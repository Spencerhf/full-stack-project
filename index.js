const express = require('express');
const app = express();
const promise = require('bluebird');
const portNumber = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
const initOptions = {
    promiseLib: promise,
};

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