var moment = require('moment');
var models = require('../models/index.js');
var nodemailer = require("nodemailer");


exports.getBooks = function (res) {
    models.bookModel.getBooks(function (err, books) {
        if (err) {
            return res.status(400).json({error: "Database error" + err});
        }

        return res.status(200).json(books);
    });
};

exports.placeOrder = function (session, name, address, mail, title, ISBN, price, quantity, res) {
    models.bookModel.getBookByISBN(ISBN, function (err, books) {
        if (err) {
            return res.status(400).json({error: "Database error"} + err);
        }
        if (books[0].title != title || books[0].ISBN != ISBN || books[0].price != price) {
            return res.status(400).json({error: "Invalid book request"});
        }
        models.orderModel.addOrder(name, address, mail, title, ISBN, price, quantity, moment().format(), price * quantity, "null", function (err, order) {
            if (err) {
                return res.status(400).json({error: "Database error" + err});
            }
            if (books[0].stock > quantity && order != undefined) {
                var state = "Dispatched at " + (moment().add(1, 'days')).format();
                processSale(order._id, state, res, session);
            } else if (order != undefined) {
                var state = "Waiting expedition";
                createOrder(order._id, order.book.ISBN, order.quantity, state, res);
            }
        });
    });
};

function sendEmail(order, state, res) {
    console.log(order);
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = mm + '/' + dd + '/' + yyyy;

    var html = [
        '	<div class="container">',
        '		<div class="row">',
        '			<div class="well col-xs-10 col-sm-10 col-md-6 col-xs-offset-1 col-sm-offset-1 col-md-offset-3">',
        '				<div class="row">',
        '					<div class="col-xs-6 col-sm-6 col-md-6">',
        '							<strong>MIEICBooks</strong>',
        '							<br>',
        '							Rua Dr. Roberto Frias S/N',
        '							<br>',
        '							4200-465 Porto, Portugal',
        '							<br>',
        '							<abbr title="Phone">P:</abbr> +351 22 508 14 00',
        '							<br>',
        '							<br>',
        '							<strong>Client name:</strong> ' + order.user.name,
        '							<br>',
        '							<strong>Client address:</strong> ' + order.user.address,
        '							<br>',
        '					</div>',
        '					<div class="col-xs-6 col-sm-6 col-md-6 text-right">',
        '						<p>',
        '							<em>' + today + '</em>',
        '						</p>',
        '					</div>',
        '				</div>',
        '				<div class="row">',
        '					<div class="text-center">',
        '						<h1>Receipt</h1>',
        '					</div>',
        '				</span>',
        '				<table class="table table-hover">',
        '					<thead>',
        '						<tr>',
        '							<th>Product</th>',
        '							<th>#</th>',
        '							<th class="text-center">Price</th>',
        '							<th class="text-center">Total</th>',
        '						</tr>',
        '					</thead>',
        '					<tbody>',
        '						<tr>',
        '							<td class="col-md-9"><em>' + order.book.title + '</em></h4></td>',
        '							<td class="col-md-1" style="text-align: center">' + order.quantity + '</td>',
        '							<td class="col-md-1 text-center">' + order.book.price / order.quantity + '</td>',
        '							<td class="col-md-1 text-center">' + order.book.price + '</td>',
        '						</tr>',
        '						<tr>',
        '							<td></td>',
        '							<td></td>',
        '							<td class="text-right">',
        '						</tr>',
        '						<tr>',
        '							<td></td>',
        '							<td></td>',
        '							<td class="text-right"><h4><strong>Total:</strong></h4></td>',
        '							<td class="text-center text-danger"><h4><strong>' + order.book.price + '</strong></h4></td>',
        '						</tr>',
        '					</tbody>',
        '				</table>',
        '			</div>',
        '		</div>',
        '	</div>',
    ].join('');

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'hoardapp@gmail.com',
            pass: 'hoardingisfun'
        }
    });

    var mailOptions = {
        from: 'MIEICBooks <bookstore@gmail.com>', // sender address
        to: order.user.email, // list of receivers
        subject: 'Sales Receipt', // Subject line
        text: "Here is your latest order's receipt!",
        html: html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        console.log("Sending email");
        if (error) {
            console.log("Falhou o mail");
        } else {
            console.log("Funcionou o mail");
        }
    });

    res.status(200).json({ok:"processed"});
};

