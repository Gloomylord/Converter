import React, {useCallback, useEffect} from 'react';
import {observer} from "mobx-react";
import {Box, makeStyles} from "@material-ui/core";
import useStore from "../../hooks/useStore";
import Diagram from "./Diagram";
import CustomSelect from "../../components/Select";
import Converter from "../../components/Converter";
import Coins from "./Coins";

const valuesArr = [
    {
        value: 'dollars',
        label: 'US Dollar',
        vsCurrency: 'usd'
    },
    {
        value: 'ethereum',
        label: 'Ethereum',
        vsCurrency: 'eth'
    },
    {
        value: 'bitcoin',
        label: 'Bitcoin',
        vsCurrency: 'btc'
    }
];

const useStyles = makeStyles((theme) => ({
    column: {
        display: 'flex',
        'flex-direction': 'column'
    },
    title: {
        margin: '20px 8px'
    },
    sumTitle: {
        margin: '20px 8px 8px 8px'
    }
}));

function Portfolio() {

    const {store} = useStore();
    const classes = useStyles();

    useEffect(() => {
        store.fetchAllCoins();
    }, []);

    console.log('userCoins', store.userCoins);
    // console.log('userData', store.coinsData);

    console.log('transactionFrom', store.transactionFrom, 'transactionTo', store.transactionTo,
        'transactionCoefficient', store.transactionCoefficient);

    const rounding = useCallback((arr) => {
        let newArr = [...arr];
        newArr.forEach((item) => {
            if (item.value > 1) {
                item.value = +(item.value.toFixed(2));
            } else {
                item.value = +(item.value.toPrecision(5));
            }
        });
        return newArr
    }, []);

    return (<Box>
            <h2 className={classes.title}>Обмен валют</h2>
            <Converter
                convertFrom={store.transactionFrom}
                convertTo={store.transactionTo}
                setConvertFrom={store.setTransactionFrom}
                setConvertTo={store.setTransactionTo}
                coefficient={store.transactionCoefficient}
                maxFrom={store.maxFrom}
                maxTo={store.maxTo}
                selectList={store.valuesArr}
                buttonHandler={store.transaction}
            />
            <Coins data={store.userCoins}/>
            <Diagram data={rounding(store.userCoins)}/>
            <Box>
                <h4 className={classes.sumTitle}>Всего в портфеле: {store.coinsSum}</h4>
                <CustomSelect
                    value={store.coinsBase}
                    setValue={store.setCoinsBase}
                    values={valuesArr}
                    label='валюта в'
                    id='sumCurrency'
                />
            </Box>
        </Box>
    );
}

export default observer(Portfolio);
