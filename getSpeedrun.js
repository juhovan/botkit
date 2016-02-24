/**
 * Created by mikko on 24.2.2016.
 */
var http = require('http');

var getGameInfo = function (name) {

    var options = {
        hostname: 'www.speedrun.com',
        path: '/api_records.php?series=',
        method: 'GET',
        json:true
    }
    options.path.concat(name);

    request(options, function(error, response, body){
        if(error) console.log(error);
        else console.log(body);
    });


    var callback = function(response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            console.log(str);
        });
    }

    http.request(options, callback).end();


};
