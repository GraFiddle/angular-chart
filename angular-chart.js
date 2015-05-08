(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  var angularChart = angular.module('angularChart', []);

  angularChart.directive('angularChart', angularChartDirective);

  function angularChartDirective() {
    return {
      restrict: 'EA',
      scope: {
        options: '='
      },
      controller: 'AngularChartController'
    };
  }

  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define('angularChart', ['c3', 'angular'], angularChart);
  } else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
    module.exports = angularChart;
  }

})();

(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  function AngularChartWatcher() {
    var $scope;

    // callbacks
    var chartCallback;
    var stateCallback;
    var dataCallback;

    // watcher
    var dataSmallWatcher;
    var dataBigWatcher;

    // disable
    var disableStateWatcher = false;

    var service = {
      init: init,
      registerChartCallback: registerChartCallback,
      registerStateCallback: registerStateCallback,
      registerDataCallback: registerDataCallback,
      updateState: updateState,
      applyFunction: applyFunction
    };

    return service;

    ////////////

    function init(scope) {
      $scope = scope;
      setupChartWatcher();
      setupStateWatcher();
      setupWatchLimitWatcher();
      setupDataWatcher();
    }

    ////
    // SETUP
    ////

    function setupChartWatcher() {
      $scope.$watch('options.chart', function () {
        if (chartCallback) {
          chartCallback();
        }
      }, true);
    }

    function setupStateWatcher() {
      $scope.$watch('options.state', function () {
        if (!disableStateWatcher && stateCallback) {
          stateCallback();
        }
      }, true);
    }

    function setupWatchLimitWatcher() {
      $scope.$watch('options.chart.data.watchLimit', function () {
        setupDataWatcher();
      });
    }

    function setupDataWatcher() {
      // variables
      var limit = (angular.isObject($scope.options) && angular.isObject($scope.options.chart) && $scope.options.chart.data && angular.isNumber($scope.options.chart.data.watchLimit)) ? $scope.options.chart.data.watchLimit : 100;
      var numberOfDataRecords = 0;
      if (angular.isObject($scope.options) && angular.isArray($scope.options.data)) {
        numberOfDataRecords = $scope.options.data.length;
      }

      // choose watcher
      if (numberOfDataRecords < limit) {
        // start small watcher
        if (!dataSmallWatcher) {
          dataSmallWatcher = setupDataSmallWatcher();
        }
        // stop big watcher
        if (dataBigWatcher) {
          dataBigWatcher();
          dataBigWatcher = undefined;
        }
      } else {
        // start big watcher
        if (!dataBigWatcher) {
          dataBigWatcher = setupDataBigWatcher();
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
    function setupDataSmallWatcher() {
      return $scope.$watch('options.data', function (newValue, oldValue) {
        if (dataCallback) {
          dataCallback();
        }
        setupDataWatcher();
      }, true);
    }

    /**
     * start watcher changes in big datasets, compares length of records
     */
    function setupDataBigWatcher() {
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
        setupDataWatcher();
      });
    }

    ////
    // REGISTER
    ////

    function registerChartCallback(callback) {
      chartCallback = callback;
    }

    function registerStateCallback(callback) {
      stateCallback = callback;
    }

    function registerDataCallback(callback) {
      dataCallback = callback;
    }


    ////
    // $apply
    ////

    function updateState(func) {
      disableStateWatcher = true;
      $scope.$apply(func);
      disableStateWatcher = false;
    }

    function applyFunction(func) {
      $scope.$apply(func);
    }

  }

  angular
    .module('angularChart')
    .service('AngularChartWatcher', AngularChartWatcher);

})();

