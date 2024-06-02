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
    Modal, TextField,
    Typography,
    useMediaQuery
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchIcon from '@mui/icons-material/Search';
import theme from "./../../Custom";
import { Link as RouterLink } from 'react-router-dom';
import {useQuery} from "react-query";
import {route} from './helpers'
import axios from './../../axiosConfig';
import CloseIcon from '@mui/icons-material/Close';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';


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
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: "20px",
    boxShadow: 24,
    p: 4,
};


function createData(id, title, population, size,density,status) {
    return { id, title, population, size, density,status };
}

// const rows = [
//     createData('#1234', 'محمد محمدي', 1324171354, 3287263,<Button variant="contained" sx={{borderRadius:"20px",bgcolor:alpha('#0BF04B', 0.3),color:"#23833E"}}>جدید</Button>),
//     createData('#1234', 'محمد محمدي', 1403500365, 9596961,<Button variant="contained" sx={{borderRadius:"20px",bgcolor:alpha('#0BF04B', 0.3),color:"#23833E"}}>جدید</Button>),
//     createData('#1234', 'محمد محمدي', 60483973, 301340,<Button variant="contained" sx={{borderRadius:"20px",bgcolor:alpha('#0BF04B', 0.3),color:"#23833E"}}>جدید</Button>),
//     createData('#1234', 'محمد محمدي', 327167434, 9833520,<Button variant="contained" sx={{borderRadius:"20px",bgcolor:alpha('#0BF04B', 0.3),color:"#23833E"}}>جدید</Button>),
//     createData('#1234', 'محمد محمدي', 37602103, 9984670,<Button variant="contained" sx={{borderRadius:"20px",bgcolor:alpha('#0BF04B', 0.3),color:"#23833E"}}>جدید</Button>),
//     createData('#1234', 'محمد محمدي', 25475400, 7692024,<Button variant="contained" sx={{borderRadius:"20px",bgcolor:alpha('#0BF04B', 0.3),color:"#23833E"}}>جدید</Button>),
//     createData('#1234', 'محمد محمدي', 83019200, 357578,<Button variant="contained" sx={{borderRadius:"20px",bgcolor:alpha('#0BF04B', 0.3),color:"#23833E"}}>جدید</Button>),
//     createData('#1234', 'محمد محمدي', 4857000, 70273,<Button variant="contained" sx={{borderRadius:"20px",bgcolor:alpha('#0BF04B', 0.3),color:"#23833E"}}>جدید</Button>),
//     createData('#1234', 'محمد محمدي', 126577691, 1972550,<Button variant="contained" sx={{borderRadius:"20px",bgcolor:alpha('#0BF04B', 0.3),color:"#23833E"}}>جدید</Button>),
//     createData('#1234', 'محمد محمدي', 126317000, 377973,<Button variant="contained" sx={{borderRadius:"20px",bgcolor:alpha('#0BF04B', 0.3),color:"#23833E"}}>جدید</Button>),
//     createData('#1234', 'محمد محمدي', 67022000, 640679,<Button variant="contained" sx={{borderRadius:"20px",bgcolor:alpha('#0BF04B', 0.3),color:"#23833E"}}>جدید</Button>),
//     createData('##1234', 'محمد محمدي', 67545757, 242495,<Button variant="contained" sx={{borderRadius:"20px",bgcolor:alpha('#0BF04B', 0.3),color:"#23833E"}}>جدید</Button>),
//     createData('#1234', 'محمد محمدي', 146793744, 17098246,<Button variant="contained" sx={{borderRadius:"20px",bgcolor:alpha('#0BF04B', 0.3),color:"#23833E"}}>جدید</Button>),
//     createData('#1234', 'محمد محمدي', 200962417, 923768,<Button variant="contained" sx={{borderRadius:"20px",bgcolor:alpha('#0BF04B', 0.3),color:"#23833E"}}>جدید</Button>),
//     createData('#1234', 'محمد محمدي', 210147125, 8515767,<Button variant="contained" sx={{borderRadius:"20px",bgcolor:alpha('#0BF04B', 0.3),color:"#23833E"}}>جدید</Button>),
// ];
export default function Users() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false)
    };

    const isXsScreen = useMediaQuery('(max-width:599px)');
    const isMdOrHigher = useMediaQuery('(min-width:900px)');

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const Ticket = useQuery("Ticket", async () => {
        const { data } = await axios.get(
            route("api.web.v1.admin.user.index")
        );
        Ticket.data = data.data;
        return Ticket;
    });

    const rows = [];

    if (Ticket?.data?.data) {
        rows.push(...Ticket.data.data.map((item, index) =>
            createData(item.id, item.name, item.created_at, item.updated_at,item.phone_number,<Button variant="contained" sx={{borderRadius:"20px",bgcolor:alpha('#0BF04B', 0.3),color:"#23833E"}}>{item.status}</Button>),
        ));
    }

    return (
        <Box position="absolute" display="flex" justifyContent="center" alignItems="center" height="92vh"   sx={{
            width: '100%',
            '@media (min-width: 900px)': {width: '84%',}
            ,}} marginTop={{xs:9,md:7}}>
            <Grid item width="100%" p={{xs:2,md:7}}>
                <Paper sx={{ width: '100%', overflow: 'hidden' ,borderRadius:"20px",bgcolor:"#F4F4F4",boxShadow:3}}>
                    <Box display="flex" justifyContent="space-between">
                        {isXsScreen && (
                            <Button
                                to={"/panel/chat"}
                                component={RouterLink}
                                variant="contained"
                                sx={{ width: "10%",height:"10%", borderRadius: "50%", margin: 2, bgcolor: theme.palette.secondary.main }}
                            >
                                <Modal
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={style}>
                                        <Typography id="modal-modal-title" variant="h6" component="h2">
                                            Text in a modal
                                        </Typography>
                                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                                        </Typography>
                                    </Box>
                                </Modal>
                                افزودن
                            </Button>
                        )}
                        {isMdOrHigher && (
                            <Button
                                variant="contained"
                                onClick={handleOpen}
                                sx={{ width: "10%", borderRadius: "20px", margin: 2, bgcolor: theme.palette.secondary.main,textDecoration: "none" }}
                                >
                                <Modal
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={style} dir="rtl">
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
                                                    <Typography>نام و نام خانوادگی</Typography>
                                                </Box>
                                                <TextField
                                                    sx={{'& .MuiOutlinedInput-root': {'& fieldset': {border: 'none',},backgroundColor: theme.palette.Primary[20], borderRadius: '20px',mt:1},}}>
                                                </TextField>
                                                <Box display="flex" flexDirection="row">
                                                    <FiberManualRecordIcon sx={{color:theme.palette.Secondary.main}}/>
                                                    <Typography>ایمیل</Typography>
                                                </Box>
                                                <TextField
                                                    sx={{'& .MuiOutlinedInput-root': {'& fieldset': {border: 'none',},backgroundColor: theme.palette.Primary[20], borderRadius: '20px',mt:1},}}>
                                                </TextField>
                                                <Box display="flex" flexDirection="row">
                                                    <FiberManualRecordIcon sx={{color:theme.palette.Secondary.main}}/>
                                                    <Typography>جنسیت</Typography>
                                                </Box>
                                                <TextField
                                                    sx={{'& .MuiOutlinedInput-root': {'& fieldset': {border: 'none',},backgroundColor: theme.palette.Primary[20], borderRadius: '20px',mt:1},}}>
                                                </TextField>

                                            </Box>
                                            <Box display="flex" flexDirection="column" width="50%">
                                                <Box display="flex" flexDirection="row">
                                                    <FiberManualRecordIcon sx={{color:theme.palette.Secondary.main}}/>
                                                    <Typography>موبایل</Typography>
                                                </Box>
                                                <TextField
                                                    sx={{'& .MuiOutlinedInput-root': {'& fieldset': {border: 'none',},backgroundColor: theme.palette.Primary[20], borderRadius: '20px',mt:1},}}>
                                                </TextField>
                                                <Box display="flex" flexDirection="row" >
                                                    <FiberManualRecordIcon sx={{color:theme.palette.Secondary.main}}/>
                                                    <Typography>کد ملی</Typography>
                                                </Box>
                                                <TextField
                                                    sx={{'& .MuiOutlinedInput-root': {'& fieldset': {border: 'none',},backgroundColor: theme.palette.Primary[20], borderRadius: '20px',mt:1},}}>
                                                </TextField>
                                                <Box display="flex" flexDirection="row">
                                                    <FiberManualRecordIcon sx={{color:theme.palette.Secondary.main}}/>
                                                    <Typography>وضعیت</Typography>
                                                </Box>
                                                <TextField
                                                    sx={{'& .MuiOutlinedInput-root': {'& fieldset': {border: 'none',},backgroundColor: theme.palette.Primary[20], borderRadius: '20px',mt:1},}}>
                                                </TextField>
                                            </Box>
                                        </Box>
                                        <Divider/>
                                        <Box display="flex" flexDirection="row" justifyContent="end" mt={1} gap={1}>
                                            <Button sx={{borderRadius:"20px",bgcolor:"gray"}} variant="contained">انصراف</Button>
                                            <Button sx={{borderRadius:"20px",bgcolor:theme.palette.Secondary.main}} variant="contained">افزودن</Button>
                                        </Box>
                                    </Box>
                                </Modal>
                                افزودن
                            </Button>
                        )}
                        <InputBase
                            sx={{ ml: 1 ,bgcolor:'#FFFFFF',borderRadius:"20px",margin:2,px:2}}
                            placeholder="جستجو ..."
                            inputProps={{ 'aria-label': 'search google maps' ,dir:"rtl"}}
                            startAdornment={
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            }
                        />
                    </Box>
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
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                {columns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={column.id} align={column.align} component={RouterLink} to={`/panel/chat/${row.id}`}>
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
                        count={rows.length}
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
