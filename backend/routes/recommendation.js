const express = require('express');
const { createRecommendation } = require('../controllers/recommendationController');

const router = express.Router();

router.post('/create', createRecommendation);



module.exports = router;

