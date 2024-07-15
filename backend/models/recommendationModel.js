const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recommendationSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required:true,
    }

})

recommendationSchema.statics.createRecommendation = async function (name, users, restrictions) {
    const recommendation = new this({name, address});
        await recommendation.save();``
        return recommendation;
}

recommendationSchema.statics.findByNameAndAddress = async function(name, address) {
    return await this.findOne({ where: { name, address } });
  };


module.exports = mongoose.model('Recommendation', recommendationSchema);
