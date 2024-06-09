const express = require('express');
const { loginUser, signupUser, updateUserDetails  } = require('../controllers/userController');

const router = express.Router();

//login route
router.post('/login', loginUser);

//sign up route
router.post('/signup', signupUser);

// router.get('/hello', hello)

//update user details
router.post('/update', updateUserDetails);

module.exports = router;