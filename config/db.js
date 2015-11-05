mongoose = require('mongoose');
var url = process.env['MONGO_URL'] ? process.env['MONGO_URL'] :  'mongodb://localhost/p2pum-facebook';

console.log("Connecting to ",url);
mongoose.connect(url);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Mongoose open");
});
