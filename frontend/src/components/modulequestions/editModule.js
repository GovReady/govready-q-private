import React, { useState, useEffect } from 'react';
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

import { ReactModal } from "../shared/modal";

// const useStyles = makeStyles((theme) => ({
//     name:
//     {
//         color: 'black'
//     },
//     headerButton: {
//         float: 'right',
//         marginRight: "20px",
//         // marginLeft: "90rem",
//         backgroundColor: '#5cb85c',
//         background: 'linear-gradient(to bottom,#5cb85c 0,#419641 100%)',
//         width: '20rem',
//         ".MuiButton-root&:hover": {
//             color: "#fff"
//         },
//     },
// }));

export const EditQuestion = ({ moduleId }) => {
    const [id, setId] = useState(0);
    const [title, setTitle] = useState("");
    // const classes = useStyles();
    // const [sortby, setSortBy] = useState(["root_task__title_override", "asc"]);
    // const [columns, setColumns] = useState([
    //     {
    //         display: "Project",
    //         sortKey: "root_task__title_override",
    //         renderCell: (obj) => {
    //             return <a  href={`/projects/${obj.id}/${slugify(obj.root_task.title_override)}`} > 
    //                 {obj.root_task.title_override}
    //             </a>
    //         }
    //     },
    //     {
    //         display: "ID",
    //         sortKey: "id",
    //         renderCell: (obj) => {
    //             return <span>
    //                 {obj.id}
    //             </span>
    //         }
    //     },
    //     {
    //         display: "Portfolio",
    //         sortKey: "portfolio__title",
    //         renderCell: (obj) => {
    //             return <span>{obj.portfolio.title}</span>
    //         }
    //     },
    //     {
    //         display: "Role",
    //         renderCell: (obj) => {
    //             return <span></span>
    //         }
    //     },
    //     {
    //         display: "Updated",
    //         sortKey: "root_task__updated",
    //         renderCell: (obj) => {
    //             return <span>{moment(obj.root_task.updated).fromNow()}</span>
    //         }
    //     },
    // ]);
    
    // const endpoint = (querystrings) => {        
    //     return axios.get(`/api/v2/modules/165/`, { params: querystrings });
    // };
    
     const endpoint = async () => {
        const response = await axios.get(`/api/v2/modules/${moduleId}/`);
        setId(response.data.id);
        
        return response.data;
    }
    console.log('testEnd: ', testEnd());

    console.log('id: ', id);
    console.log('title: ', title)
    
    console.log(question)
    return 
    <ReactModal 
        endpoint={testEnd}
        moduleId={moduleId}
        title={`Edit Module ${moduleId}`}
        body={
            <Form>
                <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                    <Form.Label column sm="2">
                    Module Id
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={id} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                    <Form.Label column sm="2">
                    Question prompt
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control plaintext defaultValue={prompt} />
                    </Col>
                </Form.Group>
            </Form>
        }
        footer={
            <Container>
                <button type="button" class="btn btn-danger" onclick={handleDelete}>Delete Question</button>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <button type="button" class="btn btn-success" onclick={handleSave}>Save Changes</button>
            </Container>
        }
    />
}