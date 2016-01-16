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

	var request = require('request');
	var options = {
		url: 'https://www.strava.com/api/v3/clubs/150858/activities?per_page=10',
		headers: {
			'Authorization': 'Bearer ' + process.env.StravaToken
		}
	};

	request.get(options, function (error, response, body) {
	
		if (!error && response.statusCode == 200) {
			var bodyJson = JSON.parse(body);
			var stravaResponse = "";
			
			for (a=0; a<10; a++){
				stravaResponse = stravaResponse + "\r" + bodyJson[a]["athlete"]["id"].toString() + ": " + bodyJson[a]["distance"].toString(); 
			}
			
			
			var request = require('request');
			var options = {
				uri: 'https://ql.hipchat.com/v2/room/2317660/notification?auth_token=' + process.env.hipChatToken,
				method: 'POST',
				json: {
					"color":"green",
					"message":stravaResponse,
					"notify":false,
					"message_format":"text"
				}
			};

			request(options, function (error, response, body) {
				if (!error && response.statusCode == 204) {
					console.log("Success"); // Print the shortened url.
				} else {
					console.log("Fail", response.statusCode);
				}
			});
			
		} else {
			console.log("Error", response.statusCode);
		}
		
	});
	response.writeHead(200);
	response.end();
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});


