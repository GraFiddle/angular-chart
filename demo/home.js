'use strict';

angular.module('angular-chart-demo', ['angularChart', 'angularCircularNavigation'])

.controller('HomeController', function($scope, $filter, $timeout) {

  $scope.optionsShowcase = {
    rows: [{
      key: 'temp',
      color: '#F37934'
    }, {
      key: 'rain',
      type: 'bar',
      axis: 'y2',
      color: '#2C82C9'
    }, {
      key: 'raindays',
      show: false,
      color: '#553982'
    }],
    xAxis: {
      key: 'month'
    },
    legend: {
      selector: true
    },
    typeSelector: true
  };

  $scope.optionsStateful = {
    rows: [{
      key: 'temp',
      color: '#F37934'
    }, {
      key: 'rain',
      type: 'bar',
      axis: 'y2',
      color: '#2C82C9'
    }],
    xAxis: {
      key: 'month'
    },
    zoom: {
      range: [1, 3]
    },
    subchart: {
      show: true
    }
  };

  $scope.optionsArray = window.optionsArray;
  $scope.exampleCategories = [{
    title: 'First',
    examples: [{
      title: 'One Example',
      description: 'test',
      options: {

      }
    }, {
      title: 'One Example',
      description: 'test',
      options: {

      }
    }]
  }, {
    title: 'Second',
    examples: [{
      title: 'One Example',
      description: 'test',
      options: {

      }
    }, {
      title: 'One Example',
      description: 'test',
      options: {

      }
    }]
  }];

  $scope.schemaObject = window.dataArray[1].schema;
  $scope.dataObject = window.dataArray[1].data;
});