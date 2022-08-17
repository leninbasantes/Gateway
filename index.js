'use strict'

const config = require('./config');
const app = require('./app');
const db = require('./db');

const port =  config.getPort();

db.connect(config.getDB(), function(err) {
    if (err) {
        return console.log(err)
    } else {
        console.log("Conexion exitosa");
        app.listen(port, function(){
        console.log("Servidor rest Test v1.0.0 sobre: "+port);
        })
    }
});
