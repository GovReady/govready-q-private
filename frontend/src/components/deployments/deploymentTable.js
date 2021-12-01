import React, { useState } from 'react';
import { DataTable } from '../shared/table';
import axios from 'axios';
import { makeStyles } from "@mui/styles";
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    name:
    {
        color: 'black'
    }
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
                return <><button>Test </button><button>Test2</button></>
            }
        },
    ]);
    const endpoint = (querystrings) => {
        return axios.get(`/api/v2/systems/${systemId}/deployments/`, { params: querystrings});
    };
    return <DataTable
        sortby={sortby}
        columns={columns}
        endpoint={endpoint} />
}