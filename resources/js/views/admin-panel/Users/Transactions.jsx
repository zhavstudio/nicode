import React from 'react'
import {alpha, Box, Button, Grid, InputAdornment, InputBase, useMediaQuery} from "@mui/material";
import Paper from "@mui/material/Paper";
import {Link as RouterLink} from "react-router-dom";
import theme from "@/Custom.js";
import SearchIcon from "@mui/icons-material/Search.js";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";




const columns = [
    { id: 'status', label: 'وضعیت', minWidth: 170 ,align: 'center',},
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
    { id: 'title', label: 'موضوع', minWidth: 100 ,align: 'right',},
    { id: 'id', label: 'شماره تیکت', minWidth: 170 ,align: 'right',},
];

function createData(id, title, population, size,status) {
    const density = population / size;
    return { id, title, population, size, density,status };
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
    // createData('#1234', 'محمد محمدي', 37602103, 9984670, <Button variant="contained" sx={{
    //     borderRadius: "20px",
    //     bgcolor: alpha('#0BF04B', 0.3),
    //     color: "#23833E"
    // }}>جدید</Button>),
    // createData('#1234', 'محمد محمدي', 25475400, 7692024, <Button variant="contained" sx={{
    //     borderRadius: "20px",
    //     bgcolor: alpha('#0BF04B', 0.3),
    //     color: "#23833E"
    // }}>جدید</Button>),
    // createData('#1234', 'محمد محمدي', 83019200, 357578, <Button variant="contained" sx={{
    //     borderRadius: "20px",
    //     bgcolor: alpha('#0BF04B', 0.3),
    //     color: "#23833E"
    // }}>جدید</Button>),
    // createData('#1234', 'محمد محمدي', 4857000, 70273, <Button variant="contained" sx={{
    //     borderRadius: "20px",
    //     bgcolor: alpha('#0BF04B', 0.3),
    //     color: "#23833E"
    // }}>جدید</Button>),
    // createData('#1234', 'محمد محمدي', 126577691, 1972550, <Button variant="contained" sx={{
    //     borderRadius: "20px",
    //     bgcolor: alpha('#0BF04B', 0.3),
    //     color: "#23833E"
    // }}>جدید</Button>),
    // createData('#1234', 'محمد محمدي', 126317000, 377973, <Button variant="contained" sx={{
    //     borderRadius: "20px",
    //     bgcolor: alpha('#0BF04B', 0.3),
    //     color: "#23833E"
    // }}>جدید</Button>),
    // createData('#1234', 'محمد محمدي', 67022000, 640679, <Button variant="contained" sx={{
    //     borderRadius: "20px",
    //     bgcolor: alpha('#0BF04B', 0.3),
    //     color: "#23833E"
    // }}>جدید</Button>),
    // createData('##1234', 'محمد محمدي', 67545757, 242495, <Button variant="contained" sx={{
    //     borderRadius: "20px",
    //     bgcolor: alpha('#0BF04B', 0.3),
    //     color: "#23833E"
    // }}>جدید</Button>),
    // createData('#1234', 'محمد محمدي', 146793744, 17098246, <Button variant="contained" sx={{
    //     borderRadius: "20px",
    //     bgcolor: alpha('#0BF04B', 0.3),
    //     color: "#23833E"
    // }}>جدید</Button>),
    // createData('#1234', 'محمد محمدي', 200962417, 923768, <Button variant="contained" sx={{
    //     borderRadius: "20px",
    //     bgcolor: alpha('#0BF04B', 0.3),
    //     color: "#23833E"
    // }}>جدید</Button>),
    // createData('#1234', 'محمد محمدي', 210147125, 8515767, <Button variant="contained" sx={{
    //     borderRadius: "20px",
    //     bgcolor: alpha('#0BF04B', 0.3),
    //     color: "#23833E"
    // }}>جدید</Button>),
];



export default function Transactions(){

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
    return(
        // <Box position="absolute" sx={{
        //     width: '100%',
        //     '@media (min-width: 900px)': {width: '84%',}
        //     ,}} >
        <Box dir="ltr">
                <Paper sx={{ width: '100%',bgcolor:theme.palette.Primary[20]}}>
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
        </Box>
        // </Box>
    )
}
