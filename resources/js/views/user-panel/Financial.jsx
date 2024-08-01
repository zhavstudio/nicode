import React, {useState} from 'react'
import {
    alpha,
    Box,
    Button,
    Divider,
    Grid,
    InputAdornment,
    InputBase,
    Modal, TextField,
    Typography,
    useMediaQuery
} from "@mui/material";
import theme from "@/Custom.js";
import Paper from "@mui/material/Paper";
import {Link as RouterLink} from "react-router-dom";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close.js";
import wallet from './../../assets/2.png'
import {useMutation, useQuery} from "react-query";
import axios from "@/axiosConfig.js";
import {route} from "@/views/user-panel/helpers.js";
import { useForm } from "react-hook-form";
import SearchIcon from "@mui/icons-material/Search.js";
import {NumericFormat} from "react-number-format";


const columns = [
    {id: 'status', label: 'وضعیت', minWidth: 170, align: 'center',},
    {
        id: 'date',
        label: 'تاریخ درخواست',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2),
    },
    {
        id: 'amount',
        label: 'مبلغ(تومان)',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    {id: 'id', label: 'شماره تراکنش', minWidth: 170, align: 'right',},
];


function createData(id, amount, date, status) {
    return {id, amount, date, status};
}
const NumericFormatCustom = React.forwardRef(
    function NumericFormatCustom(props, ref) {
        const { onChange, ...other } = props;

        return (
            <NumericFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }}
                thousandSeparator
                valueIsNumericString
                prefix=""
            />
        );
    },
);

