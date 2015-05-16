/**
 * Created by Vinnie on 16/05/2015.
 */
// Logic here is to keep a good reference of what's used

// models
Book = require('./blog');
User = require('./user');
Order = require('./order');

// exports
exports.bookModel = Book.bookModel;
exports.userModel = User.userModel;
exports.OrderModel = Order.orderModel;