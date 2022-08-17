'use strict'

var express = require('express');
var HumitempController = require('../controllers/alcantarilla');
var router = express.Router();

router.post('/saveDataSewer',  HumitempController.saveData);

module.exports = router;