const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required:true,
    },
    restrictions:[{
        type:String,
    }],
    submittedUsers:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required:true,
    },
    vibes:[{
        type:String
    }],
    price: [{
        type:String
    }],
    recommendations: {
        type: [String],
        default: [],
    }

})

roomSchema.statics.createRoom = async function (name, users, restrictions) {
    const room = new this({name, users, restrictions, submittedUsers:[], vibes:[], price:[]});
        await room.save();
        return room;
}



module.exports = mongoose.model('Room', roomSchema);