(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  function AngularChartState(AngularChartWatcher) {
    var service = {
      disableSelectionListener: false,
      synchronizeZoom: synchronizeZoom,
      applyZoom: applyZoom,
      synchronizeSelection: synchronizeSelection,
      applySelection: applySelection
    };

    return service;

    ////////////

    /**
     * Apply earlier zoom
     */
    function applyZoom(options, chart) {
      if ((angular.isObject(options.chart) && angular.isObject(options.chart.zoom) && options.chart.zoom.enabled === true) ||
        (angular.isObject(options.chart) && angular.isObject(options.chart.subchart) && options.chart.subchart.show === true)) {

        if (angular.isObject(options.state) && angular.isObject(options.state.zoom) && angular.isArray(options.state.zoom.range)) {
          chart.zoom(options.state.zoom.range);
        } else {
          chart.unzoom();
        }

      }
    }

    /**
     * Create nested options objects.
     */
    function createZoomRangePath(options) {
      if (!angular.isObject(options.state)) {
        options.state = {};
      }
      if (!angular.isObject(options.state.range)) {
        options.state.range = [];
      }
    }

    /**
     * Setup zoom event listeners which update the state
     */
    function synchronizeZoom(options, configuration) {
      if (angular.isObject(options.chart) && angular.isObject(options.chart.zoom) && options.chart.zoom.enabled === true) {

        // setup onzoomend listener
        configuration.zoom.onzoomend = function (domain) {

          // update state
          AngularChartWatcher.updateState(function () {
            createZoomRangePath(options);
            options.state.range = domain;
          });

          // call user defined callback
          if (angular.isFunction(options.chart.zoom.onzoomend)) {
            AngularChartWatcher.applyFunction(function () {
              options.chart.zoom.onzoomend(domain);
            });
          }
        };
      }

      if (angular.isObject(options.chart) && angular.isObject(options.chart.subchart) && options.chart.subchart.show === true) {
        // setup onbrush listener
        configuration.subchart.onbrush = function (domain) {

          // update state
          AngularChartWatcher.updateState(function () {
            createZoomRangePath(options);
            options.state.range = domain;
          });

          // call user defined callback
          if (angular.isFunction(options.chart.subchart.onbrush)) {
            AngularChartWatcher.applyFunction(function () {
              options.chart.subchart.onbrush(domain);
            });
          }
        };
      }
    }

    /**
     * Add passed selection to the chart.
     */
    function addSelections(chart, selections) {
      service.disableSelectionListener = true;
      selections.forEach(function (selection) {
        chart.select([selection.id], [selection.index]);
      });
      service.disableSelectionListener = false;
    }

    /**
     * Remove passed selections from the chart.
     */
    //function removeSelections(chart, selections) {
    //  disableSelectionListener = true;
    //  selections.forEach(function (selection) {
    //    chart.unselect([selection.id], [selection.index]);
    //  });
    //  disableSelectionListener = false;
    //}

    /**
     * Remove all selections present in the chart.
     */
    function removeAllSelections(chart) {
      service.disableSelectionListener = true;
      chart.unselect();
      service.disableSelectionListener = false;
    }

    /**
     * Apply earlier selections.
     */
    function applySelection(options, chart) {
      if (angular.isObject(options.chart) && angular.isObject(options.chart.data) && angular.isObject(options.chart.data.selection) && options.chart.data.selection.enabled === true) {

        if (angular.isObject(options.state) && angular.isArray(options.state.selected)) {
          // TODO: get new selections
          // TODO: get removed selections
          // var chartSelections = chart.selected();
          //    // addedSelections
          //    var addedSelections = newSelections.filter(function (elm) {
          //      var isNew = true;
          //      oldSelections.forEach(function (old) {
          //        if (old.id === elm.id && old.index === elm.index) {
          //          isNew = false;
          //          return isNew;
          //        }
          //      });
          //      return isNew;
          //    });
          //
          //    // removedSelections
          //    var removedSelections = oldSelections.filter(function (elm) {
          //      var isOld = true;
          //      newSelections.forEach(function (old) {
          //        if (old.id === elm.id && old.index === elm.index) {
          //          isOld = false;
          //          return isOld;
          //        }
          //      });
          //      return isOld;
          //    });

          // alternative: deselect all and select again
          //removeAllSelections(chart);
          addSelections(chart, options.state.selected);

        } else {
          removeAllSelections(chart);
        }
      }
    }

    /**
     * Create nested options object.
     */
    function createSelectionsPath(options) {
      if (!angular.isObject(options.state)) {
        options.state = {};
      }
      if (!angular.isArray(options.state.selected)) {
        options.state.selected = [];
      }
    }

    /**
     * Listen to chart events to save selections into to state object.
     */
    function synchronizeSelection(options, configuration) {
      if (angular.isObject(options.chart) && angular.isObject(options.chart.data) && angular.isObject(options.chart.data.selection) && options.chart.data.selection.enabled === true) {

        // add onselected listener
        configuration.data.onselected = function (data, element) {

          // check if listener is disabled currently
          if (service.disableSelectionListener) {
            return;
          }

          // update state
          AngularChartWatcher.updateState(function () {
            createSelectionsPath(options);
            options.state.selected.push(data);
          });

          // call user defined callback
          if (angular.isFunction(options.chart.data.onselected)) {
            AngularChartWatcher.applyFunction(function () {
              options.chart.data.onselected(data, element);
            });
          }

        };

        // add onunselection listener
        configuration.data.onunselected = function (data, element) {

          // check if listener is disabled currently
          if (service.disableSelectionListener) {
            return;
          }

          // update state
          AngularChartWatcher.updateState(function () {
            createSelectionsPath(options);
            options.state.selected = options.state.selected.filter(function (selected) {
              return selected.id !== data.id || selected.index !== data.index;
            });
          });

          // call user defined callback
          if (angular.isFunction(options.chart.data.onunselected)) {
            AngularChartWatcher.applyFunction(function () {
              options.chart.data.onunselected(data, element);
            });
          }

        };

      }
    }

  }
  AngularChartState.$inject = ['AngularChartWatcher'];

  angular
    .module('angularChart')
    .service('AngularChartState', AngularChartState);

})();


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
    var options = {};

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
      $timeout(registerCallbacks);
    }

    /**
     * Register callbacks for the watchers.
     */
    function registerCallbacks() {
      // updateCallback()
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
      convertOptions();
      applyChartOptions();
      synchronizeState();
      generateChart();
      stateCallback();
    }

    /**
     * Convert the angular-chart specific options into a c3-configuration.
     */
    function convertOptions() {
      AngularChartConverter.convertData(options, configuration);
      AngularChartConverter.convertDimensions(options, configuration);
      AngularChartConverter.convertSchema(options, configuration);
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
  AngularChartService.$inject = ['$timeout', 'AngularChartWatcher', 'AngularChartConverter', 'AngularChartState'];

  angular
    .module('angularChart')
    .service('AngularChartService', AngularChartService);

})();




