var userController = require('../controllers/userController.js');
var orderController = require('../controllers/orderController.js');

exports.listen = function (app) {
    // Index
    app.get('/', function (req, res) {
        var session = req.session;
        if (session.email != undefined) {
            res.render('order');
        } else {
            res.render('login');
        }
    });

    // User Routes
    app.get('/login', function (req, res) {
        req.session.destroy();
        res.render('login');
    });

    // User Routes
    app.get('/order', function (req, res) {
        var session = req.session;
        if (session.email != undefined) {
            res.render('order');
        } else {
            res.render('login');
        }
    });

    app.get('/data/books', function (req, res) {
        var session = req.session;
        if (session.email != undefined) {
            orderController.getBooks(res);
        }
        else {
            res.render('login');
        }
    });

    app.get('/user/data', function (req, res) {
        var session = req.session;
        if (session.email != undefined) {
            res.status(200).json({email: session.email, name: session.name, address: session.address});
        }
    });

    app.post('/placeorder', function (req, res) {
        var session = req.session;
        if (session.email != undefined) {
            console.log(req.body);
            if (req.body.name != "" && req.body.address != "" && req.body.email != "" && req.body.title != "" && req.body.ISBN != "" && req.body.price != "" && req.body.quantity != "") {

                orderController.placeOrder(session, req.body.name, req.body.address, req.body.email, req.body.title, req.body.ISBN, req.body.price, req.body.quantity, res);
            } else {
                return res.status(400).json({error: "Please fill all fields"});
            }
        } else {
            res.render('login');
        }
    });

    app.post('/login', function (req, res) {

        if (req.body.email != "" && req.body.password != "") {
            userController.login(req.body.email, req.body.password, req.session, res);
        } else {
            res.status(400).json({error: 'Please fill all fields'});
        }
    });

    app.post('/register', function (req, res) {
        if (req.body.email != "" && req.body.password != "" && req.body.address != "" && req.body.name != "") {
            userController.register(req.body.email, req.body.password, req.body.address, req.body.name, req.session, res);
        } else {
            res.status(400).json({error: 'Please fill all fields'});
        }
    });

    app.post('/receiveStock', function (req, res) {
       orderController.addStock(req.body.objectID, req.body.ISBN, req.body.quantity, res);
    });

    app.get('/stock', function (req, res) {
        var session = req.session;
        if (session.email == "admin@a.a") {
            res.render('orderList', {email: "Admin"});
        } else {
            res.render('login');
        }
    });

    app.get('/ordersList', function (req, res) {
        var session = req.session;
        if (session.email != undefined) {
            res.render('orderList', {email: session.email});
        } else {
            res.render('login');
        }
    });

    app.get('/data/stockList', function (req, res) {
        orderController.getStock(res);
    });

    app.post('/data/orderList', function (req, res) {
        orderController.getOrderList(req.body.email, res);
    });

    app.post('/update/stock', function (req, res) {
        console.log(req.body.quantity);
        orderController.updateStock(req.body.ISBN, req.body.quantity, res);
    });

    // Order Routes
};