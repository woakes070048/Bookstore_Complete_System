'use strict';
var app = angular.module('app', []);

app.controller('OrderTableController', ['$scope', '$http', function ($scope, $http) {
    $scope.name = [];
    $scope.address = "";
    $scope.email = "";
    $scope.books = [];
    $scope.title = "";
    $scope.price = "";
    $scope.ISBN = "";
    $scope.quantity = 1;
    $scope.total = 0;
    $scope.admin = "";

    $http.get('/data/books', {email: $scope.email, password: $scope.password}).
        success(function (data, status, headers, config) {
            $scope.books = data;

        }).
        error(function (data, status, headers, config) {

        });

    $http.get('/user/data').
        success(function (data, status, headers, config) {
            $scope.user = data;

            $scope.admin = angular.copy($scope.user.email);

            if($scope.user.email == "admin@a.a") {
                $scope.user.name  = "";
                $scope.user.address = "";
                $scope.user.email = "";
            }
        }).
        error(function (data, status, headers, config) {

        });

    $scope.updateOrder = function (title, price, ISBN) {
        $scope.title = title;
        $scope.price = price;
        $scope.ISBN = ISBN;
        $scope.updateTotal();
    };

    $scope.updateTotal = function () {
        $scope.total = $scope.quantity * $scope.price;
    };

    $scope.placeOrder = function () {
        $http.post("/placeorder", {
            name: $scope.user.name, address: $scope.user.address, email: $scope.user.email,
            title: $scope.title, ISBN: $scope.ISBN, price: $scope.price, quantity: $scope.quantity, admin: $scope.admin
        }).
            success(function (data, status, headers, config) {
                console.log("open");
                window.open('/order', '_self');
                if ($scope.admin == "admin@a.a") {
                    console.log("admin");
                    var receiptWindow = window.open('', '_blank');
                    if (!receiptWindow) {
                        console.log("nope");
                        return false;
                    }
                    var d = new Date();
                    var date = d.toString();
                    var html = [
                        '<!DOCTYPE html>',
                        '<head>',
                        '	<meta charset="UTF-8">',
                        '	<title>Order Receipt</title>',
                        '	<link rel="stylesheet" href="/css/bootstrap.min.css">',
                        '</head>',
                        '<body>',
                        '	<div class="container">',
                        '		<div class="row">',
                        '			<div class="well col-xs-10 col-sm-10 col-md-6 col-xs-offset-1 col-sm-offset-1 col-md-offset-3">',
                        '				<div class="row">',
                        '					<div class="col-xs-6 col-sm-6 col-md-6">',
                        '						<address>',
                        '							<strong>MIEICBooks</strong>',
                        '							<br>',
                        '							Rua Dr. Roberto Frias S/N',
                        '							<br>',
                        '							4200-465 Porto, Portugal',
                        '							<br>',
                        '							<abbr title="Phone">P:</abbr> +351 22 508 14 00',
                        '							<br>',
                        '							<br>',
                        '							<strong>Client name:</strong> ' + $scope.user.name,
                        '							<br>',
                        '							<strong>Client address:</strong> ' + $scope.user.address,
                        '							<br>',
                        '						</address>',
                        '					</div>',
                        '					<div class="col-xs-6 col-sm-6 col-md-6 text-right">',
                        '						<p>',
                        '							<em>'+ date +'</em>',
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
                        '							<td class="col-md-9"><em>' + $scope.title +'</em></h4></td>',
                        '							<td class="col-md-1" style="text-align: center">' + $scope.quantity +'</td>',
                        '							<td class="col-md-1 text-center">' + $scope.price/$scope.quantity +'</td>',
                        '							<td class="col-md-1 text-center">' + $scope.price +'</td>',
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
                        '							<td class="text-center text-danger"><h4><strong>' + $scope.price +'</strong></h4></td>',
                        '						</tr>',
                        '					</tbody>',
                        '				</table>',
                        '			</div>',
                        '		</div>',
                        '	</div>',
                        '</div>',
                        '</body>'
                    ].join('');
                    console.log("pop up");
                    receiptWindow.document.write(html);
                }
                location.reload();
            }).
            error(function (data, status, headers, config) {
            });
    };

}]);

