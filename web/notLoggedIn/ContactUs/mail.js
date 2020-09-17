const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

const auth = {
    auth: {
        api_key: '6de617a90efa3184a6286953192bae0a-d5e69b0b-f1db3bfb',
        domain: 'sandboxccf829bd037f4f87ab8cb9353f548f3d.mailgun.org'
    }
};

const transporter = nodemailer.createTransport(mailGun(auth));

const mailOptions ={
    from: 'test@gmail.com',
    to: 'talkaboutitforum@gmail.com',
    subject: 'test',
    text: 'test'
};

transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
        console.log('an error has occurred');
    } else {
        console.log('message sent');
    }
});