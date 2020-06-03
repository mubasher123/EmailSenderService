require('dotenv').config();
const mongoose = require('./../../lib/Infrastructure/DB/db');
const NodeMailer = require('nodemailer');


describe('Send Mail Service', function() {
    it('Should process the message without any error', async function() {
        this.timeout(40000);
        try {
            let transporter = await NodeMailer.createTransport({
                host: "securedmail.io",
                port: 587,
                secure: false, // upgrade later with STARTTLS
                auth: {
                    user: process.env.smtpUserName,
                    pass: process.env.smtpPassword
                }
            });


            const mailSent = await transporter.sendMail({
                from: "alwaysopens@gopbn.com",
                to: 'mubasher@carbonteq.com',
                subject: 'Message',
                text: 'I hope this message gets through!'
            });
            console.log(mailSent);
        }catch (e) {
            console.log(e);
        }



    });

});
