var udum =require('../app/controllers/template.js').templates();

exports.fetchSocial= function(req,res){

    udum.social.translate(req.params.id,function(object){
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(object));
    });
};

exports.fetchTags= function(req,res){

    udum.tags.translate(req.params.id,function(object){
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(object));
    });


};