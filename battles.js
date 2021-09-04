// TODO: do I need to put API hostnames in .env?
// const { apiHostName } = require('./config/config')
const axios = require('axios')
const fs = require('fs')
const path = require('path');
const basename = path.basename(__filename);

const apiHostName = 'http://localhost:3000'

const seedBattles = () => {

    // let jsonDir = __dirname + '/data/medium/'
    let jsonDir = __dirname + '/data/json/'
    // let jsonDir = __dirname + '/data/season/'

    // iterate through each file in /data/json directory
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
                console.log(`Completed POST for one JSON containing ${battles.length} battles:\n${response.data}`)
            } catch (err) {
                console.log(`Error posting JSON file to ks-api: `, err)
            }
        });
}

seedBattles()

