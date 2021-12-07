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
import EditIcon from '@mui/icons-material/Edit';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    name:
    {
        color: 'black',
        textDecoration: 'none',
        "&:hover": {
            textDecoration: 'underline',
        }
    },
    title: {
        float: "left",
        textAlign: 'left',
    },
    subheader: {
        marginLeft: "15px",
        marginRight: "15px",
    },
    newButton: {
        backgroundColor: '#5cb85c',
        background: 'linear-gradient(to bottom,#5cb85c 0,#419641 100%)',
        width: '20rem',
        ".MuiButton-root&:hover": {
            color: "#fff"
        },
        float: 'right',
    },
}))

export const PortfolioTable = () => {
    const classes = useStyles();
    const [sortby, setSortBy] = useState(["title", "asc"]);
    const [columns, setColumns] = useState([
        {
            display: "Portfolio",
            sortKey: "title",
            renderCell: (obj) => {
                return (
                <>
                    <Link  href={`/portfolios/${obj.id}/projects`} sx={{textDecoration: 'none'}}>
                        <IconButton>
                            <FolderOpenIcon />
                        </IconButton>
                        <span className={classes.name}>{obj.title}</span>
                    </Link>
                </>)
            }
        },
        {
            display: "ID",
            sortKey: "id",
            renderCell: (obj) => {
                return <span>{obj.id}</span>
            }
        },
        {
            display: "Role",
            sortKey: "role",
            renderCell: (obj) => {
                return <span>{obj.role}</span>
            }
        },
        {
            display: "Manage",
            renderCell: (obj) => {
                return <>
                    <Link href={`/portfolios/${obj.id}/edit`}>
                        <Tooltip title="Edit portfolio" placement="top">
                            <IconButton>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    </Link>
                </>
            }
        },
        {
            display: "Created",
            sortKey: "created",
            renderCell: (obj) => {
                return <span>{moment(obj.created).fromNow()}</span>
            }
        },
    ]);
    
    const endpoint = (querystrings) => {
        return axios.get(`/api/v2/portfolios/`, { params: querystrings });
    };
    
    return <DataTable
        sortby={sortby}
        columns={columns}
        endpoint={endpoint}
        header={
            <div style={{ display: "inline-grid", width: "100%" }} >
                <div className={classes.title}>
                    <span style={{fontWeight: "bold", fontSize: "20px", marginLeft: "15px"}}> Portfolios </span>
                </div>
                <div className={classes.subheader}>
                    <span>You have access to ...TODO portfolios</span>
                    <Button
                        className={classes.newButton}
                        variant="contained"
                        color="success"
                        href={`/portfolios/new`}
                    >
                        {'Create a portfolio'}
                    </Button>
                </div>
            </div>
            
        }
    />
}