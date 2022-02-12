import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { ComponentsTable } from './componentsTable';

window.componentsTable = () => {
  
    $(window).on('load', function () {
        $("#content").show();
        ReactDOM.render(
            <ComponentsTable />,
            document.getElementById('components-table')
        );
    });
};
