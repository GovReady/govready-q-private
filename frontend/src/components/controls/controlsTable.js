import React, { useState } from 'react';
import { DataTable } from '../shared/table';
import axios from 'axios';
import moment from 'moment';
import { Button, Chip, IconButton, Link, Stack, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    name:
    {
        color: 'black'
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
}))

export const ControlsTable = () => {

    
    const classes = useStyles();
    const [sortby, setSortBy] = useState(["catalog_key", "asc"]);
    const [columns, setColumns] = useState([
        {
            display: "Catalog Key",
            sortKey: "catalog_key",
            renderCell: (obj) => {
                return <a className={classes.name} href={`/controls/catalogs/${obj.catalog_key}`} >
                    {obj.catalog_key}
                </a>
            }
        },
        {
            display: "Title",
            renderCell: (obj) => {
                return <span>{obj.title}</span>
            }
        },
    ]);
    
    const endpoint = (querystrings) => {
        return axios.get(`/api/v2/controls/`, { params: querystrings });
    };

    return <DataTable
        sortby={sortby}
        columns={columns}
        endpoint={endpoint}
        header={<div style={{ display: "block" }}>
            <span style={{fontWeight: "bold", fontSize: "20px", marginLeft: "15px"}}> Catalogs </span>
        </div>}
    />
}