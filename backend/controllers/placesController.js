const axios = require("axios");

const getDiningPlaces = async (req, res) => {
  const { location, radius, type = "restaurant" } = req.query;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location,
          radius,
          type,
          key: apiKey,
        },
      }
    );

    const places = response.data.results;
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDiningPlaces };
