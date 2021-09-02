const { sequelize } = require('../models/index');

const createBattles = async (req, res, next) => {
    const battles = req.body;
    let battleCounter = 0
    let clanCounter = 0
    let playerCounter = 0

    let battlePromises = Object.values(battles).map(checkOrCreateBattle)
    let responses = await Promise.all(battlePromises)

    responses.forEach(({ battleIncrement, clanIncrement, playerIncrement }) => {
        battleCounter += battleIncrement
        clanCounter += clanIncrement
        playerCounter += playerIncrement
    })
    console.log(`Successfully posted ${battleCounter} battles, ${clanCounter} clans, and ${playerCounter} players to the database.`)

    return res.json(`Successfully posted ${battleCounter} battles, ${clanCounter} clans, and ${playerCounter} players to the database.`)
}

const getBattles = async (req, res, next) => {
    const { Battle, Clan, ClanResult, Player, PlayerResult, Ship } = sequelize.models

    try{
        let battles = await Battle.findAll({
            include: [
                'map',
                { model: ClanResult, as: 'teams', include: [
                        { model: Clan,
                            as: 'clan',
                            include: [ 'realm' ]
                        },
                        { model: PlayerResult, as: 'players', include: [
                                { model: Player, as: 'player' },
                                'ship',
                            ]
                        },
                    ]
                },
            ]
        })
        return res.json(battles)
    } catch (error) {
        return res.status(500).json({ error })
    }
}

const checkOrCreateBattle = (battle) => {
    return new Promise(async (resolve, reject) => {
        const { Battle } = sequelize.models;

        // abort if battle already exists
        const foundBattle = await Battle.findOne({ where: { id: battle.id.toString() }})
        if(foundBattle) {
            resolve({
                clanIncrement: 0,
                playerIncrement: 0,
                battleIncrement: 0
            })
            return;
        }

        // create battle
        let newBattle = await createBattle(battle)
        resolve({
            ...newBattle,
            battleIncrement: 1
        })
    })
}

