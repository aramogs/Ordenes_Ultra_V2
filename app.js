const express = require('express');
const app = express();
const db = require('./public/db/conn');
const bodyParser = require('body-parser');
var mailer = require('express-mailer');

app.set('views',__dirname + '/views');
app.set('view_engine', 'ejs');


app.use(express.static('public'));
//Requiriendo rutas
const routes = require('./routes');


app.get(db);
app.use(bodyParser.urlencoded({extended:true}));
app.use(routes);

module.exports= mailer;
app.listen(3000, function() {
    console.log('Server on port 3000!');
  });
