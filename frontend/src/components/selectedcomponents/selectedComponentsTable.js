import React, { useState } from 'react';
import { DataTable } from '../shared/table';
import axios from 'axios';
import { Chip, IconButton, Link, Stack, Tooltip } from '@mui/material';

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

export const SelectedComponentsTable = ({ systemId }) => {

   
    const classes = useStyles();
    const [sortby, setSortBy] = useState(["poam_id", "asc"]);

    const [columns, setColumns] = useState([
        {
            display: "ID",
            sortKey: "poam_id",
            renderCell: (obj) => {
                console.log(obj)
                return <a className={classes.poam_id} href={`/controls/${systemId}/component/${obj.id}`} >
                    {obj.poam_id}
                </a>
            }
        },
        {
            display: "",
            sortKey: "",
            renderCell: (obj) => {
                // console.log(obj)
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
                // console.log('index: ', index)
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
        header={<div style={{ display: "flex" }}>
            <span style={{fontWeight: "bold", fontSize: "20px", marginLeft: "15px"}}> Selected components </span>
           
        </div>}
    />
}