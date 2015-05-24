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

Order.addOrder = function (name, address, email, title, ISBN, price, quantity, date, total, orderState, callback) {
    var order = new Order({
        user: {name: name, address: address, email: email},
        book: {title: title, ISBN: ISBN, price: price},
        quantity: quantity, date: date, total: total, orderState: orderState
    });

    order.save(callback);
};

Order.getOrdersByUser = function(username, callback){
    Order.find({user:{name: username}}, callback);
};

Order.getOrdersByEmail = function(email, callback){
    Order.find({'user.email': email}, callback);
};

Order.getOrders = function( callback){
    Order.find(callback);
};

Order.getOrderByID = function (id, callback) {
    Order.find({_id: id}, callback);
};

Order.updateOrderState = function(objectID, state, callback) {
    Order.update({_id: objectID}, {$set: {orderState: state}}, callback);
};

Order.getWaitingExpedition = function(ISBN, callback) {
    Order.find({'book.ISBN': ISBN, orderState: "Waiting expedition"}, callback);
};

exports.orderModel = Order;