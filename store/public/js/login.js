'use strict';
var app = angular.module('app', []);

app.controller('LoginController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    $scope.email = "";
    $scope.password = "";
    $scope.signIn = function () {
        $http.post('/login', {email: $scope.email, password: $scope.password}).
            success(function (data, status, headers, config) {
                $window.location.href = '/order';
            }).
            error(function (data, status, headers, config) {
                console.log(data);
            });
    }
}]);

app.controller('RegisterController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    $scope.email = "";
    $scope.password = "";
    $scope.name = "";
    $scope.address = "";
    $scope.register = function () {
        $http.post('/register', {
            email: $scope.email,
            password: $scope.password,
            address: $scope.address,
            name: $scope.name
        }).
            success(function (data, status, headers, config) {
                $window.location.href = '/order';
            }).
            error(function (data, status, headers, config) {
            });
    }
}]);