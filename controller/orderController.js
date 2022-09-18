const Menu = require('../model/menu')
const Order = require('../model/order')
const nodemailer = require('nodemailer')

const getMenus = async (req, res) => {
    try {
        const menus = await Menu.find()
        res.send(menus)
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
        console.log(err);
    }
}

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

const getOrders = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    try {
        if (decoded.role === 'admin') {
            const orders = await Order.find()
            res.send(orders)
        }
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
        console.log(err);
    }
}

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

const getOrdersByUser = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)

    try {
        if (decoded.role === 'admin') {
            const orders = await Order.find({ customerEmail: req.params.email })
            res.status(200).json({ message: 'Orders fetched successfully', orders })
        }
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
        console.log(err);
    }
}

const getOrdersByDate = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    try {
        if (decoded.role === 'admin') {
            const orders = await Order.find({}).sort({ createdAt: 'asc' })
            res.status(200).json({ message: 'Orders fetched successfully', orders })
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
const getOrdersByEmail = (req, res) => {
    const email = req.params.email
    Order.find({ customerEmail: email })
        .then(orders => {
            res.status(200).json({ message: 'Orders fetched successfully', orders })
        })
        .catch(err => {
            res.status(500).json({ message: 'Something went wrong' })
            console.log(err);
        })
}

/* Exporting all the functions in the file. */
module.exports = { getMenus, addMenu, getMenu, getOrders, order, deleteOrder, getOrder, getOrders, deleteMenu, updateMenu, updateOrder, getOrdersByUser, getOrdersByDate, getOrdersByEmail }

