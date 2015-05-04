(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;
  var c3 = window.c3 ? window.c3 : 'undefined' !== typeof require ? require('c3') : undefined;

  function AngularChartService($timeout, AngularChartWatcher, AngularChartConverter, AngularChartState) {
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
        AngularChartWatcher.registerChartCallback(updateCallback);
        AngularChartWatcher.registerDataCallback(updateCallback);
        AngularChartWatcher.registerStateCallback(stateCallback);
      });
    }

    function updateCallback() {
      configuration = baseConfiguration;
      AngularChartConverter.convertData(options, configuration);
      AngularChartConverter.convertDimensions(options, configuration);
      AngularChartConverter.convertSchema(options, configuration);
      applyChartOptions();
      AngularChartState.synchronizeZoom(options, configuration);
      AngularChartState.synchronizeSelection(options, configuration);
      generateChart();
      stateCallback();
    }

    function stateCallback() {
      AngularChartState.applyZoom(options, chart);
      AngularChartState.applySelection(options, chart);
    }

    function applyChartOptions() {
      angular.merge(
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
    .service('AngularChartService', AngularChartService);

})();



