import React from 'react';
import './styles.css'; // Import your CSS file for styling

const NotFound = () => {
    return (
        <div className="not-found-container">
            <img
                src="https://e1.pngegg.com/pngimages/905/302/png-clipart-the-ultimate-patrick-star-thumbnail.png"
                alt="Patrick Star"
            />
            <h1>404 Not Found</h1>
            <p>Sorry, the page you are looking for might be in another castle.</p>
        </div>
    );
}

export default NotFound;
