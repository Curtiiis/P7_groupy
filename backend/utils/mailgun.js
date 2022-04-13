const nodemailer = require("nodemailer")
const mg = require("nodemailer-mailgun-transport")
const handlebars = require("handlebars")
const fs = require("fs")
const path = require("path")

const emailTemplateSource = fs.readFileSync(path.join(__dirname, "/template.hbs"), "utf8")

const mailgunAuth = {
    auth: {
        api_key: 'c3cb714c1a0a50eeb3bc19408a38a156-1b237f8b-d0630dcb',
        domain: 'sandbox083efd7420fa429cb6f95eb3e83c3909.mailgun.org'
    }
}

const smtpTransport = nodemailer.createTransport(mg(mailgunAuth))

const template = handlebars.compile(emailTemplateSource)

const htmlToSend = template({ message: "Hello!" })

const mailOptions = {
    from: "myemail@example.com",
    to: "c.strazel@hotmail.com",
    subject: "EMAIL SUBJECT LINE",
    html: htmlToSend
}

smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
        console.log(error)
    } else {
        console.log("Successfully sent email.")
    }
})