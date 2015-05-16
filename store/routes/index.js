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
        res.render('login');
    });

    // User Routes
    app.get('/order', function (req, res) {
        var session = req.session;
        if (session.email != undefined) {
            res.render('order', {email: session.email, name: session.name, address: session.address});
        } else {
            res.render('login');
        }
    });

    app.get('/data/books', function (req, res) {
        var session = req.session;
        if (session.email != undefined) {
            orderController.getBooks(res);
        }
        else{
            res.render('login');
        }
    });

    app.post('/put-order', function(req, res) {
        var session = req.session;
        if (session.email != undefined) {
            if (req.name != "" && req.address != "" && req.email != "" && req.title != "" && req.ISBN != "" && req.price != "" && req.quantity != "") {
                orderController.placeOrder(req.name, req.address, req.email, req.title, req.ISBN, req.price, req.quantity, res);
            } else {
                return res.statusCode(400).json({error: "Please fill all fields"});
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

    // Order Routes
};