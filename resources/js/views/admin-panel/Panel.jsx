import * as React from 'react';
import {styled, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
// import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
// import Divider from '@mui/material/Divider';
// import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import {Avatar, BottomNavigation, BottomNavigationAction} from "@mui/material";
import theme from "./../../Custom"
// import logo from './assets/zhav-new.png'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import WebAssetOutlinedIcon from '@mui/icons-material/WebAssetOutlined';
import CoPresentOutlinedIcon from '@mui/icons-material/CoPresentOutlined';
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import AppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import {Link} from "react-router-dom";
import logo from './../../assets/logo.svg'


const drawerItems = [
    {
        id: 1,
        name: "کاربران",
        route: "/panel/ticket",
        icon: <DashboardOutlinedIcon/>,
        hasChildren: false,
    },
    {
        id: 2,
        name: "تیکت ها",
        route: "/panel/ticket",
        icon: <PermIdentityOutlinedIcon/>,
        hasChildren: false,
    },
    {
        id: 6,
        name: "امور مالی",
        route: "/panel/wallet",
        icon: <DnsOutlinedIcon/>,
        hasChildren: false,
    },
];


const drawerWidth = 240;


export default function Panel(props) {
    const {window} = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const [appBar, setAppBar] = React.useState(null);

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const drawer = (
        <div>
            <Box display='flex' flexDirection='column' alignItems='center' mt='20px'>
                <img src={logo} width="70%" height="70%"/>
                <Typography fontFamily='morabba' fontWeight="900" color="white">کارگزار من</Typography>
            </Box>
            {/*<Toolbar />*/}
            {/*<Divider />*/}
            <List>
                {drawerItems.map((text, index) => (
                    <Link to={text.route} style={{textDecoration: 'none'}}>
                        <ListItem key={text.name} disablePadding>
                            <ListItemButton sx={{display: 'flex', flexDirection: "column", alignItems: 'center'}}
                                            onClick={() => setAppBar(text.name)}>
                                <ListItemIcon sx={{
                                    minWidth: '0',
                                    borderRadius: "50%",
                                    backgroundColor: "gray",
                                    width: "44px",
                                    height: "44px",
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: 'white'
                                }}>
                                    {index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}
                                </ListItemIcon>
                                <Typography mt={2} fontFamily="Dana" color="white">{text.name}</Typography>
                            </ListItemButton>
                        </ListItem>
                    </Link>
                ))}
            </List>
        </div>
    );

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar
                position="fixed"
                sx={{
                    width: {sm: '78%'},
                    mr: {sm: `${drawerWidth + 48}px`},
                    borderRadius: '24px',
                    backgroundColor: theme.palette.secondary.main,
                    mt: '20px'
                }}
            >
                <Toolbar sx={{ justifyContent: 'flex-end' }}>
                    {appBar ? <Typography variant="h6" noWrap component="div" fontFamily="Dana"
                                          fontWeight="900"> {appBar} </Typography>
                        : <Typography variant="h6" noWrap component="div" fontFamily="Dana"
                                      fontWeight="900"> داشبورد</Typography>}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ml: 2, display: {sm: 'none'}}}
                    >
                        <MenuIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
                aria-label="mailbox folders"
            >
                <Drawer
                    anchor="right"
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: {xs: 'block', sm: 'none'},
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            backgroundColor: theme.palette.secondary.main
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    anchor="right" // This will make the drawer appear on the right side
                    variant="permanent"
                    sx={{
                        display: {xs: 'none', sm: 'block'},
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            backgroundColor: theme.palette.secondary.main
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{flexGrow: 1,
                    p: 3,
                    width: {sm: `calc(100% - ${drawerWidth}px)`},
                    maxHeight: 'calc(100vh - 64px)', // Set the maximum height
                    overflowY: 'auto', // Ad
            }}
            >

            </Box>
        </Box>
    );
}
