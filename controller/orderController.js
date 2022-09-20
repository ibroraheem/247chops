/* Importing the Menu and Order models from the model folder. It is also importing the nodemailer
package. */
const Menu = require('../model/menu')
const Order = require('../model/order')
const nodemailer = require('nodemailer')

/**
 * It's an async function that uses the mongoose model to find all the menus in the database and then
 * sends them to the client.
 * @param req - The request object.
 * @param res - the response object
 */
const getMenus = async (req, res) => {
    try {
        const menus = await Menu.find()
        res.send(menus)
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
        console.log(err);
    }
}

/**
 * It creates a new menu item and saves it to the database.
 * @param req - request
 * @param res - response
 */
const addMenu = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    try {
        if (decoded.role === 'admin') {
            const menu = new Menu({
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                image: req.body.image,
                category: req.body.category,
                quantity: req.body.quantity
            })
            const savedMenu = await menu.save()
            res.status(201).json({ message: 'Menu created successfully', savedMenu })
        }
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
        console.log(err);
    }
}

/**
 * It deletes a menu item from the database
 * @param req - request
 * @param res - the response object
 */
const deleteMenu = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    try {
        if (decoded.role === 'admin') {
            const menu = await Menu.findByIdAndDelete(req.params.id)
            res.status(200).json({ message: 'Menu deleted successfully' })
        }
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
        console.log(err);
    }
}

/**
 * It gets the menu from the database and sends it to the client.
 * @param req - request
 * @param res - the response object
 */
const getMenu = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    try {
        if (decoded.role === 'admin') {
            const menu = await Menu.findById(req.params.id)
            res.status(200).json({ message: 'Menu fetched successfully', menu })
        }
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
        console.log(err);
    }
}

/**
 * It updates a menu item in the database
 * @param req - request
 * @param res - response
 */
const updateMenu = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    try {
        if (decoded.role === 'admin') {
            const menu = await Menu.findByIdAndUpdate(req.params.id, {
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                image: req.body.image,
                category: req.body.category,
                quantity: req.body.quantity
            })
            res.status(200).json({ message: 'Menu updated successfully' })
        }
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
        console.log(err);
    }
}

/**
 * It takes the data from the form, creates a new order, saves it to the database, sends an email to
 * the admin and returns a response to the client.
 * @param req - the request object
 * @param res - {
 */
const order = async (req, res) => {
    const { customerName, customerEmail, customerPhone, customerAddress, orderItems, orderTotal } = req.body
    try {
        const order = new Order({
            customerName,
            customerEmail,
            customerPhone,
            customerAddress,
            orderItems,
            orderTotal
        })
        const savedOrder = await order.save()
        const transporter = nodemailer.createTransport({
            host: 'smtp.zoho.eu',
            port: 465,
            secure: true,

            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.ADMIN_EMAIL,
            subject: 'New Order',
            html: `<h1>Order Details</h1>
                <p>Customer Name: ${customerName}</p>
                <p>Customer Email: ${customerEmail}</p>
                <p>Customer Phone: ${customerPhone}</p>
                <p>Customer Address: ${customerAddress}</p>
                <p>Order Items: ${orderItems}</p>
                <p>Order Total: ${orderTotal}</p>`
        }
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err)
            } else {
                console.log(info)
            }
        })

        res.status(201).json({ message: 'Order created successfully', savedOrder })
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
        console.log(err);
    }
}

/**
 * It gets all the orders from the database and sends them to the client.
 * @param req - The request object.
 * @param res - the response object
 */
const getOrders = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    try {
        if (decoded.role === 'admin') {
            const orders = await Order.find()
            res.status(200).json({ message: 'Orders fetched successfully', orders, count: orders.length })
        }
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
        console.log(err);
    }
}

/**
 * It deletes an order from the database if the user is an admin.
 * @param req - request
 * @param res - the response object
 */
const deleteOrder = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    try {
        if (decoded.role === 'admin') {
            const order = await Order.findByIdAndDelete(req.params.id)
            res.status(200).json({ message: 'Order deleted successfully' })
        }
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
        console.log(err);
    }
}

/**
 * It gets an order by id, but only if the user is an admin.
 * @param req - request
 * @param res - the response object
 */
const getOrder = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    try {
        if (decoded.role === 'admin') {
            const order = await Order.findById(req.params.id)
            res.status(200).json({ message: 'Order fetched successfully', order })
        }
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
        console.log(err);
    }
}

/**
 * It takes the order id from the url, and updates the order with the new data from the request body.
 * @param req - request
 * @param res - response
 */
const updateOrder = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    try {
        if (decoded.role === 'admin') {
            const order = await Order.findByIdAndUpdate(req.params.id, {
                customerName: req.body.customerName,
                customerEmail: req.body.customerEmail,
                customerPhone: req.body.customerPhone,
                customerAddress: req.body.customerAddress,
                orderItems: req.body.orderItems,
                orderTotal: req.body.orderTotal
            })
            res.status(200).json({ message: 'Order updated successfully' })
        }
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
        console.log(err);
    }
}

/**
 * It gets all the orders of a user by email.
 * @param req - request
 * @param res - the response object
 */
const getOrdersByUser = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)

    try {
        if (decoded.role === 'admin') {
            const orders = await Order.find({ customerEmail: req.params.email })
            res.status(200).json({ message: 'Orders fetched successfully', orders, count: orders.length })
        }
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
        console.log(err);
    }
}

/**
 * It fetches all the orders from the database and sorts them by date in descending order.
 * @param req - request
 * @param res - the response object
 */
const getOrdersByDate = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    try {
        if (decoded.role === 'admin') {
            const orders = await Order.find({}).sort({ createdAt: 'desc' })
            res.status(200).json({ message: 'Orders fetched successfully', orders, count: orders.length })
        }
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
        console.log(err);
    }
}


/**
 * It takes an email address as a parameter, and returns all orders associated with that email address.
 * @param req - request
 * @param res - the response object
 */
const getOrdersByEmail = async (req, res) => {
    const email = req.params.email
    try {
        const orders = await Order.find({ customerEmail: email }).sort({ createdAt: 'desc' })
        if (orders.length === 0) return res.status(404).json({ message: 'No orders found' })
        res.status(200).json({ message: 'Orders fetched successfully', orders, count: orders.length })
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
        console.log(err);
    }
}

const getCustomers = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    try {
        if (decoded.role !== 'admin') return res.status(401).json({ message: 'Unauthorized' })
        const customers = await Order.find().distinct('customerEmail')
        res.status(200).json({ message: 'Customers fetched successfully', customers, count: customers.length })
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}
/* Exporting all the functions in the file. */
module.exports = { getMenus, addMenu, getMenu, getOrders, order, deleteOrder, getOrder, getOrders, deleteMenu, updateMenu, updateOrder, getOrdersByUser, getOrdersByDate, getOrdersByEmail, getCustomers }

