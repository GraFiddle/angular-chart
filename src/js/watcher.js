(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  function angularChartWatcher() {
    var chartCallback;

    var service = {
      init: init,
      registerChartCallback: registerChartCallback
    };

    return service;

    ////////////

    function init($scope) {
      setupChartWatcher($scope);
    }

    function setupChartWatcher($scope) {
        $scope.$watch('options.chart', function (newValue, oldValue) {
          if (chartCallback) {
            chartCallback();
          }
        }, true);
    }

    function registerChartCallback(callback) {
      chartCallback = callback;
    }

  }

  angular
    .module('angularChart')
    .service('angularChartWatcher', angularChartWatcher);

})();
