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
import {useQuery} from "react-query";
import axios from "../../../axiosConfig";
import {route} from "../helpers";




export default function TicketTab(){
    const [value, setValue] = React.useState('1');
    const [assignedTickets, setAssignedTickets] = React.useState([]);
    const [unassignedTickets, setUnassignedTickets] = React.useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === '1') {
            // Reset assigned tickets when switching to unassigned tab
            setAssignedTickets([]);
            setUnassignedTickets(unassignedTicket?.data?.data)
        }
        if (newValue === '2') {
            // Reset assigned tickets when switching to unassigned tab
            setUnassignedTickets([]);
            setAssignedTickets(assignedTicket?.data?.data)
        }
    };

    const assignedTicket = useQuery("assignedTicket", async () => {
        const {data} = await axios.get(
            route("api.web.v1.admin.ticket.index")
        );
        assignedTicket.data = data.data;
        return assignedTicket;
    });

    const unassignedTicket = useQuery("Ticket", async () => {
        const { data } = await axios.get(
            route("api.web.v1.admin.unassigned")
        );
        unassignedTicket.data = data.data;
        setUnassignedTickets(data.data)
        return unassignedTicket;
    });

    React.useEffect(() => {
        if (value === '2') {
            assignedTicket.refetch();
        }
        if (value === '1'){
            unassignedTicket.refetch();
        }
    }, [value]);
    return(
        // <Box position="absolute" sx={{
        //     width: '100%',
        //     '@media (min-width: 900px)': {width: '84%',}
        //     ,}}>
        <Box sx={{ width: '100%', typography: 'body1', p: { xs: 0, md: 2 } }}>
            <TabContext value={value}>
                <Box sx={{ display: "flex", justifyContent: "center", borderBottom: 2, borderColor: theme.palette.Primary[30] }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="تیکت های متصل نشده" value="1" />
                        <Tab label="تیکت های متصل شده" value="2" />
                    </TabList>
                </Box>
                <TabPanel sx={{ p: 0, pt: 1 }} value="1">
                    <UnAssignedTicket tickets={unassignedTickets} setTickets={setUnassignedTickets} />
                </TabPanel>
                <TabPanel sx={{ p: 0, pt: 1 }} value="2">
                    <AssignedTicket tickets={assignedTickets} setTickets={setAssignedTickets} />
                </TabPanel>
            </TabContext>
        </Box>
        // </Box>
    )
}
