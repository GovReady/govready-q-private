import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { PortfolioTable } from './portfolioTable';

window.portfolioTable = () => {
  
    $(window).on('load', function () {
        $("#content").show();
        ReactDOM.render(
            <PortfolioTable />,
            document.getElementById('portfolio-table')
        );
    });
};