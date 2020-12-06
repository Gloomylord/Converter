import React from "react";
import {Box, makeStyles} from "@material-ui/core";
import {observer} from "mobx-react";

const useStyles = makeStyles((theme) => ({
    row: {
        display: 'flex',
        'flex-direction': 'row',
        'justify-content': 'space-between',
    },
    title: {
        margin: '20px 0 10px 0',
    },
    label: {
        'align-self': 'center'
    }
}));

function Coins({data}) {
    const classes = useStyles();

    return <Box className={classes.row}>
        {data.map((item,index) =>
            <Box key={index} className={classes.column}>
                <h4 className={classes.title}>{item.name}</h4>
                <label>{item.count}</label>
            </Box>
        )}
    </Box>
}

export default observer(Coins);
