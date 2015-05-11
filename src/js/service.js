(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;
  /* istanbul ignore next */
  var c3 = window.c3 ? window.c3 : 'undefined' !== typeof require ? require('c3') : undefined;

  function AngularChartService($timeout, AngularChartWatcher, AngularChartConverter, AngularChartState) {
    var chart = null;
    var baseConfiguration = {};
    var configuration = {};
    var scopeReference = null;
    var options = {};

    var service = {
      init: init,
      destroyChart: destroyChart
    };

    return service;

    ////////////

    function init(baseConfig, scope) {
      baseConfiguration = baseConfig;
      scopeReference = scope;
      updateCallback();

      // register callbacks after first digest cycle
      $timeout(registerCallbacks);
    }

    /**
     * Register callbacks for the watchers.
     */
    function registerCallbacks() {
      // updateCallback()
      AngularChartWatcher.registerDimensionsCallback(updateCallback);
      AngularChartWatcher.registerChartCallback(updateCallback);
      AngularChartWatcher.registerDataCallback(updateCallback);

      // stateCallback()
      AngularChartWatcher.registerStateCallback(stateCallback);
    }

    /**
     * Update the configuration and render the chart.
     */
    function updateCallback() {
      configuration = baseConfiguration;
      buildOptions();
      convertOptions();
      applyChartOptions();
      synchronizeState();
      generateChart();
      stateCallback();
    }

    /**
     * Build options based on the values provided from scope.
     */
    function buildOptions() {
      options = angular.isObject(scopeReference.options) ? scopeReference.options : {};
    }

    /**
     * Convert the angular-chart specific options into a c3-configuration.
     */
    function convertOptions() {
      AngularChartConverter.convertData(options, configuration);
      AngularChartConverter.convertDimensions(options, configuration);
    }

    /**
     * Use the user defined chart configuration to extend and/or overwrite
     * the automatic set configuration.
     */
    function applyChartOptions() {
      angular.merge(
        configuration,
        options.chart
      );
    }

    /**
     * Setup the synchronize from c3 events into the options.
     */
    function synchronizeState() {
      AngularChartState.synchronizeZoom(options, configuration);
      AngularChartState.synchronizeSelection(options, configuration);
    }

    /**
     * Render the chart.
     */
    function generateChart() {
      window.onresize = null;
      // TODO add own onresize listener
      // TODO regenerate chart only one or two times per second
      // TODO evaluate if it makes sense to destroy the chart first
      chart = c3.generate(configuration);
    }

    /**
     * Apply state options on the chart.
     */
    function stateCallback() {
      AngularChartState.applyZoom(options, chart);
      AngularChartState.applySelection(options, chart);
    }

    /**
     * Destroy the chart if one ist present.
     */
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



