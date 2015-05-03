(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  function angularChartWatcher() {
    // callbacks
    var chartCallback;
    var dataCallback;

    // watcher
    var dataSmallWatcher;
    var dataBigWatcher;

    var service = {
      init: init,
      registerChartCallback: registerChartCallback,
      registerDataCallback: registerDataCallback
    };

    return service;

    ////////////

    function init($scope) {
      setupChartWatcher($scope);
      setupDataWatcher($scope);
    }

    ////
    // SETUP
    ////

    function setupChartWatcher($scope) {
        $scope.$watch('options.chart', function (newValue, oldValue) {
          if (chartCallback) {
            chartCallback();
          }
        }, true);
    }

    function setupDataWatcher($scope) {
      // variables
      var limit = ($scope.options.chart && $scope.options.chart.data && angular.isNumber($scope.options.chart.data.watchLimit)) ? $scope.options.chart.data.watchLimit : 1;
      var numberOfDataRecords = 0;
      if (angular.isArray($scope.options.data)) {
        numberOfDataRecords = $scope.options.data.length;
      }

      // choose watcher
      if (numberOfDataRecords < limit) {
        // start small watcher
        if (!dataSmallWatcher) {
          dataSmallWatcher = setupDataSmallWatcher($scope);
        }
        // stop big watcher
        if (dataBigWatcher) {
          dataBigWatcher();
          dataBigWatcher = undefined;
        }
      } else {
        // start big watcher
        if (!dataBigWatcher) {
          dataBigWatcher = setupDataBigWatcher($scope);
        }
        // stop small watcher
        if (dataSmallWatcher) {
          dataSmallWatcher();
          dataSmallWatcher = undefined;
        }
      }
    }

    /**
     * start watcher changes in small datasets, compares whole object
     */
    function setupDataSmallWatcher($scope) {
      return $scope.$watch('options.data', function (newValue, oldValue) {
        if (dataCallback) {
          dataCallback();
        }
      }, true);
    }

    /**
     * start watcher changes in big datasets, compares length of records
     */
    function setupDataBigWatcher($scope) {
      return $scope.$watch(function () {
        if ($scope.options.data && angular.isArray($scope.options.data)) {
          return $scope.options.data.length;
        } else {
          return 0;
        }
      }, function (newValue, oldValue) {
        if (dataCallback) {
          dataCallback();
        }
      });
    }

    ////
    // REGISTER
    ////

    function registerChartCallback(callback) {
      chartCallback = callback;
    }

    function registerDataCallback(callback) {
      dataCallback = callback;
    }

  }

  angular
    .module('angularChart')
    .service('angularChartWatcher', angularChartWatcher);

})();
