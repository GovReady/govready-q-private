import React from 'react';

import { AlertMessage } from '../shared/alert';

export const IENotSupported = () => (
    <div>
        <strong>Warning</strong>: Internet Explorer is not supported. Please use any other browser.
    </div>
);

export const IEWarning = ({ browser }) => {    
    return (
        <>
            {(browser === 'Edge' || browser === 'IE' || browser === 'Internet Explorer') && 
                <AlertMessage browser={browser} message={IENotSupported()} style={'warning'} />
            }
        </>
    )
};
