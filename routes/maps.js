const express = require('express');
const router = express.Router();

const { getMaps, createMaps } = require('../controllers/maps');

router.get('/', getMaps)
router.post('/', createMaps)

module.exports = router;