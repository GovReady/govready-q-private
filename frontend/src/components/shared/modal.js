import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import {
    Button,
    Modal
} from 'react-bootstrap';
import { useDebouncedCallback } from "use-debounce";
import axios from 'axios';


export const ReactModal = (props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    console.log('mod id: ', props.moduleId)
    console.log('quest id: ', props.questionId)
    console.log('data: ', props.data);

    const handleSave = async () => await axios.put(`/api/v2/modules/${props.moduleId}/questions/${props.questionId}/`, props.data)
        .then((response) => {
            if(response.status === 200){    
                window.location.reload();
            } else{
                console.error("Something went wrong")
            }
        });
    
    const handleDelete = async () => {
      const response = await axios.delete(`/api/v2/modules/${props.moduleId}/questions/${props.questionId}/`)
      if(response.status === 204){    
            window.location.reload();
        } else{
            console.error("Something went wrong")
        }
    };

    return (
        <>
            <Button onClick={() => setShow(true)}>Modal</Button>
            <Modal
                size="lg"
                show={show}
                onHide={() => setShow(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton style={{backgroundColor: "#e5e5e5"}}>
                    <Modal.Title id="example-modal-sizes-title-sm">
                        {props.header}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.body}
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" className="btn btn-danger" onClick={handleDelete}>Delete Question</Button>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button type="button" className="btn btn-success" onClick={handleSave}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
};

ReactModal.defaultProps = {
    rollups: [],
};