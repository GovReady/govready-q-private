import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { ControlsTable } from './controlsTable';
import { SystemsControlTable } from './systemsControlsTable';

window.controlsTable = (systemId) => {
  
    $(window).on('load', function () {
        $("#content").show();
        ReactDOM.render(
            <ControlsTable systemId={systemId}/>,
            document.getElementById('controls-table')
        );        
    });    
};

window.systemsControlTable = (systemId) => {
  
    $(window).on('load', function () {
        $("#content").show();
        ReactDOM.render(
            <SystemsControlTable systemId={systemId}/>,
            document.getElementById('systems-controls-table')
        );
    });
};
