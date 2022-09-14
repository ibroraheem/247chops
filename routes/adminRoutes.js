const express = require('express');
const router = express.Router();

const { register, login, forgotPassword, resetPassword } = require('../controller/adminController');
const {addMenu, updateMenu, deleteMenu, getMenus, getMenu, getOrder, getOrders, deleteOrder} = require('../controller/orderController');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token ', resetPassword);
router.post('/menu', addMenu);
router.patch('/menu/:id', updateMenu);
router.delete('/menu/:id', deleteMenu);
router.get('/menus', getMenus);
router.get('/menu/:id', getMenu);
router.get('/orders', getOrders);
router.get('/order/:id', getOrder);
router.delete('/order/:id', deleteOrder);
module.exports = router;