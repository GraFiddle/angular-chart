(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  var angularChart = angular.module('angularChart', []);

  // HTML-Tag: <angular-chart>
  angularChart.directive('angularChart', angularChartDirective);
  // HTML-Tag <angularchart>
  angularChart.directive('angularchart', angularChartDirective);

  function angularChartDirective() {
    return {
      restrict: 'EA',
      scope: {
        options: '=',
        instance: '=?'
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

(function () {

  'use strict';

  /* istanbul ignore next */
  AngularChartState.$inject = ['AngularChartWatcher'];
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
      if (angular.isObject(options.state) && angular.isObject(options.state) && angular.isArray(options.state.range)) {
        chart.zoom(options.state.range);
      } else {
        chart.unzoom();
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
    function synchronizeZoom(options, configuration, watcher) {
      if (angular.isObject(options.chart) && angular.isObject(options.chart.zoom) && options.chart.zoom.enabled === true) {

        // setup onzoomend listener
        configuration.zoom.onzoomend = function (domain) {

          // update state
          AngularChartWatcher.updateState(watcher, function () {
            createZoomRangePath(options);
            options.state.range = domain;
          });

          // call user defined callback
          if (angular.isFunction(options.chart.zoom.onzoomend)) {
            AngularChartWatcher.applyFunction(watcher, function () {
              options.chart.zoom.onzoomend(domain);
            });
          }
        };
      }

      if (angular.isObject(options.chart) && angular.isObject(options.chart.subchart) && options.chart.subchart.show === true) {
        // setup onbrush listener
        configuration.subchart.onbrush = function (domain) {

          // update state
          AngularChartWatcher.updateState(watcher, function () {
            createZoomRangePath(options);
            options.state.range = domain;
          });

          // call user defined callback
          if (angular.isFunction(options.chart.subchart.onbrush)) {
            AngularChartWatcher.applyFunction(watcher, function () {
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
    function synchronizeSelection(options, configuration, watcher) {
      if (angular.isObject(options.chart) && angular.isObject(options.chart.data) && angular.isObject(options.chart.data.selection) && options.chart.data.selection.enabled === true) {

        // add onselected listener
        configuration.data.onselected = function (data, element) {

          // check if listener is disabled currently
          if (service.disableSelectionListener) {
            return;
          }

          // update state
          AngularChartWatcher.updateState(watcher, function () {
            createSelectionsPath(options);
            options.state.selected.push(data);
          });

          // call user defined callback
          if (angular.isFunction(options.chart.data.onselected)) {
            AngularChartWatcher.applyFunction(watcher, function () {
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
          AngularChartWatcher.updateState(watcher, function () {
            createSelectionsPath(options);
            options.state.selected = options.state.selected.filter(function (selected) {
              return selected.id !== data.id || selected.index !== data.index;
            });
          });

          // call user defined callback
          if (angular.isFunction(options.chart.data.onunselected)) {
            AngularChartWatcher.applyFunction(watcher, function () {
              options.chart.data.onunselected(data, element);
            });
          }

        };

      }
    }

  }

  angular
    .module('angularChart')
    .service('AngularChartState', AngularChartState);

})();


(function() {

  'use strict';

  /* istanbul ignore next */
  AngularChartService.$inject = ['$timeout', '$q', 'AngularChartWatcher', 'AngularChartConverter', 'AngularChartState'];
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




(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  function AngularChartConverter() {

    var service = {
      convertData: convertData,
      convertDimensions: convertDimensions
    };

    return service;

    ////////////

    function convertData(options, configuration) {
      // TODO support different data formats
      if (angular.isArray(options.data)) {
        configuration.data.json = options.data;
      }
    }

    function convertDimensions(options, configuration) {
      if (!angular.isObject(options.dimensions)) {
        return;
      }

      // only show used axes
      configuration.axis.y.show = false;

      // save displayFormat for reuse
      var displayFormat = {
        isUse: false,
        y: [],
        y2: []
      };

      // apply all dimensions
      angular.forEach(options.dimensions, function (dimension, key) {
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
          displayFormat.y2.push(key);
        } else if (dimension.axis !== 'x') {
          configuration.axis.y.show = true;
          displayFormat.y.push(key);
        }

        // get displayFormats
        displayFormat[key] = true;
        if (angular.isDefined(dimension.displayFormat)) {
          displayFormat.inUse = true;
          displayFormat[key] = dimension.displayFormat;
        } else if (angular.isDefined(dimension.prefix) || angular.isDefined(dimension.postfix)) {
          displayFormat.inUse = true;
          displayFormat[key] = function (label) {
            return (dimension.prefix || '') + label + (dimension.postfix || '');
          };
        }

        // data label
        if (dimension.label === true) {
          configuration.data.labels.format[key] = displayFormat[key];
        }

        // x-Axis
        if (dimension.axis === 'x') {
          configuration.data.keys.x = key;
          configuration.data.x = key;

          if (angular.isString(displayFormat[key]) || angular.isFunction(displayFormat[key])) {
            configuration.axis.x.tick.format = displayFormat[key];
          }

          if (['datetime', 'date', 'timeseries'].indexOf(dimension.dataType) !== -1) {
            configuration.axis.x.type = 'timeseries';
            if (dimension.dataFormat) {
              configuration.data.xFormat = dimension.dataFormat;
            }
          } else if (['numeric', 'number', 'indexed'].indexOf(dimension.dataType) !== -1) {
            configuration.axis.x.type = 'indexed';
          } else if (dimension.dataType === 'category' || (angular.isArray(options.data) && options.data[0] && options.data[0][key] && options.data[0][key] && !angular.isNumber(options.data[0][key]))) {
            configuration.axis.x.type = 'category';
          }
        }

      });

      // Tooltips
      // http://c3js.org/samples/tooltip_format.html
      if (displayFormat.inUse) {
        configuration.tooltip = {
          format: {
            value: function (value, ratio, id) {
              if (angular.isFunction(displayFormat[id])) {
                return displayFormat[id](value);
              } else {
                return value;
              }
            }
          }
        };
      }

      // Y-Axes
      // http://c3js.org/samples/axes_y_tick_format.html
      angular.forEach(['y', 'y2'], function (axis) {
        var format = null;
        var formatKey = null;
        angular.forEach(displayFormat[axis], function (key) {
          if (format === null) {
            format = displayFormat[key];
            formatKey = key;
          } else if (
            format !== displayFormat[key] && !(

              // not two functuins
            (!angular.isFunction(options.dimensions[formatKey].displayFormat) && !angular.isFunction(options.dimensions[key].displayFormat)) &&

            (

              // not two prefixes
            (!angular.isDefined(options.dimensions[formatKey].prefix) && !angular.isDefined(options.dimensions[key].prefix)) ||

              // two same prefixes
            (angular.isDefined(options.dimensions[formatKey].prefix) &&
            angular.isDefined(options.dimensions[key].prefix) &&
            options.dimensions[formatKey].prefix === options.dimensions[key].prefix)

            ) && (
              // not two postfixes
            (!angular.isDefined(options.dimensions[formatKey].postfix) && !angular.isDefined(options.dimensions[key].postfix)) ||

              // two same postfixes
            (angular.isDefined(options.dimensions[formatKey].postfix) &&
            angular.isDefined(options.dimensions[key].postfix) &&
            options.dimensions[formatKey].postfix === options.dimensions[key].postfix)

            ))) {
            format = false;
          }
        });
        if (format !== false && format !== true && format !== null) {
          configuration.axis[axis].tick.format = format;
        }
      });

    }

  }

  angular
    .module('angularChart')
    .service('AngularChartConverter', AngularChartConverter);

})();




(function () {

  'use strict';

  /* istanbul ignore next */
  AngularChartController.$inject = ['$scope', '$element', '$q', 'baseConfiguration', 'AngularChartService'];
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  function AngularChartController($scope, $element, $q, baseConfiguration, AngularChartService) {
    var configuration = angular.copy(baseConfiguration);
    var chartService = null;

    activate();

    ////////////

    function activate() {
      unwrapPromise();
      addIdentifier();
      addInlineStyle();
      getInstance();
      registerDestroyListener();
    }

    /**
     * Unwrap a options promise if onw exists
     */
    function unwrapPromise() {
      $q.when($scope.options, function (options) {
        $scope.options = options;
      });
    }

    /**
     * Add unique identifier for each chart
     */
    function addIdentifier() {
      $scope.dataAttributeChartID = 'chartid' + Math.floor(Math.random() * 1000000001);
      angular.element($element).attr('id', $scope.dataAttributeChartID);
      configuration.bindto = '#' + $scope.dataAttributeChartID;
    }

    /**
     * Add inline style to avoid additional css file
     */
    function addInlineStyle() {
      angular.element($element).css('display', 'block');
    }

    function getInstance() {
      chartService = AngularChartService.getInstance(configuration, $scope);
      $scope.instance = chartService.chart;
    }

    /**
     * Remove all references when directive is destroyed
     */
    function registerDestroyListener() {
      $scope.$on('$destroy', function () {
        chartService.destroyChart(configuration);
        $element.remove();
      });
    }

  }

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
      json: [],
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
        show: true,
        tick: {}
      },
      y2: {
        tick: {}
      },
      x: {
        tick: {}
      }
    },
    zoom: {},
    subchart: {},
    tooltip: {
      format: {}
    }
  };

  angular
    .module('angularChart')
    .value('baseConfiguration', baseConfiguration);

})();



