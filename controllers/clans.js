const { sequelize } = require('../models/index')

const getClanById = async (req, res, next) => {
    const { Clan } = sequelize.models
    const id = req.params.id

    try {
        const clan = await Clan.findByPk(id,{
            include: [ 'realm' ]
        })

        return res.json(clan)
    } catch (err) {
        return res.status(500).json(err)
    }
}

const getClans = async (req, res, next) => {
    const { Clan } = sequelize.models
    try {
        const clans = await Clan.findAll({
            include: [ 'realm' ]
        })
        return res.json(clans)
    } catch (err) {
        return res.status(500).json(err)
    }
}

module.exports = {
    getClanById,
    getClans
}