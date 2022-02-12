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


export const PortfolioTable = () => {

    const [records, setRecords] = useState(0);
    const [sortby, setSortBy] = useState(["title", "asc"]);
    const editToolTip = (<Tooltip placement="top" id='tooltip-edit'> Edit Portfolio
    </Tooltip>)
    const [columns, setColumns] = useState([
        {
            display: "Portfolio",
            sortKey: "title",
            renderCell: (obj) => {
                return (
                    <>
                        <a href={`/portfolios/${obj.id}/projects`} sx={{ textDecoration: 'none' }}>

                            <Glyphicon glyph="folder-close" style={{ color: '#3d3d3d' }} />
                            &nbsp;
                            &nbsp;
                            <span style={{
                                color: 'black',
                                textDecoration: 'none',
                                "&:hover": {
                                    textDecoration: 'underline',
                                }
                            }}>{obj.title}</span>
                        </a>
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
            display: "Created",
            sortKey: "created",
            renderCell: (obj) => {
                return <span>{moment(obj.created).fromNow()}</span>
            }
        },
        {
            display: "Manage",
            renderCell: (obj) => {
                return <>
                    <a href={`/portfolios/${obj.id}/edit`}>
                        <OverlayTrigger placement="right" overlay={editToolTip}>
                            <Glyphicon glyph="pencil" style={{ color: '#3d3d3d' }} />
                        </OverlayTrigger>

                    </a>
                </>
            }
        }
    ]);

    const endpoint = (querystrings) => {
        return axios.get(`/api/v2/portfolios/`, { params: querystrings });
    };

    return <DataTable
        sortby={sortby}
        columns={columns}
        endpoint={endpoint}
        header={
            <div style={{ display: "flex", width: "100%" }} >
                <div style={{ marginTop: '3px' }}>
                    <span style={{ marginLeft: "20px" }}>You have access to {records} portfolios</span>
                </div>
            </div>
        }
        onResponse={(response)=>{
            setRecords(response.pages.total_records);
        }}
    />
}