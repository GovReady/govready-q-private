import React, { useState } from 'react';
import { DataTable } from '../shared/table';
import axios from 'axios';
import moment from 'moment';
import { IconButton, Link, Button, Chip, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    name:
    {
        color: '#337ab7'
    },
    headerButton: {
        float: 'right',
        marginRight: "20px",
        // marginLeft: "90rem",
        backgroundColor: '#5cb85c',
        background: 'linear-gradient(to bottom,#5cb85c 0,#419641 100%)',
        width: '20rem',
        ".MuiButton-root&:hover": {
            color: "#fff"
        },

    },
    addControl: {
        float: 'right',
        marginRight: "200px",
    },
    chip: {
        maxWidth: 200,
        fontSize: 12,
        background: "#eee",
        marginTop: -22
    },
}))

export const SystemsControlTable = ({ systemId }) => {
    const classes = useStyles();
    const [sortby, setSortBy] = useState(["oscal_ctl_id", "asc"]);
    const [age, setAge] = React.useState('');
    const [columns, setColumns] = useState([
        {
            display: "Access Control",
            sortKey: "oscal_ctl_id",
            renderCell: (obj) => {
                const catalogKeyToUpper = obj.oscal_ctl_id.toUpperCase()
                return <a className={classes.name} href={`/systems/${systemId}/controls/`} >
                    {catalogKeyToUpper}
                </a>
            }
        },
        {
            display: "OSCAL Catalog Key",
            sortKey: "oscal_catalog_key",
            renderCell: (obj) => {
                return <Stack spacing={.5}>
                    <Chip
                        className={classes.chip}
                        label={obj.oscal_catalog_key}
                        variant="outlined"
                    />
                </Stack>
            }
        },
        {
            display: "Updated",
            sortKey: "updated",
            renderCell: (obj) => {
                return <span>{moment(obj.updated).fromNow()}</span>
            }
        },
        {
            // delete button
            display: "",
            renderCell: (obj) => {
                console.log(obj)

                return <>
                    <Link href={`/systems/${systemId}/controls/remove/${obj.id}`}>
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </Link>

                </>
            }
        },
    ]);
    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const endpoint = (querystrings) => {
        return axios.get(`/api/v2/systems/${systemId}/system-controls/`, { params: querystrings });
    };

    // const endpoint = (querystrings) => {
    //     return axios.get(`/`, { params: querystrings });
    // }
    return <DataTable
        sortby={sortby}
        columns={columns}
        endpoint={endpoint}
        header={
            <div
                style={{
                    // display: "block"
                }}>
                <span style={{
                    fontWeight: "bold",
                    fontSize: "20px",
                    marginLeft: "15px"
                }}> Selected Controls </span>

                {/* <Box
                    sx={{ minWidth: 300 }}
                    className={classes.addControl}
                >
                    <FormControl
                        fullWidth
                    >
                        <InputLabel id="demo-simple-select-label">Select A Control</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={age}
                            label="Age"
                            onChange={handleChange}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                </Box> */}



                {/* <Button
                    className={classes.headerButton}
                    variant="contained"
                    color="success"
                    // style={{width: '20rem'}}
                    href={`/systems/${systemId}/deployment/new`}
                >
                    {'New Deployment'}
                </Button> */}
                
            </div>}
    />
}