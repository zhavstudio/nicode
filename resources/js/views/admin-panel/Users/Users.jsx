import * as React from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {
    alpha,
    Box,
    Button,
    Divider,
    Grid,
    InputAdornment,
    InputBase,
    Modal, Snackbar, TextField,
    Typography,
    useMediaQuery,Autocomplete
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchIcon from '@mui/icons-material/Search';
import theme from "../../../Custom.js";
import { Link as RouterLink } from 'react-router-dom';
import {useMutation, useQuery} from "react-query";
import {route} from '../helpers.js'
import axios from '../../../axiosConfig.js';
import CloseIcon from '@mui/icons-material/Close';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import {useForm} from "react-hook-form";
import {Alert} from "@mui/lab";


const columns = [
    { id: 'status', label: 'وضعیت', minWidth: 170 ,align: 'center',},
    {
        id: 'density',
        label: 'موبایل',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2),
    },
    {
        id: 'size',
        label: 'تاریخ به روزرسانی',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'population',
        label: 'تاریخ ثبت نام',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    { id: 'title', label: 'نام و نام خانوادگی', minWidth: 100 ,align: 'right',},
    { id: 'id', label: 'شماره کاربر', minWidth: 170 ,align: 'right',},
];

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width:"500px",
    bgcolor: 'background.paper',
    borderRadius: "20px",
    boxShadow: 24,
    p: 4,
};


function createData(id, title, population, size,density,status) {
    return { id, title, population, size, density,status };
}

