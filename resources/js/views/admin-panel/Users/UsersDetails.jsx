import React from 'react'
import {Box, Button, Divider, Grid, InputAdornment, InputBase, Typography} from "@mui/material";
import Paper from "@mui/material/Paper";
import {Link as RouterLink, useNavigate, useParams} from "react-router-dom";
import theme from "./../../../Custom";
import UsersDetailsTab from "./UsersDetailsTab";
import {useQuery} from "react-query";
import {route} from "./../helpers";
import axios from './../../../axiosConfig';
import CircularProgress from "@mui/material/CircularProgress";



export default function UsersDetails() {

    const params = useParams();
    const navigate = useNavigate();

    const userDetails = useQuery("userDetails", async () => {
        const { data } = await axios.get(
            route("api.web.v1.admin.details",{id:params.id})
        );
        userDetails.data = data.data;
        return userDetails;
    },{
        onError:(e)=>{
            if (e.response.status === 401){
                navigate('/', { replace: true })}
        }
    });

    function numberToWords(number) {
        const ones = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
        const tens = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
        const hundreds = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];

        function convertThreeDigits(num) {
            let word = '';
            const hundreds_digit = Math.floor(num / 100);
            const tens_digit = Math.floor((num % 100) / 10);
            const ones_digit = num % 10;

            if (hundreds_digit > 0) {
                word += hundreds[hundreds_digit] + ' ';
            }

            if (tens_digit > 1) {
                word += tens[tens_digit] + ' ';
                word += ones[ones_digit] + ' ';
            } else if (tens_digit === 1) {
                word += 'ده' + ' ';
                if (ones_digit > 0) {
                    word += ones[ones_digit] + ' ';
                }
            } else if (ones_digit > 0) {
                word += ones[ones_digit] + ' ';
            }

            return word.trim();
        }

        let word = '';
        const billions = Math.floor(number / 1000000000);
        if (billions > 0) {
            word += convertThreeDigits(billions) + ' میلیارد ';
            number %= 1000000000;
        }

        const millions = Math.floor(number / 1000000);
        if (millions > 0) {
            word += convertThreeDigits(millions) + ' میلیون ';
            number %= 1000000;
        }

        const thousands = Math.floor(number / 1000);
        if (thousands > 0) {
            word += convertThreeDigits(thousands) + ' هزار ';
            number %= 1000;
        }

        word += convertThreeDigits(number);

        return word + ' تومان';
    }

