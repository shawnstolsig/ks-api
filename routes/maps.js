const express = require('express');
const router = express.Router();

const { sequelize } = require('../models/index');

router.post('/', (req, res,next) => {
    const { Map } = sequelize.models;
    const maps = req.body;
    let counter = 0

    Object.keys(maps).forEach(async (map) => {
        await Map.create({
            id: map,
            image: maps[map].icon,
            name: maps[map].name,
        })
        counter++
    })
    console.log(`Successfully posted ${counter} maps to the database.`)

    return res.json(`hey you did it`)
})

router.get('/', (req, res, next) => {
    return res.json('this is working')
})

module.exports = router;