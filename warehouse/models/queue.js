mongoose = require('mongoose');

var queueSchema = mongoose.Schema({
    objectID : String,
    ISBN : String,
    quantity : Number
});

var Queue = mongoose.model('Queue', queueSchema);

Queue.pushOrder = function (objectID, ISBN, quantity, callback) {
    var item = new Queue({objectID: objectID, ISBN: ISBN, quantity: quantity});

    item.save(callback);
};

Queue.getOrders = function (callback) {
    Queue.find(callback);
};

exports.queueModel = Queue;
