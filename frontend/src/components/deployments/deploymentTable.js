import React, { useState } from 'react';
import { DataTable } from '../shared/table';
import axios from 'axios';
import moment from 'moment';
import {
    Tooltip,
    Button,
    Glyphicon,
    OverlayTrigger,
} from 'react-bootstrap';

export const DeploymentTable = ({ systemId }) => {
    const [sortby, setSortBy] = useState(["name", "asc"]);
    const historyToolTip =(<Tooltip title="History" placement="top" id='tooltip-history'>
                History
            </Tooltip> )
    const editToolTip = (<Tooltip placement="top" id='tooltip-edit'> Edit
            </Tooltip>)
    const [columns, setColumns] = useState([
        {
            display: "Name",
            sortKey: "name",
            renderCell: (obj) => {
                
                return <a className={name} href={`/systems/${systemId}/deployment/${obj.id}/inventory`} >
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
                return <span style={{ display: 'inlineBlock' }}>
                    <a href={`/systems/${systemId}/deployment/${obj.id}/edit`}>
                        <OverlayTrigger placement="left" overlay={editToolTip}>
                            <Glyphicon glyph="pencil" style={{ color: '#3d3d3d' }} />
                        </OverlayTrigger>
                    </a>
                    &nbsp;
                    &nbsp;
                    <a href={`/systems/${systemId}/deployment/${obj.id}/history`}>
                        <OverlayTrigger placement="right" overlay={historyToolTip}>
                            <Glyphicon glyph="book" style={{ color: '#3d3d3d' }}/>
                        </OverlayTrigger>
                    </a>

                </span>

            }
        },
    ]);

    const endpoint = (querystrings) => {
        return axios.get(`/api/v2/systems/${systemId}/deployments/`, { params: querystrings });
    };
    return <DataTable
        sortby={sortby}
        columns={columns}
        endpoint={endpoint}
        header={<div style={{ display: "flex" }}>

            <span style={{ fontWeight: "bold", fontSize: "20px", marginLeft: "15px" }}> Deployments </span>
            <span >
                <Button
                    className={'newDeploymentButton'}
                    style={{
                        float: 'right',
                        marginRight: "-485px",
                        marginTop: "-2.75px",
                        backgroundColor: '#5cb85c',
                        background: 'linear-gradient(to bottom,#5cb85c 0,#419641 100%)',
                        width: '20rem',
                        color: "#fff"
                    }}
                    variant="contained"
                    color="success"
                    href={`/systems/${systemId}/deployment/new`}
                >
                    {'New Deployment'}
                </Button>
            </span>
        </div>}
    />
}
