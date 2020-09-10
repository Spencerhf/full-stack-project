const express = require('express');
const bcrypt = require('bcrypt');
const promise = require('bluebird');
const bodyParser = require('body-parser');
const app = express();
  
// Set EJS as templating engine 
app.set('view engine', 'ejs'); 
// For bcrypt
const saltRounds = 10;

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
        var encrypted_password = hash;
        db.query(
            `INSERT INTO users (first_name,last_name,username,email,password,date_registered)\
            VALUES\ 
            ('${first_name}','${last_name}','${username}','${email}','${encrypted_password}',CURRENT_TIMESTAMP)\
            RETURNING *`)
            .then (function(results) {
                res.json("User succesfully registered.")
            })
            .catch(e => {
                res.status(409).send("Username or email already taken.")
            });
        }) 
});


//Login User

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    db.query(`SELECT * FROM users\
    WHERE username = '${username}'`)
    .then (function (results) {
    if(!username) {
        res.status(404).send("Username is required");
    }
    if(!password) {
        res.status(404).send("Password is required");
    }
    var stored_password = results[0].password;
    bcrypt.compare(password, stored_password, function(err, result) {
        if(result) {
            res.json({status : "User has successfully logged in"});
        } else {
            res.status(409).send("Incorrect password");
        }
        })
    })
    .catch(e => {
        res.status(409).send("Email/Password combination did not match")
        });
    })


//Create Topic
app.post('/forums/:forum/topics', (req,res) => {
    let forum_id = req.params.forum;
    if ( req.body.topic === '' || req.body.topic === 'undefined' ) {
        res.send('Please enter valid topic.');
    } else if ( req.body.username_id === '' || req.body.username_id === 'undefined' ) {
        res.send('You must be logged in to post a new topic.');
    } else {
        db.query(
            `INSERT INTO topics (topic,forum_id,username_id,date_created,is_deleted)\
            VALUES\ 
            ('${req.body.topic}',${forum_id},${req.body.username_id},CURRENT_TIMESTAMP, FALSE)\
            RETURNING *`)
        .then(function (results) {
            res.json(results);
        }).catch(e => {
            console.log(e)
            res.status(400).send("An error occurred.")
        });
    };
});


//Create Post
app.post('/forums/:forum/topics/:topic/posts', (req,res) => {
    let forum_id = req.params.forum;
    let topic_id = req.params.topic;
    let body = req.body.body
    let username_id = req.body.username_id
    if ( body === '' || body === 'undefined' ) {
        res.send('Please enter some text in your post.');
    } else if ( username_id === '' || username_id === 'undefined' ) {
        res.send('You must be logged in to post.');
    } else {
        db.query(
            `INSERT INTO posts (body,likes,is_deleted,forum_id,topic_id,username_id,date_created)\
            VALUES\ 
            ('${body}',0,FALSE,${forum_id},${topic_id},${username_id},CURRENT_TIMESTAMP)\
            RETURNING *`)
        .then(function (results) {
            res.json(results)
        }).catch(e => {
            res.status(400).send("An error occurred.")
        });
    };
});

// //Create Reply
app.post('/forums/:forum/topics/:topic/posts/:post/replies', (req,res) => {
    let forum_id = req.params.forum;
    let topic_id = req.params.topic;
    let post_id = req.params.post;
    let reply = req.body.reply;
    let username_id = req.body.username_id;
    if ( reply === '' || reply === 'undefined' ) {
        res.send('Please enter some text in your reply.');
    } else if ( username_id === '' || username_id === 'undefined' ) {
        res.send('You must be logged in to reply.');
    } else {
        db.query(
            `INSERT INTO replies (reply,likes,is_deleted,forum_id,topic_id,post_id,username_id,date_created)\
            VALUES\ 
            ('${reply}',0,FALSE,${forum_id},${topic_id},${post_id},${username_id},CURRENT_TIMESTAMP)\
            RETURNING *`)
        .then(function (results) {
            res.json(results)
        }).catch(e => {
            res.status(400).send("An error occurred.")
        });
    };
});



