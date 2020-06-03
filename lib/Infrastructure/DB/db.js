var mongoose = require('mongoose');
console.log("process.env.MONGODB_CONN_URL: ", process.env.MONGODB_CONN_URL);
mongoose.connect(process.env.MONGODB_CONN_URL, {
    useFindAndModify: false,
    useNewUrlParser: true
}, function (err) {
    if(err) throw err;
    console.log('==========db-connected============')
});

module.exports = mongoose;