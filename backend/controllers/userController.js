const User = require('../models/userModel')
const jwt = require('jsonwebtoken');
const { search } = require('../routes/room');


//mongoDb uses _id so better to use same name --> part of the payload of the token
const createToken = (_id) => {
    //1st arguemnt is id,second is secret string only known to the server
    //3rd argument to declare how many days the person will stay logged in 
    return jwt.sign({_id: _id}, process.env.SECRET, { expiresIn: '3d' })
}

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.login(email, password);
        //create token
        const token = createToken(user._id)
        res.status(200).json({token, user});
    } catch (error) {
        res.json({success: false, error: error.message})
    }
}

// signup user
//in a route handler, can only use res.json once *** multiple calls will lead to errors
const signupUser = async (req, res) => {
    const { email, password, name, preferences, restrictions, avatar } = req.body;
    //to catch error: "email alr in use" or if input does not follow the Schema
    try {
        const user = await User.signup(email, password, name, preferences, restrictions, avatar);
        //create tokem
        const token = createToken(user._id)
        res.status(200).json({email, token, user})

    } catch (error) {
        console.log(error)
        res.json({error: error.message})
    }
}

const checkEmailPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        const isSuccess = await User.emailPasswordCheck(email, password);
        res.status(200).json({isSuccess});
    } catch (error) {
        console.log(error);
        res.json({error: error.message});
    }
}


//to update DB
const updateUserDetails = async (req, res) => {
    const { _id, name, preferences, restrictions } = req.body;

    try {
        const user = await User.updateOne({_id:_id}, {
            $set: {
                name: name,
                preferences: preferences,
                restrictions: restrictions,
            }
        } )
        res.status(200).json({user})
    } catch (error) {
        res.json({error: error.message})
    }
}

const requireAuth = async (req, res) => {
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
}

//to search in add friends:
const searchUsers = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Received", email);

        let users;

        if (!email) {
            users = await User.find({});
        } else {
            users = await User.find({email: new RegExp('^' + email, 'i') });
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const updateRooms = async (req, res) => {
    const { userId, roomId } = req.body;

    try {
        const user = await User.updateOne({_id: userId}, {
            $addToSet: {
                rooms: roomId,
            }
        } )
        res.status(200).json({user})
    } catch (error) {
        res.json({error: error.message})
    }
}

const removeRoomFromUser = async (req, res) => {
    const { userId, roomId } = req.body;
  
    try {
      // Update the user by pulling the roomId from the rooms array
      const user = await User.updateOne(
        { _id: userId },
        {
          $pull: {
            rooms: roomId,
          },
        }
      );
      // Send a success response
      const updatedUser = await User.findById(userId);

      res.status(200).json({ message: 'Room removed from user successfully', updatedUser });
    } catch (error) {
      // Handle any errors
      res.status(400).json({ error: error.message });
    }
  };

const fetchUserData = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findById(userId);
        res.status(200).json({user})
    } catch (error) {
        res.json({error: error.message})
    }
}

const fetchUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.json({error: error.message});
    }
}

const updatePastRecommendations = async (req, res) => {
    try {
        const { userId, placeId } = req.body;

        const data = await User.updateOne({_id: userId}, {
            $addToSet: {
                recommendations: placeId,
            }
        } )
        res.status(200).json({data});
    } catch (error) {
        res.json({error: error.message})
    }
}

module.exports = { loginUser, signupUser, updateUserDetails, searchUsers, updateRooms, fetchUserData, fetchUsers, requireAuth, removeRoomFromUser, checkEmailPassword, updatePastRecommendations };