import React, {useState} from "react";
import {AppBar, Tabs, Tab, Box, makeStyles} from "@material-ui/core";
import Converter from "./pages/ConverterPage";
import Portfolio from "./pages/Portfolio";

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    tablePanel: {
        padding: '30px'
    },
    box: {
        display: 'flex',
        'flex-direction': 'column',
        'align-items': 'center'
    },
    tabs: {
        margin: '0 auto'
    }
}));

function TabPanel(props) {
    const {children, value, index, ...other} = props;
    const classes = useStyles();
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box className={classes.box}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function App() {

    const classes = useStyles();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs value={value}
                      className={classes.tabs}
                      onChange={handleChange}
                      aria-label="simple tabs example"
                >
                    <Tab label="Конвертер" {...a11yProps(0)} />
                    <Tab label="Портфель" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <TabPanel className={classes.tablePanel} value={value} index={0}>
                <Converter/>
            </TabPanel>
            <TabPanel className={classes.tablePanel} value={value} index={1}>
                <Portfolio/>
            </TabPanel>
        </div>
    );
}

export default App;
