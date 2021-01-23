const express = require('express');
const router = express.Router();

const { sequelize } = require('../models/index');

router.post('/', (req, res,next) => {
    const { Battle } = sequelize.models;
    const battles = req.body;
    let counter = 0

    Object.keys(battles).forEach(async (battles) => {
        await Battle.create({
]
        })
        counter++
    })
    console.log(`Successfully posted ${counter} battles to the database.`)

    return res.json(`hey you did it, battles`)
})

router.get('/', (req, res, next) => {
    return res.json('this is working')
})

module.exports = router;