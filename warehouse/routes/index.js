var orderController = require('../controllers/orderController.js');

exports.listen = function (app) {
    // Index
    app.get('/', function (req, res) {
            res.render('index');
    });

    app.get('/data/unprocessedorders', function(req, res) {
        orderController.getUnprocessedOrders(res);
    });

    app.get('/data/processedorders', function(req, res) {
        orderController.getProcessedOrders(res);
    });

    app.post('/register', function (req, res) {
        if (req.body.email != "" && req.body.password != "" && req.body.address != "" && req.body.name != "") {
            userController.register(req.body.email, req.body.password, req.body.address, req.body.name, req.session, res);
        } else {
            res.status(400).json({error: 'Please fill all fields'});
        }
    });

    // Order Routes
};