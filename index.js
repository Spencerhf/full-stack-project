const express = require('express');
const bcrypt = require('bcrypt');
const promise = require('bluebird');
const bodyParser = require('body-parser');

// For bcrypt
const saltRounds = 10;

const app = express();
const portNumber = process.env.PORT || 3000;

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
    user: 'spencer'
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


        //This post will create an account 

app.post('/api/register', ( req, res ) => {
    if (!req.body.username) {
        res.status(404).send("Email is required");
    }
    if (!req.body.email) {
        res.status(401).send("Username is required");
    }
    if (!req.body.first_name) {
        res.status(401).send("First name is required");
    }
    if (!req.body.last_name) {
        res.status(401).send("Last name is required");
    }
    if (!req.body.password) {
        res.status(401).send("Password is required");
    }

    let username = req.body.username;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let password = req.body.password;

    bcrypt.hash(password, saltRounds, function (err, hash) {
        db.query(`INSERT INTO users (username, first_name, last_name, email, password)\
                  VALUES ('${username}', '${first_name}', '${last_name}', '${email}', '${hash}')`)
            .then(function (user) {
                res.json({ status: "Successful Registration" });
            });
    });
})


        //This post will login to an existing account 

app.post('/api/login', function( req, res ) {
    if(!req.body.username) {
        res.status(404);
    }

    if(!req.body.password) {
       res.status(404);
    }

    let username = req.body.username;
    let enteredPassword = req.body.password;
    
    db.query('SELECT * FROM users').then(function(users) {
        for(var i=0; i<=users.length-1; i++) {
            if (username == users[i].username) {
                let password = users[0].password;
                bcrypt.compare(enteredPassword, password, function(err, result) {
                    if(result == true) {
                        res.send('Logged in').end();
                        console.log('Logged in');
                    } else {
                        res.status(404).send("No user found").end();
                    }
                })
            } else if(i == users.length) {
                res.status(500)
                res.render('error', { error: err })
            }  else {
                console.log('no user');
            }
        }
    })
});

app.get('/api/forums', ( req, res ) => {
    db.query(`SELECT * FROM forums`).then(function(results) {
        res.json(results);
    })
    
})

app.post('/api/topics', ( req, res ) => {
    res.json(req.body);
})


app.listen(portNumber, function() {
    console.log(`My API is listening on port ${portNumber}.... `);
});