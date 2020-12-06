import React, {useCallback, useEffect, useState} from "react";
import {Box, Button, makeStyles, TextField} from "@material-ui/core";
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import CustomSelect from "../../components/Select";
import {observer} from "mobx-react";

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
    row: {
        display: 'flex',
        'flex-direction': 'row'
    },
    column: {
        display: 'flex',
        'flex-direction': 'column',
        'justify-content': 'space-between'
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
    },
    button: {
        margin: '10px 8px',
        'align-self': 'flex-end',
    }
}));

function Converter(
    {
        convertFrom, setConvertFrom, convertTo, setConvertTo,
        coefficient, maxFrom, buttonHandler,selectList
    }
) {
    const [from, setFrom] = useState('1');
    const [to, setTo] = useState('1');

    const onToggle = useCallback(() => {
        setConvertTo(convertFrom);
        setConvertFrom(convertTo, convertFrom);
    }, [convertFrom, convertTo]);

    const onChangeTo = useCallback((e) => {
        let value = (e.target.value / coefficient < 10) ? +(e.target.value / coefficient).toPrecision(4) + '' :
            +(e.target.value / coefficient).toFixed(2) + '';
        setTo(e.target.value);
        setFrom(value);
    }, [coefficient]);

    const onClick = useCallback(() => {
        buttonHandler(from, to);
    }, [from, to]);

    const onChangeFrom = useCallback((e) => {
        let value = (e.target.value * coefficient < 10) ? +(e.target.value * coefficient).toPrecision(4) + '' :
            +(e.target.value * coefficient).toFixed(2) + '';
        setTo(value);
        setFrom(e.target.value);
    }, [coefficient]);

    useEffect(() => {
        let value = (from  * coefficient < 10) ? +(from  * coefficient).toPrecision(4) + '' :
            +(from  * coefficient).toFixed(2) + '';
        setTo(value);
    }, [coefficient, convertFrom, convertTo]);

    const classes = useStyles();

    return <>
        <Box className={classes.row} style={{justifyContent: 'space-between'}}>
            <Box className={classes.column}>
                <CustomSelect
                    value={convertFrom}
                    setValue={setConvertFrom}
                    values={valuesArr}
                    label='from Currency'
                    id='fromCurrency'
                />
                <TextField
                    className={classes.input}
                    value={from}
                    onChange={onChangeFrom}
                    id="fromCurrencyNumber"
                    type='number'
                />
            </Box>
            <Box className={classes.row}>
                <Box className={classes.icon}>
                    <SyncAltIcon onClick={onToggle}/>
                </Box>
            </Box>
            <Box className={classes.column}>
                <CustomSelect
                    value={convertTo}
                    setValue={setConvertTo}
                    values={selectList}
                    id='toCurrency'
                    label='to Currency'
                />
                <TextField
                    className={classes.input}
                    value={to}
                    onChange={onChangeTo}
                    id="toCurrencyNumber"
                    type='number'
                />
            </Box>
        </Box>
        {maxFrom !== null && maxFrom !== undefined &&
        <>
            <Button className={classes.button}
                    variant="contained"
                    onClick={onClick}
                    disabled={from > maxFrom}
                    color="primary">
                Обменять
            </Button>
            {
                from > maxFrom &&
                <label>Столько нет</label>
            }
        </>
        }
    </>
}

export default observer(Converter);
