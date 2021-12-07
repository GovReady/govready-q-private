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

export const ComponentsTable = ({ systemId }) => {

    
    const classes = useStyles();
    const [sortby, setSortBy] = useState(["name", "asc"]);
    const [columns, setColumns] = useState([
        {
            display: "ID",
            sortKey: "poam_id",
            renderCell: (obj) => {
                return <a className={classes.poam_id} href={`/controls/${systemId}/component/${obj.id}`} >
                    {obj.poam_id}
                </a>
            }
        },
        {
            display: "",
            sortKey: "",
            renderCell: (obj) => {
                console.log(obj)
                return <Stack spacing={1}>
                    <Chip label={"software"} variant="outlined"/>
                </Stack>
            }
        },
        {
            display: "",
            sortKey: "",
            renderCell: (obj) => {
                return <Stack spacing={1} sx={{ color: "#999" }}>
                    <Chip label={"software"} variant="outlined"/>
                </Stack>
            }
        },
        {
            display: "Training course",
            sortKey: "training",
            renderCell: (obj, index) => {
                console.log('index: ', index)
                return <span>training course</span>
            }
        },
        {
            display: "Controls",
            sortKey: "controls",
            renderCell: (obj) => {
                return <span>controls</span>
            }
        },
        {
            display: "Actions",
            renderCell: (obj) => {
                return <>
                    <Link href={`/controls/${systemId}/component/${obj.id}/remove`}>
                        <Tooltip title="Remove component" placement="top">
                            <IconButton>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Link>
                </>
            }
        },
    ]);
    
    const endpoint = (querystrings) => {
        return axios.get(`/api/v2/systems/${systemId}/components/`, { params: querystrings });
    };

    const [availableComponentsToAdd, setAvailableComponentsToAdd] = React.useState('');

  const handleChange = (event) => {
    setAvailableComponentsToAdd(event.target.value);
  };
    return <DataTable
        sortby={sortby}
        columns={columns}
        endpoint={endpoint}
        header={<div style={{ display: "block" }}>
            <span style={{fontWeight: "bold", fontSize: "20px", marginLeft: "15px"}}> Selected components </span>
            <Box sx={{ minWidth: 300 }}>
                <FormControl sx={{ minWidth: 300 }}>
                    <InputLabel id="component-select-label">Selected Component</InputLabel>
                    <Select
                        labelId="component-select-label"
                        id="component-select"
                        value={availableComponentsToAdd}
                        label="Available Components to add"
                        onChange={handleChange}
                    >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </div>}
    />
}