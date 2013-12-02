/*
 * GET home page.
 */

exports.index = function (req, res) {

    Person.findOne(
        {fbid:req.user.id},
        function(err,value){
            if(err){
               return res.render('noinfo.html',{error: err});
            }else{
                if(!value){
                    return res.redirect("/logout");
                }
                return res.render('index.html', { person: value});
            }
        }
    )
};

exports.login = function (req, res) {
    res.render('login.html');
};

exports.logout = function (req, res) {

    if(!req.user){
        req.logout();
        return res.redirect("/");
    }
    Person.findOne({fbid:req.user.id},
        function(err,value){
            if(err || !value){
                req.logout();
                return res.redirect("/");

            }else{

                console.log(value);
                console.log("**** Logout");
                value.accesstoken=null;
                value.save();
                req.logout();
                res.redirect('/');

            }
    });
};

