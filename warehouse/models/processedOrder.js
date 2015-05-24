    mongoose = require('mongoose');

var processedOrderSchema = mongoose.Schema({
    objectID: String,
    ISBN: String,
    quantity: Number,
    date: String
});

var ProcessedOrder = mongoose.model('ProcessedOrder', processedOrderSchema);

ProcessedOrder.addOrder = function (objectID, ISBN, quantity, date, callback) {
    var item = new ProcessedOrder({objectID: objectID, ISBN: ISBN, quantity: quantity, date: date});

    item.save(callback);
};

ProcessedOrder.getOrders = function (callback) {
    ProcessedOrder.find(callback);
};

exports.processedOrderModel = ProcessedOrder;
