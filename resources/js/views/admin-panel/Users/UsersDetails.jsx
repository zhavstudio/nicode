import React from 'react'
import {Box, Button, Divider, Grid, InputAdornment, InputBase, Typography} from "@mui/material";
import Paper from "@mui/material/Paper";
import {Link as RouterLink, useParams} from "react-router-dom";
import theme from "./../../../Custom";
import UsersDetailsTab from "./UsersDetailsTab";
import {useQuery} from "react-query";
import {route} from "./../helpers";
import axios from './../../../axiosConfig';



export default function UsersDetails() {

    const params = useParams();

    const userDetails = useQuery("userDetails", async () => {
        const { data } = await axios.get(
            route("api.web.v1.admin.details",{id:params.id})
        );
        userDetails.data = data.data;
        return userDetails;
    });

if (userDetails.isLoading){
    return (
        <div>loading</div>
    )
}
    return (
        <Grid dir="rtl" container position="absolute" height="auto" sx={{
            width: '100%', backgroundColor: theme.palette.Primary[20], borderRadius: "20px",
            '@media (min-width: 900px)': {width: '78%',}
            ,
        }} marginTop={{xs: 9, md: "100px"}} ml={{xs:0,md:"50px"}}>
            <Grid item xs={12} md={4}  p={3} pl={0}>

                <Typography fontWeight={900}>اطلاعات حساب کاربری</Typography>
                <Box display="flex" flexDirection="row" gap="53px" mt={2} position="relative" >
                    <Box display="flex" flexDirection="column">
                        <Typography color={theme.palette.Primary[30]}>نام و نام خانوادگی</Typography>
                        <Typography>{userDetails.data.data.first_name + userDetails.data.data.last_name}</Typography>
                    </Box>
                    <Divider color={theme.palette.Primary[20]} orientation="vertical" sx={{height: "37px", marginTop: "5px"}}/>
                    <Box display="flex" flexDirection="column">
                        <Typography color={theme.palette.Primary[30]} >موبایل</Typography>
                        <Typography>{userDetails.data.data.phone_number}</Typography>
                    </Box>
                    <Box sx={{ position: 'relative' }}>
                        <Divider
                            color={theme.palette.Primary[20]}
                            orientation="vertical"
                            sx={{
                                height: '170px',
                                position: 'absolute',
                                top: 0,
                                // right: '120px',
                                transform: 'translateX(-50%)',
                            }}
                        />
                    </Box>
                </Box>
                <Box display="flex" flexDirection="column" mt={2}>
                    <Typography color={theme.palette.Primary[30]}>ایمیل</Typography>
                    <Typography>{userDetails.data.data.email}</Typography>
                </Box>
                <Box display="flex" flexDirection="row" gap={2} mt={2}>
                    <Box display="flex" flexDirection="column">
                        <Typography color={theme.palette.Primary[30]}>کد ملی</Typography>
                        <Typography>{userDetails.data.data.code_melli}</Typography>
                    </Box>
                    <Divider color={theme.palette.Primary[20]} orientation="vertical" sx={{height: "37px", marginTop: "5px"}}/>
                    <Box display="flex" flexDirection="column">
                        <Typography color={theme.palette.Primary[30]}>وضعیت</Typography>
                        <Typography>{userDetails.data.data.status}</Typography>
                    </Box>
                    <Divider color={theme.palette.Primary[20]} orientation="vertical" sx={{height: "37px", marginTop: "5px"}}/>
                    <Box display="flex" flexDirection="column">
                        <Typography color={theme.palette.Primary[30]}>جنسیت</Typography>
                        <Typography>{userDetails.data.data.gender}</Typography>
                    </Box>
                </Box>

                <Typography fontWeight={900} mt={2}>تیکت ها</Typography>
                    <Box display="flex" flexDirection="row" gap={8} mt={2}>
                        <Box display="flex" flexDirection="column">
                            <Typography color={theme.palette.Primary[30]}>تیکت های ارسال شده</Typography>
                            <Typography>{userDetails.data.data.tickets}</Typography>
                        </Box>
                        <Divider color={theme.palette.Primary[20]} orientation="vertical" sx={{height: "37px", marginTop: "5px"}}/>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography color={theme.palette.Primary[30]}>تیکت باز</Typography>
                            <Typography>{userDetails.data.data.open_tickets}</Typography>
                        </Box>
                        <Box sx={{ position: 'relative' }}>
                            <Divider
                                color={theme.palette.Primary[20]}
                                orientation="vertical"
                                sx={{
                                    height: '120px',
                                    position: 'absolute',
                                    top: 0,
                                    // right: '120px',
                                    transform: 'translateX(-50%)',
                                }}
                            />
                        </Box>
                    </Box>
                    <Box display="flex" flexDirection="row" gap={6} mt={2}>
                        <Box display="flex" flexDirection="column">
                            <Typography color={theme.palette.Primary[30]}>تیکت های در حال بررسی</Typography>
                            <Typography>{userDetails.data.data.pending_tickets}</Typography>
                        </Box>
                        <Divider color={theme.palette.Primary[20]} orientation="vertical" sx={{height: "37px", marginTop: "5px"}}/>
                        <Box display="flex" flexDirection="column" alignItems="end">
                            <Typography color={theme.palette.Primary[30]}>بسته</Typography>
                            <Typography>{userDetails.data.data.close_tickets}</Typography>
                        </Box>
                    </Box>

                <Typography fontWeight={900} mt={2}>کیف پول</Typography>
                <Box mt={2}>
                    <Box display="flex" flexDirection="row" gap={7}>
                        <Box display="flex" flexDirection="column">
                            <Typography color={theme.palette.Primary[30]}>موجودی به عدد</Typography>
                            <Typography>تومان 1200000</Typography>
                        </Box>
                        <Divider color={theme.palette.Primary[20]} orientation="vertical" sx={{height: "37px", marginTop: "5px"}}/>
                        <Box display="flex" flexDirection="column">
                            <Typography color={theme.palette.Primary[30]}>موجودی به حروف</Typography>
                            <Typography>دویست میلیون تومان</Typography>
                        </Box>
                        <Box sx={{ position: 'relative' }}>
                            <Divider
                                color={theme.palette.Primary[20]}
                                orientation="vertical"
                                sx={{
                                    height: '100px',
                                    position: 'absolute',
                                    top: 0,
                                    // right: '120px',
                                    transform: 'translateX(-50%)',
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Grid>
            <Grid item display={{xs: "none",md:"block"}} md={8}  p={3}>
                <UsersDetailsTab tickets={userDetails.data.data.user_tickets}/>
            </Grid>
        </Grid>
    )
}
