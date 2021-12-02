import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { PoamsTable } from './poamsTable';

window.poamsTable = (systemId) => {
  
    $(window).on('load', function () {
        $("#content").show();
        ReactDOM.render(
            <PoamsTable systemId={systemId}/>,
            document.getElementById('poams-table')
        );
    });



};
