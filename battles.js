// TODO: do I need to put API hostnames in .env?
// const { apiHostName } = require('./config/config')
const axios = require('axios')
const fs = require('fs')
const path = require('path');
const basename = path.basename(__filename);

const apiHostName = 'http://localhost:3000'

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
                console.log(`Completed POST for ${counter} battles`)
            } catch (err) {
                console.log(`Error posting battles to ks-api: `, err)
            }
        });

    // TODO: figure out how to console.log total battle count here
}

const main = async () => {

    // post battles to db
    seedBattles()

}
main()

