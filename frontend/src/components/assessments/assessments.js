import React, { useState, useEffect } from 'react';
import { DataTable } from '../shared/table';
import axios from 'axios';
import moment from 'moment';
import {
    Tooltip,
    Button,
    Glyphicon,
    OverlayTrigger,
} from 'react-bootstrap';


export const AssessmentTable = ({ systemId }) => {

    const [records, setRecords] = useState(0);
    const [sortby, setSortBy] = useState(["title", "asc"]);
    const editToolTip = (<Tooltip placement="left" id='tooltip-edit'> Edit System Assessment Result
    </Tooltip>)
    const calendarToolTip = (<Tooltip placement="top" id='tooltip-edit'> View System Assessment Result History
    </Tooltip>)

    const [columns, setColumns] = useState([
        {
            display: "Assessments",
            sortKey: "title",
            renderCell: (obj) => {                
                return (
                    <>
                        <a href={`/systems/${obj.id}/sar/$${obj.id}/view}`} sx={{ textDecoration: 'none' }}>

                            <Glyphicon glyph="folder-close" style={{ color: '#3d3d3d' }} />
                            &nbsp;
                            &nbsp;
                            <span style={{
                                color: 'black',
                                textDecoration: 'none',
                                "&:hover": {
                                    textDecoration: 'underline',
                                }
                            }}>{obj.name}</span>
                        </a>
                    </>)
            }
        },
        {
            display: "Description",
            sortKey: "id",
            renderCell: (obj) => {
                return <span>{obj.description}</span>
            }
        },
        {
            display: "Created",
            sortKey: "created",
            renderCell: (obj) => {
                return <span>{moment(obj.updated).fromNow()}</span>
            }
        },
        {
            display: "Manage",
            renderCell: (obj) => {
                return <span style={{ display: 'inlineBlock' }}>
                    <a href={`/systems/${obj.id}/sar/${obj.id}/edit`}>
                        <OverlayTrigger placement="left" overlay={editToolTip}>
                            <Glyphicon glyph="pencil" style={{ color: '#3d3d3d' }} />
                        </OverlayTrigger>
                    </a>
                    &nbsp;
                    &nbsp;
                    <a href={`/systems/${systemId}/deployment/${obj.id}/history`}>
                        <OverlayTrigger placement="right" overlay={calendarToolTip}>
                            <Glyphicon glyph="book" style={{ color: '#3d3d3d' }} />
                        </OverlayTrigger>
                    </a>

                </span>
            }
        }
    ]);

    const endpoint = (querystrings) => {
        return axios.get(`/api/v2/systems/${systemId}/assessments/`, { params: querystrings });
    };

    return <DataTable        
        sortby={sortby}
        columns={columns}
        endpoint={endpoint}
        header={
            <div style={{ display: "flex", width: "100%" }} >
                <div style={{
                    float: "left",
                    textAlign: 'left',
                }}>
                    <span style={{ fontWeight: "bold", fontSize: "20px", marginLeft: "15px" }}> System Assessment Results </span>
                </div>               
                <div style={{ marginTop: '-26px' }}>
                    <Button
                        className={'newButton'}
                        style={{
                            float: 'right',
                            marginRight: "-440px",
                            marginTop: "-2.75px",
                            backgroundColor: '#5cb85c',
                            background: 'linear-gradient(to bottom,#5cb85c 0,#419641 100%)',
                            width: '20rem',
                            color: "#fff"
                        }}
                        variant="contained"
                        color="success"
                        href={`/systems/${systemId}/assessment/new`}
                    >
                        {'New Assessment Results'}
                    </Button>
                </div>


            </div>

        }
        onResponse={(response) => {
            setRecords(response.pages.total_records);
        }}
    />
}