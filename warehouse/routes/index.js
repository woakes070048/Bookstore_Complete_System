var orderController = require('../controllers/orderController.js');
var models = require('../models/index.js');
var moment = require('moment');
var requestify = require('requestify');

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

    app.post('/sendStock', function (req, res) {
        requestify.post('http://127.0.0.1:1111/receiveStock', {objectID: req.body.objectID, ISBN: req.body.ISBN, quantity: req.body.quantity})
            .then(function (response) {
                var resJson = response.getBody();

                console.log("CENA------------");
                console.log(resJson);

                console.log("CENA------------");
                if (resJson.ok == "processed") {

                    models.queueModel.removeOrder(req.body.ISBN, req.body.quantity, function (err, order) {


                        models.processedOrderModel.addOrder(req.body.objectID, req.body.ISBN, req.body.quantity, moment().format(), function (err, processed) {

                            if (err) {
                                res.status(400).json({error: err});
                            }

                            res.status(200).json({ok: "processed"});
                        });
                    });

                } else {
                    res.status(400).json({error: "error"});
                }
            })
    });

    // Order Routes
};