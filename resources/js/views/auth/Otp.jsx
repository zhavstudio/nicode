import * as React from "react";
import {Box, Button, Divider, Grid, List, ListItem, ListItemText, Snackbar, TextField, Typography} from "@mui/material";
import theme from "./../../Custom"
import logo from "./../../assets/logo.svg"
import {MuiOtpInput} from 'mui-one-time-password-input'
import {Link as RouterLink, Link} from "react-router-dom";
import {useMutation} from "react-query";
import axios from './../../axiosConfig';
import {route} from './helpers'
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import {useDispatch, useSelector} from "react-redux";
import {setAuth} from "@/redux/actions.js";
import {Alert, LoadingButton} from "@mui/lab";
import ReplayIcon from '@mui/icons-material/Replay';
import IconButton from "@mui/material/IconButton";

export default function Otp({showOtp,retry}) {

    const [otp, setOtp] = React.useState('')
    const [disable, setDisable] = React.useState(true)
    const [loading, setLoading] = React.useState(false);
    const [openSnack, setOpenSnack] = React.useState(false);
    const [status, setStatus] = React.useState("success");
    const [message, setMessage] = React.useState("This is a success message!");
    const navigate = useNavigate();
    const [countdown, setCountdown] = React.useState(30);
    const [isTimerRunning, setIsTimerRunning] = React.useState(true);

    // Add this useEffect for the countdown timer
    useEffect(() => {
        let timer;
        if (isTimerRunning && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            setIsTimerRunning(false);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [countdown, isTimerRunning]);

    useEffect(() => {
        if ('OTPCredential' in window) {
            navigator.credentials.get({
                otp: { transport:['sms'] },
                signal: AbortSignal.timeout(120000) // Waits for 2 minutes
            }).then(otp => {
                setOtp(otp.code);
                handleOtp(otp.code);
            }).catch(err => {
                console.log(err);
            });
        }
    }, []);

    const dispatch = useDispatch();


    // const handleChange = (newValue) => {
    //     setOtp(newValue)
    // }


    const login = useMutation(async (data) => {
            const response = await axios.post(route("api.public.verification-code"), data);
            localStorage.removeItem("token");
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("role", response.data.role)
            return response.data;
        }, {
            onSuccess: (data) => {
                if (localStorage.getItem("token")) {
                    dispatch(setAuth(true))
                    setLoading(false)
                }
            },
            onError: () => {
                setOpenSnack(true);
                setStatus("error");
                setMessage("کد وارد شده اشتباه است");
            },
            onSettled: () => {
            },
        }
    )

    const phone = localStorage.getItem("phone")

    const handleChange = (newValue) => {
        setOtp(newValue);
        if (newValue.length === 6) {
            handleOtp(newValue);
        }
    }

    const handleOtp = (newValue) => {
        login.mutate({verification_code: newValue, phone_number: phone})
        setDisable(false)
        setLoading(true)
    }

    const handleKeyDown = (event) => {
        console.log(event.key)
        if (event.key === 'Enter') {
            navigate('/panel', { replace: true });
        }
    };

    const handleRetry = () => {
        retry()
        setCountdown(30)
        setIsTimerRunning(true)
    }


    return (
        <Grid container display='flex' flexDirection='row' justifyContent='space-between' p={{xs:0,md:5}} onKeyDown={handleKeyDown}>
            <Snackbar
                open={openSnack}
                autoHideDuration={6000}
                onClose={() => {
                    setOpenSnack(false);
                }}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={() => {
                        setOpenSnack(false);
                    }}
                    severity={status}
                    sx={{ width: "100%" }}
                >
                    {message}
                </Alert>
            </Snackbar>
            <Grid item xs={12} md={5} borderRadius={2} height={{md: '90vh', xs:window.screen.height - 500}}
                  bgcolor={theme.palette.Secondary.main}>
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
            <Grid item xs={12} md={7} borderRadius={2} height={{md: '90vh', xs: '60vh'}} display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection='column'
            >
                <Typography fontFamily='Dana'>به پشتیبانی <span style={{
                    fontFamily: 'Dana',
                    fontWeight: '500',
                    color: theme.palette.secondary.main
                }}>کارگزار من</span> خوش آمدید</Typography>
                <Typography fontFamily='Dana' fontWeight='900' fontSize={{xs: 30, md: 50}} color='rgba(0, 25, 73, 1)'>
                    تایید هویت
                </Typography>
                    {countdown > 0
                        ?                 <Typography fontFamily='Dana' mt={2}>
                            زمان باقی مانده:<span style={{fontFamily: 'Dana',
                            fontWeight: '500',
                            color: theme.palette.secondary.main}}> {countdown} ثانیه  </span></Typography>

                        :
                        <>
                        <Typography>
                            زمان به پایان رسید. لطفا دوباره تلاش کنید
                        </Typography>
                            <IconButton>
                                <ReplayIcon onClick={handleRetry}/>
                            </IconButton>
                        </>
                    }
                <Divider width='50%'/>
                <List sx={{listStyleType: 'none', padding: 0, marginTop: '20px'}}>
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
                            کد ارسال شده به شماره <span style={{
                            fontFamily: 'Dana',
                            fontWeight: '500',
                            color: theme.palette.secondary.main
                        }}>{phone} </span>را وارد نمایید
                        </Typography>
                    </ListItem>
                </List>
                <MuiOtpInput
                    marginY='30px'
                    display='flex'
                    length={6}
                    width={{xs: '90%', md: '50%'}}
                    value={otp}
                    onComplete={handleOtp}
                    onChange={handleChange}
                    inputProps={{
                        autocomplete: "one-time-code",
                        inputmode: "numeric"
                    }}
                />
                <LoadingButton
                    color="secondary"
                    component={RouterLink} to="/panel"
                    sx={{
                        width: '50%',
                        color: theme.palette.common.white,
                        backgroundColor: theme.palette.secondary.main,
                        borderRadius: '100px',
                    }}
                    disabled={disable}
                    loading={loading}
                    loadingPosition="start"
                    variant="contained"
                >
                    ورود
                </LoadingButton>
                <Button
                    onClick={showOtp}
                    sx={{
                    width: '30%',
                    color: theme.palette.common.white,
                    backgroundColor: theme.palette.secondary.main,
                    borderRadius: '100px',
                    mt:2
                }}
                         variant="contained">
                    اصلاح شماره موبایل
                </Button>
            </Grid>
        </Grid>
    )
}
