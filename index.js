var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.post('/test',function(request,response){
	response.writeHead(200, {"Content-Type": "application/json"});
	var json = JSON.stringify({"color":"green","message":request.body["item"]["message"]["from"]["mention_name"],"notify":false,"message_format":"text"});
	response.end(json);
});

app.post('/strava',function(request,response){
	var options = {
		url: 'https://www.strava.com/api/v3/clubs/150858/activities',
		headers: {
			'Authorization': 'Bearer 121212'
		}
	};
	
	var stravaResponse;
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			stravaResponse = "Success"; 
		} else {
			stravaResponse = "Error";
		}
	})
	
	response.writeHead(200, {"Content-Type": "application/json"});
	var json = JSON.stringify({"color":"green","message":stravaResponse,"notify":false,"message_format":"text"});
	response.end(json);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


