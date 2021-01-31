const express = require('express');
const router = express.Router();

const { sequelize } = require('../models/index')
const { getClanById, getClans } = require('../controllers/clans')

router.get('/:id', getClanById);
router.get('/', getClans);

module.exports = router;
