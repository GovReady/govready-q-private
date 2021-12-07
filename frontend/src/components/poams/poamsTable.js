import React, { useState } from 'react';
import { DataTable } from '../shared/table';
import axios from 'axios';
import moment from 'moment';
import { Button, IconButton, Link, Tooltip } from '@mui/material';

import DownloadIcon from '@mui/icons-material/Download';

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    name:
    {
        color: 'black'
    },
    headerButton: {
        float: "right",
    },
    newButton: {
        // float: 'right',
        marginRight: "20px",
        // marginLeft: "90rem",
        backgroundColor: '#5cb85c',
        background: 'linear-gradient(to bottom,#5cb85c 0,#419641 100%)',
        width: '20rem',
        ".MuiButton-root&:hover": {
            color: "#fff"
        },
        marginRight: "10rem",

    },
    
}))

export const PoamsTable = ({ systemId }) => {
    const classes = useStyles();
    const [sortby, setSortBy] = useState(["updated", "desc"]);
    const [columns, setColumns] = useState([
        {
            display: "ID",
            renderCell: (obj) => {
                return <a className={classes.name} href={`/controls/${systemId}/poams/${obj.id}/edit`} >
                    V-{obj.poam?.poam_id}
                </a>
            }
        },
        {
            display: "Weakness Name",
            renderCell: (obj) => {
                return <span>{obj.poam?.weakness_name}</span>
            }
        },
        {
            display: "Status",
            sortKey: "status",
            renderCell: (obj) => {
                return <span>{obj.status}</span>
            }
        },
        {
            display: "Updated",
            sortKey: "updated",
            renderCell: (obj) => {
                return <span>{moment(obj.updated).fromNow()}</span>
            }
        },
    ]);

    const endpoint = (querystrings) => {
        return axios.get(`/api/v2/systems/${systemId}/poam-statements/`, { params: querystrings });
    };
    return <DataTable
        sortby={sortby}
        columns={columns}
        endpoint={endpoint}
        header={<div style={{ display: "block" }}>
            <span style={{fontWeight: "bold", fontSize: "20px", marginLeft: "15px"}}> POA&Ms </span>
            <div
                className={classes.headerButton}
            >
                <Button
                    className={classes.newButton}
                    variant="contained"
                    color="success"
                    // style={{width: '20rem'}} 
                    href={`/controls/${systemId}/poams/new`}
                >
                    {'New POA&M'}
                </Button>
                <Tooltip title="Download" placement="top">
                    <IconButton
                        onClick={(event) => {
                            event.preventDefault();
                            download_document('{{document.id|escapejs}}', {systemId})
                        }}
                    >
                        <DownloadIcon />
                    </IconButton>
                </Tooltip>
            </div>
        </div>}
    />
}