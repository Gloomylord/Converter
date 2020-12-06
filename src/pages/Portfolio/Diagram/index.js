import React, {useMemo} from 'react';
import {observer} from "mobx-react";
import {
    PieChart, Pie, Cell, Tooltip, Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const RADIAN = Math.PI / 180;

function Diagram({data}) {

    const renderCustomizedLabel = useMemo(() => {
        return ({
                    cx, cy, midAngle, innerRadius, outerRadius, percent, index,
                }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
                <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                    {(percent * 100).toFixed(0) > 0 ? `${(percent * 100).toFixed(0)}%`:''}
                </text>
            );
        };
    }, [data]);

    return (
        <PieChart width={400} height={300}>
            <Pie
                data={data}
                cx={200}
                cy={150}
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
            >
                {
                    data.map((entry, index) =>
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />)
                }
            </Pie>
            <Tooltip/>
            <Legend/>
        </PieChart>
    );
}

export default observer(Diagram);
