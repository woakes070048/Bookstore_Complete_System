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
    $http.get('/data/books', {email: $scope.email, password: $scope.password}).
        success(function (data, status, headers, config) {
            $scope.books = data;


            /*$( '#table' ).searchable({
             selector: 'tbody tr',
             searchField   : '#search',
             striped: true,
             oddRow: { 'background-color': '#f5f5f5' },
             evenRow: { 'background-color': '#fff' },
             searchType: 'fuzzy'
             });*/
        }).
        error(function (data, status, headers, config) {

        });

    $http.get('/user/data').
        success(function (data, status, headers, config) {
            $scope.user = data;
            console.log($scope.user);
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
        console.log($scope.total);
    };

    $scope.placeOrder = function () {
        $http.post("/placeorder", {name: $scope.name , address: $scope.address , email: $scope.email ,
            title: $scope.title , ISBN: $scope.ISBN , price: $scope.price , quantity: $scope.quantity}).
            success(function (data, status, headers, config){
                console.log(data);
            }).
            error(function (data, status, headers, config) {
                console.log(data);
            });
    };

}]);

