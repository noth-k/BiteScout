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
    const { id, newUsers, newRestrictions } = req.body;
    try {
        // Fetch the room to get the current users array
        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Update the users array
        room.users = [...room.users, ...newUsers];
        room.restrictions = [...room.restrictions, ...newRestrictions];

        // Save the updated room
        await room.save();

        res.status(200).json({ room });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const removeUser = async (req, res) => {
  const { roomId, userId } = req.body;

  try {
    // Find the room by ID
    const room = await Room.findById(roomId);

    // Check if the room was found
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Find the index of the userId in the users array
    const userIndex = room.users.indexOf(userId);
    
    // If userId is not found, return an error
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found in room' });
    }

    // Pull the userId from the users array
    room.users.splice(userIndex, 1);

    // Pull the corresponding restriction value from the restrictions array
    room.restrictions.splice(userIndex, 1);

    // Save the updated room document
    await room.save();

    // Send the updated room as a response
    res.status(200).json(room);
  } catch (error) {
    // Handle any errors that occur
    res.status(500).json({ message: 'Internal server error', error });
  }
};


  const updateSubmittedUsers = async (req, res) => {
    const { roomId, userId, vibe, price } = req.body;
    try {
        // Fetch the room to get the current users array
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Update the users array
        room.submittedUsers = [...room.submittedUsers, userId];
        room.vibes = [...room.vibes, vibe];
        room.price = [...room.price, price];

        // Save the updated room
        await room.save();

        res.status(200).json({ room });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  }

  const resetSubmittedUsers = async (req, res) => {
    const { roomId } = req.body;
    try {
        // Fetch the room to get the current users array
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Update the users array
        room.submittedUsers = [];
        room.vibes = [];
        room.price = [];

        // Save the updated room
        await room.save();

        res.status(200).json({ room });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  }

  const fetchVibesAndPrice  = async (req, res) => {
    const { roomId } = req.body;
    try {
        // Fetch the room to get the current users array
        const room = await Room.findById(roomId).select('vibes price');
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }


        res.status(200).json({ vibes: room.vibes, price: room.price });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  }


  const deleteRoom = async (req, res) => {
    const { roomId } = req.body;
  
    try {
      // Find the room by ID and delete it
      const room = await Room.findByIdAndDelete(roomId);
  
      // Check if the room was found and deleted
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
  
      // Send a success message
      res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
      // Handle any errors that occur
      res.status(500).json({ message: 'Internal server error', error });
    }
  };

  const fetchRestrictions = async (req, res) => {
    const { roomId } = req.body;
    try {
      const room = await Room.findById(roomId).select('restrictions');
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
    }
    res.status(200).json({ restrictions: room.restrictions });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  const updateGroupRecommendations = async (req, res) => {
    try {
        const { roomId, placeId } = req.body;

        const room = await Room.updateOne({_id: roomId}, {
            $addToSet: {
                recommendations: placeId,
            }
        } )
        res.status(200).json({room});
    } catch (error) {
        res.json({error: error.message})
    }
}
module.exports = { createRoom, fetchRoom, fetchRoomNames, updateRoom, removeUser, deleteRoom, updateSubmittedUsers, resetSubmittedUsers, fetchVibesAndPrice, fetchRestrictions, updateGroupRecommendations};