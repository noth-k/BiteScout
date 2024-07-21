const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  upvotedBy: {
    type: [String], // Array of user IDs who have upvoted
    default: [],
  },
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
