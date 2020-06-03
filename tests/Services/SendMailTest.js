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
                    clientId: "182747067910-u9ustprokt61ipkcn2issjf8vpouomtr.apps.googleusercontent.com",
                    clientSecret: "m9KRliq5k-c-h_C1b9jMuTgn"
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
                    refreshToken: "1/3pxvSzOYq-j26NVCVrnp6YgFVAk6g100EJ3yJ6ZJ668",
                    accessToken: "ya29.GluhBpUf2StwDzoFL9xBSVDgdJEJfg2Yu9LsfPjhTRXT8OTJCN1q0JwcGU2aNhIsYFk0ogXHwTMz2lt3SXZyB-l6gRMkJsuc8CCNZQfeVPADjRiSDp2xwRP0Fy1j",
                }
            });
            console.log(mailSent);
        }catch (e) {
            console.log(e);
        }



    });

});