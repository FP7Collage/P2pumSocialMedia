exports.setup=function(app){

    var natural = require('natural');

    var tokenizer = new natural.WordTokenizer();
    var fbgraph = require('fbgraph');
    var _ = require('underscore');
    var async = require('async');


    var handleComments = function(res,string,likes,callback){

        //count the number of likes per object
        async.each(res.data,function(value,done){
            if(value.message){
                string += value.message;
            }

            fbgraph.get('/fql?q=SELECT object_id, object_type, post_id, user_id FROM like WHERE object_id = '+value.id,function(err,res){

                likes+=res.data.length;
                done();

            });
        },function(err){
            if(res.paging && res.paging.next) {

                console.log('Moving on to the next one '+res.paging.previous);
                fbgraph.get(res.paging.next,function(err,res){
                    if(err){
                        console.log("Something happened here");
                    }else{
                        handleComments(res,string,likes,callback);
                    }
                });
            }else{
                callback(string,likes);
            }
        });
    };
    return {
        refresh : function(complete){

            Person.find({},function(err,persons){
                async.each(persons,function(value,done){

                    if(!value.accesstoken ){
                        console.log("No valid access token for user "+value.fbid);
                        return done();
                    }

                    if(value.lastUpdated == undefined || (new Date() - value.lastUpdated > (15*60*1000))){

                        fbgraph.setAccessToken(value.accesstoken);

                        fbgraph.get('/fql?q=select object_id from like WHERE user_id='+value.fbid,function(err,res){



                            value.likes= res.data.length;

                            value.save();

                            fbgraph.get(value.fbid+'/statuses',function(err,res){
                                if(!err){
                                    handleComments(res,'',0,function(string,liked){
                                        var tokenized=tokenizer.tokenize(string);
                                        value.tokens=tokenized;
                                        value.lastUpdated = new Date();
                                        value.liked=liked;
                                        value.save();
                                        done();
                                    });
                                }else{
                                    value.accesstoken=null;
                                    value.save();
                                    console.log('Ignoring access token is not valid anymore',err);
                                    done();
                                }
                            });
                        });
                    }else{
                        console.log(value.fbid+" updated withing 1 minute igoring");
                        done();
                    }

                }, function(err) {
                    if(err) {
                        console.log("There was an error" + err);
                    } else {
                        console.log("Loop is done");
                        complete();
                    }
                });


            });


        }

    }

};