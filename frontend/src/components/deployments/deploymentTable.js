import React, { useState } from 'react';
import { DataTable } from '../shared/table';
import axios from 'axios';
import moment from 'moment';
import { IconButton, Link, Button } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';

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

export const DeploymentTable = ({ systemId }) => {
    const classes = useStyles();
    const [sortby, setSortBy] = useState(["name", "asc"]);
    const [columns, setColumns] = useState([
        {
            display: "Name",
            sortKey: "name",
            renderCell: (obj) => {
                return <a className={classes.name} href={`/systems/${systemId}/deployment/${obj.id}/inventory`} >
                    {obj.name}
                </a>
            }
        },
        {
            display: "Description",
            sortKey: "description",
            renderCell: (obj) => {
                return <span>{obj.description}</span>
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
            display: "Actions",
            renderCell: (obj) => {
                return <>
                    <Link href={`/systems/${systemId}/deployment/${obj.id}/edit`}>
                        <IconButton>
                            <EditIcon />
                        </IconButton>
                    </Link>
                    <Link href={`/systems/${systemId}/deployment/${obj.id}/history`}>
                        <IconButton>
                            <HistoryIcon />
                        </IconButton>
                    </Link>
                </>
            }
        },
    ]);

    const endpoint = (querystrings) => {
        return axios.get(`/api/v2/systems/${systemId}/deployments/`, { params: querystrings });
    };
    return <DataTable
        sortby={sortby}
        columns={columns}
        endpoint={endpoint}
        header={<div style={{ display: "block" }}>
            <span style={{fontWeight: "bold", fontSize: "20px", marginLeft: "15px"}}> Deployments </span>
            <Button
                className={classes.headerButton}
                variant="contained"
                color="success"
                // style={{width: '20rem'}} 
                href={`/systems/${systemId}/deployment/new`}
            >
                {'New Deployment'}
            </Button>
        </div>}
    />
}