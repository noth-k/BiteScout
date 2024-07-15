const Recommendation = require('../models/recommendationModel');

const createRecommendation = async (req, res) => {
    const { name, address } = req.body;

    try {
        // Check if a recommendation with the same name and address exists
        const existingRecommendation = await Recommendation.findOne({ name, address });

        if (existingRecommendation) {
            // If it exists, return the existing recommendation
            return res.status(200).json({ recommendation: existingRecommendation });
        } else {
            // If it does not exist, create a new recommendation
            const recommendation = new Recommendation({ name, address });
            await recommendation.save();

            return res.status(200).json({ recommendation });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};




module.exports = { createRecommendation};