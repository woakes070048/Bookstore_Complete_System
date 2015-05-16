/**
 * Created by Vinnie on 14/05/2015.
 */
exports.mongoose = require('mongoose');

var orderSchema = mongoose.Schema({
    user: {
        name: String,
        address: String,
        email: String
    },
    book: {
        title: String,
        author: String,
        edition: String,
        publisher: Date,
        ISBN: String,
        price: Number
    },
    quantity: String,
    date: Date,
    total: Number,
    orderState: String
});

Order = mongoose.model('Order', orderSchema);

exports.orderModel = Order;