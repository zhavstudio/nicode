import React from 'react'
import {Box, Button, Grid, InputAdornment, InputBase} from "@mui/material";
import Paper from "@mui/material/Paper";
import {Link as RouterLink} from "react-router-dom";
import theme from "@/Custom.js";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import AssignedTicket from "./AssignedTicket";
import UnAssignedTicket from "./UnAssignedTicket";




export default function TicketTab(){
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return(
        // <Box position="absolute" sx={{
        //     width: '100%',
        //     '@media (min-width: 900px)': {width: '84%',}
        //     ,}}>
            <Box sx={{ width: '100%', typography: 'body1',p:{xs:0,md:2} }}>
                <TabContext value={value}>
                    <Box sx={{display:"flex",justifyContent:"center", borderBottom: 2, borderColor: theme.palette.Primary[30] }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="تیکت های متصل نشده" value="1" />
                            <Tab label="تیکت های متصل شده" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel sx={{p:0,pt:1}} value="1" ><UnAssignedTicket /></TabPanel>
                    <TabPanel sx={{p:0,pt:1}} value="2" ><AssignedTicket/></TabPanel>
                </TabContext>
            </Box>
        // </Box>
    )
}
