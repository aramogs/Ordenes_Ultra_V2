let mysql      = require('mysql');
let connection = mysql.createConnection({
  host     : '10.56.99.100',
  user     : 'root',
  password : 'toor',
  database : 'otplus',
});
 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});

module.exports = connection;