if (userDetails.isLoading){
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <CircularProgress />
        </div>
    );
}
    return (
        <Grid dir="rtl" container position="absolute" height="-webkit-fill-available" sx={{
            width: '100%', backgroundColor: "white", borderRadius: "20px",
            '@media (min-width: 900px)': {width: '80%',},'@media (min-width: 1200px)': {width: '85%',},'@media (min-width: 1500px)': {width: '87%',},'@media (min-width: 1900px)': {width: '90%',}
            ,
        }} marginTop={{xs: 9, md: "100px"}} ml={{xs:0,md:"30px"}}>
            <Grid item xs={12} md={4} p={3} pl={0}>

                <Box bgcolor={theme.palette.Primary[20]} padding={2} borderRadius={5} mb={2}>
                    <Typography fontWeight={900}>اطلاعات حساب کاربری</Typography>
                    <Box display="flex" flexDirection="row" gap="30px" mt={2} position="relative" >
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
                            {/*<Divider*/}
                            {/*    color={theme.palette.Primary[20]}*/}
                            {/*    orientation="vertical"*/}
                            {/*    sx={{*/}
                            {/*        height: '170px',*/}
                            {/*        position: 'absolute',*/}
                            {/*        top: 0,*/}
                            {/*        // right: '120px',*/}
                            {/*        transform: 'translateX(-50%)',*/}
                            {/*    }}*/}
                            {/*/>*/}
                        </Box>
                    </Box>
                    <Box display="flex" flexDirection="column" mt={2}>
                        <Typography color={theme.palette.Primary[30]}>ایمیل</Typography>
                        <Typography>{userDetails.data.data.email}</Typography>
                    </Box>
                    <Box display="flex" flexDirection="row" gap={2} mt={2}>
                        <Box display="flex" flexDirection="column">
                            <Typography color={theme.palette.Primary[30]}>کد ملی</Typography>
                            <Typography>{userDetails.data.data.code_meli}</Typography>
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
                </Box>

                <Box bgcolor={theme.palette.Primary[20]} padding={2} borderRadius={5} mb={2}>
                <Typography fontWeight={900} mt={2}>تیکت ها</Typography>
                    <Box display="flex" flexDirection="row"  mt={2}
                    >
                        <Box display="flex" flexDirection="column">
                            <Typography color={theme.palette.Primary[30]}>تیکت های ارسال شده</Typography>
                            <Typography>{userDetails.data.data.tickets}</Typography>
                        </Box>
                        {/*<Divider color={theme.palette.Primary[20]} orientation="vertical" sx={{height: "37px", marginTop: "5px"}}/>*/}
                        {/*<Box display="flex" flexDirection="column" alignItems="center">*/}
                        {/*    <Typography color={theme.palette.Primary[30]}>تیکت باز</Typography>*/}
                        {/*    <Typography>{userDetails.data.data.open_tickets}</Typography>*/}
                        {/*</Box>*/}
                        <Box sx={{ position: 'relative' }}>
                            {/*<Divider*/}
                            {/*    color={theme.palette.Primary[20]}*/}
                            {/*    orientation="vertical"*/}
                            {/*    sx={{*/}
                            {/*        height: '120px',*/}
                            {/*        position: 'absolute',*/}
                            {/*        top: 0,*/}
                            {/*        // right: '120px',*/}
                            {/*        transform: 'translateX(-50%)',*/}
                            {/*    }}*/}
                            {/*/>*/}
                        </Box>
                    </Box>
                    <Box display="flex" flexDirection="row" gap={6} mt={2}>
                        {/*<Box display="flex" flexDirection="column">*/}
                        {/*    <Typography color={theme.palette.Primary[30]}>تیکت های در حال بررسی</Typography>*/}
                        {/*    <Typography>{userDetails.data.data.pending_tickets}</Typography>*/}
                        {/*</Box>*/}
                        {/*<Divider color={theme.palette.Primary[20]} orientation="vertical" sx={{height: "37px", marginTop: "5px"}}/>*/}
                        <Box display="flex" flexDirection="column" alignItems="end">
                            <Typography color={theme.palette.Primary[30]}>بسته</Typography>
                            <Typography>{userDetails.data.data.close_tickets}</Typography>
                        </Box>
                        <Divider color={theme.palette.Primary[20]} orientation="vertical" sx={{height: "37px", marginTop: "5px"}}/>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography color={theme.palette.Primary[30]}>تیکت باز</Typography>
                            <Typography>{userDetails.data.data.open_tickets}</Typography>
                        </Box>
                    </Box>
                </Box>

                <Box bgcolor={theme.palette.Primary[20]} padding={2} borderRadius={5}>
                <Typography fontWeight={900} mt={2}>کیف پول</Typography>
                <Box mt={2}>
                    <Box display="flex" flexDirection="row" gap={4}>
                        <Box display="flex" flexDirection="column">
                            <Typography color={theme.palette.Primary[30]}>موجودی به عدد</Typography>
                            <Typography>تومان {userDetails.data.data.wallet}</Typography>
                        </Box>
                        <Divider color={theme.palette.Primary[20]} orientation="vertical" sx={{height: "37px", marginTop: "5px"}}/>
                        <Box display="flex" flexDirection="column">
                            <Typography color={theme.palette.Primary[30]}>موجودی به حروف</Typography>
                            <Typography>{numberToWords(userDetails.data.data.wallet)}</Typography>
                        </Box>
                        <Box sx={{ position: 'relative' }}>
                            {/*<Divider*/}
                            {/*    color={theme.palette.Primary[20]}*/}
                            {/*    orientation="vertical"*/}
                            {/*    sx={{*/}
                            {/*        height: '100px',*/}
                            {/*        position: 'absolute',*/}
                            {/*        top: 0,*/}
                            {/*        // right: '120px',*/}
                            {/*        transform: 'translateX(-50%)',*/}
                            {/*    }}*/}
                            {/*/>*/}
                        </Box>
                    </Box>
                </Box>
                </Box>
            </Grid>
            <Grid item display={{xs: "none",md:"block"}} md={8} p={3} >
                <UsersDetailsTab tickets={userDetails.data.data.user_tickets} transactions={userDetails.data.data.user_transactions
                }/>
            </Grid>
        </Grid>
    )
}
