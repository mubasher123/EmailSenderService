require('dotenv').config();
const mongoose = require('./../../lib/Infrastructure/DB/db');
const NodeMailer = require('nodemailer');


describe('Send Mail Service', function() {
    it('Should process the message without any error', async function(){
        this.timeout(40000);
        try {
            let transporter = await NodeMailer.createTransport({
                host:"smtp.office365.com",
                port:"587",
                auth: {
                    user: "hithesh.puh@outlook.com",
                    pass: "hithesh@"
                }
            });
            const verification = await transporter.verify();
            // const mailsent = await transporter.sendMail({
            //     from: "devteam@olaping.net",
            //     to: 'hitesh.puh@gmail.com,mustafa@carbonteq.com',
            //     subject: 'Message',
            //     text: 'I hope this message gets through!'
            // });
            // console.log(mailsent);
            console.log(transporter.options);
            console.log(verification);
        } catch (e) {
            console.log(e)
        }
    })
})