(function() {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;
  /* istanbul ignore next */
  var c3 = window.c3 ? window.c3 : 'undefined' !== typeof require ? require('c3') : undefined;

  function AngularChartService($timeout, $q, AngularChartWatcher, AngularChartConverter, AngularChartState) {

    var ChartService = function(baseConfig, scope) {
      this.deferredChart = $q.defer();
      this.chart = this.deferredChart.promise;
      this.baseConfiguration = {};
      this.configuration = {};
      this.scopeReference = null;
      this.options = {};
      this.watcher = null;

      this.init(baseConfig, scope);
    };

    ChartService.prototype.init = function(baseConfig, scope) {
      this.watcher = AngularChartWatcher.init(scope);
      this.baseConfiguration = baseConfig;
      this.scopeReference = scope;
      this.updateCallback();

      // register callbacks after first digest cycle
      var chartService = this;
      $timeout(function() {
        chartService.registerCallbacks();
      });
    };

    /**
     * Register callbacks for the watchers.
     */
    ChartService.prototype.registerCallbacks = function() {
      var chartService = this;

      // updateCallback(), closure to keep reference to chart service
      this.watcher.dimensionsCallback = function() {
        chartService.updateCallback();
      };
      this.watcher.chartCallback = function() {
        chartService.updateCallback();
      };
      this.watcher.dataCallback = function() {
        chartService.updateCallback();
      };

      // transformCallback(), closure to keep reference to chart service
      this.watcher.dimensionsTypeCallback = function() {
        chartService.transformCallback();
      };

      // stateCallback(), closure to keep reference to chart service
      this.watcher.stateCallback = function() {
        chartService.stateCallback();
      };
    };

    /**
     * Update the configuration and render the chart.
     */
    ChartService.prototype.updateCallback = function() {
      this.configuration = angular.copy(this.baseConfiguration);
      this.buildOptions();
      this.convertOptions();
      this.applyChartOptions();
      this.synchronizeState();

      // call long running generation async
      var chartService = this;
      $timeout(function() {
        chartService.generateChart(chartService);
        chartService.stateCallback();
      });
    };

    /**
     * Pushes type changes using transform to update the chart without a full render.
     */
    ChartService.prototype.transformCallback = function() {
      var chartService = this;
      if (chartService.options && chartService.options.dimensions) {
        angular.forEach(chartService.options.dimensions, function(dimension, key) {
          chartService.chart.transform(dimension.type, key);
        });
      }
    };

    /**
     * Build options based on the values provided from scope.
     */
    ChartService.prototype.buildOptions = function() {
      this.options = angular.isObject(this.scopeReference.options) ? this.scopeReference.options : {};
    };

    /**
     * Convert the angular-chart specific options into a c3-configuration.
     */
    ChartService.prototype.convertOptions = function() {
      AngularChartConverter.convertData(this.options, this.configuration);
      AngularChartConverter.convertDimensions(this.options, this.configuration);
    };

    /**
     * Use the user defined chart configuration to extend and/or overwrite
     * the automatic set configuration.
     */
    ChartService.prototype.applyChartOptions = function() {
      this.merge(
        this.configuration,
        this.options.chart
      );
    };

    /**
     * Setup the synchronize from c3 events into the options.
     */
    ChartService.prototype.synchronizeState = function() {
      AngularChartState.synchronizeZoom(this.options, this.configuration, this.watcher);
      AngularChartState.synchronizeSelection(this.options, this.configuration, this.watcher);
    };

    /**
     * Render the chart.
     */
    ChartService.prototype.generateChart = function(chartService) {
      // TODO add own onresize listener?
      // TODO regenerate chart only one or two times per second
      // TODO evaluate if it makes sense to destroy the chart first

      var chart = c3.generate(chartService.configuration);

      chartService.deferredChart.resolve(chart);
      chartService.scopeReference.instance = chart;
      chartService.chart = chart;

      /*
       Custom event: 'angular-chart-rendered'
       - new chart instance generated
       - { configuration, chart } - data format
       - configuration - the options used to generate the chart
       - chart - the newly created chart instance
       */
      this.scopeReference.$emit('angular-chart-rendered', chartService.configuration, chartService.chart);
    };

    /**
     * Apply state options on the chart.
     */
    ChartService.prototype.stateCallback = function() {
      AngularChartState.applyZoom(this.options, this.chart);
      AngularChartState.applySelection(this.options, this.chart);
    };

    /**
     * Destroy the chart if one ist present.
     */
    ChartService.prototype.destroyChart = function() {
      if (this.chart.destroy) {
        this.chart.destroy();
      }
    };

    ChartService.prototype.merge = angular.merge || deepMerge;

    function deepMerge(target, src) {
      src = src || {};

      Object.keys(src).forEach(function (key) {
        if (!angular.isObject(src[key]) || !src[key]) {
          target[key] = src[key];
        } else {
          if (!target[key]) {
            target[key] = src[key];
          } else {
            target[key] = deepMerge(target[key], src[key]);
          }
        }
      });

      return target;
    }

    return {
      getInstance: function(baseConfig, scope) {
        return new ChartService(baseConfig, scope);
      }
    };
  }

  angular
    .module('angularChart')
    .factory('AngularChartService', AngularChartService);

})();



