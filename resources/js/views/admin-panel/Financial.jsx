import React from 'react'
import {Box, Button, Grid, InputAdornment, InputBase} from "@mui/material";
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




export default function Financial(){
    console.log("akbar")
    return(
        <Box position="absolute"  display="flex" justifyContent="center" alignItems="center" height="92vh"   sx={{
            width: '100%',
            '@media (min-width: 900px)': {width: '84%',}
            ,}} marginTop={{xs:9,md:7}}>
            <Grid item width="100%" p={{xs:2,md:7}}>
                    fgdfgdfgdfgdfgdfg
            </Grid>
        </Box>
    )
}
