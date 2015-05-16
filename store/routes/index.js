var userController = require('../controllers/userController.js');

exports.listen = function(app) {
    // Index
    app.get('/', function (req, res) {
        res.render('index');
    });


    // User Routes
    app.get('/login', function (req, res) {
        res.render('login');
    });

    app.post('/login', function (req, res) {
        console.log(req.body.email);
        console.log(req.body.password);

        if (req.body.email != "" && req.body.password != "") {
            userController.login(req.body.email, req.body.password, req.session, res);
        } else {
            res.status(400).json({error: 'Please fill all fields'});
        }
    });

    app.post('/register', function(req, res) {
        if (req.body.email != "" && req.body.password != "" && req.body.address != "" && req.body.name != "") {
            userController.register(req.body.email, req.body.password, req.body.address, req.body.name);
        } else {
            res.status(400).json({error: 'Please fill all fields'});
        }
    });

    // Order Routes
};