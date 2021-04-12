import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import DialogContent from '@material-ui/core/DialogContent';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { DialogActions, InputLabel, TextField, Typography, FormControl } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    autocomplete: {
        marginTop: "15px",
        padding: "0px 5px 0px 0px"
    },
    form: {
        marginTop: theme.spacing(2),
        width: "98%"
    },
    formItem: {
        marginTop: theme.spacing(1)
    }
}))

const CreateNewShipmentDialog = ({ creatorOpen, handleCreate, handleCancel }) => {
    const classes = useStyles();
    const [shipType,setShipType]=useState("");
    const [shipFrom,setShipFrom]=useState("");
    const [shipTo,setShipTo]=useState("");
    const [missingType, setMissingType] = useState(false);
    const [missingFrom,setMissingFrom] =useState(false);
    const [missingTo, setMissingTo] =useState(false);

    const [state, setState] = useState({
        shipFrom: null,
        shipTo: null,
        shipmentType: "",
        shipFromOptions: [],
        shipToOptions: [],
        allShippingOptions: [],
        newFromOption: null,
        newToOption: null
    })

    useEffect(() => {
        if (creatorOpen) {
            fetch(`${process.env.REACT_APP_API_URL}/locations`)
                .then(res => res.json())
                .then(json => {
                    setState(s => ({ ...s, allShippingOptions: json }));
                });
        }
    }, [creatorOpen]);

    /* Limit the locations selectable based on shipment type */
    useEffect(() => {
        if (state.shipmentType === "") {
            setState(s => ({
                ...s,
                shipFromOptions: [],
                shipToOptions: []
            }));
        } else if (state.shipmentType === "Incoming") {
            setState(s => ({
                ...s,
                shipFromOptions: s.allShippingOptions,
                shipToOptions: s.allShippingOptions.filter(obj => obj.locationType === "Staging Facility")
            }));
        } else if (state.shipmentType === "Outgoing") {
            setState(s => ({
                ...s,
                shipToOptions: s.allShippingOptions,
                shipFromOptions: s.allShippingOptions.filter(obj => obj.locationType === "Staging Facility")
            }));
        }
    }, [state.shipmentType]);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setState(s => ({
            ...s,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if(shipType===""){
            setMissingType(true);
            return;
        }
        if(shipFrom===""){
            setMissingFrom(true);
            return;
        }
        if(shipTo===""){
            setMissingTo(true);
            return;
        }
        handleCreate(state);
        setState({
            shipFrom: null,
            shipTo: null,
            shipmentType: "",
            newFromOption: null,
            newToOption: null
        })
    }

    return (
        <Dialog onClose={handleCancel} onSubmit={handleSubmit} open={creatorOpen} fullWidth>
            <DialogTitle>Start New Shipment</DialogTitle>

            <DialogContent>
                <Grid container direction="row">
                    <Grid item xs={12}>
                        <FormControl variant="outlined" style={{ width: "50%", display: "block", marginLeft: "auto", marginRight: "auto" }}>
                            <InputLabel id="type-label">Shipment Type</InputLabel>
                            <Select
                                labelId="type-label"
                                id="type"
                                name="shipmentType"
                                fullWidth
                                labelWidth={110}
                                value={state.shipmentType}
                                onChange={(event)=>{
                                    if(missingType){setMissingType(false)};
                                    handleChange(event)}}
                                    >

                                <MenuItem value="Incoming">Incoming</MenuItem>
                                <MenuItem value="Outgoing">Outgoing</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} className={classes.autocomplete}>
                        <Autocomplete
                            id="shipment-from-locator"
                            options={state.shipFromOptions}
                            getOptionLabel={(option) => `${option.locationName} (${option.key})`}
                            value={state.shipFrom}
                            fullWidth
                            groupBy={(option) => option.locationType}
                            onChange={(event, newValue) =>{ 
                                if(missingFrom){setMissingFrom(false)}
                                setState(s => ({ ...s, shipFrom: newValue }))}}
                            className={classes.autocomplete}
                            renderOption={(option) => {
                                return (
                                    <>
                                        <div>
                                            {option.locationName} {`(${option.key})`}
                                            <Typography className={classes.subtitle} variant="subtitle2">
                                                {
                                                    option.operator ?
                                                        option.operator
                                                        : option.client ?
                                                            option.client
                                                            : option.address ?
                                                                option.address
                                                                : null
                                                }
                                            </Typography>
                                        </div>
                                    </>
                                )
                            }}
                            renderInput={(params) => <TextField {...params} label="Ship From" variant="outlined" />}
                        />
                    </Grid>
                    <Grid item xs={6} className={classes.autocomplete}>
                        <Autocomplete
                            id="shipment-to-locator"
                            options={state.shipToOptions}
                            getOptionLabel={(option) => `${option.locationName} (${option.key})`}
                            value={state.shipTo}
                            fullWidth
                            groupBy={(option) => option.locationType}
                            onChange={(event, newValue) => {
                                if(missingTo){setMissingTo(false)}
                                setState(s => ({ ...s, shipTo: newValue }))}}
                            className={classes.autocomplete}
                            renderOption={(option) => {
                                return (
                                    <>
                                        <div>
                                            {option.locationName} {`(${option.key})`}
                                            <Typography className={classes.subtitle} variant="subtitle2">
                                                {
                                                    option.operator ?
                                                        option.operator
                                                        : option.client ?
                                                            option.client
                                                            : option.address ?
                                                                option.address
                                                                : null
                                                }
                                            </Typography>
                                        </div>
                                    </>
                                )
                            }}
                            renderInput={(params) => <TextField {...params} label="Ship To" variant="outlined" />}
                        />
                    </Grid>
                </Grid>

            </DialogContent>
            <DialogActions>
                <Button className={classes.button} onClick={() => {
                    handleCancel();
                    setState({
                        shipFrom: null,
                        shipTo: null,
                        shipmentType: "",
                        newFromOption: null,
                        newToOption: null
                    });
                }}>Cancel</Button>
                <Button className={classes.button} onClick={handleSubmit}>Create</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateNewShipmentDialog;