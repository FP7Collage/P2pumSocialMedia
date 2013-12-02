exports.schedule = function(app,twitter){

    console.log("Setting up schedules");

//    var schedule = require('node-schedule');

    var timeout = -1;
    function refresh(){
        clearTimeout(timeout);
        twitter.refresh(function(){
            console.log("Setting the next timeout");
            timeout = setTimeout(refresh,5*1000);
        });
    }


    refresh();
//    var rule = new schedule.RecurrenceRule();
//    rule.minute = 1;
//
//    //* * * * * /path_to_script
//
//    var j = schedule.scheduleJob('* * * * *', function(){
//        facebook.refresh();
//    });


};