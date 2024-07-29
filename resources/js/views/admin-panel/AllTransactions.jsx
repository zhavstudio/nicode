import * as React from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {alpha, Box, Button, Grid, InputAdornment, InputBase, useMediaQuery} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchIcon from '@mui/icons-material/Search';
import theme from "./../../Custom";
import {Link as RouterLink} from 'react-router-dom';
import {useQuery} from "react-query";
import {route} from './helpers'
import axios from './../../axiosConfig';


const columns = [
    {id: 'status', label: 'وضعیت', minWidth: 170, align: 'center',},
    {
        id: 'density',
        label: 'از طرف',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2),
    },
    {
        id: 'size',
        label: 'مبلغ تراکنش',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'population',
        label: 'تاریخ تراکنش',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    {id: 'title', label: 'موضوع', minWidth: 100, align: 'right',},
    {id: 'id', label: 'شماره تراکنش', minWidth: 170, align: 'right',},
];

function createData(id, title, population, size, density, status,user_id) {
    return {id, title, population, size, density, status,user_id};
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
export default function AllTransactions() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('population');

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0); // Reset to first page when searching
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const Transactions = useQuery("Transactions", async () => {
        const {data} = await axios.get(
            route("api.web.v1.admin.transaction-list")
        );
        Transactions.data = data.data;
        handleRequestSort('population')
        return Transactions;
    });

    const backgroundColors = (Status) => {
        let backgroundColor = "";
        if (Status === "کنسل شده") backgroundColor = alpha('#fc7703', 0.3);
        else if (Status === "موفق") backgroundColor = alpha('#0BF04B', 0.3);
        else if (Status === "ناموفق") backgroundColor = alpha('#B80B0B', 0.3);
        else backgroundColor = "white";
        return backgroundColor;
    };

    const colors = (Status) => {
        let Color = "";
        if (Status === "کنسل شده") Color = "black";
        else if (Status === "موفق") Color = '#23833E';
        else if (Status === "ناموفق") Color = "red"
        else Color = "black";
        return Color;
    };

    const rows = [];

    if (Transactions?.data?.data) {
        rows.push(...Transactions.data.data.map((item, index) =>
            createData(item.id, "افزایش اعتبار", item.created_at, item.amount, item.user,
                <Button variant="contained"
                        sx={{
                            borderRadius: "20px",
                            bgcolor:backgroundColors(item.status),
                            color: colors(item.status)
                        }}>{item.status}</Button>,item.user_id)
        ));
    }

    const filteredRows = rows.filter((row) =>
        Object.values(row).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    const compareFunction = (a, b) => {
        console.log(a)
        if (orderBy === 'population') {
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
        <Box position="absolute" height="92vh" sx={{
            width: '100%',
            '@media (min-width: 900px)': {width: '85%',},
            '@media (min-width: 1200px)': {width: '90%',}
            ,'@media (min-width: 1500px)': {width: '91%',}
            ,'@media (min-width: 1900px)': {width: '93%',}
        }} marginTop={{xs: 9, md: 7}}>
            <Grid item width="100%" p={{xs: 2, md: 7}}>
                <Paper sx={{width: '100%', overflow: 'hidden', borderRadius: "20px", bgcolor: "#F4F4F4", boxShadow: 3}}>
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
                                {sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => {
                                        console.log(row)
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                {columns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={column.id} align={column.align}
                                                                   component={RouterLink} to={`/panel/users/${row.user_id}`}>
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
