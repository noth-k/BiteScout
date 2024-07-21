require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const placesRoutes = require('./routes/places');
const roomRoutes = require('./routes/room');
const recommendationRoutes = require('./routes/recommendation');
const restaurantRoutes = require('./routes/restaurant');

const app = express();

// Middleware that parses incoming requests; transforms the raw request body into a JS object that can be accessed through req.body
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/room', roomRoutes);
app.use('/api/user', userRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/recommendation', recommendationRoutes);
app.use('/api/restaurant', restaurantRoutes); // Add this line

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // Listen to request when connected
    app.listen(process.env.PORT, () => {
      console.log("port is listening", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
