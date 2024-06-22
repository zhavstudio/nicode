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
    useMediaQuery
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchIcon from '@mui/icons-material/Search';
import theme from "./../../Custom";
import {Link as RouterLink} from 'react-router-dom';
import {useMutation, useQuery} from "react-query";
import {route} from './helpers'
import axios from './../../axiosConfig';
import wallet from "@/assets/2.png";
import CloseIcon from "@mui/icons-material/Close";
import {useForm} from "react-hook-form";
import {Alert} from "@mui/lab";


const columns = [
    {id: 'status', label: 'وضعیت', minWidth: 170, align: 'center',},
    {
        id: 'density',
        label: 'درخواست دهنده',
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
        label: 'تاریخ ایجاد',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    {id: 'title', label: 'موضوع', minWidth: 100, align: 'right',},
    {id: 'id', label: 'شماره تیکت', minWidth: 170, align: 'right',},
];

function createData(id, title, population, size , density, status) {
    return {id, title, population, size , density , status};
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
export default function Ticket() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = React.useState(false);
    const [openSnack, setOpenSnack] = React.useState(false);
    const [status, setStatus] = React.useState("success");
    const [message, setMessage] = React.useState("This is a success message!");

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

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const Ticket = useQuery("Ticket", async () => {
        const {data} = await axios.get(
            route("api.web.v1.user.userTicket")
        );
        Ticket.data = data.data;
        return Ticket;
    });

    const firstTicket = useMutation(async (data) => {
            const response = await axios.post(route("api.web.v1.user.first-ticket"),data);
            return response.data;
        }, {
            onSuccess: (data) => {
                setOpen(false)
                setOpenSnack(true);
                setStatus("success");
                setMessage("تیکت ارسال شد");
                Ticket.refetch()
            },
            onError: () => {
                setOpenSnack(true);
                setStatus("error");
                setMessage("ارسال تیکت مشکل مواجه شد");
            },
            onSettled: () => {
            },
        }
    )

    //react hook forms config
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isValid },
    } = useForm({ mode: "onBlur" });
    const onSubmit = (data) => {
        firstTicket.mutate(data)
    };

    const backgroundColors = (Status) => {
        let backgroundColor = "";
        if (Status === "در انتظار") backgroundColor = alpha('#001949', 0.3);
        else if (Status === "جدید") backgroundColor = alpha('#0BF04B', 0.3);
        else if (Status === "بسته") backgroundColor = alpha('#B80B0B', 0.3);
        else backgroundColor = "white";
        return backgroundColor;
    };
    const colors = (Status) => {
        let Color = "";
        if (Status === "در انتظار") Color = "black";
        else if (Status === "جدید") Color = '#23833E';
        else if (Status === "بسته") Color = "red"
        else Color = "black";
        return Color;
    };

    const rows = [];

    if (Ticket?.data?.data) {
        rows.push(...Ticket.data.data.map((item, index) =>
            createData(item.id, item.title, item.created_at, item.updated_at,item.user, <Button variant="contained" sx={{
                borderRadius: "20px",
                bgcolor:backgroundColors(item.status) ,
                color: colors(item.status)
            }}>{item.status}</Button>),
        ));
    }



    return (
        <Box position="absolute" display="flex" justifyContent="center" alignItems="center" height="92vh" sx={{
            width: '100%',
            '@media (min-width: 900px)': {width: '84%',}
            ,
        }} marginTop={{xs: 9, md: 7}}>
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
            <Grid item width="100%" p={{xs: 2, md: 7}}>
                <Paper sx={{width: '100%', overflow: 'hidden', borderRadius: "20px", bgcolor: "#F4F4F4", boxShadow: 3}}>
                    <Box display="flex" justifyContent="space-between">
                        {isXsScreen && (
                            <Button
                                to={"/panel/chat"}
                                component={RouterLink}
                                variant="contained"
                                sx={{
                                    width: "10%",
                                    height: "10%",
                                    borderRadius: "50%",
                                    margin: 2,
                                    bgcolor: theme.palette.secondary.main
                                }}
                            >
                                افزودن
                            </Button>
                        )}
                        {isMdOrHigher && (
                            <Button
                                variant="contained"
                                sx={{
                                    width: "10%",
                                    borderRadius: "20px",
                                    margin: 2,
                                    bgcolor: theme.palette.secondary.main,
                                    textDecoration: "none"
                                }}
                                onClick={handleOpen}
                            >
                                تیکت جدید
                            </Button>
                        )}
                        <Modal
                            open={open}
                            onClose={() => handleClose()}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box component="form" sx={style} dir="rtl">
                                <Box display="flex" flexDirection="row">
                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                        تیکت جدید
                                    </Typography>
                                    <IconButton>
                                        <CloseIcon/>
                                    </IconButton>
                                </Box>
                                <Divider sx={{width: "100%"}}/>
                                <Typography fontSize={15}>موضوع</Typography>
                                <TextField
                                    required
                                    {...register("title")}
                                    id="outlined-required"
                                    sx={{
                                        marginBottom: 2,
                                        width: "100%",
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                border: 'none',
                                            },
                                            mt: 2,
                                            pl: 5,
                                            backgroundColor: theme.palette.Primary[20], borderRadius: '20px',
                                            boxShadow: {xs: 3, md: 0},
                                        },
                                    }}
                                />
                                <Typography fontSize={15}>متن</Typography>
                                <TextField
                                    required
                                    {...register("message")}
                                    id="outlined-required"
                                    sx={{
                                        marginBottom: 2,
                                        width: "100%",
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                border: 'none',
                                            },
                                            mt: 2,
                                            pl: 5,
                                            backgroundColor: theme.palette.Primary[20], borderRadius: '20px',
                                            boxShadow: {xs: 3, md: 0}, height: "257px",

                                        },
                                    }}
                                />
                                <Button type="submit" sx={{
                                    borderRadius: "10px",
                                    bgcolor: theme.palette.Secondary.main,
                                    width: "100%"
                                }} onClick={handleSubmit(onSubmit)}
                                        variant="contained">ارسال</Button>
                            </Box>
                        </Modal>
                        <InputBase
                            sx={{ml: 1, bgcolor: '#FFFFFF', borderRadius: "20px", margin: 2, px: 2}}
                            placeholder="جستجو ..."
                            inputProps={{'aria-label': 'search google maps', dir: "rtl"}}
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
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{minWidth: column.minWidth}}
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
                                                        <TableCell key={column.id} align={column.align}
                                                                   component={RouterLink} to={`/panel/chat/${row.id}`}>
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
