const express = require("express");
const { getDiningPlaces } = require("../controllers/placesController");

const router = express.Router();

router.get("/dining", getDiningPlaces);

module.exports = router;
