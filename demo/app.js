'use strict';

var app = angular.module('demoApp', ['angularChart', 'json-tree']);

app.controller('Controller', function ($scope) {
  $scope.dataset = window.dataset;
  $scope.options = {};
});