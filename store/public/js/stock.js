'use strict';
var app = angular.module('app', []);

app.controller('StockController', ['$scope', '$http', function ($scope, $http) {

    $scope.orders = {};

    var updateLists = function () {
        $http.get('/data/stockList').
            success(function (data, status, headers, config) {
                console.log(data);
                $scope.orders = data;
            }).
            error(function (data, status, headers, config) {
                console.log(data);
            });

    };

    updateLists();

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

