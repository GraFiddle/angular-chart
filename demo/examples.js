'use strict';

angular.module('angular-chart-demo', ['angularChart', 'ui.ace'])

.controller('ExamplesController', function($scope, $filter, $timeout, $location) {

  $scope.exampleCategories = window.exampleCategories;
  $scope.params = $location.search();
  if ($scope.params.category) {
    $scope.selectedCategory = $scope.exampleCategories[$scope.params.category];
  }

  // auto select first example
  $scope.$watch('selectedCategory', function(newObject, oldObject) {
    var selected = false;
    if (!newObject) {
      angular.forEach($scope.exampleCategories, function(value, key) {
        if (!selected) {
          $scope.selectedCategory = value;
          newObject = value;
          selected = true;
        }
      });
    }
    selected = false;

    // update URL
    $scope.params.category = newObject.slug;
    $location.search($scope.params);

    // does URL specify example?
    if ($scope.params.example && $scope.params.example in $scope.selectedCategory.examples) {
      $scope.selectedExample = $scope.selectedCategory.examples[$scope.params.example];
      selected = true;
    }

    // choose default example
    angular.forEach(newObject.examples, function(value, key) {
      if (!selected) {
        $scope.selectedExample = value;
        selected = true;
      }
    });
  });

  // update URL
  $scope.$watch('selectedExample', function(newObject, oldObject) {
    // update URL
    $scope.params.example = newObject.slug;
    $location.search($scope.params);

    $scope.optionsObject = newObject;
    $scope.showInfo = true;

    // hide info after timeout again
    $timeout.cancel($scope.timeout);
    $scope.timeout = $timeout(function () {
      $scope.showInfo = false;
    }, 4000);
  });

  // define code highlighting
  $scope.optionsAceConfig = {
    mode: 'json',
    useWrapMode: false,
    onLoad: function(_editor) {
      _editor.setShowPrintMargin(false);
    }
  };

  $scope.dataArray = window.dataArray;

  $scope.optionsObject = {};
  $scope.showInfo = false;
  $scope.timout = null;
  $scope.dataObject = {};
  $scope.dataName = '';

  $scope.loadData = function(data) {
    $scope.dataName = data.name;
    $scope.dataObject = data.data;
    $scope.schemaObject = data.schema;
  };


  // keep string representation in sync with object
  var syncObjectWithString = function(object, string) {
    $scope.$watch(object, function(json) {
      $scope[string] = $filter('json')(json);
    }, true);

    $scope.$watch(string, function(json) {
      try {
        $scope[object] = JSON.parse(json);
        $scope.wellFormed = true;
      } catch (e) {
        $scope.wellFormed = false;
      }
    }, true);
  };

  syncObjectWithString('dataObject', 'dataString');

  $scope.$watch('optionsObject.options', function(json) {
    $scope.optionsObject.string = $filter('json')(json);
  }, true);

  $scope.$watch('optionsObject.string', function(json) {
    try {
      $scope.optionsObject.options = JSON.parse(json);
      $scope.wellFormed = true;
    } catch (e) {
      $scope.wellFormed = false;
    }
  }, true);


  $scope.loadData($scope.dataArray[0]);
});
