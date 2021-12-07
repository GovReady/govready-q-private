import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { ControlsTable } from './controlsTable';

window.controlsTable = (systemId) => {
  
    $(window).on('load', function () {
        $("#content").show();
        ReactDOM.render(
            <ControlsTable />,
            document.getElementById('controls-table')
        );
    });
};