//Get All Forums
app.get('/forums', (req,res) => {
    db.query(
        'SELECT * FROM forum'
    ).then (function(results) {
         res.json(results) 
    })
    .catch(e => {
        res.status(404).send("Something unexpected happened.")
    });
});

//Get Forum
app.get('/forums/:forum', (req,res) => {
    let forum_id = req.params.forum;
    db.query(
        `SELECT * FROM forum\
        WHERE id = '${forum_id}'`
    ).then (function(results) {
         res.json(results) 
    })
    .catch(e => {
        res.status(404).send("That forum does not exist.")
    }); 
})

//Get All Topics on Forum
app.get('/forums/:forum/topics', (req,res) => {
    let forum_id = req.params.forum;
    db.query(
        `SELECT * FROM topics\
        FULL OUTER JOIN forum ON topics.forum_id = forum.id\
        FULL OUTER JOIN users ON topics.username_id = users.id\
        WHERE topics.forum_id = ${forum_id} AND forum.id = ${forum_id}`
    ).then (function(results) {
        console.log(results);
        let topics = results
        res.render('forum', {topics: topics}); 
    })
    .catch(e => {
        res.status(404).send("That forum does not exist.")
    });
});

//Get Topic
app.get('/forums/:forum/topics/:topic', (req,res) => {
    let forum_id = req.params.forum;
    let topic_id = req.params.topic;
    db.query(
        `SELECT * FROM topics\
        WHERE forum_id = '${forum_id}'\
        AND id = '${topic_id}'`
    ).then (function(results) {
         res.json(results) 
    })
    .catch(e => {
        res.status(404).send("That topic does not exist.")
    });
});

//Get All Posts on Topic
app.get('/forums/:forum/topics/:topic/posts', (req,res) => {
    let forum_id = req.params.forum;
    let topic_id = req.params.topic;
    db.query(
        `SELECT * FROM posts\
        WHERE forum_id = '${forum_id}'\
        AND topic_id = '${topic_id}'`
    ).then (function(results) {
         res.json(results) 
    })
    .catch(e => {
        res.status(404).send("That topic does not exist.")
    });
});

//Get Post
app.get('/forums/:forum/topics/:topic/posts/:post', (req,res) => {
    let forum_id = req.params.forum;
    let topic_id = req.params.topic;
    let post_id = req.params.post;
    db.query(
        `SELECT * FROM posts\
        WHERE forum_id = '${forum_id}'\
        AND topic_id = '${topic_id}'\
        AND id = '${post_id}'`
    ).then (function(results) {
         res.json(results) 
    })
    .catch(e => {
        res.status(404).send("That post does not exist.")
    });
});

//Get All Replies
app.get('/forums/:forum/topics/:topic/posts/:post/replies', (req,res) => {
    let forum_id = req.params.forum;
    let topic_id = req.params.topic;
    let post_id = req.params.post;
    db.query(
        `SELECT * FROM posts\
        WHERE forum_id = '${forum_id}'\
        AND topic_id = '${topic_id}'\
        AND post_id = '${post_id}'`
    ).then (function(results) {
         res.json(results) 
    })
    .catch(e => {
        res.status(404).send("That post does not exist.")
    });
});

//Get Reply
app.get('/forums/:forum/topics/:topic/posts/:post/replies/:reply', (req,res) => {
    let forum_id = req.params.forum;
    let topic_id = req.params.topic;
    let post_id = req.params.post;
    let reply_id = req.params.post;
    db.query(
        `SELECT * FROM posts\
        WHERE forum_id = '${forum_id}'\
        AND topic_id = '${topic_id}'\
        AND post_id = '${post_id}'\
        AND id = '${reply_id}'`
    ).then (function(results) {
         res.json(results) 
    })
    .catch(e => {
        res.status(404).send("That reply does not exist.")
    });
});



//Start localhost 
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});