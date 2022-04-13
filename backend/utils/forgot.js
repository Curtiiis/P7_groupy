const nodemailer = require('nodemailer');
// const mailGun = require('nodemailer-mailgun-transport');
const log = console.log;

// Step 1
// const auth = {
//     auth: {
//         api_key: 'c3cb714c1a0a50eeb3bc19408a38a156-1b237f8b-d0630dcb',
//         domain: 'sandbox083efd7420fa429cb6f95eb3e83c3909.mailgun.org'
//     }
// auth: {
//     api_key: process.env.MAILGUN_API_KEY || 'mailgun_api_key', // TODO: 
//     domain: process.env.MAILGUN_DOMAIN || 'mailgun_domain' // TODO:
// }
// };

// Step 2
let transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    secure: false,
    tls: { ciphers: 'SSLv3' },
    auth: {
        api_key: 'c3cb714c1a0a50eeb3bc19408a38a156-1b237f8b-d0630dcb',
        domain: 'sandbox083efd7420fa429cb6f95eb3e83c3909.mailgun.org'
    }
});


// Step 3
let mailOptions = {
    from: 'GroupyApp - Réinitialisation de votre mot de passe <forgot@groupy-app.fr>', // TODO: email sender
    to: 'c.strazel@hotmail.com', // TODO: email receiver
    subject: 'Nodemailer - Test',
    text: 'Wooohooo it works!!',
    html: { path: '../views/forgot.html' }
};

// Step 4
transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
        return log('Error occurs');
    }
    return log('Email sent!!!');
});