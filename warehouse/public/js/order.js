'use strict';
var app = angular.module('app', []);

app.controller('OrderTableController', ['$scope', '$http', function ($scope, $http) {
    $scope.processedOrders = {};
    $scope.unprocessedOrders = {};

    $http.get('/data/processedorders').
        success(function (data, status, headers, config) {
            $scope.processedOrders = data;
        }).
        error(function (data, status, headers, config) {
            console.log(data);
        });

    $http.get('/data/unprocessedorders').
        success(function (data, status, headers, config) {
            $scope.unprocessedOrders = data;
        }).
        error(function (data, status, headers, config) {
            console.log(data);
        });

    $scope.sendStock = function (objectID, ISBN, quantity) {
        $http.post('http://localhost:1111/receiveStock', {objectID: objectID, ISBN: ISBN, quantity: quantity}).
            success(function (data, status, headers, config) {
                console.log(data);
            }).
            error(function (data, status, headers, config) {
                console.log(data);
            });
    }
}]);

