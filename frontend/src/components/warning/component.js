import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import { AlertMessage } from '../shared/alert';

window.warningMessage = ({}) => {
    
    ReactDOM.render(
        <AlertMessage message={'WARNING: IE IS NOT SUPPORTED'} style={'warning'} />,
        document.getElementById('warning-message')
    );
};