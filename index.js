const express = require('express');
const app = express();
const promise = require('bluebird');
const portNumber = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
const initOptions = {
    promiseLib: promise,
};

const saltRounds = 10;

const config = {
    host: 'localhost',
    port: 5432,
    database: 'forum_project',
    user: 'davidsullivan'
};

const pgp = require('pg-promise')(initOptions);
const db = require("./models");

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static( __dirname + '/web'));

bcrypt.hash(password,saltRounds, function(err,hash){
    db.user.create({"username": username, "email": email,"password": hash})
    .then(function (user) {
        resizeBy.json({status: "Successful Registration"});
    });
})

app.listen(portNumber, function() {
    console.log(`My API is listening on port ${portNumber}......`);
});