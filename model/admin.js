/* Importing the mongoose module. */
const mongoose = require('mongoose');

/* Creating a schema for the admin model. */
const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: 'admin'
    },
    passwordResetToken: {
        type: String,
        default: undefined
    },
},
    { timestamps: true }
);

/* Creating a model for the schema. */
const Admin = mongoose.model('Admin', adminSchema);

/* Exporting the Admin model. */
module.exports = Admin;
