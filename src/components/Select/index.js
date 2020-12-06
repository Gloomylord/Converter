import React from "react";
import {Select, InputLabel, MenuItem, FormControl, makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
    },
    select : {
        '& div': {
            padding: '10px 20px !important'
        }
    }
}));

export default function CustomSelect({value, setValue, id, values, label}) {

    const classes = useStyles();

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return <FormControl className={classes.formControl}>
            <InputLabel id={id + " select-label"}>{label}</InputLabel>
            <Select
                labelId={id + " select-label"}
                id={id}
                value={value}
                className={classes.select}
                onChange={handleChange}
            >
                {
                    values.map(({value, label},index)=> <MenuItem key={value} value={value}>{label}</MenuItem>)
                }
            </Select>
        </FormControl>
}
