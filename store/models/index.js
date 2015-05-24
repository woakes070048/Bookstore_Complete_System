/**
 * Created by Vinnie on 16/05/2015.
 */
// Logic here is to keep a good reference of what's used

// models
var Book = require('./book');
var User = require('./user');
var Order = require('./order');
var Queue = require('./queue');
var Stock = require('./stock');

// exports
exports.bookModel = Book.bookModel;
exports.userModel = User.userModel;
exports.orderModel = Order.orderModel;
exports.queueModel = Queue.queueModel;
exports.stockModel = Stock.stockModel;