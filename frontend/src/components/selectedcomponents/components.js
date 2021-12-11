import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { SelectedComponentsTable } from './selectedComponentsTable';

window.systemsComponentsTable = (systemId) => {
  
    $(window).on('load', function () {
        $("#content").show();
        ReactDOM.render(
            <SelectedComponentsTable systemId={systemId}/>,
            document.getElementById('systems-components-table')
        );
    });
};
