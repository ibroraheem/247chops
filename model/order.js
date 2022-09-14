const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    customerPhone: {
        type: String,
        required: true
    },
    customerAddress: {
        type: String,
        required: true
    },
    orderItems: {
        type: Array,
        required: true
    },
    orderTotal: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
        default: 'pending'
    },
},
    { timestamps: true }
)

const Order = mongoose.model('Order', orderSchema)
module.exports = Order