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
import theme from "../../../Custom.js";
import { Link as RouterLink } from 'react-router-dom';
import {useQuery} from "react-query";
import {route} from '../helpers.js'
import axios from '../../../axiosConfig.js';



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

function createData(id, title, population, size , density, status) {
    return {id, title, population, size , density , status};
}


export default function UnAssignedTicket() {
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

    const Ticket = useQuery("Ticket", async () => {
        const { data } = await axios.get(
            route("api.web.v1.admin.unassigned")
        );
        Ticket.data = data.data;
        return Ticket;
    });

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
        const filtered = Ticket?.data?.data.filter((item,index)=>{
            return item.message.length > 0
        })
        rows.push(...filtered.map((item, index) =>
            createData(item.id, item.title, item.created_at, item.updated_at,item.user, <Button variant="contained" sx={{
                borderRadius: "20px",
                bgcolor:backgroundColors(item.status) ,
                color: colors(item.status)
            }}>{item.status}</Button>),
        ));
    }

    return (
        <Box dir="ltr">
        <Paper sx={{ width: '100%', overflow: 'hidden' ,borderRadius:"20px",bgcolor:"#F4F4F4",boxShadow:3}}>
                    <Box display="flex" justifyContent="space-between">
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
        </Box>
    )
}
