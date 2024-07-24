import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import theme from "./../../Custom"
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';

import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import {Link} from "react-router-dom";
import logo from './../../assets/logo.svg'
import LogoutIcon from '@mui/icons-material/Logout';


const drawerItems = [
    {
        id: 2,
        name: "تیکت ها",
        route: "/panel/ticket",
        icon: <PermIdentityOutlinedIcon/>,
        hasChildren: false,
    },
    {
        id: 6,
        name: "کیف پول",
        route: "/panel/financial",
        icon: <DnsOutlinedIcon/>,
        hasChildren: false,
    },
    {
        id: 7,
        name: "خروج",
        route: "/logout",
        icon: <LogoutIcon />,
        hasChildren: false,
    },
];


const drawerWidth = 150;


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
                    <Link to={text.route} style={{textDecoration: 'none'}}
                          onClick={() => {
                              if (text.route === "/logout") {
                                  // Remove the token from local storage
                                  localStorage.removeItem("token");
                                  // Optionally, you can redirect the user to the login page
                                  window.location.href = "/";
                              }
                          }}
                    >
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
                    '@media (min-width: 1600px)': {width: '90%',},
                    width: {sm: '100%',md:'79%',lg:"82%"},
                    mr: {md: `${drawerWidth + 48}px`},
                    borderRadius: '24px',
                    backgroundColor: theme.palette.secondary.main,
                    mt: '20px',
                    '@media (min-width: 900px)': {zIndex: (theme) => theme.zIndex.drawer + 1,}
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
                        sx={{ml: 2, display: {md: 'none'}}}
                    >
                        <MenuIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    // right: {sm: drawerWidth},
                    // left: 0,
                    height: '64px', // 84px (AppBar height + top margin) + 20px extra
                    backgroundColor: 'white',
                    '@media (min-width: 900px)': {zIndex: (theme) => theme.zIndex.drawer},
                    // '@media (min-width: 1600px)': {
                        width: '100%',
                        right: 'auto',
                        left: '50%',
                        transform: 'translateX(-50%)',
                    // },
                }}
            />
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
                        display: {xs: 'block', sm: 'block',md:"none"},
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
                        display: {xs: 'none', sm: 'none',md:"block"},
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