const createBattle = (b) => {
    return new Promise(async(resolve, reject) => {
        const { Battle, Clan, ClanResult, Map, Player, PlayerResult, Realm, Stage } = sequelize.models;
        const battleId = b.id.toString()

        let clanCounter = 0
        let playerCounter = 0

        // BUILD NEW BATTLE:
        // root level attributes: arena_id, finished_at, cluster_id, season_number
        const finishedAt =  new Date(b.finished_at)
        const arenaId = b.arena_id
        const clusterId = b.cluster_id
        const season = b.season_number

        // get map and realm: map_id and realm
        const map = await Map.findByPk(b.map_id.toString())
        const battleRealm = await Realm.findOne({ where: { wgRealm: b.realm }})

        // create the battle
        let createdBattle = await Battle.create({
            id: battleId,
            finishedAt,
            arenaId,
            clusterId,
            season,
            mapId: map.id,
            realmId: battleRealm.id
        })

        // for determining winMethod
        let losersDied = true

        // create the associated ClanResults
        for(const clanFromJson of b.teams){

            // find or create the clan
            let clanRealm = await Realm.findOne({ where: { wgRealm: clanFromJson.claninfo.realm }})
            let [ clanFromDb, wasClanCreated ] = await Clan.findOrCreate({
                where: {
                    id: clanFromJson.clan_id.toString()
                },
                defaults: {
                    name: clanFromJson.claninfo.name,
                    color: clanFromJson.claninfo.color,
                    isDisbanded: clanFromJson.claninfo.disbanded,
                    memberCount: clanFromJson.claninfo.members_count,
                    tag: clanFromJson.claninfo.tag,
                    realmId: clanRealm.id
                }
            })

            // update counter for status message
            if(wasClanCreated) {
                clanCounter++;
            }
            else {
                updateClan(clanFromDb, {
                    name: clanFromJson.claninfo.name,
                    isDisbanded: clanFromJson.claninfo.disbanded,
                    tag: clanFromJson.claninfo.tag,
                    memberCount: clanFromJson.claninfo.members_count,
                    realmId: clanRealm.id,
                    color: clanFromJson.claninfo.color,
                })
            }

            // create the clanResult
            let clanResultInstance = {
                id: clanFromJson.id.toString(),
                division: clanFromJson.division,
                divisionRating: clanFromJson.division_rating,
                league: clanFromJson.league,
                ratingDelta: clanFromJson.rating_delta,
                result: clanFromJson.result,
                teamRating: clanFromJson.team_number === 1 ? 'alpha' : 'bravo',
                battleId,
                clanId: clanFromDb.id,
            }
            let createdClanResult = await ClanResult.create(clanResultInstance)

            // if there is a stage, create it
            if(clanFromJson.stage){

                // determine winCount and lossCount
                let winCount = 0
                let lossCount = 0
                for(let progressBattle of clanFromJson.stage.progress){
                    if(progressBattle === 'victory'){
                        winCount++
                    } else {
                        lossCount++
                    }
                }

                const stageToCreate = {
                    id: clanFromJson.stage.id.toString(),
                    battles: clanFromJson.stage.battles,
                    lossCount,
                    target: clanFromJson.stage.target,
                    targetDivision: clanFromJson.stage.target_division,
                    targetDivisionRating: clanFromJson.stage.target_division_rating,
                    targetLeague: clanFromJson.stage.target_league,
                    targetPublicRating: clanFromJson.stage.target_public_rating,
                    type: clanFromJson.stage.type,
                    victoriesRequired: clanFromJson.stage.victories_required,
                    winCount,
                    clanResultId: createdClanResult.id
                }

                // for some reason, this is trying to get a ClanResultId col from the table
                // adding returning:false prevents this
                await Stage.create(stageToCreate, {returning: false})
            }


            // create associated PlayerResults
            for(const playerFromJson of clanFromJson.players){

                let [ playerFromDb, wasPlayerCreated ] = await Player.findOrCreate({
                    where: {
                        id: playerFromJson.spa_id.toString()
                    },
                    defaults: {
                        name: playerFromJson.name,
                        clanId: clanFromDb.id.toString(),
                        realmId: clanRealm.id
                    }
                })

                // update counter for status message
                if(wasPlayerCreated) {
                    playerCounter++;
                }
                else {
                    updatePlayer(playerFromDb, {
                        name: playerFromJson.name,
                        clanId: clanFromDb.id.toString()
                    })
                }

                let playerResultInstance = {
                    id: `B${battleId}P${playerFromDb.id}`,
                    survived: playerFromJson.survived,
                    battleId,
                    clanId: clanFromDb.id.toString(),
                    clanResultId: createdClanResult.id.toString(),
                    playerId: playerFromDb.id.toString(),
                    shipId: playerFromJson.vehicle_id.toString()
                }

                await PlayerResult.create(playerResultInstance)

                if(createdClanResult.result === 'defeat' && playerFromJson.survived){
                    losersDied = false
                }
            }
        }

        // update the battle's winMethod field after iterating through all teams/players
        if(losersDied){
            createdBattle.winMethod = 'Kills'
        } else {
            createdBattle.winMethod = 'Points'
        }
        createdBattle.save()

        resolve({
            clanIncrement: clanCounter,
            playerIncrement: playerCounter
        })
    })
}
// utility functions
// TODO: clean up these functions, use a loop instead
const updatePlayer = (playerFromDb, { name, clanId }) => {
    let needsUpdate = false;
    if(playerFromDb.name !== name){
        needsUpdate = true
        playerFromDb.name = name
    }
    if(playerFromDb.clanId !== clanId){
        needsUpdate = true
        playerFromDb.clanId = clanId
    }
    if(needsUpdate){
        playerFromDb.save()
    }
}

const updateClan = (clanFromDb, {  name, isDisbanded, tag, memberCount, realmId, color }) => {
    let needsUpdate = false;

    if(clanFromDb.name !== name){
        needsUpdate = true
        clanFromDb.name = name
    }
    if(clanFromDb.isDisbanded !== isDisbanded){
        needsUpdate = true
        clanFromDb.isDisbanded = isDisbanded
    }
    if(clanFromDb.tag !== tag){
        needsUpdate = true
        clanFromDb.tag = tag
    }
    if(clanFromDb.memberCount !== memberCount){
        needsUpdate = true
        clanFromDb.memberCount = memberCount
    }
    if(clanFromDb.realmId !== realmId){
        needsUpdate = true
        clanFromDb.realmId = realmId
    }
    if(clanFromDb.color !== color){
        needsUpdate = true
        clanFromDb.color = color
    }

    if(needsUpdate){
        clanFromDb.save()
    }
}

// exports
module.exports = {
    createBattles,
    getBattles
}