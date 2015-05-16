var userController = require('../controllers/userController.js');
var orderController = require('../controllers/orderController.js');

exports.listen = function (app) {
    // Index
    app.get('/', function (req, res) {
        res.render('index');
    });


    // User Routes
    app.get('/login', function (req, res) {
        res.render('login');
    });

    // User Routes
    app.get('/order', function (req, res) {
        res.render('order');
    });

    app.get('/data/books', function (req, res) {
        orderController.getBooks(res);
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
            userController.register(req.body.email, req.body.password, req.body.address, req.body.name, res);
        } else {
            res.status(400).json({error: 'Please fill all fields'});
        }
    });

    // Order Routes
};