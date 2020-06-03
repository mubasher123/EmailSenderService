require('dotenv').config();
const mongoose = require('./../../lib/Infrastructure/DB/db');
const NodeMailer = require('nodemailer');


describe('Send Mail Service', function() {
    it('Should process the message without any error', async function() {
        //ya29.GlugBk4fdqQcCvURXaBJDOa6RKGsWkvvfLNh8bzlxPf2rQelBkg_7LXrDf3Sngek_Z1Kf0rDmZauNPNsOstP3Mjlk1Dh018qlFkNuBz94SICgWAkBntAIxj46aVo
        this.timeout(40000);
        try {
            let transporter = NodeMailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    type: 'OAuth2',
                    clientId: pocess.env.clientId,
                    clientSecret: pocess.env.clientSecret
                },
                logger: true
            });


            const mailSent = await transporter.sendMail({
                from: "uditsaas@gmail.com",
                to: 'mubasher@carbonteq.com',
                subject: 'Message',
                text: 'I hope this message gets through!',
                auth: {
                    user: "uditsaas@gmail.com",
                    refreshToken: pocess.env.token,
                    accessToken: pocess.env.accessToken,
                }
            });
            console.log(mailSent);
        }catch (e) {
            console.log(e);
        }



    });

});
