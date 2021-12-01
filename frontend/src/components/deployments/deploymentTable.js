import React, { useState } from 'react';
import { DataTable } from '../shared/table';
import axios from 'axios';

export const DeploymentTable = ({ systemId }) => {
    const [sortby, setSortBy] = useState(["created", "desc"]);
    const [columns, setColumns] = useState([
        // {
        //   display: "Type",
        //   property: "document_type.display",
        //   sortKey: "document_type",
        //   dataType: columnDataTypes.STRING,
        // },
        {
            display: "Name",
            sortKey: "name",
            renderCell: (obj) => {
                return <span>{obj.name}</span>
            }
        },
        {
            display: "Description",
            sortKey: "description",
            renderCell: (obj) => {
                return <span>{obj.description}</span>
            }
        },
    ]);

    const endpoint = () => axios.get(`/api/v2/systems/${systemId}/deployments/`);

    return <DataTable
        sortby={sortby}
        sortKey={"name"}
        columns={columns}
        endpoint={endpoint} />
}