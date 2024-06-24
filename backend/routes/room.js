const express = require('express');
const { createRoom, fetchRoom, fetchRoomNames, updateRoom  } = require('../controllers/roomController');

const router = express.Router();

router.post('/create', createRoom);

router.post('/find', fetchRoom);

router.post('/names', fetchRoomNames);

router.post('/update', updateRoom);

module.exports = router;

