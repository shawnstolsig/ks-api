const { sequelize } = require('../models/index')
const {
    SHIP_CLASSES,
    SHIPS_ABBREVIATIONS,
    NATIONS
} = require('../constants')

const getShips = async (req, res, next) => {
    const { Ship } = sequelize.models
    try {
        const ships = await Ship.findAll({
            include: [ 'shipClass', 'nation']
        })
        return res.json(ships)
    } catch (err) {
        return res.status(500).json(err)
    }
}

const getShipById = async (req, res, next) => {
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
}

const createShips = (req, res, next) => {
    const { Ship } = sequelize.models;
    const ships = req.body;
    let counter = 0

    Object.keys(ships).forEach(async (ship) => {
        counter++
        await Ship.create({
            id: Number(ship),
            name: ships[ship].name,
            tier: ships[ship].tier,
            nationId: NATIONS[ships[ship].nation],
            shipClassId: SHIP_CLASSES[ships[ship].type].id,
            abbreviation: SHIPS_ABBREVIATIONS[ship],
        })
    })
    console.log(`Successfully posted ${counter} ships to the database.`)

    return res.json(`hey you did it ships`)
}

module.exports = {
    getShips,
    getShipById,
    createShips,
}
