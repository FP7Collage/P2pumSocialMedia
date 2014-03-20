var udum =require('../app/controllers/template.js').templates();

exports.fetchStatus = function(req,res){

    udum.status.determine(req.params.id,function(object){
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(object));
    })
};

exports.fetchSocial= function(req,res){

    //logic to protect


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