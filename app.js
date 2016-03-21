var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var moduleToDo = require('./routes/module');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/task', moduleToDo);

app.get('/*', function(req, res){
  var file = req.params[0] || 'views/index.html';
  res.sendFile(path.join(__dirname, './public', file));
});

app.set('port', process.env.PORT || 6200);
app.listen(app.get('port'), function(){
  console.log('Listening on port: ', app.get('port'));
});
