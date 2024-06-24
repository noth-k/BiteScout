const express = require('express');
const { loginUser, signupUser, updateUserDetails, searchUsers, updateRooms, fetchUserData, fetchUsers, requireAuth  } = require('../controllers/userController');

const router = express.Router();

// get user restrictions
router.get('/userRestrictions', requireAuth);

// login route
router.post('/login', loginUser);

// signup route
router.post('/signup', signupUser);

// router.get('/hello', hello)

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

module.exports = router;
