import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import { browserName, browserVersion, isIE } from "react-device-detect";
import { AlertMessage } from '../shared/alert';
import { IEWarning } from './IEWarning';

window.warningMessage = ({}) => {
 
    ReactDOM.render(
        <IEWarning browser={browserName} />,
        document.getElementById('warning-message')
    );
};