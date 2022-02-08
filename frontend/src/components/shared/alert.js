import React from 'react';
import { Alert } from 'react-bootstrap'

export const AlertMessage = ({ message, style }) => {
    console.log('alert-message: ', message);
    console.log('alert-style: ', style);
  return (
    <Alert bsStyle={style}>
        <strong>Holy guacamole!</strong> Best check yo self, you're not looking too good.
        {/* {message} */}
    </Alert>
  );
};
