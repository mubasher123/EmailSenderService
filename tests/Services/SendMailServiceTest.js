require('dotenv').config();
const mongoose = require('./../../lib/Infrastructure/DB/db');
const {expect} = require('chai');
const SendMailService = require("../../lib/Services/SendMail/SendMailProcessingService");


describe('Send Mail Service', function() {
    it('Should process the message without any error', async function() {
        await SendMailService.startProcess({
            type: "gauth",
            clientId: "gauth-client-1",
            bunch_size: 10
        }, true);
    });

});