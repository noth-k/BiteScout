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
    submittedUsers:[{
        type:String
    }]

})

roomSchema.statics.createRoom = async function (name, users, restrictions) {
    const room = new this({name, users, restrictions, submittedUsers:[]});
        await room.save();
        return room;
}



module.exports = mongoose.model('Room', roomSchema);
