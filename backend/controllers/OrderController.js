const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item');

const getOrders = async (req, res) => {
    try {
        const orderList = await Order.find().populate('user', 'name').sort({ 'dateOrdered': -1 });
        res.status(200).json(orderList);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name')
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product',
                    populate: 'category'
                }
            });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found!" });
        }
        
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

const createOrder = async (req, res) => {
    try {
        const orderItems = Promise.all(req.body.orderItems.map(async (orderItem) => {
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product
            });
            newOrderItem = await newOrderItem.save();
            return newOrderItem._id;
        }));

        const orderItemsResolved = await orderItems;
        let totalPrice = 0;
        for (let i = 0; i < orderItemsResolved.length; i++) {
            const orderItem = await OrderItem.findById(orderItemsResolved[i]).populate('product', 'price');
            totalPrice += orderItem.product.price * orderItem.quantity;
        }

        let order = new Order({
            orderItems: orderItemsResolved,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status || 'Pending',
            totalPrice: totalPrice,
            user: req.body.user,
        });
        order = await order.save();

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Define other controller functions...

module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    // Add other controller functions here...
};
