import React, { useState } from 'react';
import { DataTable } from '../shared/table';
import axios from 'axios';
import moment from 'moment';
import { Button, Chip, IconButton, Link, Stack, Tooltip } from '@mui/material';

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
                return <a className={classes.poam_id} href={`/systems/${systemId}/deployment/${obj.id}/inventory`} >
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
        return axios.get(`/api/v2/systems/${systemId}/controls/`, { params: querystrings });
    };
    return <DataTable
        sortby={sortby}
        columns={columns}
        endpoint={endpoint}
        header={<div style={{ display: "block" }}>
            <span style={{fontWeight: "bold", fontSize: "20px", marginLeft: "15px"}}> Selected components </span>
            <span>Add component</span>
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