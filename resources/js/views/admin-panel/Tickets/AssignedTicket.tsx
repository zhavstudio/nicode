import * as React from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {alpha, Box, Button, Grid, InputAdornment, InputBase, TableSortLabel, useMediaQuery} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchIcon from '@mui/icons-material/Search';
import theme from "../../../Custom.js";
import {Link as RouterLink} from 'react-router-dom';
import {useQuery} from "react-query";
import {route} from '../helpers.js'
import axios from '../../../axiosConfig.js';


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

function createData(id, title, population, size, density, status, updated_at) {
    return {id, title, population, size, density, status, updated_at};
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
export default function AssignedTicket({ tickets, setTickets }) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('size');
    const [searchTerm, setSearchTerm] = React.useState('');


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0); // Reset to first page when searching
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // const Ticket = useQuery("Ticket", async () => {
    //     const {data} = await axios.get(
    //         route("api.web.v1.admin.ticket.index")
    //     );
    //     Ticket.data = data.data;
    //     handleRequestSort("size")
    //     return Ticket;
    // });

    const backgroundColors = (Status) => {
        let backgroundColor = "";
        if (Status === "در انتظار") backgroundColor = alpha('#6e2478', 0.3);
        else if (Status === "جدید") backgroundColor = alpha('#0BF04B', 0.3);
        else if (Status === "بسته") backgroundColor = alpha('#B80B0B', 0.3);
        else backgroundColor = backgroundColor = alpha('#08330d', 0.6);
        return backgroundColor;
    };

    const colors = (Status) => {
        let Color = "";
        if (Status === "در انتظار") Color = "black";
        else if (Status === "جدید") Color = '#23833E';
        else if (Status === "بسته") Color = "red"
        else Color = "white";
        return Color;
    };
    console.log(tickets)

    const rows = React.useMemo(() => {
        handleRequestSort("size")
        return tickets?.map((item) =>
            createData(item.id, item.title, item.created_at, item.updated_at, item.user,
                <Button variant="contained" sx={{
                    borderRadius: "20px",
                    bgcolor: backgroundColors(item.status),
                    color: colors(item.status)
                }}>{item.status}</Button>,
                item.updated_at
            )
        );
    }, [tickets]);
    const filteredRows = rows.filter((row) =>
        Object.values(row).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
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
        <Box dir="ltr">
            <Paper sx={{width: '100%', overflow: 'hidden', borderRadius: "20px", bgcolor: "#F4F4F4", boxShadow: 3}}>
                <Box display="flex" justifyContent="flex-end">
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
                                        <TableSortLabel
                                            active={orderBy === column.id}
                                            direction={orderBy === column.id ? order : 'asc'}
                                            onClick={() => handleRequestSort(column.id)}
                                        >
                                            {column.label}
                                        </TableSortLabel>
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
                    count={filteredRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    )
}
