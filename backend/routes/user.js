const express = require('express');
const { loginUser, signupUser, updateUserDetails, searchUsers, updateRooms, fetchUserData, fetchUsers, requireAuth, removeRoomFromUser, checkEmailPassword  } = require('../controllers/userController');

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

module.exports = router;
