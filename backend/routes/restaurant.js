const express = require('express');
const axios = require('axios');
const Restaurant = require('../models/restaurantModel');
const router = express.Router();
const User = require('../models/userModel');

// fetch all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user ? req.user._id : null; // auth check

    const googleResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&type=restaurant&key=AIzaSyD7KpFMQMMe2Ry6MC_q6_286QSdjt2Lvvc`
    );

    const fetchedPlaces = googleResponse.data.results;
    const placeIds = fetchedPlaces.map(place => place.place_id);

    // fetch upvotes data from db
    const restaurants = await Restaurant.find({ id: { $in: placeIds } });

    // map the fetched places with the upvotes data
    const results = fetchedPlaces.map(place => {
      const restaurant = restaurants.find(r => r.id === place.place_id);
      return {
        id: place.place_id,
        name: place.name,
        vicinity: place.vicinity,
        upvotes: restaurant ? restaurant.upvotes : 0,
        isUpvoted: restaurant ? restaurant.upvotedBy.includes(userId) : false,
      };
    });

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/upvote', async (req, res) => {
  try {
    const { id, name, userId } = req.body;

    console.log('Upvote request received:', id, name, userId); 

    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    let restaurant = await Restaurant.findOne({ id });
    let user = await User.findById(userId); 

    if (!restaurant) {
      restaurant = new Restaurant({ id, name, upvotes: 0, upvotedBy: [] });
    }

    if (restaurant.upvotedBy.includes(userId)) {
      // user has already upvoted, remove the upvote
      restaurant.upvotes -= 1;
      restaurant.upvotedBy = restaurant.upvotedBy.filter((user) => user !== userId);
      user.upvotedRestaurants = user.upvotedRestaurants.filter((restaurantId) => restaurantId !== id); // Remove from user's upvotedRestaurants
    } else {
      // user has not upvoted, add the upvote
      restaurant.upvotes += 1;
      restaurant.upvotedBy.push(userId);
      user.upvotedRestaurants.push(id); // add to user's upvotedRestaurants
    }

    await restaurant.save();
    await user.save(); // Save user changes

    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    console.error('Error in upvote endpoint:', error); // Log for debugging
    res.status(500).json({ success: false, error: error.message });
  }
});


// get top restaurants for leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const topRestaurants = await Restaurant.find().sort({ upvotes: -1 }).limit(10);
    res.status(200).json({ success: true, data: topRestaurants });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// fetch restaurant upvotes
router.get('/upvotes', async (req, res) => {
  try {
    const { placeId } = req.query;

    const restaurant = await Restaurant.findOne({ id: placeId });

    if (!restaurant) {
      // If the restaurant is not found, return upvotes as 0
      return res.status(200).json({ success: true, data: { upvotes: 0 } });
    }

    res.status(200).json({ success: true, data: { upvotes: restaurant.upvotes } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// fetch restaurant details by ID
router.get('/details/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findOne({ id });
    if (!restaurant) {
      return res.status(200).json({ success: true, data: { upvotes: 0 } });
    }
    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
