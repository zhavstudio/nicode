import * as React from "react";
import {Box, Button, Divider, Grid, List, ListItem, ListItemText, TextField, Typography, useTheme} from "@mui/material";
import theme from "./../../Custom"
import logo from "./../../assets/logo.svg"
import {Link as RouterLink, Link, Navigate} from "react-router-dom";
import {useState} from "react";
import axios from './../../axiosConfig';
import {useMutation, useQuery} from "react-query";
import {route} from './helpers'
import { useNavigate } from 'react-router-dom';



export default function Login() {

    const [phoneNumber, setPhoneNumber] = useState('');
    const handlePhoneNumberChange = (event) => {
        const value = event.target.value;
        setPhoneNumber(value);
    };
    const navigate = useNavigate();

    localStorage.setItem("phone",phoneNumber)

    const isButtonDisabled = phoneNumber.length !== 11 ;

    const register = useMutation(async (phone_number) => {
            const response = await axios.post(route("api.public.register"),phone_number);
            return response.data;
        }, {
            onSuccess: (data) => {
            },
            onError: () => {
            },
            onSettled: () => {
            },
        }
    )

    const handleSubmit = () => {
        if (!isButtonDisabled) {
            register.mutate({ phone_number: phoneNumber });
        }
    };

    const handleKeyDown = (event) => {
        console.log(event.key)
        if (event.key === 'Enter') {
            handleSubmit();
            navigate('/otp', { replace: true });
        }
    };

    return (
        <Grid container display='flex' flexDirection='row' justifyContent='space-between' p={{xs:0,md:5}}>
            <Grid item xs={12} md={5} borderRadius={2} height={{md:'90vh',xs:'60vh'}} bgcolor={theme.palette.Secondary.main}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    height="100%"
                >
                    <img src={logo} alt="Logo" width="70%" height="70%"/>
                    <Typography fontWeight='900' fontSize={50} color='white' fontFamily='Dana'>کارگزار
                        من</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} md={7} borderRadius={2} height={{md:'90vh',xs:'60vh'}} display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection='column'
            >
                <Typography fontFamily='Dana'>به پشتیبانی <span style={{fontFamily:'Dana',fontWeight:'500',color:theme.palette.secondary.main}}>کارگزار من</span> خوش آمدید</Typography>
                <Typography fontFamily='Dana' fontWeight='900' fontSize={{xs: 30, md: 50}} color='rgba(0, 25, 73, 1)'>
                    ورود به حساب کاربری
                </Typography>
                <Divider width='50%'/>
                <List sx={{ listStyleType: 'none', padding: 0,marginTop:'20px' }}>
                    <ListItem
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'row-reverse',

                        }}
                    >
                        <Typography
                            fontFamily='Dana'
                            sx={{
                                '&:after': {
                                    content: '"•"',
                                    marginLeft: '0.5rem',
                                    fontWeight: 'bold',
                                },
                            }}
                        >
                            شماره همراه خود را وارد نمایید
                        </Typography>
                    </ListItem>
                </List>
                <TextField
                    required
                    InputProps={{
                        sx: { borderRadius: '12px' },
                    }}
                    id="name"
                    label="09XXXXXXXXX"
                    variant="outlined"
                    sx={{ width: '50%', marginY: '30px' }}
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    onKeyDown={handleKeyDown}
                />
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    component={RouterLink} to="/otp"
                    sx={{
                        width: '50%',
                        color: theme.palette.common.white,
                        backgroundColor: theme.palette.secondary.main,
                        borderRadius: '100px',
                    }}
                    disabled={isButtonDisabled}
                >
                    ادامه
                </Button>
            </Grid>
        </Grid>
    )
}
