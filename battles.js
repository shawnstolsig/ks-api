// TODO: do I need to put API hostnames in .env?
// const { apiHostName } = require('./config/config')
const axios = require('axios')
const fs = require('fs')
const path = require('path');
const basename = path.basename(__filename);

const apiHostName = 'http://localhost:3001'

const seedBattles = async () => {

    // clear existing battles
    await axios.get(`${apiHostName}/resetBattles/`)

    // let jsonDir = __dirname + '/data/medium/'
    // let jsonDir = __dirname + '/data/json/'
    let jsonDir = __dirname + '/data/season/'

    //---------------------- this version will only process one file at a time
    // iterate through each file directory
    const files = fs
        .readdirSync(jsonDir)
        .filter(file => {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-5) === '.json');
        })

    let fileCount = 0
    for(const file of files){
        fileCount++
        // get array of battles from json file
        const filename = path.join(jsonDir, file)
        const rawData = fs.readFileSync(filename)
        const battles = JSON.parse(rawData)

        // post to db
        try {
            let response = await axios.post(`${apiHostName}/battles/`, battles)
            console.log(`Completed POST for one JSON containing ${battles.length} battles:\n${JSON.stringify(response.data)} #${fileCount}`)
        } catch (err) {
            console.log(`Error posting JSON file to ks-api: `, err)
        }
    }

    //---------------------- this version will only process multiple files at a time
    //---------------------- this might not be usable since multiple files may contain the same battle, and since battles
    //---------------------- are created with findOrBuild rather than findOrCreate
    // fs
    //     .readdirSync(jsonDir)
    //     .filter(file => {
    //         return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-5) === '.json');
    //     })
    // .forEach(async file => {
    //
    //     // get array of battles from json file
    //     const filename = path.join(jsonDir, file)
    //     const rawData = fs.readFileSync(filename)
    //     const battles = JSON.parse(rawData)
    //
    //     // post to db
    //     try {
    //         let response = await axios.post(`${apiHostName}/battles/`, battles)
    //         console.log(`Completed POST for one JSON containing ${battles.length} battles:\n${JSON.stringify(response.data)}`)
    //     } catch (err) {
    //         console.log(`Error posting JSON file to ks-api: `, err)
    //     }
    // });
}

seedBattles()

