import React from 'react';
import { Alert } from 'react-bootstrap'

export const AlertMessage = ({ message, style }) => {
  return (
    <Alert bsStyle={style}>
      {message}
    </Alert>
  );
};
