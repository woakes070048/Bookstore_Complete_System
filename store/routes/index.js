exports.listen = function(app) {
    // Index
    app.get('/', function (req, res) {
        res.render('index');
    });


    // User Routes
    app.get('/login', function (req, res) {
        res.render('login');
    });


    // Order Routes
};