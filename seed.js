// TODO: do I need to put API hostnames in .env?
// const { apiHostName } = require('./config/config')
const { APP_ID } = require('./config/secrets')
const axios = require('axios')

const apiHostName = 'http://localhost:3000'
const mapUrl = `https://api.worldofwarships.com/wows/encyclopedia/battlearenas/?application_id=${APP_ID}`

const seedMaps = async () => {

    // get maps from WG API
    let response
    try {
        response = await axios.get(mapUrl);
    } catch (err) {
        console.log(`Error getting maps from WG API: `,err)
    }

    // iterate through each map
    const maps = response.data.data
    try {
        response = await axios.post(`${apiHostName}/maps/`, maps)
    } catch (err) {
        console.log(`Error posting maps to ks-api: `,err)
    }
    console.log(`Completed POST for maps`)

}

seedMaps()