import React, { useState } from 'react';
import { DataTable } from '../../shared/table';
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
import slugify from 'react-slugify';
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
export const ProjectsTable = () => {
    
    const classes = useStyles();
    const [sortby, setSortBy] = useState(["root_task__title_override", "asc"]);
    const [columns, setColumns] = useState([
        {
            display: "Project",
            sortKey: "root_task__title_override",
            renderCell: (obj) => {
                return <a  href={`/projects/${obj.id}/${slugify(obj.root_task.title_override)}`} > 
                    {obj.root_task.title_override}
                </a>
            }
        },
        {
            display: "ID",
            sortKey: "id",
            renderCell: (obj) => {
                return <span>
                    {obj.id}
                </span>
            }
        },
        {
            display: "Portfolio",
            sortKey: "portfolio__title",
            renderCell: (obj) => {
                return <span>{obj.portfolio.title}</span>
            }
        },
        {
            display: "Role",
            renderCell: (obj) => {
                return <span></span>
            }
        },
        {
            display: "Updated",
            sortKey: "root_task__updated",
            renderCell: (obj) => {
                return <span>{moment(obj.root_task.updated).fromNow()}</span>
            }
        },
    ]);
    
    const endpoint = (querystrings) => {        
        return axios.get(`/api/v2/projects/`, { params: querystrings });
    };
    console.log(endpoint())
    return <DataTable
        sortby={sortby}
        columns={columns}
        endpoint={endpoint}
        header={<div style={{ display: "block" }}>
            <span style={{fontWeight: "bold", fontSize: "20px", marginLeft: "15px"}}> Projects </span>
        </div>}
    />
}