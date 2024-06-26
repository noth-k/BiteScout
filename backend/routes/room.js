const express = require('express');
const { createRoom, fetchRoom, fetchRoomNames, updateRoom, removeUser, deleteRoom, updateSubmittedUsers, resetSubmittedUsers } = require('../controllers/roomController');

const router = express.Router();

router.post('/create', createRoom);

router.post('/find', fetchRoom);

router.post('/names', fetchRoomNames);

router.post('/update', updateRoom);

router.post('/removeUser', removeUser);

router.post('/delete', deleteRoom);

router.post('/submitUser', updateSubmittedUsers);

router.post('/reset', resetSubmittedUsers);


module.exports = router;

