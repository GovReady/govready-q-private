import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { ControlsTable } from './controlsTable';
import { SystemsControlTable } from './systemsControlsTable';
import { ControlGroupings } from './controlGroupings';
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

//Uncomment to reveal React table for Catalog Groups

// window.controlGroupings = (systemId) => {
  
//     $(window).on('load', function () {
//         $("#content").show();
//         ReactDOM.render(
//             <ControlGroupings systemId={systemId}/>,
//             document.getElementById('index-group-content')
//         );
//     });
// };
