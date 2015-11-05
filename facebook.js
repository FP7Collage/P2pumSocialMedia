
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
    ,facebook=require('./routes/facebook')
    ,udum=require('./routes/udum')
    ,fs = require('fs')
  , http = require('http')
    ,nunjucks=require('nunjucks')
    , passport = require('passport')
    , util = require('util')
    , path = require('path');


var app = express();

var env= {
    callback: process.env["p2p_facebook_callback"] ? process.env["p2p_facebook_callback"] : "https://localhost:7000/auth/facebook/callback"
};

console.log(env);
app.locals(env);

require('./config/view.js').views(app,nunjucks);



require('./config/db.js');
require('./model/Person');
var _constants = require('./config/constants');

app.facebook_app_id=_constants.facebook.app_id;
app.facebook_app_secret=constants.facebook.app_secret;



var p = require('./config/passport.js');
p.passport(app,passport,env.callback);


var fbcontroller = require('./app/controllers/facebook.js').setup(app);


var MongoStore = require('connect-mongo')(express);


require('./config/schedule.js').schedule(app,fbcontroller);


// all environments
app.set('port', process.env.PORT || 3002);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(app.facebook_app_secret) );
app.use(express.session(
    {   secret: app.facebook_app_secret,
        store: new MongoStore({
            db: "p2pum-facebook"
        })
    })
);


// use passport session
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));




// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}


app.get('/', p.ensureAuthenticated("/login"), routes.index);
app.post('/',p.ensureAuthenticated("/login"),facebook.canvas);
app.get('/logout', routes.logout);
app.get('/login',routes.login);


app.get('/auth/facebook', passport.authenticate('facebook',{scope: ['email','user_about_me','user_likes','user_notes','user_subscriptions','read_friendlists','read_stream'] }));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/login' }));


app.get('/udum/status/:id',udum.fetchStatus);
app.get('/udum/social/:id',udum.fetchSocial);
app.get('/udum/tags/:id',udum.fetchTags);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


if ('development' == app.get('env')) {

    https = require('https');
    https.createServer({
        key: fs.readFileSync('/private/etc/apache2/ssl/server.key'),
        cert: fs.readFileSync('/private/etc/apache2/ssl/server.crt')
    },app).listen(7002,function(){
            console.log('Express server listening on port 7000 (ssl)')
        });


}
