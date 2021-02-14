// TODO: do I need to put API hostnames in .env?
// const { apiHostName } = require('./config/config')
const appId = require(__dirname + '/config/config.json')['appId']
const axios = require('axios')
const fs = require('fs')
const path = require('path');
const basename = path.basename(__filename);

const apiHostName = 'http://localhost:3000'
const mapUrl = `https://api.worldofwarships.com/wows/encyclopedia/battlearenas/?application_id=${appId}`
const shipUrl = (page) => `https://api.worldofwarships.com/wows/encyclopedia/ships/?application_id=${appId}&page_no=${page}&fields=name%2Ctier%2Ctype%2Cnation`

const seedMaps = () => {
    return new Promise(async (resolve, reject) => {
        // get maps from WG API
        let response
        try {
            response = await axios.get(mapUrl);
        } catch (err) {
            console.log(`Error getting maps from WG API: `, err)
            reject('Error getting maps from WG API')
        }

        // iterate through each map
        const maps = response.data.data

        try {
            response = await axios.post(`${apiHostName}/maps/`, maps)
            resolve(`Completed POST for ${Object.keys(maps).length} maps`)
        } catch (err) {
            console.log(`Error posting maps to ks-api: `, err)
            reject('Error posting maps to ks-api')
        }
    })

}

const seedShips = () => {
    return new Promise(async (resolve, reject) => {
        // get ships from WG API
        let response
        let counter = 0
        for (let i = 1; i <= 5; i++) {
            try {
                response = await axios.get(shipUrl(i));
            } catch (err) {
                console.log(`Error getting ships from WG API: `, err)
                reject(`Error getting ships from WG API`)
            }

            // if status === 'error', then likely because getting page that doesn't exist
            if (response.data.status === 'error') continue;

            const ships = response.data.data
            counter += parseInt(response.data.meta['count'])
            try {
                response = await axios.post(`${apiHostName}/ships/`, ships)
                console.log(`Posting ${Object.keys(ships).length} ships...`)
            } catch (err) {
                console.log(`Error posting ships to ks-api: `, err)
                reject(`Error posting ships to ks-api`)
            }
        }
        resolve(`...Completed POST for ${counter} ships`)
    })
}

const seedBattles = () => {

    let counter = 0;
    let jsonDir = __dirname + '/data/json/'

    // filter through each
    fs
        .readdirSync(jsonDir)
        .filter(file => {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-5) === '.json');
        })
        .forEach(async file => {

            // get array of battles from json file
            const filename = path.join(jsonDir, file)
            const rawData = fs.readFileSync(filename)
            const battles = JSON.parse(rawData)

            // post to db
            try {
                let response = await axios.post(`${apiHostName}/battles/`, battles)
                counter += battles.length
                console.log(`Completed POST for ${counter} battles.  Response:`, response.data)
            } catch (err) {
                console.log(`Error posting battles to ks-api: `, err)
            }
        });

}

const main = async () => {

    // post maps to db
    try {
        let res = await seedMaps()
        console.log(res)
    } catch (err) {
        console.log(err)
        return
    }

    // post ships to db
    try {
        let res = await seedShips()
        console.log(res)
    } catch (err) {
        console.log(err)
        return
    }

}
main()

