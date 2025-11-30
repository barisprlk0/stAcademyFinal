import React from 'react';
import '../css/CustomButton.css';

function CustomButton(props) {
    
    const { text, myMethod } = props;

    const handleClick = () => {
        if (myMethod) {
            myMethod();
        }
    };

    return (
        <div className="buttonContainer">
            <button onClick={handleClick} className="btn customButton py-1">
                <span className="customButtonText fw-bold"> {text} </span>
            </button>
        </div>
    );
}   

export default CustomButton;