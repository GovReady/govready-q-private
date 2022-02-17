import React, { useCallback } from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader } from 'react-pro-sidebar';
import Grid from '@mui/material/Grid';
import HomeIcon from '@mui/icons-material/Home';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ApiIcon from '@mui/icons-material/Api';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PreviewIcon from '@mui/icons-material/Preview';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CreateIcon from '@mui/icons-material/Create';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import Box from '@mui/material/Box';
import ReactDOM from 'react-dom';
// import { projectTagsStateSlice } from "./slice"
// import { Provider } from "react-redux";
// import store from "../../../store";
// import { TagDropdown } from "../../shared/tag-dropdown";


// const { setTags } = projectTagsStateSlice.actions;

window.projectMenu = (data) => {
    // store.dispatch(setTags(existingTags));
    $(window).on('load', function () {
        $("#content").show();
    });

    function redirect(url) {
        window.location = url;
    }


    // console.log(data)
    // console.log(displayMap.urls)



    ReactDOM.render(
        <>
            <Box style={{ width: '100%' }}>
                <ProSidebar style={{ width: '100%' }} >
                    <Menu iconShape="square">
                        {data.project.system && <>
                            <SidebarHeader className="sidebardarkheader">
                                <Grid container >
                                    <Grid item xs={12}>
                                    <h3 className="sidebardark-head" onClick={() => redirect(`/portfolios/${data.project.portfolio.id}/projects`)} style={{cursor: 'pointer'}}>{data.project.portfolio.title}</h3>
                                        <h2 className="sidebardark-header"><span onClick={() => redirect(`/projects/${data.project.id}`)} style={{cursor: 'pointer'}}>
                                            {data.project.root_task.title_override}</span>&nbsp;&nbsp;

                                            <span className="glyphicon glyphicon-pencil" style={{ fontSize: '14px', color: '#aaa', cursor: 'pointer' }}
                                                onClick={() => show_edit_project_modal()}></span>
                                            </h2>
                                        <span className="sidebardark-project-details" title={`${data.project.version_comment}`}> Project ID: {data.project.id}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;System ID: {data.project.system.id}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Version: {data.project.version} <br/>{data.project.version_comment}</span>
                                        <br/>

                                    </Grid>
                                </Grid>
                            </SidebarHeader>

                            <Grid container >
                                <Grid item xs={12}>
                                <h4 className="sidebar-progress-title">Current System Progress</h4>
                                <div className="sidebar-info-block">


                                <span className="project-info-compliance"><strong>% </strong> compliance <span className="unassessed">(unassessed)</span></span><br />
                                <div className="bar-box"><div className="bar-box-bar" style={{ width: '20%' }}></div></div>

                                <span className="project-info-controls">Controls Addressed (X of Y)</span>

                                <div className="bar-box"><div className="bar-box-bar" style={{ width: '15%' }}></div></div>

                                <span className="project-info-poams">PoA & Milestones (7 of 28)</span>
                                <div className="bar-box"><div className="bar-box-bar" style={{ width: '25%' }}></div></div>

                                </div>
                                </Grid>
                                </Grid>

                            <Grid container >
                                <Grid item xs={12}>
                            <div className="sidebar-module-boxes">
                            <div className="sidebar-module-boxes-header">
                              <span className="sidebar-icon glyphicon glyphicon-th"></span><span className="sidebar-box-label" style={{cursor: 'pointer'}} onClick={() => redirect(`${window.origin}${data.urls.components}`)}>Components</span>





                            </div>
                            <span className="sidebar-module-components-list">A realtime list of components used in this project goes here.</span>
                            </div>
                            </Grid>
                            </Grid>

                            <Grid container >
                                <Grid item xs={12}>
                            <div className="sidebar-module-boxes">
                            <div className="sidebar-module-boxes-header">
                              <span className="sidebar-icon glyphicon glyphicon-list"></span><span className="sidebar-box-label">Artifacts</span>
                            </div>
                            <MenuItem
                                id="menu-btn-project-assesments"
                                icon={<AssessmentIcon />}
                                onClick={() => redirect(`${window.origin}${data.urls.assesments}`)}
                                onKeyPress={(e) => {
                                    if(e.key === 'Enter'){
                                        redirect(`${window.origin}${data.urls.assesments}`)
                                    }
                                }}
                            >
                                Assesments
                            </MenuItem>



                            <MenuItem
                                id="menu-btn-project-documents"
                                icon={<InsertDriveFileIcon />}
                                onClick={() => redirect(`${window.origin}${data.urls.documents}`)}
                                onKeyPress={(e) => {
                                    if(e.key === 'Enter'){
                                        redirect(`${window.origin}${data.urls.documents}`)
                                    }
                                }}
                            >Documents</MenuItem>
                            </div>
                            </Grid>
                            </Grid>

                            <Grid container >
                                <Grid item xs={12}>
                            <div className="sidebar-module-boxes">
                            <div className="sidebar-module-boxes-header">
                              <span className="sidebar-icon glyphicon glyphicon-transfer"></span><span className="sidebar-box-label">Actions</span>
                            </div>

                            <MenuItem
                                id="menu-btn-project-import"
                                icon={<ArrowUpwardIcon />}
                                onClick={() => {
                                    let m = $('#import_project_modal');
                                    $("#import_loading_spinner").hide();
                                    m.modal();
                                }}
                                onKeyPress={(e) => {
                                    if(e.key === 'Enter'){
                                        let m = $('#import_project_modal');
                                        $("#import_loading_spinner").hide();
                                        m.modal();
                                    }
                                }}
                            >Import Project</MenuItem>

                            <MenuItem
                                id="menu-btn-project-export_project"
                                icon={<ArrowDownward />}
                                onClick={() => redirect(`${window.origin}${data.urls.export_project}`)}
                                onKeyPress={(e) => {
                                    if(e.key === 'Enter'){
                                        redirect(`${window.origin}${data.urls.export_project}`)
                                    }
                                }}
                            >Export Project</MenuItem>



                            <MenuItem
                                icon={<PersonAddAlt1Icon />}
                                id="menu-btn-show-project-invite"
                                onClick={() => {
                                    var info = project_invitation_info;
                                    show_invite_modal(
                                        'Invite To Project Team (' + info.model_title + ')',
                                        'Invite a colleague to join this project team.',
                                        info,
                                        'Please join the project team for ' + info.model_title + '.',
                                        {
                                            project: info.model_id,
                                            add_to_team: "1"
                                        },
                                        function () { window.location.reload() }
                                    );
                                    return false;
                                }}
                                onKeyPress={(e) => {
                                    if(e.key === 'Enter'){
                                        var info = project_invitation_info;
                                        show_invite_modal(
                                            'Invite To Project Team (' + info.model_title + ')',
                                            'Invite a colleague to join this project team.',
                                            info,
                                            'Please join the project team for ' + info.model_title + '.',
                                            {
                                                project: info.model_id,
                                                add_to_team: "1"
                                            },
                                            function () { window.location.reload() }
                                        );
                                        return false;
                                    }
                                }}
                            >Invite
                            </MenuItem>


                            <MenuItem
                                id="menu-btn-move_project"
                                icon={<ImportExportIcon />}
                                onClick={() => {
                                    move_project()
                                }}
                                onKeyPress={(e) => {
                                    if(e.key === 'Enter'){
                                        move_project()
                                    }
                                }}
                            >Move Project
                            </MenuItem>



                            </div>
                            </Grid>
                            </Grid>


                            <Grid container >
                                <Grid item xs={12}>
                            <div className="sidebar-module-boxes">
                            <div className="sidebar-module-boxes-header">
                              <span className="sidebar-icon glyphicon glyphicon-cog"></span><span className="sidebar-box-label">Administration</span>
                            </div>
                            {(!data.project.is_account_project || data.project.is_deletable) && <>
                                <MenuItem
                                    id="menu-btn-project-is_account_project"
                                    icon={<SettingsIcon />}
                                    onClick={() => redirect(`${window.origin}${data.urls.settings}`)}
                                    onKeyPress={(e) => {
                                        if(e.key === 'Enter'){
                                            redirect(`${window.origin}${data.urls.settings}`)
                                        }
                                    }}
                                >
                                    Settings
                                </MenuItem>
                            </>}


                            <MenuItem
                                id="menu-btn-project-deployments"
                                icon={<ApiIcon />}
                                onClick={() => redirect(`${window.origin}${data.urls.deployments}`)}
                                onKeyPress={(e) => {
                                    if(e.key === 'Enter'){
                                        redirect(`${window.origin}${data.urls.deployments}`)
                                    }
                                }}
                            >
                                Deployments
                            </MenuItem>
                            </div>
                            </Grid>
                            </Grid>





                        </>}

                    </Menu>
                </ProSidebar>
            </Box>

        </>
        ,
        document.getElementById('menu')
    );

};
