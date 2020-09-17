const express = require('express');
const bcrypt = require('bcrypt');
const promise = require('bluebird');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
  
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

app.use(session({
    secret: process.env.SECRET_KEY || 'dev',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60000}
  }));

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
  

let userLoggedIn = false;

function authenticationMiddleware(req, res, next) {
    if(userLoggedIn) {
        console.log(userLoggedIn);
        next();
    } else {
        console.log('User not authenticated');
        res.redirect('/login');
    }
}


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
            `INSERT INTO users (first_name,last_name,username,email,password)\
            VALUES\ 
            ('${first_name}','${last_name}','${username}','${email}','${encrypted_password}')\
            RETURNING *`)
            .then (function(results) {
                res.json(results);
                userLoggedIn = true;
                req.session.user = results;
            })
            .catch(e => {
                console.log(e)
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
            res.json(results);
            req.session.user = res;
            userLoggedIn = true;
        } else {
            res.status(409).send("Incorrect password");
        }
        })
    })
    .catch(e => {
        console.log(e)
        res.status(404).send("Email/Password combination did not match")
        });
    })


//Create Topic
app.post('/forums/:forum/topics', authenticationMiddleware, (req,res) => {
    let forum_id = req.params.forum;
    if ( req.body.topic === '' || req.body.topic === 'undefined' ) {
        res.send('Please enter valid topic.');
    } else if ( req.body.username_id === '' || req.body.username_id === 'undefined' ) {
        res.send('You must be logged in to post a new topic.');
    } else {
        db.query(
            `INSERT INTO topics (topic,forum_id,username_id,date_created,is_deleted)\
            VALUES\ 
            ('${req.body.topic}',${forum_id},${req.body.username_id}, CURRENT_DATE, FALSE)\
            RETURNING *`)
        .then(function (results) {
            res.json(results);
        }).catch(e => {
            console.log("Topic already exists");
            res.status(400).send("An error occurred.")
        });
    };
});


//Create Comment
app.post('/forums/:forum/topics/:topic/posts', authenticationMiddleware, (req,res) => {
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
            userLoggedIn = true;
        }).catch(e => {
            console.log(e)
            res.status(400).send("An error occurred.")
        });
    };
});

// //Create Reply
app.post('/forums/:forum/topics/:topic/posts/:post/replies', authenticationMiddleware, (req,res) => {
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
            console.log(e)
            res.status(400).send("An error occurred.")
        });
    };
});



//Get All Forums
app.get('/forums', (req,res) => {
    db.query(
    `SELECT * FROM forum`).then (function(results) {
        console.log(results);
        let forums = results;
        console.log(results);
        if(userLoggedIn) {
            res.render('loggedIn/forums', {forums: forums}); 
        } else {
            res.render('loggedOut/forums', {forums: forums});
        }
    })
    .catch(e => {
        console.log(e)
        res.status(404).send("Something unexpected happened.")
        
    });
});

//Get Forum
app.get('forums/:forum', (req,res) => {
    let forum_id = req.params.forum;
    db.query(
        `SELECT * FROM forum\
        WHERE forum_id = '${forum_id}'`
    ).then (function(results) {
         res.json(results);
    })
    .catch(e => {
        console.log(e)
        res.status(404).send("An error occurred")
    }); 
})

//Get All Topics on Forum
app.get('/forums/:forum/topics', (req,res) => {
    let forum_id = req.params.forum;
    db.query(

        `SELECT * FROM forum\
        INNER JOIN topics ON topics.forum_id = forum.forum_id\
        LEFT OUTER JOIN users ON topics.username_id = users.user_id\
        WHERE topics.forum_id = ${forum_id} AND forum.forum_id = ${forum_id}`
        
    ).then (function(results) {
        console.log(results);
        let topics = results;
        if(userLoggedIn) {
            res.render('loggedIn/topics', {topics: topics})
        } else {
            res.render('loggedOut/topics', {topics: topics});
        }
    })
    .catch(e => {
        console.log(e);
        res.status(404).send("That forum does not exist.");
        
    });
});

//Get Topic
app.get('/forums/:forum/topics/:topic', (req,res) => {
    let forum_id = req.params.forum;
    let topic_id = req.params.topic;
    db.query(
        `SELECT * FROM topics\
        WHERE forum_id = '${forum_id}'\
        AND topic_id = '${topic_id}'`
    ).then (function(results) {
         res.json(results) 
    })
    .catch(e => {
        console.log(e)
        res.status(404).send("That topic does not exist.")
        
    });
});

//Get All Posts on Topic
app.get('/forums/:forum/topics/:topic/posts', (req,res) => {
    let forum_id = req.params.forum;
    let topic_id = req.params.topic;
    db.query(
        `SELECT * FROM posts\
        LEFT JOIN forum ON posts.forum_id = forum.forum_id\
        LEFT JOIN topics ON topics.topic_id = posts.topic_id\
        LEFT JOIN users ON users.user_id = posts.username_id\
        WHERE posts.forum_id = '${forum_id}'\
        AND posts.topic_id = '${topic_id}'`
    ).then (function(results) {
        let posts = results;
        console.log(posts.length);
        res.render('/loggedIn/comments.ejs', {posts: posts}); 
    })
    .catch(e => {
        console.log(e)
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
        AND post_id = '${post_id}'`
    ).then (function(results) {
         res.json(results) 
    })
    .catch(e => {
        console.log(e)
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
        console.log(e)
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
        AND reply_id = '${reply_id}'`
    ).then (function(results) {
         res.json(results) 
    })
    .catch(e => {
        console.log(e)
        res.status(404).send("That reply does not exist.")
    });
});


//Get Dashboard
app.get('/dashboard', authenticationMiddleware, function (req, res) {
    res.send('Hello, ' + req.username)
})



//Start localhost 
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});