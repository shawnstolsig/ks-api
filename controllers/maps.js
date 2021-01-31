const { sequelize } = require('../models/index')

const getMaps = async (req, res, next) => {
    const { Map } = sequelize.models

    try {
        const ships = await Map.findAll()
        return res.json(ships)
    } catch (err) {
        return res.status(500).json(err)
    }
}

const createMaps = (req, res, next) => {
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
}

module.exports = {
    createMaps,
    getMaps,
}