import * as React from "react";
import {Route, Routes} from "react-router-dom";
import Ticket from "./Tickets/Ticket";
import Financial from "./Financial";
import TicketChat from "./Tickets/TicketChat";
import Users from "./Users/Users.jsx";
import UsersDetails from "./Users/UsersDetails.jsx";
import AllTransactions from "@/views/admin-panel/AllTransactions.jsx";







export default function Contents() {
    return (
        <>
            <Routes>
                    <Route path="" >
                        <Route path="/" element={<Ticket/>}/>
                        <Route path="ticket" element={<Ticket/>}/>
                        <Route path="chat/:id" element={<TicketChat/>}/>
                        <Route path="financial" element={<AllTransactions/>}/>
                        <Route path="account_info" element={<Financial/>}/>
                        <Route path="users" element={<Users/>}/>
                        <Route path="users/:id" element={<UsersDetails/>}/>
                    </Route>
            </Routes>
        </>
    );
}
