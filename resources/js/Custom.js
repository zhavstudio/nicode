import { createTheme, colors } from "@mui/material";

const customTheme = createTheme({
    palette: {
        Primary:{
            main:'#4162FF',
            10 : '#F4F4F4',
            20 : "#E9E9E9"
        },
        Secondary:{
            main:'#593188',
        },
        Background: '#FFFFFF',
        danger: '#FF417A',
        alert: '#FF8C00',
        active: '#007528'

    },
    direction: 'rtl',
    typography: {
        fontFamily: [
            "Dana", "Iranian-sans","morabba"
        ].join(','),
    },
})
export default customTheme;
