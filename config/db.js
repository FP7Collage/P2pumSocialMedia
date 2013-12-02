mongoose = require('mongoose');
if(process.env.NODE_ENV=='production' || process.env.NODE_ENV=='test'){
    mongoose.connect('mongodb://admin:peekadmin@paulo.mongohq.com:10091/peekintoo');
}else{
    mongoose.connect('mongodb://localhost/udumfacebook');
}
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("Mongoose open");

});
