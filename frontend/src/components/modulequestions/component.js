import React from 'react';
import ReactDOM from 'react-dom';

import { ReactModal } from "../shared/modal";
import { EditQuestion } from "./editQuestion";
import { EditModule } from "./editModule";

window.editQuestionModal = (moduleId, q_id) => {  
    return ReactDOM.render(
        <EditQuestion moduleId={moduleId} questionId={q_id} />,
        document.getElementById('react-edit-module-question-modal')
    );
};

// window.editModuleModal = (moduleId) => {
//     $(window).on('load', function () {
//         $("#content").show();
//         console.log('q_id: ', q_id)
//         ReactDOM.render(
//             <EditModule moduleId={moduleId} />,
//             document.getElementById('react-edit-module-modal')
//         );
//     });
// }