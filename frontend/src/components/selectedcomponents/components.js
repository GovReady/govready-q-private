import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { ComponentsTable } from './componentsTable';

window.componentsTable = (systemId) => {
  
    $(window).on('load', function () {
        $("#content").show();
        ReactDOM.render(
            <ComponentsTable systemId={systemId}/>,
            document.getElementById('components-table')
        );
    });
};
