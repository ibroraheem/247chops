const request = require('request');
const Order = require('../model/order')
require('dotenv').config()

const pay = async (req, res) => {
    try {
        const email = req.params.email
    const {customerName, customerPhone, customerAddress, orderItems, amount} = req.body
        var options = {
            'method': 'POST',
            'url': 'https://api.paystack.co/transaction/initialize',
            'headers': {
                'Authorization': `Bearer ${process.env.secretKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email": email,
                "amount": amount.toString() * 100,
                "metadata": {
                    "custom_fields": [
                        {
                            "display_name": customerName,
                            "variable_name": customerPhone,
                            "value": customerPhone
                        }
                    ]
                }
            })

        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            const data = JSON.parse(response)
            const reference = data.data.reference
            const order = new Order({
                customerName,
                customerEmail: email,
                customerPhone,
                customerAddress,
                orderItems,
                orderTotal: amount,
                reference
            })
            order.save()
         res.redirect(data.data.authorization_url)
        });

    } catch (error) {
        console.log(error.message)
        res.status(500).send('Server Error')
    }
}

const verify = async (req, res) => {
    try {
        const reference = req.params.reference
        var options = {
            'method': 'GET',
            'url': `https://api.paystack.co/transaction/verify/${reference}`,
            'headers': {
                'Authorization': `Bearer ${process.env.secretKey}`,
                'Content-Type': 'application/json'
            }
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            const data = JSON.parse(response)
            const order = Order.findOne({reference: data.data.reference})
            if(!order){
                return res.status(404).send('Order not found')
            }
            order.orderStatus = 'confirmed'
            order.save()
            res.redirect('http://localhost:3000')
        });
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Server Error')
    }
}

module.exports = { pay, verify }