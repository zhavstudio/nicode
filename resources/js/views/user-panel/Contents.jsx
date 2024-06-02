import * as React from "react";
import {Route, Routes} from "react-router-dom";
import Ticket from "./Ticket";
import Financial from "./Financial";
import TicketChat from "./TicketChat";







export default function Contents() {
    return (
        <>
            <Routes>
                    <Route path="" >
                        <Route path="ticket" element={<Ticket/>}/>
                        <Route path="chat/:id" element={<TicketChat/>}/>
                        <Route path="financial" element={<Financial/>}/>
                        <Route path="account_info" element={<Financial/>}/>
                    </Route>
            </Routes>
        </>
    );
}
