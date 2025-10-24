import React from 'react';
import axios from 'axios';

const EmailButton = () => {
    const sendEmail = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/sendMail`);
            console.log({ response })
            alert(response.data.message);
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send email.');
        }
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#f4f4f4',
        fontFamily: 'Arial, sans-serif',
    };

    const headingStyle = {
        color: '#333',
    };

    const buttonStyle = {
        padding: '10px 20px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s ease',
    };

    const buttonHoverStyle = {
        ...buttonStyle,
        backgroundColor: '#0056b3',
    };

    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <div className='col-span-10 p-6 ml-12 mr-12'>
            <div style={containerStyle}>
                <h1 style={headingStyle}>Send Email with Attachment</h1>
                <button
                    style={isHovered ? buttonHoverStyle : buttonStyle}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={sendEmail}
                >
                    Send Email
                </button>
            </div>
        </div>
    );
};

export default EmailButton;
