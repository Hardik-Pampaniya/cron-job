// server.js
// Import necessary modules
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com', // Replace with your Gmail address
    pass: 'your_password', // Replace with your Gmail password
  },
});

// API endpoint for receiving form data
app.post('/submit-form', upload.single('file'), (req, res) => {
  // Extract form data
  const email = req.body.email;
  const title = req.body.title;
  const filePath = req.file.path;

  // Send email
  const mailOptions = {
    from: 'your_email@gmail.com',
    to: email,
    subject: title,
    text: 'See attachment for details.',
    attachments: [
      {
        filename: req.file.originalname,
        path: filePath,
      },
    ],
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      // Remove the uploaded file after sending email
      fs.unlinkSync(filePath);
      res.status(200).send('Email sent successfully');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
