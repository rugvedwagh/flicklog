import patrick from '../../assets/patrick.png'
import './notfound.styles.css';
import React from 'react';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <img
                src={patrick}
                alt="Patrick Star"
            />
            <h1>404 Not Found</h1>
            <p>Sorry, the page you are looking for might be in another castle.</p>
        </div>
    );
}

export default NotFound;
