require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());

console.log(process.env.GMAIL_ACCOUNT);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ACCOUNT,
    pass: process.env.GMAIL_PASS,
  },
});

app.post('/contact', (req, res) => {
  if (req.query.apiKey !== process.env.API_KEY) {
    res.status(401);
    res.json({ error: 'wrong api key' });
  }

  const { name, message, email } = req.body;

  const mailOptions = {
    from: process.env.GMAIL_ACCOUNT,
    to: process.env.GMAIL_ACCOUNT,
    subject: `Demande de contact de ${name}`,
    text: `${name} (${email}) vous a envoyé une demande de contact : \n\n${message}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.sendStatus(500);
    } else {
      console.log('Email sent: ' + info.response);
      res.send('votre demande de contact a bien été envoyée');
    }
  });
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
