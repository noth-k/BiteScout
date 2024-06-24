const express = require('express');
const { loginUser, signupUser, updateUserDetails, searchUsers, updateRooms, fetchUserData, fetchUsers  } = require('../controllers/userController');

const router = express.Router();

// get user restrictions
router.get('/userRestrictions', requireAuth, async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ restrictions: user.restrictions });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

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