var processSale = function (objectID, state, res, session) {
    models.orderModel.updateOrderState(objectID, state, function (err, order) {
        if (err) {
            return res.status(400).json({error: "Database error" + err});
        }


        if (order != undefined) {
            //TODO: send email/receipt
            models.orderModel.getOrderByID(objectID, function (err, updatedOrder) {

                if (err) {
                    return res.status(400).json({error: "Database error" + err});
                }

                if (updatedOrder[0] != undefined) {
                    //update book stock
                    models.bookModel.removeStock(updatedOrder[0].book.ISBN, updatedOrder[0].quantity, function (err, updatedBook) {
                        if (updatedBook != null) {
                            console.log("Chegou aqui");
                            if (session.email != "admin@a.a") {
                                sendEmail(updatedOrder[0], state, res);
                            } else {
                                res.status(200).json({ok: "processed"});
                            }
                        }
                    });
                } else {
                    return res.status(400).json({error: "No updated order"});
                }
            });

        } else {
            res.status(400).json({error: "No order defined"});
        }
    });
};

var createOrder = function (objectID, ISBN, quantity, state, res) {
    //mensagem para a queue com 10*(o que foi pedido)
    //state: waiting expedition
    //quando envia state: dispatch should occur at (depois de amanha)

    models.orderModel.updateOrderState(objectID, state, function (err, order) {
        if (err) {
            return res.status(400).json({error: "Database error" + err});
        }

        if (order != undefined) {
            models.queueModel.pushOrder(objectID, ISBN, quantity * 10, function (err, item) {
                if (err) {
                    res.status(400).json({error: "Database error" + err});
                }
                if (item != undefined) {
                    res.status(200).json({success: "Success!"});
                }
            })
        }
    });
};

exports.addStock = function (objectID, ISBN, quantity, res) {
    models.stockModel.addStock(objectID, ISBN, quantity, function (err, stock) {
        if (err) {
            return res.status(400).json({error: "Database error" + err});
        }

        res.status(200).json({ok: "processed"});
    })
};

exports.getStock = function (res) {
    models.stockModel.getStock(function (err, stock) {
        if (err) {
            res.status(400).json({error: err});
        }

        if (stock != undefined) {
            res.status(200).json(stock);
        } else {
            res.status(400).json({error: "No stock no fun"});
        }
    });
};

exports.updateStock = function (ISBN, quantity, res, session) {
    models.bookModel.updateStock(ISBN, quantity, function (err, stock) {
        if (err) {
            return res.status(400).json({error: "Database error" + err});
        }
        models.orderModel.getWaitingExpedition(ISBN, function (err, ordersToUpdate) {
            if (err) {
                res.status(400).json({err: err});
            }
            for (var i in ordersToUpdate) {
                if (ordersToUpdate[i].quantity <= quantity) {
                    var state = "Dispatch will occur " + (moment().add(2, 'days')).format();
                    processSale(ordersToUpdate[i]._id, state, null, session);
                } else {
                    break;
                }
            }
            models.stockModel.removeStock(ISBN, quantity, function (err, manuel) {
                if (err) {
                    res.status(400).json({err: err});
                }
                res.status(200).json({ok: "updated"});
            });
        });
    })
};

exports.getOrderList = function (email, res) {
    models.orderModel.getOrdersByEmail(email, function (err, orders) {
        if (err) {
            res.status(400).json({error: "Database error:" + err});
        }

        if (orders != undefined) {
            res.status(200).json(orders);
        } else {
            res.status(400).json({error: 'Ja nao deu'});
        }
    });
};