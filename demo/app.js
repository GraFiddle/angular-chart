'use strict';

var app = angular.module('demoApp', ['angularChart', 'json-tree']);

app.controller('Controller', function ($scope) {
  $scope.dataset = window.dataset;
  $scope.options = {
    rows: [{
      name: 'income',
      type: 'bar'
    }, {
      name: 'sales'
    }],
    xAxis: {
      name: 'dayString',
      // displayFormat: '%Y-%m-%d %H:%M:%S'
    },
    yAxis: {
    }
  };
});