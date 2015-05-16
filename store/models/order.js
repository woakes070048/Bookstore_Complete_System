/**
 * Created by Vinnie on 14/05/2015.
 */
mongoose = require('mongoose');

var orderSchema = mongoose.Schema({
    user: {
        name: String,
        address: String,
        email: String
    },
    book: {
        title: String,
        ISBN: String,
        price: Number
    },
    quantity: String,
    date: Date,
    total: Number,
    orderState: String
});

var Order = mongoose.model('Order', orderSchema);

exports.orderModel = Order;