import React, {useState} from 'react';
import ReactDOM from 'react-dom';

import { AssessmentTable } from './assessments';

window.assessmentTable = (systemId) => {
  
    $(window).on('load', function () {
        $("#content").show();
        ReactDOM.render(
            <AssessmentTable systemId={systemId}/>,
            document.getElementById('assessments-table')
        );
    });
};