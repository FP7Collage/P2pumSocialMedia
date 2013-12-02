
exports.templates=function(){

    return {

        social:{
            translate:function(id,done){


                Person.findByFBID(id,function(person){

                    if(!person){
                        done(null);
                    }else{

                        var response = {
                            "name":person.name,
                            "lastname":person.lastname,
                            "emails":person.emails,
                            "social_activity":{
                                "likes":person.likes,
                                "liked":person.liked
                            }
                        }

                        done(response);

                    }

                });
            }
        },
        tags:{
            translate:function(id,done){

                Person.findByFBID(id,function(person){
                    if(!person){
                        done(null);
                    }else{
                        var response={
                            tags:person.tokens
                        }
                        done(response);
                    }
                });
            }
        }

    }
};