const { sequelize } = require('../models/index')
const { REALMS } = require('../constants')

const createBattles = async (req, res, next) => {
    const battles = req.body;
    let battleCounter = 0
    let clanCounter = 0
    let playerCounter = 0

    const allMaps = await sequelize.models.Map.findAll()

    let battlePromises = Object.values(battles).map(battle => processBattle(battle,allMaps))
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

const processBattle = (b,allMaps) => {
    return new Promise(async(resolve, reject) => {
        const { Battle, Clan, ClanResult, Player, PlayerResult, Stage } = sequelize.models;

        let clanCounter = 0
        let playerCounter = 0

        // BUILD NEW BATTLE:
        // root level attributes: arena_id, finished_at, cluster_id, season_number
        const {
            arena_id: arenaId,
            cluster_id: clusterId,
            season_number: season
        } = b
        const battleId = b.id.toString()
        const finishedAt =  new Date(b.finished_at)

        // get map and realm: map_id and realm
        const map = allMaps.find(map => map.id === b.map_id.toString())
        const battleRealm = REALMS[b.realm]

        try {
            const [ battle, wasBattleCreated] = await Battle.findOrBuild({
                where: {
                    id: battleId
                },
                defaults: {
                    finishedAt,
                    arenaId,
                    clusterId,
                    season,
                    mapId: map.id,
                    realmId: battleRealm.id
                }
            })

            if(wasBattleCreated){

                // for determining winMethod
                let losersDied = true

                // create the associated ClanResults
                for(const clanFromJson of b.teams){

                    // find or create the clan
                    const clanRealm = REALMS[clanFromJson.claninfo.realm]
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

                    // // create the clanResult
                    // let clanResultInstance = {
                    //     id: clanFromJson.id.toString(),
                    //     division: clanFromJson.division,
                    //     divisionRating: clanFromJson.division_rating,
                    //     league: clanFromJson.league,
                    //     ratingDelta: clanFromJson.rating_delta,
                    //     result: clanFromJson.result,
                    //     teamRating: clanFromJson.team_number === 1 ? 'alpha' : 'bravo',
                    //     battleId,
                    //     clanId: clanFromDb.id,
                    // }
                    // let createdClanResult = await ClanResult.create(clanResultInstance)
                    const [createdClanResult, wasClanResultCreated] = await ClanResult.findOrCreate({
                        where: {
                            id: clanFromJson.id.toString(),
                        },
                        defaults: {
                            division: clanFromJson.division,
                            divisionRating: clanFromJson.division_rating,
                            league: clanFromJson.league,
                            ratingDelta: clanFromJson.rating_delta,
                            result: clanFromJson.result,
                            teamRating: clanFromJson.team_number === 1 ? 'alpha' : 'bravo',
                            battleId,
                            clanId: clanFromDb.id,
                        }
                    })

                    if(wasClanResultCreated){
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
                }

                // update the battle's winMethod field after iterating through all teams/players
                if(losersDied){
                    battle.winMethod = 'Kills'
                } else {
                    battle.winMethod = 'Points'
                }
                await battle.save()
            }

            resolve({
                clanIncrement: clanCounter,
                playerIncrement: playerCounter,
                battleIncrement: wasBattleCreated ? 1 : 0
            })

        }  // end try block

        catch (error) {
            console.log(`Failed to process battle ${battleId}:`, error)
            reject(error)
        }

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