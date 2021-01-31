const express = require('express');
const router = express.Router();

const { getShips, getShipById, createShips } = require('../controllers/ships')

router.get('/:id', getShipById);
router.get('/', getShips);
router.post('/', createShips)

module.exports = router;
