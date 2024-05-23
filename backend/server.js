require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');

const app = express();

//order here matters
const cors = require('cors');

//middleware that parses incoming requests; transforms the raw request body into a JS object that can be accessed through req.body
app.use(express.json());
//routes
app.use('/api/user', userRoutes);

app.use(cors());

//connect to db
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

