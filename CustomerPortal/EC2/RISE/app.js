// Module dependencies

var express    = require('express'),
    mysql      = require('mysql'),
    bodyparser = require('body-parser'),
    expressSession = require('express-session'),
    path = require('path'),
    cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it    

// Application initialization

 var sess;
 var connection = mysql.createConnection({
   host     : '127.0.0.1',
   user     : 'root',
   password : 'password123',
   database : 'cmpe280'
 });
   
var app = express();
//app.use('/static', express.static('/Users/hanumesh/Documents/EC2/RISE/template-assets'));
app.use('/static', express.static('/home/ec2-user/RISE/template-assets'));
app.use('/staticVR', express.static('/home/ec2-user/RISE/vrpages'));
app.use('/staticAdmin', express.static('/home/ec2-user/RISE/admin'));

app.set('view engine','html');

app.use(cookieParser());
//app.use(expressSession({secret:'somesecrettokenhere'}));// must use cookieParser before expressSession
app.use(expressSession({
  secret: 'keyboard cat',
  resave: false,
  expires: new Date(Date.now() + 3600000),
  saveUninitialized: true
}));


// Configuration
app.use(bodyparser.json());


app.get('/VRHomePage', function(req, res) {
    
       if(sess && sess.userName){
           console.log("VRHomePage");
       res.sendFile(__dirname + '/vrpages/VRHomePage.html');
   }
    else{
        res.send("<HTML><BODY><P>Please Login to Continue..</p></BODY></HTML>");
    }
});


app.get('/admin', function(req, res) {
    console.log("path-->", __dirname);
    res.sendFile(__dirname + '/admin/index.html');
});



// Database setup

connection.query('CREATE DATABASE IF NOT EXISTS cmpe280', function (err) {
    console.log("===connection query===");
    if (err) throw err;
    connection.query('USE cmpe280', function (err) {
        if (err) throw err;
        connection.query('CREATE TABLE IF NOT EXISTS users('
            + 'id INT NOT NULL AUTO_INCREMENT,'
            + 'PRIMARY KEY(id),'
            + 'name VARCHAR(30),'
            + 'password VARCHAR(30),' 
            + 'email VARCHAR(30)'             
            +  ')', function (err) {
                if (err) throw err;
            });
    });
});


// Main route sends our HTML file

app.get('/home', function(req, res) {
    console.log("session-1", req.session);
    res.sendFile(__dirname + '/template-assets/index.html'); 
});

// Update MySQL database

app.post('/users', function (req, res) {
    console.log("session-2", req.session);
    name = req.body.name;
    console.log("name===>", name);
    
    connection.query('SELECT * from users WHERE name="'+ name+'"', 
        function (err, result) {
            if (err) throw err;
            if(result.length == 1)
                res.send('USER ERROR');
        }
    );
    
    email = req.body.email;
    console.log("mail===>", email);
    
    connection.query('SELECT * from users WHERE email="'+ email+'"', 
        function (err, result) {
            if (err) throw err;
            if(result.length == 1)
                res.send('MAIL ERROR');
        }
    );
    
    connection.query('INSERT INTO users SET ?', req.body, 
        function (err, result) {
            if (err) throw err;
            res.send('OK');
        }
    );
});



// Update MySQL database

app.post('/checkout', function (req, res) {
    console.log("enter checkout");
    connection.query('INSERT INTO tbl_order SET ?', req.body,
        function (err, result) {
            if (err) throw err;
            res.send('OK');
        }
    );
});


app.get("/adminData", function (req, res) {
      connection.query('SELECT * from tbl_order', 
        function (err, rows, fields) {
            if (err) throw err;
            res.send(rows);
            for (var i in rows) {
             console.log(rows[i]);
    }
        }
    );
});


app.post('/login', function(req, res) {
    name = req.body.name;
    console.log("name===>", name);
    password = req.body.password;
    console.log("password===>", password);
    
  connection.query('SELECT * from users WHERE name="'+ name+'"',                 
        function (err, rows, fields) {
            if (err) throw err;
            console.log("Here after query for login");
             console.log("rows====>" , rows);
            if(rows[0]) {
                console.log("Here after query inside else");
                console.log("name2==", rows[0].name);
                console.log("password2==", rows[0].password);
                 if((rows[0].name == name)&&(rows[0].password == password)){
                    console.log("Logged in!"); 
                    req.session.userName = name;
//                     res.sendFile(__dirname + '/template-assets/index.html');
                    req.session.save(function(err) {
  // session saved 
}) ;
                     sess = req.session;
                    console.log("====Session Started==", req.session.userName);
                     
                 }
                else res.send('ERROR');
            }
            else res.send('ERROR');
  });  
});

app.post('/logout',function(req, res) {
   sess.destroy();
    sess.userName = "Guest";
    console.log("====Session Ended==");
//    res.sendFile(__dirname + '/template-assets/index.html'); 
    res.send("OK");
});

app.post('/getuser',function(req, res) {
   if(sess && sess.userName){
       res.send(sess.userName);
   }
    else {
        console.log("req.session===>",sess);
        res.send("Guest");
    }
     
});



// Begin listening

app.listen(8081);
console.log("Express server listening on port 8081");
//, app.get('port')
console.log("Express server in "+ app.settings.env);
