mongoose = require('mongoose');

var stockSchema = mongoose.Schema({
    objectID : String,
    ISBN : String,
    quantity : Number
});

var Stock = mongoose.model('Stock', stockSchema);

Stock.addStock = function (objectID, ISBN, quantity, callback) {
    var item = new Stock({objectID: objectID, ISBN: ISBN, quantity: quantity});

    item.save(callback);
};

Stock.getStock = function (callback) {
    Stock.find(callback);
};

Stock.removeStock = function(ISBN, quantity, callback) {
    Stock.remove({ISBN: ISBN, quantity: quantity}, callback);
};

exports.stockModel = Stock;

