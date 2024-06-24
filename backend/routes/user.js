const express = require('express');
const { loginUser, signupUser, hello } = require('../controllers/userController');
const User = require('../models/userModel');
const requireAuth = require('../middleware/auth'); // auth middleware

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

router.get('/hello', hello);

module.exports = router;