(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  function AngularChartConverter() {

    var service = {
      convertData: convertData,
      convertDimensions: convertDimensions,
      convertSchema: convertSchema
    };

    return service;

    ////////////

    function convertData(options, configuration) {
      if (options.data) {
        // TODO support different data formats
        configuration.data.json = options.data;
      }
    }

    function convertDimensions(options, configuration) {
      if (!angular.isObject(options.dimensions)) {
        return;
      }

      // only show used axes
      configuration.axis.y.show = false;


      // apply all dimensions
      angular.forEach(options.dimensions, function(dimension, key) {
        // TODO only when JSON (array of objects) data
        // set dimensions to show
        if (!angular.isDefined(dimension.show) || dimension.show) {
          configuration.data.keys.value.push(key);
        }

        // set name
        if (angular.isString(dimension.name)) {
          configuration.data.names[key] = dimension.name;
        }

        // set type
        if (angular.isDefined(dimension.type)) {
          configuration.data.types[key] = dimension.type;
        }

        // set color
        if (angular.isString(dimension.color)) {
          configuration.data.colors[key] = dimension.color;
        }

        // axis
        if (dimension.axis === 'y2') {
          configuration.data.axes[key] = 'y2';
          configuration.axis.y2.show = true;
        } else if (dimension.axis !== 'x') {
          configuration.axis.y.show = true;
        }

        // label
        if (dimension.label === true) {
          if (angular.isDefined(dimension.displayFormat)) {
            configuration.data.labels.format[key] = dimension.displayFormat;
          } else {
            configuration.data.labels.format[key] = true;
          }
        }

        // TODO configure http://c3js.org/samples/axes_y_tick_format.html
        // TODO configure http://c3js.org/samples/tooltip_format.html


        // x-Axis
        if (dimension.axis === 'x') {
          configuration.data.keys.x = key;
          configuration.data.x = key;

          if (angular.isDefined(dimension.displayFormat)) {
            configuration.axis.x.tick.format = dimension.displayFormat;
          }
        }

      });
    }

    function convertSchema(options, configuration) {
      // TODO configure
      //  else if (angular.isObject(options.schema) && angular.isObject(options.schema[key]) && angular.isString(options.schema[key].name)) {
      //    configuration.data.names[key] = options.schema[key].name;
      //  }
      //
      //  else if (angular.isObject(options.schema) && angular.isObject(options.schema[key]) && angular.isString(options.schema[key].color)) {
      //    configuration.data.colors[key] = options.schema[key].color;
      //  }

      // TODO apply pre/postfixes
      //if (dimension.type === 'datetime') {
      //  configuration.axis.x.type = 'timeseries';
      //  if (dimension.dataFormat) {
      //    configuration.data.xFormat = dimension.dataFormat;
      //  } else {
      //    configuration.data.xFormat = '%Y-%m-%dT%H:%M:%S'; // default
      //    // TODO brute force (and check) right format
      //  }
      //} else if (dimension.type === 'numeric') {
      //  configuration.axis.x.type = 'numeric';
      //} else {
      //  // TODO check for optimal type if nothing was provided
      //}
    }

  }

  angular
    .module('angularChart')
    .service('AngularChartConverter', AngularChartConverter);

})();




(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  function AngularChartController($scope, $element, baseConfiguration, AngularChartWatcher, AngularChartService) {
    var configuration = baseConfiguration;

    activate();

    ////////////

    function activate() {
      addIdentifier();
      AngularChartWatcher.init($scope);
      AngularChartService.init(configuration, $scope.options);
      registerDestroyListener();
    }

    // add unique identifier for each chart
    //
    function addIdentifier() {
      $scope.dataAttributeChartID = 'chartid' + Math.floor(Math.random() * 1000000001);
      angular.element($element).attr('id', $scope.dataAttributeChartID);
      baseConfiguration.bindto = '#' + $scope.dataAttributeChartID;
    }

    // remove all references when directive is destroyed
    //
    function registerDestroyListener() {
      $scope.$on('$destroy', function () {
        AngularChartService.destroyChart();
        $element.remove();
      });
    }

  }
  AngularChartController.$inject = ['$scope', '$element', 'baseConfiguration', 'AngularChartWatcher', 'AngularChartService'];

  angular
    .module('angularChart')
    .controller('AngularChartController', AngularChartController);

})();

(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  var baseConfiguration = {
    data: {
      keys: {
        value: []
      },
      names: {},
      types: {},
      colors: {},
      axes: {},
      labels: {
        format: {}
      }
    },
    axis: {
      y: {
        show: true
      },
      y2: {},
      x: {
        tick: {}
      }
    },
    zoom: {},
    subchart: {}
  };

  angular
    .module('angularChart')
    .value('baseConfiguration', baseConfiguration);

})();



