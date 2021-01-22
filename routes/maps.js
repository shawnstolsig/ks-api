const express = require('express');
const router = express.Router();

// erase me
const { sequelize } = require('../models/index');

router.post('/', (req, res,next) => {
    const { Map } = sequelize.models;
    const maps = req.body;

    // iterate through all maps
    Object.keys(maps).forEach(async (map) => {
        await Map.create({
            id: map,
            image: maps[map].icon,
            name: maps[map].name,
        })
        console.log(`Created ${map}: ${maps[map].name}`)
    })

    return res.json(`hey you did it`)
})

router.get('/', (req, res, next) => {
    return res.json('this is working')
})

module.exports = router;