const express = require('express');
const cloudinary = require('cloudinary').v2;
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dxroitrhz',
  api_key: '454934146854713',
  api_secret: 'mq9UKQUk3DpQ_W3V_-W_SJfZMVE',
  secure: true,
});

// Connect to MongoDB (replace 'your_database_url' with your MongoDB URL)
mongoose
  .connect('mongodb://127.0.0.1:27017/filecloud', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(() => {
    console.log('Not Connected');
  });

// Define a schema for storing file data
const fileSchema = new mongoose.Schema({
  filename: String,
  mimetype: String,
  data: Buffer,
});

const File = mongoose.model('File', fileSchema);

// Middleware for parsing JSON and form data

app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Configure Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Define the upload route to accept any file type
app.post('/upload', upload.single('file'), async (req, res) => {
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ message: 'No file provided' });
  }

  // Upload the file to Cloudinary
  cloudinary.uploader.upload_stream({}, async (error, result) => {
    if (error) {
      return res.status(500).json({ error: 'Error uploading file to Cloudinary' });
    }

    // If successful, save file information to MongoDB
    const newFile = new File({
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      data: req.file.buffer,
    });
    await newFile.save();



    // Send an email with the uploaded image as an attachment
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // e.g., 'Gmail'
      auth: {
        user: 'siva16cs58@gmail.com',
        pass: 'uhilkxpgraspvlul',
      },
    });

    const mailOptions = {
      to: recipient,
      subject: subject,
      text: message, // Use the provided email message
      attachments: [
        {
          filename: req.file.originalname,
          content: req.file.buffer,
        },
      ],
    };
    

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        res.status(500).json({ error: 'Error sending email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.json({ fileUrl: result.url, message: 'Email sent successfully' });
      }
    });
  }).end(req.file.buffer);
});

const PORT = 6000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// static code for sending email with attachment like image pdf


// const express = require('express');
// const cloudinary = require('cloudinary').v2;
// const bodyParser = require('body-parser');
// const multer = require('multer');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const nodemailer = require('nodemailer');

// const app = express();

// // Configure Cloudinary with your credentials
// cloudinary.config({
//   cloud_name: 'dxroitrhz',
//   api_key: '454934146854713',
//   api_secret: 'mq9UKQUk3DpQ_W3V_-W_SJfZMVE',
//   secure: true,
// });

// // Connect to MongoDB (replace 'your_database_url' with your MongoDB URL)
// mongoose
//   .connect('mongodb://127.0.0.1:27017/filecloud', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch(() => {
//     console.log('Not Connected');
//   });

// // Define a schema for storing file data
// const fileSchema = new mongoose.Schema({
//   filename: String,
//   mimetype: String,
//   data: Buffer,
// });

// const File = mongoose.model('File', fileSchema);

// // Middleware for parsing JSON and form data
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors());

// // Configure Multer for handling file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Define the upload route to accept any file type
// app.post('/upload', upload.single('file'), async (req, res) => {
//   // Check if a file was uploaded
//   if (!req.file) {
//     return res.status(400).json({ message: 'No file provided' });
//   }

//   // Upload the file to Cloudinary
//   cloudinary.uploader.upload_stream({}, async (error, result) => {
//     if (error) {
//       return res.status(500).json({ error: 'Error uploading file to Cloudinary' });
//     }

//     // If successful, save file information to MongoDB
//     const newFile = new File({
//       filename: req.file.originalname,
//       mimetype: req.file.mimetype,
//       data: req.file.buffer,
//     });
//     await newFile.save();

//     // Get recipient email and email content from the request
//     const { recipient, subject, message } = req.body;
//     console.log(recipient,subject,message);

//     // Send an email with the uploaded image as an attachment
//     const transporter = nodemailer.createTransport({
//       service: 'Gmail', // e.g., 'Gmail'
//       auth: {
//         user: 'siva16cs58@gmail.com',
//         pass: 'uhilkxpgraspvlul',
//       },
//     });

//     const mailOptions = {
//       // from: 'youremail@gmail.com',
//       to: recipient,
//       subject: subject,
//       text: message,
//       attachments: [
//         {
//           filename: req.file.originalname,
//           content: req.file.buffer,
//         },
//       ],
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log('Error sending email:', error);
//         res.status(500).json({ error: 'Error sending email' });
//       } else {
//         console.log('Email sent: ' + info.response);
//         res.json({ fileUrl: result.url, message: 'Email sent successfully' });
//       }
//     });
//   }).end(req.file.buffer);
// });

// const PORT = process.env.PORT || 7000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
