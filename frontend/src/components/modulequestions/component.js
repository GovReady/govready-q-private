import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import {v4 as uuid_v4} from "uuid";
import { EditQuestion } from "./editQuestion";
import { Provider } from "react-redux";
import store from "../../store";

window.editQuestionModal = (moduleId, q_id) => {
    const uuid = uuid_v4();
    ReactDOM.render(
        <Provider store={store}>
            <EditQuestion moduleId={moduleId} questionId={q_id} uuid={uuid} />
        </Provider>,
        document.getElementById('react-edit-module-question-modal')
    );
};