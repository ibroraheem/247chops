/* Importing the mongoose module. */
const mongoose = require('mongoose')

/* Creating a schema for the menu model. */
const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
},
{timestamps: true}
)

/* Creating a model for the menu schema. */
const Menu = mongoose.model('Menu', menuSchema)

/* Exporting the Menu model. */
module.exports = Menu