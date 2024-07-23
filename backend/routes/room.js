const express = require('express');
const { createRoom, fetchRoom, fetchRoomNames, updateRoom, removeUser, deleteRoom, updateSubmittedUsers, resetSubmittedUsers, fetchVibesAndPrice, fetchRestrictions, updateGroupRecommendations } = require('../controllers/roomController');
const Room = require('../models/roomModel');

const router = express.Router();

router.post('/create', createRoom);

router.post('/find', fetchRoom);

router.post('/names', fetchRoomNames);

router.post('/update', updateRoom);

router.post('/removeUser', removeUser);

router.post('/delete', deleteRoom);

router.post('/submitUser', updateSubmittedUsers);

router.post('/reset', resetSubmittedUsers);

router.post('/vibesAndPrice', fetchVibesAndPrice);

router.post('/restrictions', fetchRestrictions);

router.post('/addRecommendation', updateGroupRecommendations);

router.get('/recommendations', async (req, res) => {
    try {
      const { roomId } = req.query;
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ success: false, error: 'Room not found' });
      }
      res.status(200).json({ success: true, data: room.recommendations });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });


module.exports = router;

