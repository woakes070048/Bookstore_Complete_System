'use strict';
var app = angular.module('app', []);

app.controller('OrderTableController', ['$scope', '$http', function ($scope, $http) {
    $scope.books = [];
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

}]);