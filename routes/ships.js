var express = require('express');
var router = express.Router();

const { sequelize } = require('../models/index')

/* GET users listing. */
router.get('/', async function(req, res, next) {
    let ships = await sequelize.models.Ship.findAll()
    res.json(ships);
});

module.exports = router;
