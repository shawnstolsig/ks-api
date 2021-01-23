var express = require('express');
var router = express.Router();

const { sequelize } = require('../models/index')
const { shipsAbbr, shipClasses, nations } = require('../data/ships')

router.get('/:id', async (req, res, next) => {
    const { Ship } = sequelize.models
    const id = req.params.id

    try {
        const ship = await Ship.findByPk(id,{
            include: [ 'shipClass', 'nation' ]
        })

        return res.json(ship)
    } catch (err) {
        return res.status(500).json(err)
    }
});

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

router.post('/', (req, res,next) => {
    const { Ship } = sequelize.models;
    const ships = req.body;
    let counter = 0

    Object.keys(ships).forEach(async (ship) => {
        counter++
        await Ship.create({
            id: ship,
            name: ships[ship].name,
            tier: ships[ship].tier,
            nationId: nations[ships[ship].nation],
            shipClassId:shipClasses[ships[ship].type],
            abbreviation: shipsAbbr[ship],
        })
    })
    console.log(`Successfully posted ${counter} ships to the database.`)

    return res.json(`hey you did it ships`)
})

module.exports = router;
