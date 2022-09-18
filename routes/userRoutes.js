/* Importing express and creating a router. */
const express = require('express')
const router = express.Router()

/* Importing the functions from the orderController.js file. */
const {getMenus, getMenu, order, getOrdersByEmail} = require('../controller/orderController')

/* This is the routing for the API. */
router.get('/menu', getMenus)
router.get('/menu/:id', getMenu)
router.post('/order', order)
router.get('/orders/:email', getOrdersByEmail)

/* Exporting the router to be used in the app.js file. */
module.exports = router