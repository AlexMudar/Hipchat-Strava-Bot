var express = require('express');
var bodyParser = require("body-parser"); //Alex
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(body.Parser.urlencoded({ extended: false })); //Alex
app.use(bodyParser.json());//Alex

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.post('/test',function(request,response){ //Alex
//var query1=request.body.var1; //Alex
//var query2=request.body.var2; //Alex
res.end("yes");
}); //Alex

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


