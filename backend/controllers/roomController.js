const Room = require('../models/roomModel');

const createRoom = async (req, res) => {
    const { name, users, restrictions } = req.body;
    try {
        const room = await Room.createRoom(name, users, restrictions);
        res.status(200).json({room});
    } catch (error) {
        res.json({success: false, error: error.message})
    }
}

const fetchRoom = async (req, res) => {
    const { roomId } = req.body;
    try {
        const room = await Room.findById(roomId);
        res.status(200).json({room});
    } catch (error) {
        res.json({sucess: false, error: error.message})
    }
}

const fetchRoomNames = async (req, res) => {
    try {
        const rooms = await Room.find({}, '_id name');
        res.status(200).json({rooms});
    } catch (error) {
        res.json({success: false, error: error.message})
    }
}

const updateRoom = async (req, res) => {
    const { id, newUsers } = req.body;
    try {
        // Fetch the room to get the current users array
        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Update the users array
        room.users = [...room.users, ...newUsers];

        // Save the updated room
        await room.save();

        res.status(200).json({ room });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createRoom, fetchRoom, fetchRoomNames, updateRoom };