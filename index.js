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
 var json = JSON.stringify({"color":"green","message":"My first notification (yey)","notify":false,"message_format":"text"});
 response.end(json);

	//request.post('https://ql.hipchat.com/v2/room/2317660/notification?auth_token=paDzoz5VeFjCntDjsII3C0Hpt6YDxQ2D9tSV5mfh',
	//response.send(request.body);
	//res.end("yes");
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


