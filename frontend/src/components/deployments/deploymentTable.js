import React, { useState } from 'react';
import { DataTable } from '../shared/table';
import axios from 'axios';
import moment from 'moment';
import { IconButton, Link } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    name:
    {
        color: 'black'
    }
}))

export const DeploymentTable = ({ systemId }) => {
    const classes = useStyles();
    const headerButton = {
        title: 'New Deployment',
        link: `/systems/${systemId}/deployment/new`
    }
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

    <a class="portfolio-project-link" href="/systems/1/deployment/1/edit" title="Edit deployment" aria-label="Edit deployment"><span class="glyphicon glyphicon-pencil"></span></a>
    const endpoint = (querystrings) => {
        return axios.get(`/api/v2/systems/${systemId}/deployments/`, { params: querystrings});
    };
    return <DataTable
        sortby={sortby}
        columns={columns}
        endpoint={endpoint}
        headerButton={headerButton} 
        />
}