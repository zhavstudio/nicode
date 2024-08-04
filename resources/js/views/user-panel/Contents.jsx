import * as React from "react";
import {Route, Routes, Navigate, useNavigate} from "react-router-dom";
import Ticket from "./Ticket";
import Financial from "./Financial";
import TicketChat from "./TicketChat";
import { useQuery, useMutation } from "react-query";
import axios from "@/axiosConfig.js";
import { route } from "@/views/user-panel/helpers.js";
import CircularProgress from '@mui/material/CircularProgress';
import {setAuth} from "./../../redux/actions";
import {useDispatch} from "react-redux";


export default function Contents() {
    const [initialPath, setInitialPath] = React.useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const ticket = useQuery("ticket", async () => {
        const { data } = await axios.get(
            route("api.web.v1.user.userTicket")
        );
        return data;
    },{
        onError:(e)=>{
            if (e.response.status === 401){
                dispatch(setAuth(false))
                navigate('/', { replace: true });
            }
        }});

    const createTicket = useMutation(async () => {
        const { data } = await axios.post(
            route("api.web.v1.user.first-ticket"),
            { title: "پیشفرض" }
        );
        return data;
    });

    React.useEffect(() => {
        if (ticket.isSuccess) {
            const answered = ticket.data?.data.filter((item) => item.status !== "بسته");
            const defaultTicket = ticket.data?.data.find((item) => item.title === "پیشفرض" && item.message.length === 0);

            if (answered && answered.length > 0) {
                setInitialPath(`/panel/chat/${answered[0].id}`);
            } else if (defaultTicket) {
                setInitialPath(`/panel/chat/${defaultTicket.id}`);
            } else {
                createTicket.mutate();
            }
        }
    }, [ticket.isSuccess]);

    React.useEffect(() => {
        if (createTicket.isSuccess) {
            setInitialPath(`/panel/chat/${createTicket.data}`);
        }
    }, [createTicket.isSuccess]);

    if (ticket.isLoading || createTicket.isLoading || initialPath === null) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh", // Adjust as needed
                }}
            >
                <CircularProgress />
            </div>
        );
    }

    return (
        <Routes>
            <Route path="" element={<Navigate to={initialPath} replace />} />
            <Route path="/" element={<Ticket />} />
            <Route path="ticket" element={<Ticket />} />
            <Route path="chat/:id" element={<TicketChat />} />
            <Route path="financial" element={<Financial />} />
            <Route path="account_info" element={<Financial />} />
        </Routes>
    );
}
