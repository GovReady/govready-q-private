import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { DeploymentTable } from './deploymentTable';

window.deploymentTable = (systemId) => {
  
    $(window).on('load', function () {
        $("#content").show();
        ReactDOM.render(
            <DeploymentTable systemId={systemId}/>,
            document.getElementById('data-table')
        );
    });



};
