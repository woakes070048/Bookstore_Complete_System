/**
 * Created by Vinnie on 16/05/2015.
 */
// Logic here is to keep a good reference of what's used

// models
var Queue = require('./queue');
var ProcessedOrder = require('./processedOrder');

// exports
exports.queueModel = Queue.queueModel;
exports.processedOrderModel = ProcessedOrder.processedOrderModel;