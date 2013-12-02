var personSchema = mongoose.Schema({
    'emails': {type: []},
    'fbid':  {type: String, index: true},
    'name': {type:String, index: true},
    'lastname':{type:String, index: true},
    'accesstoken':{type:String},
    'lastUpdated':{type:Date},
    'createdAt': {type: Date,    default: function () { return new Date;} },
    'tokens' : {type: []},
    'likes' : {type: Number},
    'liked' : {type: Number}
});

Person = mongoose.model('Person', personSchema);



// get account objects for a set of account ids
Person.getAccountsByFBIds = function (ids, callback) {
    Person.find({fbid: {$in: ids}}, function (err, accounts){
        callback(accounts);
    });
};
// get account objects for a set of account ids
Person.getAccountsByIds = function (ids, callback) {
    Person.find({_id: {$in: ids}}, function (err, accounts){
        callback(accounts);
    });
};


Person.findByFBID = function(id,callback){
    Person.findOne({fbid:id},function(err,person){
        callback(person);
    });
};