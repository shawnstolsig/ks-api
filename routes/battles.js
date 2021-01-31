const express = require('express');
const router = express.Router();

const { createBattles, getBattles } = require('../controllers/battles')

router.post('/', createBattles)
router.get('/', getBattles)

module.exports = router;