require('dotenv').config();
const mongoose = require('./../../lib/Infrastructure/DB/db');
const NodeMailer = require('nodemailer');
const AWS = require('aws-sdk');


describe('Send Mail Service', function() {
    it('Should process the message without any error', async function() {
        //ya29.GlugBk4fdqQcCvURXaBJDOa6RKGsWkvvfLNh8bzlxPf2rQelBkg_7LXrDf3Sngek_Z1Kf0rDmZauNPNsOstP3Mjlk1Dh018qlFkNuBz94SICgWAkBntAIxj46aVo
        this.timeout(40000);
        try {
            let transporter = await NodeMailer.createTransport({
                SES: new AWS.SES({
                    apiVersion: '2010-12-01',
                    accessKeyId: pocess.env.keyId,
                    secretAccessKey: pocess.env.secretKey,
                    region: 'us-east-1'
                }),
                logger: true
            });

            const mailSent = await transporter.sendMail({
                from: "udit@funnelbake.com",
                to: 'mubasherahmad2@gmail.com',
                replyTo: 'alwaysopens@gopbn.com',
                subject: 'Message',
                text: 'I hope this message gets through!'
            });
            console.log(mailSent);
        }catch (e) {
            console.log(e);
        }



    });

});
