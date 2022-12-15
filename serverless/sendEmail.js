const nodemailer = require("nodemailer");

const { AUTH_USER, AUTH_PASS } = process.env;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed', headers: { 'Allow': 'POST' } }
  }

  const data = JSON.parse(event.body)
  const { name, email, message } = data;
  if (!name || !email || !message) return { statusCode: 422, body: 'Name, email, and message are required.' }

  const regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
  if (!regex.test(email)) return { statusCode: 422, body: 'Invalid email.' }
  if (message.length < 10)  return { statusCode: 422, body: 'Message is too short.' }

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: AUTH_USER,
      pass: AUTH_PASS,
    }
  });

  try {
    let info = await transporter.sendMail({
      to: AUTH_USER,
      subject: "A message from your website",
      html: `<p>Hi Jingxuan,</p><p>You have a new message from your website.</p><p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`,
    });
  
    if (info.accepted.length) {
      return { statusCode: 200, body: JSON.stringify({ message: 'Message sent successfully.'})}
    } else {
      return { statusCode: 422, body: JSON.stringify({ message: 'Message was rejected.'})}
    }

  } catch (err) {
    console.log(err);
    return { statusCode: 422, body: JSON.stringify({ message: 'Message failed to send.'}) };
  }
};

