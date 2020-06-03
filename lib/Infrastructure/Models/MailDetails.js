const mongoose = require('mongoose');

const MailDetailsSchema = mongoose.Schema({
    "_id": ObjectId("5c507fdb80cf34f4f1ec4af2"),
    "team_id": ObjectId("5c3dac527a03d903fbc2ed42"),
    "user_id": ObjectId("5c3dac527a03d903fbc2ed41"),
    "created_at": ISODate("2019-01-29T16:31:23.626Z"),
    "gmail": {
        "username": "uditsaas@gmail.com",
        "access_creds": {
            "access_token": "ya29.GluhBjUU7NUKSqWliMZFLBeGNMXx1NjVRCYXvvWlpC2kRj3IceHhQx1EwnKfqXZJWgzdCyhs8dUY2UprSg9X1ffMxx6Itf9e4U24osJR-vjM3Jx-otBCQaxpke3z",
            "refresh_token": "1/kHz749yDFdCY_OeHAvracDTDuW9HFNYZhSSQP1T5dbc",
            "token_type": "Bearer",
            "expiry_date": "1548857459233"
        },
        "sendAsEmails": null
    },
    "updated_at": ISODate("2019-01-30T13:10:59.688Z")
}, {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        versionKey: false
    })

var MailDetailsModel = mongoose.model('maildetails', MailDetailsSchema);

module.exports = MailDetailsModel;