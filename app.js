'use strict'

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const rest_route = require('./routes/route');

app.use(bodyParser.json({limit: '30mb'}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));

app.use(bodyParser.json())

console.log('datos llegando')

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Allow', 'POST, GET, OPTIONS');
    next();
});

app.use(cors());

app.use('',rest_route);

module.exports = app;