var express = require('express');
var router = express.Router();

const { sequelize } = require('../models/index')

/* GET users listing. */
router.get('/', async (req, res, next) => {
    const { Ship } = sequelize.models
    try {
        const ships = await Ship.findAll({
            include: [ 'shipClass', 'nation']
        })
        return res.json(ships)
    } catch (err) {
        return res.status(500).json(err)
    }

});

module.exports = router;
