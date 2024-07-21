const express = require('express');
const { loginUser, signupUser, updateUserDetails, searchUsers, updateRooms, fetchUserData, fetchUsers, requireAuth, removeRoomFromUser, checkEmailPassword  } = require('../controllers/userController');
const User = require('../models/userModel');

const router = express.Router();

// get user restrictions
router.get('/userRestrictions', requireAuth);

// login route
router.post('/login', loginUser);

// signup route
router.post('/signup', signupUser);

//check email and password
router.post('/check', checkEmailPassword);

//update user details
router.post('/update', updateUserDetails);

//search for user
router.post('/search', searchUsers);

//update room details
router.post('/roomsUpdate', updateRooms);

//fetch user data
router.post('/data', fetchUserData);

//fetch all users
router.post('/allData', fetchUsers )

//remove room from user
router.post('/removeRoom', removeRoomFromUser);

//get user upvoted restaurants
router.get('/upvotedRestaurants', async (req, res) => {
    try {
      const { userId } = req.query;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.status(200).json({ success: true, data: user.upvotedRestaurants });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

module.exports = router;
