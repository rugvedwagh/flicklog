import React from 'react';
import './styles.css'; // Import your CSS file for styling
import patrick from '../../assets/patrick.png'

const NotFound = () => {
    return (
        <div className="not-found-container">
            <img
                src={patrick}
                alt="Patrick Star"
                style={{height:'380px',widht:'380px'}}
            />
            <h1>404 Not Found</h1>
            <p>Sorry, the page you are looking for might be in another castle.</p>
        </div>
    );
}

export default NotFound;
