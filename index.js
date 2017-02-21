var express = require('express');
var request = require('request');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
	response.render('pages/index');
});

 app.post('/test',function(request,response){
	response.writeHead(200, {"Content-Type": "application/json"});
	var json = JSON.stringify({"color":"green","message":request.body["item"]["message"]["from"]["mention_name"],"notify":false,"message_format":"text"});
	response.end(json);
});

app.post('/strava', function(request, response){
	stravaScoreboard(request, response, 178970, process.env.hipChatCyclingTest);
});

app.post('/running', function(request, response){
	stravaScoreboard(request, response, 178970, process.env.hipChatRunning);
});

app.post('/cycling', function(request, response){
	stravaScoreboard(request, response, 150858, process.env.hipChatCycling);
});

function stravaScoreboard(request, response, stravaClub, hipChatPostURL){
	var request = require('request');
	var options = {
		url: 'https://www.strava.com/api/v3/clubs/' + stravaClub + '/activities?per_page=200', 	
		headers: {
			'Authorization': 'Bearer ' + process.env.StravaToken
		}
	};

	request.get(options, function (error, response, body) {
	
		if (!error && response.statusCode == 200) {
			var bodyJson = JSON.parse(body);
			var athleteRanking = []; 
			var stravaResponse = "";
			var oneWeekAgo = new Date();
			var teamTotal = 0;
			oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
			
			for (a=0; a<bodyJson.length; a++){
				var tempDate = new Date(bodyJson[a]["start_date"]);
				if (tempDate > oneWeekAgo){
					var distanceInMiles = ((bodyJson[a]["distance"])/1609.3); //.toFixed(1);
					var athleteID = bodyJson[a]["athlete"]["id"].toString();
					for (b=0; b<athleteRanking.length; b++ ){
						if (athleteRanking[b].id === athleteID){
							athleteRanking[b].distanceInMiles = athleteRanking[b].distanceInMiles + distanceInMiles;
							athleteID = 0; 
						} 
					}
					if (athleteID != 0){
						var name = bodyJson[a]["athlete"]["firstname"].toString();
                        var profile = bodyJson[a]["athlete"]["profile_medium"].toString();
						athleteRanking.push( {id: athleteID, distanceInMiles: distanceInMiles, name: name, profile: profile});
					}
				}
			}
            
            athleteRanking.sort(function(a,b){
                if (parseFloat(a.distanceInMiles) < parseFloat(b.distanceInMiles))
                    return -1;
                if (parseFloat(a.distanceInMiles) > parseFloat(b.distanceInMiles))
                    return 1;
                return 0;
            });
            
            for (c = 0; c<athleteRanking.length; c++){
			    if (c == 0)
                    stravaResponse = stravaResponse + "<img src='" + (athleteRanking[0].profile).toString() + "' alt='' width='42' heigh='42'>";
                stravaResponse = stravaResponse + "<a href='https://www.strava.com/athletes/" + (athleteRanking[c].id).toString() + "'>" + (athleteRanking[c].name).toString() + "</a>" + ": " + ((athleteRanking[c].distanceInMiles).toFixed(1)).toString() + "mi <br>"; 
				teamTotal = teamTotal + athleteRanking[c].distanceInMiles;
			}
			
			stravaResponse = stravaResponse + "<a href='https://www.strava.com/clubs/" + stravaClub + "'>Club Total</a>: " + teamTotal.toFixed(1) + "mi \r";
			
			var request = require('request');
			var options = {
				uri: hipChatPostURL,
				method: 'POST',
				json: {
					"color":"gray",
					"message":stravaResponse,
					"notify":false,
					"message_format":"html"
				}
			};
			request(options, function (error, response, body) {
				if (!error && response.statusCode == 204) {
					console.log("Successfuly posted to Hipchat, received a 204 back.");
				} else {
					console.log("Failed to post to HipChat. Post response HTTP status code is: ", response.statusCode);
					console.log("Message to be posted was: ", JSON.stringify(stravaResponse));
				}
			});
			
		} else {
			console.log("Error", response.statusCode);
			console.error(error);
		}
		
	});
	response.writeHead(200);
	response.end();
}
	
app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});


