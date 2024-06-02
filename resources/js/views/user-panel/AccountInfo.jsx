import React from 'react'
import {Box, Button, Grid, InputAdornment, InputBase} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import theme from "@/Custom.js";





export default function AccountInfo(){
    console.log("AccountInfo")
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
