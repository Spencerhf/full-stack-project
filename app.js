const express = require('express');
const bcrypt = require('bcrypt');
const promise = require('bluebird');
const bodyParser = require('body-parser');
// For bcrypt
const saltRounds = 10;
const app = express();
const port = process.env.PORT || 3000;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// pg-promise initialization options:
const initOptions = {
    // Use a custom promise library, instead of the default ES6 Promise:
    promiseLib: promise 
};
// Database connection parameters:
const config = {
    host: 'localhost',
    port: 5432,
    database: 'forum_project',
    user: 'zac-evans'
};
// Load and initialize pg-promise:
const pgp = require('pg-promise')(initOptions);
// Create the database instance:
const db = pgp(config);
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	next();
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + '/web'));
  




//Register New User

app.post('/register', (req, res) => {
    if (!req.body.first_name) {
        res.status(404).send("Name is required");
    }
    if (!req.body.last_name) {
        res.status(404).send("Name is required");
    }
    if (!req.body.username) {
        res.status(404).send("Username is required");
    }
    if (!req.body.email) {
        res.status(404).send("Email is required");
    }
    if (!req.body.password) {
        res.status(404).send("Password is required");
    }
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        let password = hash;
        console.log(password)
        })
    db.query(
        `INSERT INTO users (first_name,last_name,username,email,password,date_registered)\
        VALUES\ 
        ('${first_name}','${last_name}','${username}','${email}','${password}',CURRENT_TIMESTAMP)\
        RETURNING *`)
    .then (function(results) {
        res.json("User succesfully registered.")
    })
    .catch(e => {
        res.status(409).send("Username or email already taken.")
    });
});





// //New Topic
// /forums/:forum/topics/:topic

// //New Post
// /forums/:forum/topics/:topic/posts/:post

// //New Reply
// /forums/:forum/topics/:topic/posts/:post/replies/:reply




app.get('/users', (req,res) => {
    var id = req.params.id;
    db.query(
        'SELECT * FROM users'
    ).then (function(results) {
         res.json(results) 
    })
})



//Login User

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    if(!username) {
        res.status(404).send("Username is required");
    }
    if(!password) {
        res.status(404).send("Password is required");
    }
    if(!users[username]) {
        res.status(404).send("No account with that username exists.");
    }
    var stored_password = users[password];
    console.log(stored_password);
    bcrypt.compare(password, stored_password, function(err, result) {
        if(result == true) {
            res.json({status : "User has successfully logged in"});
        } else {
            res.status(404).send("Email/Password combination did not match");
        }
    });
})






//Start localhost 
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});