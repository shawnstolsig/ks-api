// TODO: do I need to put API hostnames in .env?
// const { apiHostName } = require('./config/config')
const { APP_ID } = require('./config/secrets')
const axios = require('axios')

const apiHostName = 'http://localhost:3000'
const mapUrl = `https://api.worldofwarships.com/wows/encyclopedia/battlearenas/?application_id=${APP_ID}`
const shipUrl = (page) => `https://api.worldofwarships.com/wows/encyclopedia/ships/?application_id=${APP_ID}&page_no=${page}&fields=name%2Ctier%2Ctype%2Cnation`


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

const seedShips = async () => {
    // get maps from WG API
    let response
    for(let i = 1; i <= 5; i++){
        let counter = 0
        try {
            response = await axios.get(shipUrl(i));
        } catch (err) {
            console.log(`Error getting maps from WG API: `,err)
        }

        // if status === 'error', then likely because getting page that doesn't exist
        if(response.data.status === 'error') continue;

        const ships = response.data.data
        counter += parseInt(response.data.meta['count'])
        try {
            response = await axios.post(`${apiHostName}/ships/`, ships)
        } catch (err) {
            console.log(`Error posting ships to ks-api: `,err)
        }
        console.log(`Completed POST for ${counter} ships`)
    }
}
// seedMaps()
seedShips()