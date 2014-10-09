'use strict';

var app = angular.module('angular-chart-demo', ['angularChart', 'ui.ace']);

app.controller('Controller', function ($scope, $filter) {

  // define code highlighting
  $scope.optionsAceConfig = {
    mode: 'json',
    useWrapMode: false,
    onLoad: function (_editor) {
      _editor.setShowPrintMargin(false);
    }
  };

  $scope.optionsArray = window.optionsArray;
  $scope.dataArray = window.dataArray;

  $scope.optionsObject = {};
  $scope.optionsName = '';
  $scope.dataObject = {};
  $scope.dataName = '';

  $scope.loadOptions = function (options) {
    $scope.optionsName = options.name;
    $scope.optionsObject = options.options;
  };
  $scope.loadData = function (data) {
    $scope.dataName = data.name;
    $scope.dataObject = data.data;
  };


  // keep string representation in sync with object
  var syncObjectWithString = function (object, string) {
    $scope.$watch(object, function (json) {
      $scope[string] = $filter('json')(json);
    }, true);

    $scope.$watch(string, function (json) {
      try {
        $scope[object] = JSON.parse(json);
        $scope.wellFormed = true;
      } catch (e) {
        $scope.wellFormed = false;
      }
    }, true);
  };

  syncObjectWithString('optionsObject', 'optionsString');
  syncObjectWithString('dataObject', 'dataString');

  $scope.loadData($scope.dataArray[0]);
  $scope.loadOptions($scope.optionsArray[0]);
});