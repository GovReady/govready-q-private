import React, { useState, useEffect } from 'react';
import { DataTable } from '../shared/table';
import axios from 'axios';
import { Button, Checkbox, FormControlLabel , FormGroup , Chip, Stack, Tooltip } from '@mui/material';

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    name:
    {
        color: 'black'
    },
    headerButton: {
        float: 'right',
        marginRight: "20px",
        backgroundColor: '#5cb85c',
        background: 'linear-gradient(to bottom,#5cb85c 0,#419641 100%)',
        width: '20rem',
        ".MuiButton-root&:hover": {
            color: "#fff"
        },

    },
    newButton: {
        marginLeft: "1rem",
        marginRight: "1rem",
        backgroundColor: '#5cb85c',
        background: 'linear-gradient(to bottom,#5cb85c 0,#419641 100%)',
        ".MuiButton-root&:hover": {
            color: "#fff"
        },
    },
    compareButton: {
        backgroundColor: '#1976d2',
        background: 'linear-gradient(to bottom,#5bc0de 0,#2aabd2 100%)',
        ".MuiButton-root&:hover": {
            color: '#fff',
            backgroundColor: '#31b0d5',
            borderColor: '#269abc'
        }
    }
}))

export const ComponentsTable = () => {
    const classes = useStyles();
    const [records, setRecords] = useState(0);
    const [sortby, setSortBy] = useState(["name", "asc"]);
    const [columns, setColumns] = useState([
        {
            display: "Component",
            sortKey: "catalog_key",
            renderCell: (obj) => {
                return <a className={classes.name} href={`/controls/components/${obj.id}`} >
                    {obj.name}
                </a>
            }
        },
        {
            display: "Description",
            renderCell: (obj) => {
                return <div>
                        <span>{obj.description}</span>
                        <Stack>
                            {obj.tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag.label}
                                    sx={{width: '100px', margin: '5px'}}
                                    onClick={handleClick}
                                    variant="outlined" 
                                />
                            ))}
                        </Stack>
                    </div>
            }
        },
        {
            display: "Select",
            renderCell: (obj) => {
                return <FormGroup>
                <FormControlLabel control={<Checkbox />} label="" />
              </FormGroup>
            }
        },
        {
            display: "Statements",
            renderCell: (obj) => {
                return <span>{obj.statements_produced.length}</span>
            }
        },
    ]);
    const handleClick = () => {
        console.log('Clicked!')
    }
    const endpoint = (querystrings) => {
        return axios.get(`/api/v2/components/`, { params: querystrings });
    };

    useEffect(()=> {
        newItem();
    });
    const newItem = async () => {
        try {
            const item = await endpoint().then((response) => {
              setRecords(response.data.pages.total_records)
            });
        } catch (err) {
            console.log(err)
        }
    };

    return <DataTable
        sortby={sortby}
        columns={columns}
        endpoint={endpoint}
        header={<div style={{ display: "block" }}>
            <div style={{ display: 'flex', placeContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{fontWeight: "bold", fontSize: "20px", marginLeft: "15px"}}> Component Library </span>
                <div style={{ float: 'right' }}>
                    <Button
                        className={classes.newButton}
                        variant="contained"
                        color="success"
                        style={{marginRight: "1rem"}} 
                        href={`/controls/components/new`}
                    >
                        {'Create a Component'}
                    </Button>
                    <Button
                        className={classes.newButton}
                        variant="contained"
                        color="success"
                        style={{marginRight: "1rem"}} 
                        href={`/#`}
                    >
                        {'Import OSCAL Component'}
                    </Button>
                    <Button
                        className={classes.newButton}
                        variant="contained"
                        color="success"
                        // style={{width: '20rem'}} 
                        onClick={(event) =>{
                            event.preventDefault();
                            show_import_component_modal()
                        }}
                    >
                        {'Manage Import Component'}
                    </Button>
                </div>
            </div>
            <span style={{ marginLeft: "15px" }}>You have access to {records} components</span>
            <div style={{ float: 'right' }}>
                <Button
                    className={classes.compareButton}
                    variant="contained"
                    // color="success"
                    style={{marginRight: "1rem"}} 
                    href={`/controls/components/compare`}
                >
                    {'Compare Components'}
                </Button>
                <Button
                    //className={classes.newButton}
                    variant="contained"
                    color="success"
                    style={{marginRight: "1rem"}} 
                    onClick={(event) =>{
                        event.preventDefault();
                        select_all(true)
                        console.log('all true!')
                    }}
                >
                    {'Select All'}
                </Button>
                <Button
                    //className={classes.newButton}
                    variant="contained"
                    color="error"
                    // style={{width: '20rem'}} 
                    onClick={(event) =>{
                        event.preventDefault();
                        select_all(false)
                        console.log('all true!')
                    }}
                >
                    {'Deselect  All'}
                </Button>
            </div>
        </div>
        }
    />
}