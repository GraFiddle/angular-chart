(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  function AngularChartWatcher() {

    var service = {
      init: init,
      updateState: updateState,
      applyFunction: applyFunction
    };

    return service;

    ////////////

    function init(scope) {
      var watcher = {
        scope: scope,
        dimensionsCallback: null,
        dimensionsTypeCallback: null,
        chartCallback: null,
        stateCallback: null,
        dataCallback: null,
        dataSmallWatcher: null,
        dataBigWatcher: null,
        disableStateWatcher: false
      };

      setupDimensionsWatcher(watcher);
      setupDimensionsTypeWatcher(watcher);
      setupChartWatcher(watcher);
      setupStateWatcher(watcher);
      setupWatchLimitWatcher(watcher);
      setupDataWatcher(watcher);

      return watcher;
    }

    ////
    // SETUP
    ////

    function setupDimensionsWatcher(watcher) {
      watcher.scope.$watch(function () {
        var check = watcher.scope.options && watcher.scope.options.dimensions;

        // remove types from copy to check only other changes
        if (angular.isObject(check)) {
          check = angular.copy(check);
          angular.forEach(check, function (dimension) {
            if (dimension.type) {
              delete dimension.type;
            }
          });
        }

        return check;
      }, function () {
        if (angular.isFunction(watcher.dimensionsCallback)) {
          watcher.dimensionsCallback();
        }
      }, true);
    }

    function setupDimensionsTypeWatcher(watcher) {
      watcher.scope.$watch(function () {
        var check = {};

        // extract only dimension types
        if (watcher.scope.options && watcher.scope.options.dimensions) {
          angular.forEach(watcher.scope.options.dimensions, function (dimension, key) {
            check[key] = dimension.type;
          });
        }

        return check;
      }, function () {
        if (angular.isFunction(watcher.dimensionsTypeCallback)) {
          watcher.dimensionsTypeCallback();
        }
      }, true);
    }

    function setupChartWatcher(watcher) {
      watcher.scope.$watch('options.chart', function () {
        if (watcher.chartCallback) {
          watcher.chartCallback();
        }
      }, true);
    }

    function setupStateWatcher(watcher) {
      watcher.scope.$watch('options.state', function () {
        if (!watcher.disableStateWatcher && angular.isFunction(watcher.stateCallback)) {
          watcher.stateCallback();
        }
      }, true);
    }

    function setupWatchLimitWatcher(watcher) {
      watcher.scope.$watch('options.chart.data.watchLimit', function () {
        setupDataWatcher(watcher);
      });
    }

    function setupDataWatcher(watcher) {
      // variables
      var limit = (angular.isObject(watcher.scope.options) && angular.isObject(watcher.scope.options.chart) && watcher.scope.options.chart.data && angular.isNumber(watcher.scope.options.chart.data.watchLimit)) ? watcher.scope.options.chart.data.watchLimit : 100;
      var numberOfDataRecords = 0;
      if (angular.isObject(watcher.scope.options) && angular.isArray(watcher.scope.options.data)) {
        numberOfDataRecords = watcher.scope.options.data.length;
      }

      // choose watcher
      if (numberOfDataRecords < limit) {
        // start small watcher
        if (!watcher.dataSmallWatcher) {
          watcher.dataSmallWatcher = setupDataSmallWatcher(watcher);
        }
        // stop big watcher
        if (watcher.dataBigWatcher) {
          watcher.dataBigWatcher();
          watcher.dataBigWatcher = undefined;
        }
      } else {
        // start big watcher
        if (!watcher.dataBigWatcher) {
          watcher.dataBigWatcher = setupDataBigWatcher(watcher);
        }
        // stop small watcher
        if (watcher.dataSmallWatcher) {
          watcher.dataSmallWatcher();
          watcher.dataSmallWatcher = undefined;
        }
      }
    }

    /**
     * start watcher changes in small datasets, compares whole object
     */
    function setupDataSmallWatcher(watcher) {
      return watcher.scope.$watch('options.data', function () {
        if (angular.isFunction(watcher.dataCallback)) {
          watcher.dataCallback();
        }
        setupDataWatcher(watcher);
      }, true);
    }

    /**
     * start watcher changes in big datasets, compares length of records
     */
    function setupDataBigWatcher(watcher) {
      return watcher.scope.$watch(function () {
        if (watcher.scope.options.data && angular.isArray(watcher.scope.options.data)) {
          return watcher.scope.options.data.length;
        } else {
          return 0;
        }
      }, function () {
        if (angular.isFunction(watcher.dataCallback)) {
          watcher.dataCallback();
        }
        setupDataWatcher(watcher);
      });
    }

    ////
    // $apply
    ////

    function updateState(watcher, func) {
      watcher.disableStateWatcher = true;
      watcher.scope.$apply(func);
      watcher.disableStateWatcher = false;
    }

    function applyFunction(watcher, func) {
      watcher.scope.$apply(func);
    }

  }

  angular
    .module('angularChart')
    .service('AngularChartWatcher', AngularChartWatcher);

})();
