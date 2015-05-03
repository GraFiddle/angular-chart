(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;
  var c3 = window.c3 ? window.c3 : 'undefined' !== typeof require ? require('c3') : undefined;

  function angularChartService($timeout, angularChartWatcher, angularChartConverter) {
    var chart;
    var baseConfiguration;
    var configuration;
    var options;

    var service = {
      init: init,
      destroyChart: destroyChart
    };

    return service;

    ////////////

    function init(baseConfig, optionsReference) {
      baseConfiguration = baseConfig;
      options = optionsReference;
      updateCallback();

      // register callbacks after first digest cycle
      $timeout(function () {
        angularChartWatcher.registerChartCallback(updateCallback);
        angularChartWatcher.registerDataCallback(updateCallback);
      });
    }

    function updateCallback() {
      configuration = baseConfiguration;
      angularChartConverter.convertData(options, configuration);
      angularChartConverter.convertDimensions(options, configuration);
      angularChartConverter.convertSchema(options, configuration);
      applyChartOptions();
      generateChart();
    }

    function applyChartOptions() {
      // TODO replace with angular 1.4.0 angular.merge for deep copy
      angular.extend(
        configuration,
        options.chart
      );
    }

    function generateChart() {
      console.log('draw', configuration);
      window.onresize = null;
      chart = c3.generate(configuration);
    }

    function destroyChart() {
      if (angular.isObject(chart) && angular.isFunction(chart.destroy)) {
        chart.destroy();
      }
    }

  }

  angular
    .module('angularChart')
    .service('angularChartService', angularChartService);

})();



