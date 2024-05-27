import * as React from "react";
import {Route, Routes} from "react-router-dom";
import Login from "./Login.jsx";
import Otp from "./Otp.jsx";
import Panel from "./../AdminPanel/Panel"
import Ticket from "../AdminPanel/Ticket.jsx";






export default function Contents() {
    return (
        <>
            <Routes>
                    {/*<Route path="/" element={<Login/>}/>*/}
                    {/*<Route path="/otp" element={<Otp/>}/>*/}
                    <Route path="admin-panel" >
                        <Route path="" element={<Panel/>}/>
                        <Route path="ticket" element={<Ticket/>}/>
                    </Route>
            </Routes>
        </>
    );
}