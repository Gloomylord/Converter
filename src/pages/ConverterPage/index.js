import React, {useEffect} from "react";
import {Box, makeStyles} from "@material-ui/core";
import Chart from "./Chart";
import {observer} from "mobx-react";
import Converter from "../../components/Converter";
import useStore from "../../hooks/useStore";

const useStyles = makeStyles((theme) => ({
    row: {
        display: 'flex',
        'flex-direction': 'row'
    },
    column: {
        display: 'flex',
        'flex-direction': 'column'
    },
    input: {
        margin: theme.spacing(1)
    },
    icon: {
        'align-self': 'center',
        'font-size': '24px',
        color: '#666',
        margin: '0 20px',
        transition: '.2s',
        cursor: 'pointer',
        '&:hover': {
            color: '#111'
        }
    }
}));

function ConverterPage() {

    const classes = useStyles();

    const {store} = useStore();

    useEffect(() => {
        store.fetchCoins(store.coinFrom, store.coinTo);
    }, [store.coinFrom]);

    console.log('coeff', store.coinsCoefficient);

    return <Box className={classes.column}>
        <Converter
            convertFrom={store.coinFrom}
            convertTo={store.coinTo}
            setConvertFrom={store.setCoinFrom}
            setConvertTo={store.setCoinTo}
            coefficient={store.coinsCoefficient}
            selectList={store.valuesArr}
        />
        <Chart/>
    </Box>
}

export default observer(ConverterPage);
