const express = require('express');
const router = express.Router();

const { sequelize } = require('../models/index');

router.post('/', (req, res,next) => {
    const { Battle, Map, Realm } = sequelize.models;
    const battles = req.body;
    let counter = 0

    Object.keys(battles).forEach(async (battle) => {

        const b = battles[battle]

        // root level attributes: arena_id, finished_at, cluster_id, season_number
        const id = b.id
        const finishedAt =  new Date(b.finished_at)
        const arenaId = b.arena_id
        const clusterId = b.cluster_id
        const season = b.season_number

        // get map and realm: map_id and realm
        const map = await Map.findByPk(b.map_id)
        const realm = await Realm.findOne({
            where: {
                wgRealm: b.realm
            }
        })

        await Battle.create({
            id,
            finishedAt,
            arenaId,
            clusterId,
            season,
            mapId: map.id,
            realmId: realm.id
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