'use strict';

var app = angular.module('demoApp', ['angularChart', 'json-tree']);

app.controller('Controller', function ($scope) {
  $scope.dataset = window[window.datasetName];
  $scope.options = window.options;
});