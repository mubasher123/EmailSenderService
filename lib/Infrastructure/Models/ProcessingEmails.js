var mongoose = require('mongoose');

var ProcessingEmailsSchema = mongoose.Schema({
    process_at: {
        type: Date,
        default: new Date()
    },
    sender_email: String,
    service_type: {
        type: String,
        enum: ['custom-smtp', 'gauth', 'office365', 'amazonses']
    },
    rescheduled: Boolean,
    mail_count: Number,
    success_count: Number,
    error_count: Number,
    nonprocessed_count: Number,
    client_id: String,
    transportDetails: {
        service: String,//gauth,native,sendgrid
        sendAsEmails: [{ type: String }],
        gmail_oauth: {
            client_id: String,
            client_secret: String,
            redirect_uris: String
        },
        host: String,
        port: Number,
        secure: Boolean,
        requireTLS: Boolean,
        auth: {
            user: String,
            pass: String
        },
        tls: {
            rejectUnauthorized: Boolean
        },
        maildetails_verified: Boolean
    },
    error: {
        type: String,
        default: null
    }
}, {
        strict: false,
        versionKey: false,
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    });

var ProcessingEmailsModel = mongoose.model('processing-emails', ProcessingEmailsSchema);

module.exports = ProcessingEmailsModel;