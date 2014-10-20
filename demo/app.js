'use strict';

angular.module('angular-chart-demo', ['angularChart', 'ui.ace'])

.controller('Controller', function ($scope, $filter, $timeout) {

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
  $scope.showInfo = false;
  $scope.timout = null;
  $scope.dataObject = {};
  $scope.dataName = '';

  $scope.loadOptions = function (options) {
    $scope.optionsObject = options;
    $scope.showInfo = true;

    $timeout.cancel($scope.timeout);
    // hide info again
    $scope.timeout = $timeout(function () {
      $scope.showInfo = false;
    }, 4000);
  };

  $scope.loadData = function (data) {
    $scope.dataName = data.name;
    $scope.dataObject = data.data;
    $scope.schemaObject = data.schema;
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

  syncObjectWithString('dataObject', 'dataString');

  $scope.$watch('optionsObject.options', function (json) {
    $scope.optionsObject.string = $filter('json')(json);
  }, true);

  $scope.$watch('optionsObject.string', function (json) {
    try {
      $scope.optionsObject.options = JSON.parse(json);
      $scope.wellFormed = true;
    } catch (e) {
      $scope.wellFormed = false;
    }
  }, true);


  $scope.loadData($scope.dataArray[0]);
  $scope.loadOptions($scope.optionsArray[0]);
});