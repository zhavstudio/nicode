import React, {useEffect, useRef, useState} from 'react'
import {
    alpha,
    Avatar,
    Box,
    Button,
    Divider,
    FormControl,
    Grid, IconButton, InputAdornment,
    InputLabel,
    MenuItem,
    Select, Snackbar,
    TextareaAutosize, TextField,
    Typography
} from "@mui/material";
import theme from "./../../../Custom";
import SendIcon from '@mui/icons-material/Send';
import axios from './../../../axiosConfig';
import {useMutation, useQuery} from "react-query";
import {route} from './../helpers'
import {useParams} from "react-router-dom";
import {Alert} from "@mui/lab";


export default function TicketChat() {

    const [age, setAge] = React.useState('');
    const [inputValue, setInputValue] = useState('');
    const [chat, setChat] = React.useState([]);
    const params = useParams();
    const chatBoxRef = useRef(null);
    const [openSnack, setOpenSnack] = React.useState(false);
    const [status, setStatus] = React.useState("success");
    const [message, setMessage] = React.useState("This is a success message!");


    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const scrollToBottom = () => {
        console.log("akbar")
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollIntoView({behavior: "smooth", block: "end"});
        }
    };

    const sendMessage = useMutation(async (data) => {
            const response = await axios.post(route("api.web.v1.admin.message", {ticket: params.id}), data);
            return response.data;
        }, {
            onSuccess: (data) => {
                setOpenSnack(true);
                setStatus("success");
                setMessage("تیکت ارسال شد");
            },
            onError: () => {
                setOpenSnack(true);
                setStatus("error");
                setMessage("ارسال با مشکل مواجه شد");
            },
            onSettled: () => {
            },
        }
    )

    const closeTicket = useMutation(async (data) => {
            const response = await axios.put(route("api.web.v1.admin.close", {ticket: params.id}));
            return response.data;
        }, {
            onSuccess: (data) => {
                setOpenSnack(true);
                setStatus("success");
                setMessage("تیکت بسته شد");
                SetTicketClose(true)
            },
            onError: () => {
                setOpenSnack(true);
                setStatus("error");
                setMessage("بستن تیکت با مشکل مواجه شد");
            },
            onSettled: () => {
            },
        }
    )


    const Messages = useQuery("Messages", async () => {
        const {data} = await axios.get(
            route("api.web.v1.admin.messages", {ticket: params.id})
        );
        // Messages.data = data.data;
        return data;
    }, {
        onSuccess: (data) => {
            setChat(data)
            setTimeout(() => {
                scrollToBottom();
            }, 1000)
        }
    });
    const connectWebSocket = () => {
        window.Echo.private(`messages.${params.id}`)
            .listen('MessageEvent', (data) => {
                setChat(prev => {
                    return {
                        ...prev,
                        messages: [...prev.messages, {
                            ...data.message,
                            is_sender: data.message.user_id === prev.id
                        }]
                    };
                });
            });
    };
    useEffect(() => {
        connectWebSocket();

        return () => {
            window.Echo.leave("messages");
        }

    }, []);

    const [ticketClose, SetTicketClose] = React.useState(Messages?.data?.status === 4);

    return (
        <Box position="absolute" dir="rtl" display="flex" justifyContent="center" alignItems="center" height="92vh"
             sx={{
                 width: '100%',
                 '@media (min-width: 900px)': {width: '84%',}
                 ,
             }} marginTop={{xs: 9, md: 7}} p={{xs: 1, md: 7}}>
            <Snackbar
                open={openSnack}
                autoHideDuration={6000}
                onClose={() => {
                    setOpenSnack(false);
                }}
                anchorOrigin={{vertical: "top", horizontal: "right"}}
            >
                <Alert
                    onClose={() => {
                        setOpenSnack(false);
                    }}
                    severity={status}
                    sx={{width: "100%"}}
                >
                    {message}
                </Alert>
            </Snackbar>
            <Grid item display="flex" p={{xs: 1, md: 3}} height="auto" flexDirection="column"
                  boxShadow={3} borderRadius="20px" bgcolor="#F4F4F4" width="100%">
                <Box display="flex" justifyContent="space-between" width="100%">
                    <Typography sx={{height: "10%"}}>
                        تيكت باز شده در{Messages?.data?.create}
                    </Typography>
                    <Button disabled={ticketClose} onClick={() => closeTicket.mutate()} variant="contained"
                            sx={{width: "10%", pl: 2, borderRadius: "20px"}}>
                        بستن تیکت
                    </Button>
                </Box>
                <Divider sx={{mt: "10px"}}/>
                <Box display="flex" flexDirection="row" width="100%">
                    <Box display="flex" flexDirection="column" width={{xs:"100%",md:"60%"}}>
                        <Typography fontWeight="900">
                            {Messages?.data?.ticket_title}
                        </Typography>
                        <Typography>آخرین آپدیت در{Messages?.data?.update}</Typography>
                        <Box sx={{height: {xs: "300px", md: "363px"}, overflowY: 'auto'}}>
                            <Box width="100%" ref={chatBoxRef} display="flex" justifyContent="flex-end"
                                 flexDirection="column" p={1}>
                                {chat?.messages?.map((item, index) => (
                                    item.is_sender ?
                                        (<Box display="flex" justifyContent="start" flexDirection="row" gap={1}
                                              key={index}>
                                            <Avatar></Avatar>
                                            <Typography
                                                bgcolor={theme.palette.Primary[20]}
                                                borderRadius="20px"
                                                maxWidth="50%"
                                                p={2}
                                                mt={1}
                                                style={{
                                                    wordBreak: 'break-word',
                                                }}
                                            >
                                                {item.text}
                                            </Typography>
                                        </Box>) :
                                        (<Box display="flex" justifyContent="end" flexDirection="row" gap={1}
                                              key={index}>
                                            <Typography
                                                bgcolor="white"
                                                borderRadius="20px"
                                                maxWidth="50%"
                                                p={2}
                                                mt={1}
                                                style={{
                                                    wordBreak: 'break-word',
                                                }}
                                            >
                                                {item.text}
                                            </Typography>
                                            <Avatar></Avatar>
                                        </Box>)
                                ))}
                            </Box>
                            <Box width="70%" bgcolor={alpha('#B80B0B', 0.3)} height="100px" borderRadius="20px"
                                 display={ticketClose ? "flex" : "none"} justifyContent="center" alignItems="center">
                                <Typography>
                                    تیکت بسته شده
                                </Typography>
                            </Box>
                        </Box>
                        <TextField
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        border: 'none',
                                    },
                                    mt: 2,
                                    pl: 5,
                                    backgroundColor: theme.palette.Primary[20], borderRadius: '20px',
                                    boxShadow: {xs: 3, md: 0},
                                    width: {xs: "100%", md: "97%"}
                                },
                            }}

                            InputProps={{
                                startAdornment: (
                                    <InputAdornment
                                        onClick={() => {
                                            sendMessage.mutate({text: inputValue}, {
                                                onSuccess: () => {
                                                    setInputValue('');
                                                }
                                            });
                                        }}
                                        position="start"
                                    >
                                        <IconButton>
                                            <SendIcon/>
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        ></TextField>
                    </Box>
                    <Box width="30%" display={{xs: "none", md: "flex"}} alignItems="start" flexDirection='column' p={1}>
                        <Typography fontWeight="900" mt={2}>جزییات</Typography>
                        <Divider sx={{mt: "10px"}}/>
                        <Typography mt={2} fontWeight="500">تیکت ارسال شده توسط</Typography>
                        <Typography mt={2}>09331210757</Typography>
                        {/*<Typography mt={2} fontWeight="500">وضعیت تیکت</Typography>*/}
                        {/*<FormControl fullWidth>*/}
                        {/*    <InputLabel id="demo-simple-select-label">Age</InputLabel>*/}
                        {/*    <Select*/}
                        {/*        labelId="demo-simple-select-label"*/}
                        {/*        id="demo-simple-select"*/}
                        {/*        value={age}*/}
                        {/*        label="Age"*/}
                        {/*        onChange={handleChange}*/}
                        {/*        sx={{*/}
                        {/*                '& .MuiOutlinedInput-root': {*/}
                        {/*                    '& fieldset': {*/}
                        {/*                        borderColor: theme.palette.Primary[20],*/}
                        {/*                    }},*/}
                        {/*                backgroundColor: theme.palette.Primary[20],*/}
                        {/*                borderRadius: '20px',*/}
                        {/*            }}*/}
                        {/*    >*/}
                        {/*        <MenuItem value={10}>Ten</MenuItem>*/}
                        {/*        <MenuItem value={20}>Twenty</MenuItem>*/}
                        {/*        <MenuItem value={30}>Thirty</MenuItem>*/}
                        {/*    </Select>*/}
                        {/*</FormControl>*/}
                        <Typography mt={2} fontWeight="500">فایل های پیوست</Typography>
                    </Box>
                </Box>
            </Grid>
        </Box>
    )
}
