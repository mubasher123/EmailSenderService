var mongoose = require('mongoose');

var MailstackSchema = mongoose.Schema({
    mailmsgDetails: {
        from: String,       //'"Fred Foo :ghost:" <kanad@kanad.me>', // sender address
        to: String,         //emailid, // list of receivers
        subject: String,    // Subject line needed to be baked
        text: String        //`mail msg baked`
    },
    service_type: String,
    sendAt: Date,
    status: { type: String, enum: ["queued", "in-process"] },
    error: [{ type: String }],
    attempts: Number,
    campaign_id: mongoose.Schema.Types.ObjectId,
    campaignitem_id: mongoose.Schema.Types.ObjectId,
    email_id: String,
    team_id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    recipient_id: mongoose.Schema.Types.ObjectId
}, {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        versionKey: false
    })

var MailstackModel = mongoose.model('mailstacks', MailstackSchema);

module.exports = MailstackModel;