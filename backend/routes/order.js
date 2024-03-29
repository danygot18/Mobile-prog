const express = require('express');
const router = express.Router();
const orderControllers = require('../controllers/OrderController');

const { isAuthenticated } = require('../middlewares/Auth')

// router.get(`/`, orderControllers.getOrders);
// router.get(`/:id`, orderControllers.getOrderById);
router.post('/', isAuthenticated, orderControllers.newOrder); // Add this line to handle POST requests for creating orders
router.get('/', isAuthenticated, orderControllers.myOrders);
module.exports = router;
