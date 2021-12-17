import React, { useState } from 'react';
import { DataTable } from '../shared/table';
import axios from 'axios';



export const ControlsTable = () => {


    const [sortby, setSortBy] = useState(["catalog_key", "asc"]);
    const [columns, setColumns] = useState([
        {
            display: "Catalog Key",
            sortKey: "catalog_key",
            renderCell: (obj) => {
                return <a href={`/controls/catalogs/${obj.catalog_key}`} >
                    {obj.catalog_key}
                </a>
            }
        },
        {
            display: "Title",
            renderCell: (obj) => {
                return <span>{obj.title}</span>
            }
        },
    ]);

    const endpoint = (querystrings) => {
        return axios.get(`/api/v2/controls/`, { params: querystrings });
    };
    return <DataTable
        sortby={sortby}
        columns={columns}
        endpoint={endpoint}
        header={<div style={{ display: "block" }}>
            <span style={{ fontWeight: "bold", fontSize: "20px", marginLeft: "15px" }}> Catalogs </span>
        </div>}
    />
}