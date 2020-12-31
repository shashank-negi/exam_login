var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '123456',
	database : 'nodelogin'
});
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});
//login- in 
app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});
//register

app.post('/register', function(req, res) {


    inputData ={
       username: req.body.username,
        password: req.body.password,
        email:req.body.email
    }
// check unique email address
var sql='SELECT * FROM accounts WHERE username =?';
connection.query(sql, [inputData.username] ,function (err, data, fields) {
 if(err) throw err
 if(data.length>1){
     var msg = inputData.username+ "was already exist";
 }else{
     
    // save users data into database
    var sql = 'INSERT INTO accounts SET ?';
   connection.query(sql, inputData, function (err, data) {
      if (err) throw err;
           });
  var msg ="Your are successfully registered";
 }
 //res.render('/home',{alertMsg:msg});
 res.redirect('/home');
})


});





app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(3000);
/*
con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * from room",function(err,result,fields){
   if (err) throw err;
   console.log(result);
})
});*/



