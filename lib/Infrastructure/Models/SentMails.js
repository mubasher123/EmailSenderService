var mongoose = require('mongoose')

var SentMailSchema = mongoose.Schema({
    campaignitem_id: mongoose.Schema.Types.ObjectId,
    campaign_id: mongoose.Schema.Types.ObjectId,
    team_id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    email_id: String,
    sent: [
        {
            message_id: String,
            thread_id: String,
            recipient_id: mongoose.Schema.Types.ObjectId,
            recipient_email: String,
            status: {
                type: String,
                enum: [
                    'sent',
                    'failed',
                    'bounced'
                ]
            },
            sent_at: { type: Date, default: Date.now },
            error: {
                type: String,
                strict: false
            },
            recipient_deleted: {
                type: Boolean,
                default: false
            }
        }
    ]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, versionKey: false, usePushEach: true });

var SentMailModel = mongoose.model('sentmails', SentMailSchema);

module.exports = SentMailModel;