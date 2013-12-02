exports.passport = function(app,passport,callback_url){

    FacebookStrategy = require('passport-facebook').Strategy;

    passport.use(new FacebookStrategy({
            clientID: app.facebook_app_id,
            clientSecret: app.facebook_app_secret,
            callbackURL: callback_url
        },
        function(accessToken, refreshToken, profile, done) {

            //serialize

            Person.findByFBID(profile.id,function(person){

                if(person ==null){
                    person =  new Person();
                }

                person.fbid= profile.id;
                person.emails =  profile.emails;
                person.name = profile.name.givenName;
                person.lastname= profile.name.familyName;
                person.accesstoken = accessToken;
                person.save();

                return done(null,profile);
            });

        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });



};

exports.ensureAuthenticated = function(url) {
    return function(req, res, next){
        if (req.isAuthenticated()) { return next(); }
        return res.redirect(url)

    }
};