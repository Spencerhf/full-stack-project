const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

const auth = {
    auth: {
        api_key: 'fd5b952afc98d1cde1e21f35aaba043c-d5e69b0b-c2bbb581',
        domain: 'sandbox9da77a90ee6846678fe8c1654ee6e8e7.mailgun.org'
    }
};

const transporter = nodemailer.createTransport(mailGun(auth));

const sendMail = (email, subject, text, cb) => {
    const mailOptions ={
        from: email,
        to: 'talkaboutitforum@gmail.com',
        subject: subject,
        text: text
    };
    
    transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
            cb(err, data);
        } else {
            cb(null, data);
        }
    });
}

module.exports = sendMail;
