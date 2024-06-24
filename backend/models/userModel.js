const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String, 
        required: true,
    },
    name: {
        type: String,
        required: true,
    }, 
    preferences: {
        type: String,
        required: true,
    },
    restrictions: {
        type: String,
        required:true,
        enum: ["Halal", "Vegetarian", "Vegan", "Nil"],
    },
    rooms: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Room',
      default: []
  },
})
  

// static signup method
userSchema.statics.signup = async function (email, password, name, preferences, restrictions) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Invalid Email");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    email,
    password: hash,
    name,
    preferences,
    restrictions,
    rooms:[] });

  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Incorrect Email");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Invalid Password");
  }
  return user;
};

// static method to get user restrictions
userSchema.statics.getUserRestrictions = async function (email) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  return user.restrictions;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