export default function Financial() {

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0); // Reset to first page when searching
    };

    function numberToWords(value) {
        const ones = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
        const tens = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
        const hundreds = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
        let number = value?.replace(/,/g, '')
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

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "346px",
        bgcolor: 'white',
        borderRadius: "20px",
        boxShadow: 24,
        p: 4,
        display: "flex",
        alignItems: "center",
        flexDirection: "column"
    };
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors, isValid },
    } = useForm({ mode: "onBlur" });

    const transactions = useQuery("transactions", async () => {
        const {data} = await axios.get(
            route("api.web.v1.user.transaction-list")
        );
        transactions.data = data.data;
        return transactions;
    });

    const totalBalance = useQuery("totalBalance", async () => {
        const {data} = await axios.get(
            route("api.web.v1.user.transaction-list")
        );
        totalBalance.data = data.data;
        return totalBalance;
    });

    const postTransaction = useMutation('postTransaction', async(data)=>{
        const response =  await axios.post(
            route("api.web.v1.user.transaction", {}, 1), data
        );
        // Check if the response contains an HTML page
        if (response.headers['content-type'].includes('text/html')) {
            // Open a new window or tab with the received HTML page
            const paymentPageWindow = window.open('', '_blank');
            paymentPageWindow.document.write(response.data);
        } else {
            // Handle the response as needed (e.g., display success/error messages)
            console.log(response.data);
        }

    })

    //modal handling
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false)
    };

    const isXsScreen = useMediaQuery('(max-width:599px)');
    const isMdOrHigher = useMediaQuery('(min-width:900px)');

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const onSubmit = (data) => {
        postTransaction.mutate(data);
        reset();
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const statusRender = (status) => {
        switch (status) {
            case 'کنسل شده':
                return alpha('#fc7703', 0.3)
            case 'موفق':
                return alpha('#0BF04B', 0.3)
            case 'ناموفق':
                return alpha('#B80B0B', 0.3)
        }

    }
    const rows = [];
    if (!transactions.isLoading) {
        rows.push(...transactions.data.data.transactions.map((item, index) =>
            createData(item.id,item.amount, item.created_at, <Typography style={{color: "black", paddingLeft:10, paddingRight:10, paddingTop:5, paddingBottom:5}}  variant="contained"
                sx={{borderRadius: "20px", bgcolor: statusRender(item.status)}}>{item.status}</Typography>),
        ));
    }

    const filteredRows = rows.filter((row) =>
        Object.values(row).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <Box position="absolute" display="flex" height="92vh"   sx={{
            width: '100%',
            '@media (min-width: 900px)': {width: '85%',},
            '@media (min-width: 1200px)': {width: '90%',}
            ,'@media (min-width: 1500px)': {width: '91%',}
            ,'@media (min-width: 1900px)': {width: '93%',}            ,}} marginTop={{xs:9,md:14}}>
            <Grid container mt={{xs:"20px",md:0}} spacing={2} sx={{display: "flex", justifyContent: "center"}}>
                <Grid item md={6} sx={{mb:5,display: isXsScreen ? "none" : "flex", justifyContent: "flex-end"}}>
                    <Box width="551px" height="266px" display="flex" flexDirection="column" alignItems="center"
                        justifyContent="center"
                        sx={{backgroundImage: "linear-gradient(#2C822A,#54D06F)", borderRadius: "30px", boxShadow: 5}}>
                        <Typography style={{color: "white", fontSize: 30, fontWeight: 500, marginBottom: 20}}>جمع
                                                                                                              پرداختی
                                                                                                              ها</Typography>
                        <Box display="flex" >
                            <Typography style={{color: "white", fontSize: 30, fontWeight: 500, marginBottom: 20, marginRight:3}}>تومان</Typography>
                            <Typography style={{color: "white", fontSize: 30, fontWeight: 500, marginBottom: 20}}>{!transactions.isLoading && transactions.data.data.total_payments}</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={11.5} md={6} sx={{display: "flex", justifyContent: "flex-start"}}>
                    <Box width="551px" height={isXsScreen ? "194px" : "266px"} display="flex" flexDirection="column"
                        alignItems="center" justifyContent="center"
                        sx={{backgroundImage: "linear-gradient(#9C2CF3,#593188)", borderRadius: "30px", boxShadow: 5}}>
                        <Typography style={{color: "white", fontSize: 30, fontWeight: 500, marginBottom: 20}}>موجودی
                                                                                                              شما</Typography>
                        <Box display="flex" >
                            <Typography style={{color: "white", fontSize: 30, fontWeight: 500, marginBottom: 20, marginRight:3}}>تومان</Typography>
                            <Typography style={{color: "white", fontSize: 30, fontWeight: 500, marginBottom: 20}}>{!transactions.isLoading && transactions.data.data.total}</Typography>
                        </Box>
                        <Button variant="contained" sx={{width: "50%", borderRadius: 20, bgcolor: "#593188"}}
                            onClick={handleOpen}>
                            افزایش موجودی
                        </Button>
                        <Modal open={open} onClose={() => handleClose()} aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description">
                            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={style} dir="rtl">
                                <Box sx={{ width: '100%' }}  display="flex" flexDirection="row" justifyContent="space-between">
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography align="center"  id="modal-modal-title" variant="h6" component="h2">
                                            افزایش اعتبار
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <IconButton style={{padding:0}} onClick={()=> setOpen(false)}>
                                            <CloseIcon/>
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Divider sx={{width: "100%"}}/>
                                <img src={wallet} style={{marginTop: 20, marginBottom: 10}}/>
                                <Typography fontSize={15}>میزان اعتبار مورد نظر خود را وارد نمایید</Typography>
                                <TextField  placeholder='مثلا 200,000'
                                    {...register("amount", {
                                    required: true,maxLength:10
                                })} InputProps={{
                                    inputComponent: NumericFormatCustom,
                                }} required  id="outlined-required"
                                    sx={{width: "100%", marginBottom: 2}}/>
                                {watch('amount') !== '' && <Typography style={{marginBottom:20}}>{numberToWords(watch('amount'))}</Typography>}

                                <Button type="submit" disabled={!isValid}
                                    sx={{borderRadius: "10px", bgcolor: theme.palette.Secondary.main, width: "100%"}}
                                    variant="contained">پرداخت</Button>
                            </Box>
                        </Modal>
                    </Box>
                </Grid>
                <Grid item xs={11.2}>
                    <Paper sx={{
                        width: "100%",
                        overflow: "hidden",
                        borderRadius: "20px",
                        bgcolor: "#F4F4F4",
                        boxShadow: 3,
                    }}>
                        <Box display="flex" justifyContent="end">
                            <InputBase
                                sx={{ml: 1, bgcolor: '#FFFFFF', borderRadius: "20px", margin: 2, px: 2}}
                                placeholder="جستجو ..."
                                inputProps={{'aria-label': 'search google maps', dir: "rtl"}}
                                value={searchTerm}
                                onChange={handleSearchChange}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <SearchIcon/>
                                    </InputAdornment>
                                }
                            />
                        </Box>
                        <TableContainer sx={{maxHeight: 440}}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell key={column.id} align={column.align}
                                                style={{minWidth: column.minWidth}}>
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                    {columns.map((column) => {
                                                        const value = row[column.id];
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {value}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={filteredRows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}
