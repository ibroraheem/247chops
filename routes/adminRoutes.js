/* Importing express and creating a router. */
const express = require('express');
const router = express.Router();

/* Importing the functions from the adminController and orderController files. */
const { register, login, forgotPassword, resetPassword } = require('../controller/adminController');
const {addMenu, updateMenu, deleteMenu, getMenus, getMenu, getOrder, getOrders, deleteOrder} = require('../controller/orderController');

/* Creating a route for the API. */
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

/* Exporting the router to be used in the main server.js file. */
module.exports = router;