const express = require('express')
const router = express.Router()

const {getMenus, getMenu, order, getOrdersByEmail} = require('../controller/orderController')

router.get('/menu', getMenus)
router.get('/menu/:id', getMenu)
router.post('/order', order)
router.get('/order', getOrdersByEmail)

module.exports = router