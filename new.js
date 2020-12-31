

router.post('/register', function(req, res, next) {
    
    inputData ={
       username: req.body.username,
        password: req.body.password,
    
    }
// check unique email address
var sql='SELECT * FROM registration WHERE email_address =?';
db.query(sql, [inputData.email_address] ,function (err, data, fields) {
 if(err) throw err
 if(data.length>1){
     var msg = inputData.email_address+ "was already exist";
 }else{
     
    // save users data into database
    var sql = 'INSERT INTO accounts SET ?';
   db.query(sql, inputData, function (err, data) {
      if (err) throw err;
           });
  var msg ="Your are successfully registered";
 }
 res.render('/home',{alertMsg:msg});
})
     
});