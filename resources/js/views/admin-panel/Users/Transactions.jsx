import React from 'react'
import {alpha, Box, Button, Grid, InputAdornment, InputBase, TableSortLabel, useMediaQuery} from "@mui/material";
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
    {id: 'status', label: 'وضعیت', minWidth: 170, align: 'center',},
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
function createData(id, title, population, size,status, updated_at) {
    return { id, title, population, size,status, updated_at };
}



export default function Transactions({transactions}){

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('updated_at');


    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const compareFunction = (a, b) => {
        if (b[orderBy] < a[orderBy]) {
            return order === 'asc' ? 1 : -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return order === 'asc' ? -1 : 1;
        }
        return 0;
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const backgroundColors = (Status) => {
        let backgroundColor = "";
        if (Status === "در انتظار") backgroundColor = alpha('#001949', 0.3);
        else if (Status === "موفق") backgroundColor = alpha('#0BF04B', 0.3);
        else if (Status === "ناموفق") backgroundColor = alpha('#B80B0B', 0.3);
        else backgroundColor = "white";
        return backgroundColor;
    };

    const colors = (Status) => {
        let Color = "";
        if (Status === "در انتظار") Color = "black";
        else if (Status === "موفق") Color = '#23833E';
        else if (Status === "ناموفق") Color = "red"
        else Color = "black";
        return Color;
    };

    const rows = [];

    if (transactions) {
        rows.push(...transactions.map((item, index) =>
            createData(item.id, "افزایش اعتبار", item.created_at, item.amount,
                <Button variant="contained"
                        sx={{
                            borderRadius: "20px",
                            bgcolor:backgroundColors(item.status),
                            color: colors(item.status)
                        }}>{item.status}</Button>, item.updated_at),
        ));
    }



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
                                {rows.sort(compareFunction).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
