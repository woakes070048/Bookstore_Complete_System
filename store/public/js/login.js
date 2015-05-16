'use strict';
var app = angular.module('app',[]);

app.controller('LoginController', ['$scope', '$http', function($scope, $http) {
    $scope.username = "";
    $scope.password = "";
    $scope.signIn = function () {
        console.log($scope.username);
        console.log($scope.password);

        $http.post('/login', {username: $scope.username, password: $scope.password}).
            success(function (data, status, headers, config) {
            console.log("pintou");
                console.log(data);
        }).
        error(function (data, status, headers, config) {
            console.log("merdou");
        });
    }
}]);