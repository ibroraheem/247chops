/* Requiring the dotenv package and then calling the config() method on it. */
const mongoose = require('mongoose')
require('dotenv').config()

/**
 * This function connects to the MongoDB database using the Mongoose library and the MongoDB URI stored
 * in the .env file.
 */
const connectDB = () => {
    mongoose.connect(
        process.env.MONGO_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    console.log('MongoDB Connected')
}

/* Exporting the connectDB function so that it can be used in other files. */
module.exports = connectDB