import nodemailer from 'nodemailer';
import path from 'path';

const sendEmail = (filePath = "C:/Database/local_inventory.db", fileName = "local_inventory.db") => {
    // Create a transporter object
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // Gmail's SMTP server
        port: 587,             // Port for TLS
        secure: false,         // Use true for port 465
        auth: {
            user: 'adityashivhare7291@gmail.com', // Your Gmail address
            pass: 'nbfk eaag hhqg bywe',         // Your app password
        },
    });

    // Configure the mail options object
    const mailOptions = {
        from: 'adityashivhare7291@gmail.com',
        to: 'satyamseed29@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!',
        attachments: [
            {
                filename: fileName,   // Custom filename for the attachment
                path: path.resolve(filePath), // Full path to the file
            },
        ],
    };

    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

// Call the function to send the email
export default sendEmail;
