const { sequelize } = require('../models/index')
const { REALMS } = require('../constants')

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

const createBattles = async (req, res, next) => {
    const battles = req.body;
    let battleCounter = 0
    let clanCounter = 0
    let playerCounter = 0
    let errorCounter = 0

    const allMaps = await sequelize.models.Map.findAll()

    // ----- this shouldn't be needed anymore, there won't be duplicate battles within the same file so no problem
    // ----- with updating them all in parallel with Promise.allSettled()
    // for(const battle of Object.values(battles)){
    //     try {
    //         const {
    //             battleIncrement,
    //             clanIncrement,
    //             playerIncrement
    //         } = await processBattle(battle, allMaps)
    //         battleCounter += battleIncrement
    //         clanCounter += clanIncrement
    //         playerCounter += playerIncrement
    //     } catch (e) {
    //         errorCounter++
    //     }
    // }

    let battlePromises = Object.values(battles).map(battle => processBattle(battle,allMaps))
    let responses = await Promise.allSettled(battlePromises)

    const successfulBattles  = responses.filter(({status}) => status === 'fulfilled')
    errorCounter = responses.filter(({status}) => status === 'rejected').length

    successfulBattles.map(battle => battle.value).forEach(({ battleIncrement, clanIncrement, playerIncrement }) => {
        battleCounter += battleIncrement
        clanCounter += clanIncrement
        playerCounter += playerIncrement
    })
    console.log(`Successfully posted ${battleCounter} battles, ${clanCounter} clans, and ${playerCounter} players to the database. Unsuccessful battles: ${errorCounter}`)

    return res.json({
        success: {
            battles: battleCounter,
            clans: clanCounter,
            players: playerCounter
        },
        errors: errorCounter
    })
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
        const finishedAt = new Date(b.finished_at)

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

                // data for the home team will be marked as private
                let isPrivate = true

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
                            realmId: clanRealm.id,
                            asOf: finishedAt
                        }
                    })

                    // update counter for status message
                    if(wasClanCreated) {
                        clanCounter++;
                    }
                    else if (!wasClanCreated && clanFromDb.asOf < finishedAt){
                        updateModelInstance(clanFromDb, {
                            name: clanFromJson.claninfo.name,
                            isDisbanded: clanFromJson.claninfo.disbanded,
                            tag: clanFromJson.claninfo.tag,
                            memberCount: clanFromJson.claninfo.members_count,
                            realmId: clanRealm.id.toString(),
                            color: clanFromJson.claninfo.color,
                            asOf: finishedAt
                        })
                    }

                    // todo: does this need to be findOrCreate?  if the battle is being created, can we assume ClanResults are also new?
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
                            isPrivate
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
                                    realmId: clanRealm.id,
                                    asOf: finishedAt
                                }
                            })

                            // update counter for status message
                            if(wasPlayerCreated) {
                                playerCounter++;
                            }
                            else if(!wasPlayerCreated && playerFromDb.asOf < finishedAt){
                                updateModelInstance(playerFromDb, {
                                        name: playerFromJson.name,
                                        clanId: clanFromDb.id.toString(),
                                        asOf: finishedAt
                                    })
                            }

                            let playerResultInstance = {
                                id: `B${battleId}P${playerFromDb.id}`,
                                survived: playerFromJson.survived,
                                battleId,
                                clanId: clanFromDb.id.toString(),
                                clanResultId: createdClanResult.id.toString(),
                                playerId: playerFromDb.id.toString(),
                                shipId: playerFromJson.vehicle_id.toString(),
                                isPrivate
                            }

                            await PlayerResult.create(playerResultInstance)

                            if(createdClanResult.result === 'defeat' && playerFromJson.survived){
                                losersDied = false
                            }
                        }
                    }

                    // since there are only ever two teams, toggle this to true for the opposing team
                    isPrivate = false
                } // end of team loop

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
const updateModelInstance = (instance, props) => {
    let needsUpdate
    for(const key in props){
        if(instance[key] !== props[key]){
            needsUpdate = true
            instance[key] = props[key]
        }
    }
    if(!needsUpdate) return;
    instance.save()
}

// exports
module.exports = {
    createBattles,
    getBattles
}
