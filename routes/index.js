const express = require('express');
const router = express.Router();

const { sequelize, Sequelize } = require('../models/index')

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});
router.get('/resetAll', async (req, res, next) => {
  const { Battle, ClanResult, Clan, Map, PlayerResult, Player, Ship, Stage } = sequelize.models
  await Battle.destroy({
    where: {}
  })
  await ClanResult.destroy({
    where: {}
  })
  await Clan.destroy({
    where: {}
  })
  await Map.destroy({
    where: {}
  })
  await PlayerResult.destroy({
    where: {}
  })
  await Player.destroy({
    where: {}
  })
  await Ship.destroy({
    where: {}
  })
  await Stage.destroy({
    where: {}
  })


  res.json( { message: 'all reset success' });
});

router.get('/resetBattles', async (req, res, next) => {
  const { Battle, ClanResult, Clan, PlayerResult, Player, Stage } = sequelize.models
  await Battle.destroy({
    where: {}
  })
  await ClanResult.destroy({
    where: {}
  })
  await Clan.destroy({
    where: {}
  })
  await PlayerResult.destroy({
    where: {}
  })
  await Player.destroy({
    where: {}
  })
  await Stage.destroy({
    where: {}
  })


  res.json( { message: 'battles reset success' });
});

module.exports = router;
