import React from 'react'
import {Box, Button, Grid, InputAdornment, InputBase} from "@mui/material";
import Paper from "@mui/material/Paper";
import {Link as RouterLink} from "react-router-dom";
import theme from "@/Custom.js";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Transactions from "@/views/admin-panel/Users/Transactions.jsx";
import UserTickets from "@/views/admin-panel/Users/UserTickets.jsx";




export default function UsersDetailsTab({tickets,transactions}){
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return(
        <Box position="absolute" display="flex" justifyContent="center" borderRadius="20px" sx={{
            width: '100%',bgcolor:theme.palette.Primary[20],
            '@media (min-width: 900px)': {width: '62%',}
            ,}}>
            <Box sx={{ width: '90%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{display:"flex",justifyContent:"center", borderBottom: 2, borderColor: theme.palette.Primary[30] }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="تیکت های ارسال شده" value="1" />
                            <Tab label="تراکنش ها" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1" ><UserTickets tickets={tickets}/></TabPanel>
                    <TabPanel value="2" ><Transactions transactions={transactions}/></TabPanel>
                </TabContext>
            </Box>
        </Box>
    )
}
