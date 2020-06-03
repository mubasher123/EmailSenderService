require('dotenv').config();

module.exports = {

    gmail : {
        type: "gauth",
        clientId: "gauth-client-1",
        bunch_size: 10
    },
    smtp : {
        type: "custom-smtp",
        clientId: "custom-smtp-client-1",
        bunch_size: 100
    },
    amazonses : {
        type: 'amazonses',
        clientId: 'amazonses-client-1',
        bunch_size: 100

    },
    office365 : {
        type: 'office365',
        clientId: "office365-client-1",
        bunch_size: 100
    }
};
