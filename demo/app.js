'use strict';

var app = angular.module('demoApp', ['angularChart', 'json-tree']);

app.controller('Controller', function ($scope) {
  $scope.dataset = window.dataset;
  $scope.options1 = {
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
  $scope.options2 = {
    rows: [{
      name: 'income'
    }, {
      name: 'sales'
    }],
    type: 'pie',
    xAxis: {
      name: 'dayString',
      // displayFormat: '%Y-%m-%d %H:%M:%S'
    },
    yAxis: {
    }
  };
});