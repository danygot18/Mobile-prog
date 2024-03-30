const  Order  = require('../models/order');
const Product  = require('../models/product');


// const { OrderItem } = require('../models/order-item');

// const getOrders = async (req, res) => {
//     try {
//         const orderList = await Order.find().populate('user', 'name').sort({ 'dateOrdered': -1 });
//         res.status(200).json(orderList);
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// const getOrderById = async (req, res) => {
//     try {
//         const order = await Order.findById(req.params.id)
//             .populate('user', 'name')
//             .populate({
//                 path: 'orderItems',
//                 populate: {
//                     path: 'product',
//                     populate: 'category'
//                 }
//             });

//         if (!order) {
//             return res.status(404).json({ success: false, message: "Order not found!" });
//         }
        
//         res.status(200).json(order);
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// const createOrder = async (req, res) => {
//     try {
//         const orderItems = Promise.all(req.body.orderItems.map(async (orderItem) => {
//             let newOrderItem = new OrderItem({
//                 quantity: orderItem.quantity,
//                 product: orderItem.product
//             });
//             newOrderItem = await newOrderItem.save();
//             return newOrderItem._id;
//         }));

//         const orderItemsResolved = await orderItems;
//         let totalPrice = 0;
//         for (let i = 0; i < orderItemsResolved.length; i++) {
//             const orderItem = await OrderItem.findById(orderItemsResolved[i]).populate('product', 'price');
//             totalPrice += orderItem.product.price * orderItem.quantity;
//         }

//         let order = new Order({
//             orderItems: orderItemsResolved,
//             shippingAddress1: req.body.shippingAddress1,
//             shippingAddress2: req.body.shippingAddress2,
//             city: req.body.city,
//             zip: req.body.zip,
//             country: req.body.country,
//             phone: req.body.phone,
//             status: req.body.status || 'Pending',
//             totalPrice: totalPrice,
//             user: req.body.user,
//         });
//         order = await order.save();

//         res.status(201).json(order);
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// // Define other controller functions...

// module.exports = {
//     getOrders,
//     getOrderById,
//     createOrder,
//     // Add other controller functions here...
// };

// exports.newOrder = async (req, res, next) => {
//     try {
//       // Extract shipping information from the request body
//       const shippingInfo = {
//         address: req.body.address,
//         city: req.body.city,
//         phoneNo: req.body.phoneNo,
//         postalCode: req.body.postalCode,
//         country: req.body.country
        
//       };
      
//       // Extract other necessary information from the request body
//       const { orderItems } = req.body;

//     //   req.body.orderItems.product = req.body.orderItems.id
//       console.log(req.body)
//       // Create a new order in the database
//       const order = await Order.create({
//         orderItems,
//         shippingInfo,
//         paidAt: Date.now(),
//         user: req.user._id // Assuming req.user contains user information
//         // You can include itemsPrice, totalPrice, and paymentInfo here if needed
//       });
  
//       // Send a success response with the newly created order
//       res.status(200).json({
//         success: true,
//         order
//       });
//     } catch (error) {
//       // Handle errors
//       console.error("Error creating order:", error);
//       res.status(500).json({
//         success: false,
//         error: "Failed to create order"
//       });
//     }
//   };


exports.newOrder = async (req, res, next) => {
  try {
    // Extract shipping information from the request body
    const shippingInfo = {
      address: req.body.address,
      city: req.body.city,
      phoneNo: req.body.phoneNo,
      postalCode: req.body.postalCode,
      country: req.body.country
    };

    // Extract other necessary information from the request body
    const { orderItems } = req.body;

    // Calculate total price for each order item
    let totalPrice = 0;
    const calculatedOrderItems = orderItems.map(item => {
      const totalItemPrice = item.quantity * item.price;
      totalPrice += totalItemPrice;
      return { ...item, totalPrice: totalItemPrice };
    });

    // Create a new order in the database
    const order = await Order.create({
      orderItems: calculatedOrderItems,
      shippingInfo,
      totalPrice, // Include the total price for the entire order
      orderStatus: 'Processing', // Assuming this is the default status
      user: req.user._id // Assuming req.user contains user information
      // You can include itemsPrice, totalPrice, and paymentInfo here if needed
    });

    // Send a success response with the newly created order
    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    // Handle errors
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create order"
    });
  }
};


exports.myOrders = async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id })

    res.status(200).json({
        success: true,
        orders
    })
}

exports.getSingleOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (!order) {
        return res.status(404).json({ message: `No Order found with this ID` })

    }

    res.status(200).json({
        success: true,
        order
    })
}

exports.adminOrders = async (req, res, next) => {
    const orders = await Order.find().populate('user', 'name')

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
}