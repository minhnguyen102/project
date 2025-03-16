const nodemailer = require('nodemailer');

module.exports.sendEmail = (email , subject, html) => {
    let mailTransporter = nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        }
    );

let mailDetails = {
    from: 'minhkhac1002@gmail.com',
    to: email,
    subject: subject,
    html : html
};

mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log(err);
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
}