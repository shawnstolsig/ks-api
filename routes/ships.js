var express = require('express');
var router = express.Router();

const { sequelize } = require('../models/index')

/* GET users listing. */
router.get('/', async function(req, res, next) {
    const { ShipClass, Nation, Ship } = sequelize.models
    try {

        const ships = await Ship.findAll({
            include: [ 'shipClass', 'nation']
        })
        return res.json(ships)
    } catch (err) {
        return res.status(500).json(err)
    }


    // try {
    //     const ships = await Ship.findAll()
    //     for(const ship of ships){
    //         const nation = await Nation.findOne({ where: { id: ship.nationId }})
    //         const shipClass = await Class.findOne({ where: { id: ship.classId }})
    //         ship.nation = nation
    //         ship.class = shipClass
    //     }
    //     return res.json(ships)
    // } catch (e) {
    //     return res.status(500).json(e)
    // }

});

module.exports = router;
