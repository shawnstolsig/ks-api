const { sequelize } = require('../models/index')

const getPlayerById = async (req, res, next) => {
    const { Player } = sequelize.models
    const id = req.params.id

    try {
        const ship = await Player.findByPk(id,{
            include: [ 'clan', 'realm' ]
        })

        return res.json(ship)
    } catch (err) {
        return res.status(500).json(err)
    }
}

module.exports = {
    getPlayerById
}