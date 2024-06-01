import React from 'react'
import {
    Avatar,
    Box,
    Button,
    Divider,
    FormControl,
    Grid, IconButton, InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextareaAutosize, TextField,
    Typography
} from "@mui/material";
import theme from "./../../Custom";
import SendIcon from '@mui/icons-material/Send';
import axios from './../../axiosConfig';
import {useMutation, useQuery} from "react-query";
import {route} from './helpers'


export default function TicketChat(){

    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const sendMessage = useMutation(async (data) => {
            const response = await axios.post(route("api.web.v1.admin.message"),data);
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


    const Messages = useQuery("Messages", async () => {
        const { data } = await axios.get(
            route("api.web.v1.admin.messages")
        );
        Messages.data = data.data;
        return Messages;
    },{refetchInterval:3000});

    return(
        <Box position="fixed" dir="rtl" display="flex" justifyContent="center" alignItems="center" height="100vh"   sx={{
            width: '100%',
            '@media (min-width: 900px)': {width: '84%',}
            ,}} marginTop={{xs:9,md:4}} p={7} >
         <Grid item display="flex" p={3} flexDirection="column" boxShadow={3} borderRadius="20px" bgcolor="#F4F4F4"  width="100%">
             <Box display="flex" justifyContent="space-between" width="100%">
                 <Typography sx={{height:"10%"}}>
                     تيكت باز شده در
                 </Typography>
                 <Button variant="contained" sx={{width:"10%",pl:2,borderRadius:"20px"}}>
                    بستن تیکت
                 </Button>
             </Box>
             <Divider sx={{mt:"10px"}}/>
            <Box display="flex" flexDirection="row" width="100%">
                <Box sx={{ height: '400px', overflowY: 'auto' }}>
                    <Box width="70%" display="flex" justifyContent="flex-end" flexDirection="column">
                        <Typography fontWeight="900">
                            اين تايتل فقط نمايشي است براي تيكت زدن در سايت
                        </Typography>
                        <Typography>آخرین آپدیت در 28/7/1402</Typography>
                        {Messages?.data?.data.map((item, index) => (
                            <Box display="flex" flexDirection="column" gap={1} key={index}>
                                <Avatar></Avatar>
                                <Typography
                                    bgcolor={theme.palette.Primary[20]}
                                    borderRadius="20px"
                                    maxWidth="50%"
                                    p={2}
                                >
                                    {item.text}
                                </Typography>
                            </Box>
                        ))}
                        <TextField
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        border: 'none',
                                    },
                                    mt: 2,
                                    pl: 5,
                                },
                            }}
                            inputProps={{
                                sx: { backgroundColor: "#F4F4F4", borderRadius: '20px' },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment
                                        onClick={() => sendMessage.mutate({ text: "asfafafafsdf" })}
                                        position="end"
                                    >
                                        <IconButton>
                                            <SendIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        ></TextField>
                    </Box>
                </Box>
                <Box width="30%" display="flex" justifyContent="flex-end" flexDirection='column'>
                    <Typography fontWeight="900" mt={2}>جزییات</Typography>
                    <Divider sx={{mt:"10px"}}/>
                    <Typography mt={2} fontWeight="500">تیکت ارسال شده توسط</Typography>
                    <Typography mt={2}>09331210757</Typography>
                    <Typography mt={2} fontWeight="500">وضعیت تیکت</Typography>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Age</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={age}
                            label="Age"
                            onChange={handleChange}
                            sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: theme.palette.Primary[20],
                                        }},
                                    backgroundColor: theme.palette.Primary[20],
                                    borderRadius: '20px',
                                }}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                    <Typography mt={2} fontWeight="500">فایل های پیوست</Typography>
                </Box>
            </Box>
         </Grid>
        </Box>
    )
}
