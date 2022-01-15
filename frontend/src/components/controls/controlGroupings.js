import React, { useState } from 'react';
import { DataTable } from '../shared/table';
import axios from 'axios';




export const ControlGroupings = () => {
    const currentUrl = window.location.href
    // CMMC_ver1
    // url(r'^catalogs/(?P<catalog_key>.*)/group/(?P<g_id>.*)', views.group, name="control_group")

    const [sortby, setSortBy] = useState(["catalog_key", "asc"]);
    const [columns, setColumns] = useState([

        {
            display: "Project",
            sortKey: "catalog_key",
            renderCell: (obj) => {
                const object_array = [obj]
                {
                    object_array.map((group) => {
                        if (obj.catalog_key == "CMMC_ver1") {
                            console.log(group.groups)
                            const updated_group = group.groups
                            {
                                updated_group.map((group) => {
                                    return <span key={group.id}>{group.id} </span>
                                })
                            }
                            return <span key={group.groups.id}>{group.groups.id} </span>
                        }
                    })
                }


                //     return <span>{obj.groups.id}</span>
                // }

                // <a href={`/controls/catalogs/${'CMMC_ver1'}/group/${obj.groups.id}`} >

                //  </a>
            }
        },
        {
            display: "Title",
            sortKey: "id",
            renderCell: (obj) => {

                return <span>
                    {obj.groups.id}
                </span>
            }
        },
        // {
        //     display: "Portfolio",
        //     sortKey: "portfolio__title",
        //     renderCell: (obj) => {
        //         return <span>{obj.portfolio.title}</span>
        //     }
        // },
        // {
        //     display: "Role",
        //     renderCell: (obj) => {
        //         return <span></span>
        //     }
        // },
        // {
        //     display: "Updated",
        //     sortKey: "root_task__updated",
        //     renderCell: (obj) => {
        //         return <span>{moment(obj.root_task.updated).fromNow()}</span>
        //     }
        // },
    ]);

    const endpoint = (querystrings) => {
        console.log(querystrings);
        return axios.get(`/api/v2/catalog-data/CMMC_ver1/catalog-key/`, { params: querystrings });
    };


    return <DataTable
        sortby={sortby}
        columns={columns}
        endpoint={endpoint}
        header={<div style={{ display: "block" }}>
            <span style={{ fontWeight: "bold", fontSize: "20px", marginLeft: "15px" }}> Control Groupings </span>
        </div>}
    />
}