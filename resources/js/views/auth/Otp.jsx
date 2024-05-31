import * as React from "react";
import {Box, Button, Divider, Grid, List, ListItem, ListItemText, TextField, Typography} from "@mui/material";
import theme from "./../../Custom"
import logo from "./../../assets/logo.svg"
import { MuiOtpInput } from 'mui-one-time-password-input'
import {Link} from "react-router-dom";
import {useMutation} from "react-query";
import axios from './../../axiosConfig';
import {route} from './helpers'



export default function Otp() {

    const [otp, setOtp] = React.useState('')
    const [disable,setDisable] = React.useState(true)

    const handleChange = (newValue) => {
        setOtp(newValue)
    }


    const login = useMutation(async (data) => {
            const response = await axios.post(route("api.public.verification-code"),data);
            return response.data;
        }, {
            onSuccess: (data) => {
                localStorage.setItem("token",data.token)
                localStorage.setItem("role",data.role)
            },
            onError: () => {
            },
            onSettled: () => {
            },
        }
    )

    const phone = localStorage.getItem("phone")

    const handleOtp = (newValue) =>{
        login.mutate({verification_code:newValue,phone_number:phone})
        setDisable(false)
    }



    return (
        <Grid container display='flex' flexDirection='row' justifyContent='space-between'>
            <Grid item xs={12} md={5} borderRadius={2} height={{md:'90vh',xs:'50vh'}} bgcolor={theme.palette.Secondary.main}>
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
            <Grid item xs={12} md={7} borderRadius={2} height={{md:'90vh',xs:'50vh'}} display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection='column'
            >
                <Typography fontFamily='Dana'>به پشتیبانی <span style={{fontFamily:'Dana',fontWeight:'500',color:theme.palette.secondary.main}}>کارگزار من</span> خوش آمدید</Typography>
                <Typography fontFamily='Dana' fontWeight='900' fontSize={{xs: 30, md: 50}} color='rgba(0, 25, 73, 1)'>
                    تایید هویت
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
                            کد ارسال شده به شماره  <span style={{fontFamily:'Dana',fontWeight:'500',color:theme.palette.secondary.main}}>09038384481</span>را وارد نمایید
                        </Typography>
                    </ListItem>
                </List>
                <MuiOtpInput marginY='30px' display='flex' length={6} width={{xs:'90%',md:'50%'}} value={otp} onComplete={handleOtp} onChange={handleChange} />
                <Button
                    disabled={disable}
                    variant='contained'
                    sx={{
                        width:'50%',
                        color: theme.palette.common.white,
                        backgroundColor: theme.palette.secondary.main,
                        borderRadius:'100px'
                    }}
                >
                    <Link to={'/panel'} style={{ textDecoration: 'none' ,width:'50%'}}>
                    بررسی و ورود
                    </Link>
                </Button>
            </Grid>
        </Grid>
    )
}
