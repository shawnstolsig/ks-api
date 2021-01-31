const { sequelize } = require('../models/index');

const createBattles = (req, res, next) => {
    const { Battle, Clan, ClanResult, Map, Player, PlayerResult, Realm, Stage } = sequelize.models;
    const battles = req.body;
    let battleCounter = 0
    let clanCounter = 0
    let playerCounter = 0

    // TODO: Promisify this?  How to prevent returning the response before it's done creating the entries
    Object.keys(battles).forEach(async (battle) => {

        const b = battles[battle]
        const battleId = b.id

        // abort if battle already exists
        const foundBattle = await Battle.findOne({ where: { id: battleId }})
        if(foundBattle) return;

        // BUILD NEW BATTLE:
        // root level attributes: arena_id, finished_at, cluster_id, season_number
        const finishedAt =  new Date(b.finished_at)
        const arenaId = b.arena_id
        const clusterId = b.cluster_id
        const season = b.season_number

        // get map and realm: map_id and realm
        const map = await Map.findByPk(b.map_id)
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
        for(const team of b.teams){

            // find or create the clan
            let clanRealm = await Realm.findOne({ where: { wgRealm: team.claninfo.realm }})
            let [ clan, wasClanCreated ] = await Clan.findOrCreate({
                where: {
                    id: team.clan_id
                },
                defaults: {
                    name: team.claninfo.name,
                    color: team.claninfo.color,
                    isDisbanded: team.claninfo.disbanded,
                    memberCount: team.claninfo.members_count,
                    tag: team.claninfo.tag,
                    realmId: clanRealm.id
                }
            })

            // update counter for status message
            if(wasClanCreated) clanCounter++;

            // create the clanResult
            let clanResultInstance = {
                id: team.id,
                division: team.division,
                divisionRating: team.division_rating,
                league: team.league,
                ratingDelta: team.rating_delta,
                result: team.result,
                teamRating: team.team_number === 1 ? 'alpha' : 'bravo',
                battleId,
                clanId: clan.id,
            }
            let createdClanResult = await ClanResult.create(clanResultInstance)

            // if there is a stage, create it
            if(team.stage){

                // determine winCount and lossCount
                let winCount = 0
                let lossCount = 0
                for(let progressBattle of team.stage.progress){
                    if(progressBattle === 'victory'){
                        winCount++
                    } else {
                        lossCount++
                    }
                }

                let createdStage = await Stage.create({
                    id: team.stage.id,
                    battles: team.stage.battles,
                    lossCount,
                    target: team.stage.target,
                    targetDivision: team.stage.target_division,
                    targetDivisionRating: team.stage.target_division_rating,
                    targetLeague: team.stage.target_league,
                    targetPublicRating: team.stage.target_public_rating,
                    type: team.stage.type,
                    victoriesRequired: team.stage.victories_required,
                    winCount,
                    clanResultId: createdClanResult.id
                })
            }


            // create associated PlayerResults
            for(const player of team.players){

                let [ createdPlayer, wasPlayerCreated ] = await Player.findOrCreate({
                    where: {
                        id: player.spa_id
                    },
                    defaults: {
                        name: player.name,
                        clanId: clan.id,
                        realmId: clanRealm.id
                    }
                })

                // update counter for status message
                if(wasPlayerCreated) playerCounter++;

                let playerResultInstance = {
                    survived: player.survived,
                    battleId,
                    clanId: clan.id,
                    clanResultId: createdClanResult.id,
                    playerId: createdPlayer.id,
                    shipId: player.vehicle_id
                }

                await PlayerResult.create(playerResultInstance)

                if(createdClanResult.result === 'defeat' && player.survived){
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

        battleCounter++;
    })

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

module.exports = {
    createBattles,
    getBattles
}