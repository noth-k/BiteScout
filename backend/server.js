require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const placesRoutes = require('./routes/places');
const roomRoutes = require('./routes/room');
const recommendationRoutes = require('./routes/recommendation')

const app = express();

//order here matters
const cors = require('cors');
const recommendationModel = require('./models/recommendationModel');

//middleware that parses incoming requests; transforms the raw request body into a JS object that can be accessed through req.body
app.use(express.json());
app.use(cors());

//routes
app.use('/api/room', roomRoutes);
app.use('/api/user', userRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/recommendation', recommendationRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    //listen to request when connected
    app.listen(process.env.PORT, () => {
        console.log("port is listening", process.env.PORT)
    })
})
.catch((error) => {
    console.log(error);
})