export default function Users() {
    const [openSnack, setOpenSnack] = React.useState(false);
    const [status, setStatus] = React.useState("success");
    const [message, setMessage] = React.useState("This is a success message!");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('size');

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0); // Reset to first page when searching
    };


    //modal handling
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false)
    };
    //check screen size
    const isXsScreen = useMediaQuery('(max-width:599px)');
    const isMdOrHigher = useMediaQuery('(min-width:900px)');

    //pagination handling
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    //fetch api config
    const users = useQuery("users", async () => {
        const { data } = await axios.get(
            route("api.web.v1.admin.user.index")
        );
        users.data = data.data;
        handleRequestSort("size")
        return users;
    });
    const addUser = useMutation(
        async (data) => {
            const response = await axios.post(
                route("api.web.v1.admin.user.store"),
                data
            );
            return response.data;
        },
        {
            onSuccess: (data) => {
                setOpen(false)
                setOpenSnack(true);
                setStatus("success");
                setMessage("کاربر ذخیره شد");
            },
            onError: (error) => {
                setOpenSnack(true);
                setStatus("error");
                setMessage("ذخیره سازی با مشکل مواجه شد");
            },
            onSettled: () => {},
        }
    );


    //rows of table
    const rows = [];

    if (users?.data?.data) {
        rows.push(...users.data.data.map((item, index) =>
            createData(item.id, item.name, item.created_at, item.updated_at,item.phone_number,<Button variant="contained" sx={{borderRadius:"20px",bgcolor:alpha('#0BF04B', 0.3),color:"#23833E"}}>{item.status}</Button>),
        ));
    }
    const filteredRows = rows.filter((row) =>
        Object.values(row).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    //react hook forms config
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isValid },
    } = useForm({ mode: "onBlur" });
    const onSubmit = (data) => {
        addUser.mutate(data)
    };

    const handleChange = (e,v)=>{
        // console.log(v.value)
        setValue("gender",v.value)
    }

    //gender options
    const gender = [
        {label: "مرد",value:"0"},
        {label: "زن",value:"1"},
    ]

    const compareFunction = (a, b) => {
        console.log(a)
        if (orderBy === 'size') {
            const dateA = parseJalaliDateTime(a[orderBy]);
            const dateB = parseJalaliDateTime(b[orderBy]);
            return order === 'desc' ? dateA - dateB : dateB - dateA;
        }
        if (b[orderBy] < a[orderBy]) {
            return order === 'desc' ? -1 : 1;
        }
        if (b[orderBy] > a[orderBy]) {
            return order === 'desc' ? 1 : -1;
        }
        return 0;
    };
    const parseJalaliDateTime = (dateTimeStr) => {
        const [datePart, timePart] = dateTimeStr.split(',');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hour, minute, second] = timePart.split(':').map(Number);

        // Create a Date object (this will be in Gregorian calendar)
        // Note: month is 0-indexed in JavaScript Date
        return new Date(year, month - 1, day, hour, minute, second);
    };

    const sortedRows = React.useMemo(() => {
        return [...filteredRows].sort(compareFunction);
    }, [filteredRows, order, orderBy]);


    return (
        <Box position="absolute" display="flex" justifyContent="center" alignItems="center" height="92vh"   sx={{
            width: '100%',
            '@media (min-width: 900px)': {width: '87%',},
            '@media (min-width: 1200px)': {width: '90%',}
            ,'@media (min-width: 1500px)': {width: '91%',}
            ,'@media (min-width: 1900px)': {width: '93%',}            ,}} marginTop={{xs:9,md:6}}>
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
            <Grid item width="100%" height="100%" p={{xs:2,md:7}}>
                <Paper sx={{ width: '100%', overflow: 'hidden' ,borderRadius:"20px",bgcolor:"#F4F4F4",boxShadow:3}}>
                        {isXsScreen && (
                            <Box display="flex" flexDirection="column">
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
                            <Button
                                onClick={handleOpen}
                                variant="contained"
                                sx={{ width: "90%", borderRadius: "20px", margin: 2, bgcolor: theme.palette.secondary.main }}
                            >
                                افزودن
                            </Button>
                                <Modal
                                    open={open}
                                    onClose={()=>handleClose()}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={style} dir="rtl">
                                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                                افزودن کاربر
                                            </Typography>
                                            <IconButton>
                                                <CloseIcon/>
                                            </IconButton>
                                        </Box>
                                        <Divider/>
                                        <Box display="flex" flexDirection="row" gap={1} mb={1} mt={1}>
                                            <Box display="flex" flexDirection="column" width="50%">
                                                <Box display="flex" flexDirection="row">
                                                    <FiberManualRecordIcon sx={{color:theme.palette.Secondary.main}}/>
                                                    <Typography>نام</Typography>
                                                </Box>
                                                <TextField {...register("first_name",{ required: "این فیلد ضروری است" })}
                                                    sx={{'& .MuiOutlinedInput-root': {'& fieldset': {border: 'none',},backgroundColor: theme.palette.Primary[20], borderRadius: '20px',mt:1},}}>
                                                </TextField>
                                                <Box display="flex" flexDirection="row">
                                                    <FiberManualRecordIcon sx={{color:theme.palette.Secondary.main}}/>
                                                    <Typography>ایمیل</Typography>
                                                </Box>
                                                <TextField {...register("email",{ required: "این فیلد ضروری است" })}
                                                    sx={{'& .MuiOutlinedInput-root': {'& fieldset': {border: 'none',},backgroundColor: theme.palette.Primary[20], borderRadius: '20px',mt:1},}}>
                                                </TextField>
                                                {errors.mail && <p role="alert">{errors.mail?.message}</p>}
                                                <Box display="flex" flexDirection="row">
                                                    <FiberManualRecordIcon sx={{color:theme.palette.Secondary.main}}/>
                                                    <Typography>جنسیت</Typography>
                                                </Box>
                                                <Autocomplete
                                                    disablePortal
                                                    {...register("gender",{ required: "این فیلد ضروری است" })}
                                                    id="combo-box-demo"
                                                    options={gender}
                                                    sx={{'& .MuiOutlinedInput-notchedOutline': {border:"none"}, backgroundColor: theme.palette.Primary[20], borderRadius: '20px',mt:1}}
                                                    renderInput={(params) => <TextField {...params}  />}
                                                />

                                            </Box>
                                            <Box display="flex" flexDirection="column" width="50%">
                                                <Box display="flex" flexDirection="row">
                                                    <FiberManualRecordIcon sx={{color:theme.palette.Secondary.main}}/>
                                                    <Typography>نام خانوادگی</Typography>
                                                </Box>
                                                <TextField {...register("last_name",{ required: "این فیلد ضروری است" })}
                                                           sx={{'& .MuiOutlinedInput-root': {'& fieldset': {border: 'none',},backgroundColor: theme.palette.Primary[20], borderRadius: '20px',mt:1},}}>
                                                </TextField>
                                                <Box display="flex" flexDirection="row">
                                                    <FiberManualRecordIcon sx={{color:theme.palette.Secondary.main}}/>
                                                    <Typography>موبایل</Typography>
                                                </Box>
                                                <TextField {...register("phone_number",{ required: "این فیلد ضروری است" })}
                                                    sx={{'& .MuiOutlinedInput-root': {'& fieldset': {border: 'none',},backgroundColor: theme.palette.Primary[20], borderRadius: '20px',mt:1},}}>
                                                </TextField>
                                                <Box display="flex" flexDirection="row" >
                                                    <FiberManualRecordIcon sx={{color:theme.palette.Secondary.main}}/>
                                                    <Typography>کد ملی</Typography>
                                                </Box>
                                                <TextField {...register("code_meli",{ required: "این فیلد ضروری است" })}
                                                    sx={{'& .MuiOutlinedInput-root': {'& fieldset': {border: 'none',},backgroundColor: theme.palette.Primary[20], borderRadius: '20px',mt:1},}}>
                                                </TextField>
                                                {/*<Box display="flex" flexDirection="row">*/}
                                                {/*    <FiberManualRecordIcon sx={{color:theme.palette.Secondary.main}}/>*/}
                                                {/*    <Typography>وضعیت</Typography>*/}
                                                {/*</Box>*/}
                                                {/*<Autocomplete*/}
                                                {/*    disablePortal*/}
                                                {/*    {...register("status",{ required: "این فیلد ضروری است" })}*/}
                                                {/*    id="combo-box-demo"*/}
                                                {/*    options={userStatus}*/}
                                                {/*    sx={{'& .MuiOutlinedInput-notchedOutline': {border:"none"}, backgroundColor: theme.palette.Primary[20], borderRadius: '20px',mt:1}}*/}
                                                {/*    renderInput={(params) => <TextField {...params}  />}*/}
                                                {/*/>*/}
                                            </Box>
                                        </Box>
                                        <Divider/>
                                        <Box display="flex" flexDirection="row" justifyContent="end" mt={1} gap={1}>
                                            <Button onClick={handleClose} sx={{borderRadius:"20px",bgcolor:"gray"}} variant="contained">انصراف</Button>
                                            <Button type="submit" sx={{borderRadius:"20px",bgcolor:theme.palette.Secondary.main}} variant="contained">افزودن</Button>
                                        </Box>
                                    </Box>
                                </Modal>
                            </Box>
                        )}
                        {isMdOrHigher && (
                            <Box display="flex" justifyContent="space-between">
                            <Button
                                variant="contained"
                                onClick={handleOpen}
                                sx={{ width: "10%", borderRadius: "20px", margin: 2, bgcolor: theme.palette.secondary.main,textDecoration: "none" }}
                                >
                                افزودن
                            </Button>
                                <Modal
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={style} dir="rtl">
                                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                                افزودن کاربر
                                            </Typography>
                                            <IconButton onClick={handleClose}>
                                                <CloseIcon/>
                                            </IconButton>
                                        </Box>
                                        <Divider/>
                                        <Box display="flex" flexDirection="row" gap={1} mb={1} mt={1}>
                                            <Box display="flex" flexDirection="column" width="50%">
                                                <Box display="flex" flexDirection="row">
                                                    <FiberManualRecordIcon sx={{color:theme.palette.Secondary.main}}/>
                                                    <Typography>نام</Typography>
                                                </Box>
                                                <TextField {...register("first_name",{ required: "این فیلد ضروری است" })}
                                                           sx={{'& .MuiOutlinedInput-root': {'& fieldset': {border: 'none',},backgroundColor: theme.palette.Primary[20], borderRadius: '20px',mt:1},}}>
                                                </TextField>
                                                {errors.first_name?.type === 'required' && <p style={{color:'red'}} role="alert">{errors.first_name.message}</p>}
                                                <Box display="flex" flexDirection="row">
                                                    <FiberManualRecordIcon sx={{color:theme.palette.Secondary.main}}/>
                                                    <Typography>ایمیل</Typography>
                                                </Box>
                                                <TextField {...register("email",{ required: "این فیلد ضروری است" })}
                                                           sx={{'& .MuiOutlinedInput-root': {'& fieldset': {border: 'none',},backgroundColor: theme.palette.Primary[20], borderRadius: '20px',mt:1},}}>
                                                </TextField>
                                                {errors.email && <p style={{color:'red'}} role="alert">{errors.email?.message}</p>}
                                                <Box display="flex" flexDirection="row">
                                                    <FiberManualRecordIcon sx={{color:theme.palette.Secondary.main}}/>
                                                    <Typography>جنسیت</Typography>
                                                </Box>
                                                <Autocomplete
                                                    disablePortal
                                                    id="combo-box-demo"
                                                    options={gender}
                                                    onChange={(event, value) => handleChange(event,value)}
                                                    sx={{'& .MuiOutlinedInput-notchedOutline': {border:"none"} ,backgroundColor: theme.palette.Primary[20], borderRadius: '20px',mt:1}}
                                                    renderInput={(params) => <TextField {...params}  />}
                                                />
                                                {errors.gender?.type === 'required' && <p style={{color:'red'}} role="alert">{errors.gender.message}</p>}
                                            </Box>
                                            <Box display="flex" flexDirection="column" width="50%">
                                                <Box display="flex" flexDirection="row">
                                                    <FiberManualRecordIcon sx={{color:theme.palette.Secondary.main}}/>
                                                    <Typography>نام خانوادگی</Typography>
                                                </Box>
                                                <TextField {...register("last_name",{ required: "این فیلد ضروری است" })}
                                                           sx={{'& .MuiOutlinedInput-root': {'& fieldset': {border: 'none',},backgroundColor: theme.palette.Primary[20], borderRadius: '20px',mt:1},}}>
                                                </TextField>
                                                <Box display="flex" flexDirection="row">
                                                    <FiberManualRecordIcon sx={{color:theme.palette.Secondary.main}}/>
                                                    <Typography>موبایل</Typography>
                                                </Box>
                                                <TextField type="number" {...register("phone_number",{ required: "این فیلد ضروری است" ,minLength:11})}
                                                           sx={{'& .MuiOutlinedInput-root': {'& fieldset': {border: 'none',},backgroundColor: theme.palette.Primary[20], borderRadius: '20px',mt:1},}}>
                                                </TextField>
                                                {errors.phone_number?.type === 'required' && <p style={{color:'red'}} role="alert">{errors.phone_number.message}</p>}
                                                <Box display="flex" flexDirection="row" >
                                                    <FiberManualRecordIcon sx={{color:theme.palette.Secondary.main}}/>
                                                    <Typography>کد ملی</Typography>
                                                </Box>
                                                <TextField {...register("code_meli",{ required: "این فیلد ضروری است" })}
                                                           sx={{'& .MuiOutlinedInput-root': {'& fieldset': {border: 'none',},backgroundColor: theme.palette.Primary[20], borderRadius: '20px',mt:1},}}>
                                                </TextField>
                                                {errors.code_meli?.type === 'required' && <p style={{color:'red'}} role="alert">{errors.code_meli.message}</p>}
                                                {/*<Box display="flex" flexDirection="row">*/}
                                                {/*    <FiberManualRecordIcon sx={{color:theme.palette.Secondary.main}}/>*/}
                                                {/*    <Typography>وضعیت</Typography>*/}
                                                {/*</Box>*/}
                                                {/*<Autocomplete*/}
                                                {/*    disablePortal*/}
                                                {/*    {...register("status",{ required: "این فیلد ضروری است" })}*/}
                                                {/*    id="combo-box-demo"*/}
                                                {/*    options={userStatus}*/}
                                                {/*    sx={{'& .MuiOutlinedInput-notchedOutline': {border:"none"}, backgroundColor: theme.palette.Primary[20], borderRadius: '20px',mt:1}}*/}
                                                {/*    renderInput={(params) => <TextField {...params} />}*/}
                                                {/*/>*/}
                                                {/*{errors.status?.type === 'required' && <p style={{color:'red'}} role="alert">{errors.status.message}</p>}*/}
                                            </Box>
                                        </Box>
                                        <Divider/>
                                        <Box display="flex" flexDirection="row" justifyContent="end" mt={1} gap={1}>
                                            <Button onClick={handleClose} sx={{borderRadius:"20px",bgcolor:"gray"}} variant="contained">انصراف</Button>
                                            <Button type="submit" sx={{borderRadius:"20px",bgcolor:theme.palette.Secondary.main}} variant="contained">افزودن</Button>
                                        </Box>
                                    </Box>
                                </Modal>
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
                        )}
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table >
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                {columns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={column.id} align={column.align} component={RouterLink} to={`/panel/users/${row.id}`}>
                                                            {column.format && typeof value === 'number'
                                                                ? column.format(value)
                                                                : value}
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
        </Box>
    )
}
