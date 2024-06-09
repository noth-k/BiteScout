const User = require('../models/userModel')
const jwt = require('jsonwebtoken');


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
    const { email, password, name, preferences, restrictions } = req.body;
    //to catch error: "email alr in use" or if input does not follow the Schema
    try {
        const user = await User.signup(email, password, name, preferences, restrictions);
        //create tokem
        const token = createToken(user._id)
        res.status(200).json({email, token, user})

    } catch (error) {
        console.log(error)
        res.json({error: error.message})
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

module.exports = { loginUser, signupUser, updateUserDetails };