const express = require('express');
const { loginUser, signupUser, hello } = require('../controllers/userController');

const router = express.Router();

//login route
router.post('/login', loginUser);

//sign up route
router.post('/signup', signupUser);

router.get('/hello', hello)


module.exports = router;