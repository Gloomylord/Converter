import React, {useEffect, useMemo} from "react";
import {observer} from "mobx-react";
import {CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import {Box, makeStyles} from "@material-ui/core";
import useStore from "../../hooks/useStore";
import CustomSelect from "../../components/Select";

const useStyles = makeStyles((theme) => ({
    row: {
        display: 'flex',
        'flex-direction': 'row',
        'justify-content': 'space-between',
    },
    title: {
        'text-align': 'center',
        margin: '30px 0 0 0',
    },
    label: {
        'align-self': 'center'
    }
}));

function Chart() {
    const {store} = useStore();
    const classes = useStyles();

    useEffect(() => {
        store.fetchChartData(store.chartCoin, store.chartVsCurrency);
    }, []);

    const data = useMemo(() => {
        return Array.from(store.chartData).map((value, i) => {
            let date = new Date(value[0]);
            return {
                name: (i !== 14) ? date.getDate() + '.' + (date.getMonth() + 1) : 'now',
                'цена': (value[1] < 10) ? value[1].toPrecision(5) : value[1].toFixed(2),
            }
        })
    }, [store.chartData]);

    const valuesVsCurrency = useMemo(() => {
        return store.valuesArr.map((item) => {
            return {
                value: item.vsCurrency,
                label: item.label
            }
        })
    }, []);

    return <Box>
        <h3 className={classes.title}>Изменение цены за 14 дней</h3>
        <LineChart width={600} height={300} data={data} margin={{top: 35, right: 20, bottom: 20, left: 20}}>
            <Line type="monotone" dataKey="цена" stroke="#8884d8"/>
            <CartesianGrid stroke="#ccc" strokeDasharray="3 3"/>
            <Tooltip/>
            <XAxis dataKey="name"/>
            <YAxis/>
        </LineChart>
        <Box className={classes.row}>
            <CustomSelect
                value={store.chartCoin}
                setValue={store.setChartCoin}
                values={store.valuesArr}
                id='coinChart'
                label='X'
            />
            <label className={classes.label}>Цена в:</label>
            <CustomSelect
                value={store.chartVsCurrency}
                setValue={store.setChartVsCurrency}
                values={valuesVsCurrency}
                id='vsCurrencyChart'
                label='Y'
            />
        </Box>
    </Box>
}

export default observer(Chart);