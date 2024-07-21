// updateUserSchema.js
const mongoose = require('mongoose');
const User = require('./models/userModel'); // Adjust the path as necessary


mongoose.connect("mongodb+srv://vinoth2002k:HggNs2G5wR6VEkyd@bitescout.uuoalpy.mongodb.net/?retryWrites=true&w=majority&appName=BiteScout"
, { useNewUrlParser: true, useUnifiedTopology: true });

const updateUserSchema = async () => {
  try {
    const users = await User.find({ upvotedRestaurants: { $exists: false } });
    for (const user of users) {
      user.upvotedRestaurants = [];
      await user.save();
    }
    console.log("User schema updated successfully.");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error updating user schema:", error);
    mongoose.connection.close();
  }
};

updateUserSchema();
