'use strict';
var app = angular.module('app', []);

app.controller('StockController', ['$scope', '$http', function ($scope, $http) {

    $scope.orders = {};
    $scope.user = {};

    var updateLists = function () {
        if ($scope.user.email == "admin@a.a") {
            $http.get('/data/stockList').
                success(function (data, status, headers, config) {
                    console.log(data);
                    $scope.orders = data;
                }).
                error(function (data, status, headers, config) {
                    console.log(data);
                });
        } else {
            console.log($scope.user.email);
            $http.post('/data/orderList', {email: $scope.user.email}).
                success(function (data, status, headers, config) {
                    $scope.orders = data;
                    console.log($scope.orders);
                }).
                error(function (data, status, headers, config) {
                    console.log(data);
                });
        }
    };

    $http.get('/user/data').
        success(function (data, status, headers, config) {
            $scope.user = data;
            updateLists();
        }).
        error(function (data, status, headers, config) {

        });

    //updateLists();

    $scope.updateOrder = function(ISBN, stock) {
        $http.post('/update/stock', {ISBN: ISBN, quantity: stock}).
            success(function(data, status, headers, config) {
                console.log(data);
                updateLists();
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
    };
}]);

