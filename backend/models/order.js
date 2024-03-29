// const mongoose = require('mongoose');

// const orderSchema = mongoose.Schema({
//     orderItems: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'OrderItem',
//         required:true
//     }],
//     shippingAddress1: {
//         type: String,
//         required: true,
//     },
//     shippingAddress2: {
//         type: String,
//     },
//     city: {
//         type: String,
//         required: true,
//     },
//     zip: {
//         type: String,
//         required: true,
//     },
//     country: {
//         type: String,
//         required: true,
//     },
//     phone: {
//         type: String,
//         required: true,
//     },
//     status: {
//         type: String,
//         required: true,
//         default: 'Pending',
//     },
//     totalPrice: {
//         type: Number,
//     },
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//     },
//     dateOrdered: {
//         type: Date,
//         default: Date.now,
//     },
// })

// orderSchema.virtual('id').get(function () {
//     return this._id.toHexString();
// });

// orderSchema.set('toJSON', {
//     virtuals: true,
// });

// exports.Order = mongoose.model('Order', orderSchema);

const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        phoneNo: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            images: [{
                type: String,
                required: true

            }],
            price: {
                type: Number,
                required: true
            },
            id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'Processing' // Processing, Confirmed, Shipped, Delivered
    },
    deliveredAt: {
        type: Date
    },
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)
