import React from 'react'
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


function createData(id, title, population, size, status) {
    const density = population / size;
    return {id, title, population, size, density, status};
}

const rows = [
    createData('#1234', 'محمد محمدي', 1324171354, 3287263, <Button variant="contained" sx={{
        borderRadius: "20px",
        bgcolor: alpha('#0BF04B', 0.3),
        color: "#23833E"
    }}>جدید</Button>),
    createData('#1234', 'محمد محمدي', 1403500365, 9596961, <Button variant="contained" sx={{
        borderRadius: "20px",
        bgcolor: alpha('#0BF04B', 0.3),
        color: "#23833E"
    }}>جدید</Button>),
    createData('#1234', 'محمد محمدي', 60483973, 301340, <Button variant="contained" sx={{
        borderRadius: "20px",
        bgcolor: alpha('#0BF04B', 0.3),
        color: "#23833E"
    }}>جدید</Button>),
    createData('#1234', 'محمد محمدي', 327167434, 9833520, <Button variant="contained" sx={{
        borderRadius: "20px",
        bgcolor: alpha('#0BF04B', 0.3),
        color: "#23833E"
    }}>جدید</Button>),
    createData('#1234', 'محمد محمدي', 37602103, 9984670, <Button variant="contained" sx={{
        borderRadius: "20px",
        bgcolor: alpha('#0BF04B', 0.3),
        color: "#23833E"
    }}>جدید</Button>),
    createData('#1234', 'محمد محمدي', 25475400, 7692024, <Button variant="contained" sx={{
        borderRadius: "20px",
        bgcolor: alpha('#0BF04B', 0.3),
        color: "#23833E"
    }}>جدید</Button>),
    createData('#1234', 'محمد محمدي', 83019200, 357578, <Button variant="contained" sx={{
        borderRadius: "20px",
        bgcolor: alpha('#0BF04B', 0.3),
        color: "#23833E"
    }}>جدید</Button>),
    createData('#1234', 'محمد محمدي', 4857000, 70273, <Button variant="contained" sx={{
        borderRadius: "20px",
        bgcolor: alpha('#0BF04B', 0.3),
        color: "#23833E"
    }}>جدید</Button>),
    createData('#1234', 'محمد محمدي', 126577691, 1972550, <Button variant="contained" sx={{
        borderRadius: "20px",
        bgcolor: alpha('#0BF04B', 0.3),
        color: "#23833E"
    }}>جدید</Button>),
    createData('#1234', 'محمد محمدي', 126317000, 377973, <Button variant="contained" sx={{
        borderRadius: "20px",
        bgcolor: alpha('#0BF04B', 0.3),
        color: "#23833E"
    }}>جدید</Button>),
    createData('#1234', 'محمد محمدي', 67022000, 640679, <Button variant="contained" sx={{
        borderRadius: "20px",
        bgcolor: alpha('#0BF04B', 0.3),
        color: "#23833E"
    }}>جدید</Button>),
    createData('##1234', 'محمد محمدي', 67545757, 242495, <Button variant="contained" sx={{
        borderRadius: "20px",
        bgcolor: alpha('#0BF04B', 0.3),
        color: "#23833E"
    }}>جدید</Button>),
    createData('#1234', 'محمد محمدي', 146793744, 17098246, <Button variant="contained" sx={{
        borderRadius: "20px",
        bgcolor: alpha('#0BF04B', 0.3),
        color: "#23833E"
    }}>جدید</Button>),
    createData('#1234', 'محمد محمدي', 200962417, 923768, <Button variant="contained" sx={{
        borderRadius: "20px",
        bgcolor: alpha('#0BF04B', 0.3),
        color: "#23833E"
    }}>جدید</Button>),
    createData('#1234', 'محمد محمدي', 210147125, 8515767, <Button variant="contained" sx={{
        borderRadius: "20px",
        bgcolor: alpha('#0BF04B', 0.3),
        color: "#23833E"
    }}>جدید</Button>),
];


export default function Financial() {

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [open, setOpen] = React.useState(false);

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

    console.log("akbar")
    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="92vh" sx={{
            width: '100%',
            '@media (min-width: 900px)': {width: '84%',}
            ,
        }} marginTop={{xs: 9, md: 7}}>
            <Grid container spacing={2} sx={{mt: 20, display: "flex", justifyContent: "center"}}>
                <Grid item md={6} sx={{display: isXsScreen ? "none" : "flex", justifyContent: "flex-end"}}>
                    <Box
                        width="551px"
                        height="266px"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        sx={{backgroundImage: "linear-gradient(#2C822A,#54D06F)", borderRadius: "30px", boxShadow: 5}}
                    >
                        <Typography style={{color: "white", fontSize: 30, fontWeight: 500, marginBottom: 20}}>جمع
                            پرداختی ها</Typography>
                        <Typography style={{color: "white", fontSize: 30, fontWeight: 500, marginBottom: 20}}>540،000
                            تومان </Typography>
                    </Box>
                </Grid>
                <Grid item xs={11.5} md={6} sx={{display: "flex", justifyContent: "flex-start"}}>
                    <Box
                        width="551px"
                        height={isXsScreen ? "194px" : "266px"}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        sx={{backgroundImage: "linear-gradient(#9C2CF3,#593188)", borderRadius: "30px", boxShadow: 5}}
                    >
                        <Typography style={{color: "white", fontSize: 30, fontWeight: 500, marginBottom: 20}}>موجودی
                            شما</Typography>
                        <Typography style={{color: "white", fontSize: 30, fontWeight: 500, marginBottom: 20}}>540،000
                            تومان </Typography>
                        <Button
                            variant="contained"
                            sx={{width: "50%", borderRadius: 20, bgcolor: "#593188"}}
                            onClick={handleOpen}
                        >
                            افزایش موجودی
                        </Button>
                        <Modal
                            open={open}
                            onClose={() => handleClose()}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box component="form" sx={style} dir="rtl">
                                <Box display="flex" flexDirection="row" justifyContent="space-between">
                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                        افزایش اعتبار
                                    </Typography>
                                    <IconButton>
                                        <CloseIcon/>
                                    </IconButton>
                                </Box>
                                <Divider sx={{width: "100%"}}/>
                                <img src={wallet} style={{marginTop: 20,marginBottom:10}}/>
                                <Typography fontSize={15}>میزان اعتبار مورد نظر خود را وارد نمایید</Typography>
                                <TextField
                                    required
                                    type="number"
                                    id="outlined-required"
                                    sx={{width:"100%",marginBottom:2}}
                                />
                                <Button type="submit" sx={{borderRadius: "10px", bgcolor: theme.palette.Secondary.main,width:"100%"}}
                                        variant="contained">پرداخت</Button>
                            </Box>
                        </Modal>
                    </Box>
                </Grid>
                <Grid item xs={11.2}>
                    <Paper
                        sx={{
                            width: "100%",
                            overflow: "hidden",
                            borderRadius: "20px",
                            bgcolor: "#F4F4F4",
                            boxShadow: 3,
                        }}
                    >
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
                                    {rows
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    tabIndex={-1}
                                                    key={row.code}
                                                >
                                                    {columns.map((column) => {
                                                        const value = row[column.id];
                                                        return (
                                                            <TableCell
                                                                key={column.id}
                                                                align={column.align}
                                                                component={RouterLink}
                                                                to={`/panel/chat/${row.id}`}
                                                            >
                                                                {column.format && typeof value === "number"
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
            </Grid>
        </Box>
    )
}
