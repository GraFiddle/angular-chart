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
      setupChartWatcher($scope);
      setupStateWatcher($scope);
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

    function setupStateWatcher($scope) {
      $scope.$watch('options.state', function (newValue, oldValue) {
        if (!disableStateWatcher && stateCallback) {
          stateCallback();
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
  AngularChartService.$inject = ['$timeout', 'AngularChartWatcher', 'AngularChartConverter', 'AngularChartState'];

  angular
    .module('angularChart')
    .service('AngularChartService', AngularChartService);

})();




(function () {

  'use strict';

  /*global define, module, exports, require */

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  var circular = angular.module('angularCircularNavigation', [])
    .directive('circular', ['$compile', function ($compile) {

      return {
        restrict: 'EA',
        scope: {
          options: '='
        },
        template: '<div class="cn-wrapper {{options.size}} items-{{options.items.length}}" ng-class="{\'opened-nav\': options.isOpen}"><ul>' +
          '<li ng-repeat="item in options.items">' +
          '<a ng-hide="item.empty" ng-click="perform(options, item)" ng-class="{\'is-active\': item.isActive}" class="{{item.cssClass}}" title="{{item.title}}" style="background: {{item.background ? item.background : options.background}}; color: {{item.color ? item.color : options.color}};">' +
          '<span>{{item.content}}</span>' +
          '</a></li></ul></div>' +
          '<button ng-click="toggleMenu()" class="cn-button {{options.button.size}}" ng-class="options.button.cssClass" style="background: {{options.button.background ? options.button.background : options.background}}; color: {{options.button.color ? options.button.color :options.color}};">{{options.content}}</button>',
        controller: ['$scope', '$element', '$attrs',
          function ($scope, $element, $attrs) {

            $scope.toggleMenu = function () {
              $scope.options.isOpen = !$scope.options.isOpen;
            };

            $scope.perform = function (options, item) {
              if (typeof item.onclick === 'function') {
                item.onclick(options, item);
              }

              if ($scope.options.toggleOnClick) {
                $scope.toggleMenu();
              }
            };

          }
        ]
      };
    }]);

  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define('circular', ['angular'], circular);
  } else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
    module.exports = circular;
  }

})();

(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  function AngularChartEditor() {

//// Remove the max-height set by c3.js
//angular.element(element).removeAttr('style');
//
//// Choose x-axis
////
//scope.chooseXAxis = function () {
//  if (scope.options.type === 'pie' || scope.options.type === 'donut' || !scope.options.xAxis || !scope.options.xAxis.selector) {
//    return;
//  }
//  var el = angular.element('<span class="chooseXAxis"/>');
//  el.append('<select ng-hide="options.type === \'pie\' || options.type === \'donut\'" ng-model="options.xAxis.key" class="form-control"><option ng-repeat="col in schema" value="{{col.id}}" ng-selected="col.id===options.xAxis.key">{{col.name ? col.name : col.id}}</option></select>');
//  $compile(el)(scope);
//  element.append(el);
//};
//
//// Choose chart-type
////
//scope.chooseChartType = function () {
//  if (scope.options.typeSelector) {
//    var el = angular.element('<div class="chooseChartType btn-group">');
//    el.append('<button ng-click="changeChartType(\'scatter\')" ng-class="{\'active\': options.type === \'scatter\'}" class="btn btn-default">Scatter</button>');
//    el.append('<button ng-click="changeChartType(\'bar\')" ng-class="{\'active\': options.type === \'bar\'}" class="btn btn-default">Bar</button>');
//    el.append('<button ng-click="changeChartType(\'line\')" ng-class="{\'active\': options.type === \'line\'}" class="btn btn-default">Line</button>');
//    el.append('<button ng-click="changeChartType(\'pie\')" ng-class="{\'active\': options.type === \'pie\'}" class="btn btn-default">Pie</button>');
//    $compile(el)(scope);
//    element.prepend(el);
//  }
//};
//// called function
//scope.changeChartType = function (type) {
//  scope.options.type = type;
//  scope.options.rows.forEach(function (element) {
//    element.type = type;
//  });
//};
//
//// Toggle Subchart
////
//scope.toggleSubchart = function () {
//  scope.options.subchart.show = !scope.options.subchart.show;
//  if (scope.options.zoom && scope.options.zoom.range) {
//    delete scope.options.zoom.range;
//  }
//};
//
//// Add Toggle Subchart Links
////
//scope.toggleSubchartLink = function () {
//  if (scope.options.type === 'pie' || scope.options.type === 'donut' || !scope.options.subchart || !scope.options.subchart.selector) {
//    return;
//  }
//  var el = angular.element('<span class="toggleSubchart"/>');
//  if (scope.options.subchart.show) {
//    // hide subchart
//    el.append('<a title="hide navigation subchart" ng-click="toggleSubchart()"><i class="flaticon-hide"></i> hide navigator</a>');
//  } else {
//    // show subchart
//    el.append('<a title="show navigation subchart" ng-click="toggleSubchart()"><i class="flaticon-show"></i> show navigator</a>');
//  }
//  $compile(el)(scope);
//  element.append(el);
//
//};
//
//// Add custom Legend
////
//scope.customLegend = function () {
//  if (!scope.options.legend || !scope.options.legend.selector) {
//    return;
//  }
//
//  var legend = angular.element('<div class="customLegend"><span ng-repeat="row in options.rows" ng-if="row.key !== options.xAxis.key" class="customLegend-item" ><circular options="rowEdit[$index]"></circular><span class="customLegend-label" data-id="{{row.name}}">{{(schema[row.key] && schema[row.key].name) ? schema[row.key].name : (row.name ? row.name : row.key)}}</span></span></div>');
//  $compile(legend)(scope);
//  element.prepend(legend);
//
//  // d3.selectAll('.customLegend span')
//  //   .each(function () {
//  //     var id = d3.select(this).attr('data-id');
//  //     d3.select(this).style('background-color', scope.chart.color(id));
//  //   })
//  //   .on('mouseover', function () {
//  //     var id = d3.select(this).attr('data-id');
//  //     scope.chart.focus(id);
//  //   })
//  //   .on('mouseout', function () {
//  //     var id = d3.select(this).attr('data-id');
//  //     scope.chart.revert();
//  //   })
//  //   .on('click', function () {
//  //     var id = d3.select(this).attr('data-id');
//  //     scope.chart.toggle(id);
//  //   });
//
//  var typeIcons = {
//    'line': 'flaticon-line',
//    'spline': 'flaticon-line',
//    'area': 'flaticon-area',
//    'area-spline': 'flaticon-area',
//    'scatter': 'flaticon-scatter',
//    'bar': 'flaticon-bar',
//    'pie': 'flaticon-pie',
//    'donut': 'flaticon-pie',
//    'step': 'flaticon-line',
//    'area-step': 'flaticon-area'
//  };
//
//  // onClick functions
//  //
//  scope.switchAxis = function (options, clicked) {
//    scope.options.rows[options.index].axis = clicked.axis;
//    scope.options.rows[options.index].show = true;
//  };
//  scope.switchType = function (options, clicked) {
//    scope.options.rows[options.index].type = clicked.type;
//    scope.options.rows[options.index].show = true;
//  };
//  scope.switchShow = function (options, clicked) {
//    scope.options.rows[options.index].show = clicked.show;
//  };
//
//  // generate circular options
//  //
//  scope.rowEdit = [];
//  for (var index in scope.options.rows) {
//
//    // hide current x-axis
//    //
//    if (scope.options.xAxis && scope.options.xAxis.key === scope.options.rows[index].key) {
//      continue;
//    }
//
//    var show = scope.options.rows[index].show === undefined || scope.options.rows[index].show === true;
//
//    scope.rowEdit[index] = {
//      row: 'sales',
//      index: index,
//      isOpen: false,
//      toggleOnClick: true,
//      background: show ? scope.options.rows[index].color || scope.chart.color(scope.options.rows[index].key) : 'gray',
//      color: 'white',
//      size: '',
//      button: {
//        content: '',
//        cssClass: typeIcons[scope.options.rows[index].type] || typeIcons.spline,
//        background: show ? scope.options.rows[index].color || scope.chart.color(scope.options.rows[index].key) : 'gray',
//        color: 'white',
//        size: 'small'
//      },
//      items: [{
//        title: 'plot data on right axis',
//        axis: 'y2',
//        onclick: scope.switchAxis,
//        isActive: scope.options.rows[index].axis === 'y2',
//        cssClass: 'flaticon-right'
//      }, {
//        title: 'plot data on left axis',
//        axis: 'y',
//        onclick: scope.switchAxis,
//        isActive: scope.options.rows[index].axis === 'y',
//        cssClass: 'flaticon-left'
//      }, {
//        empty: true
//      }, {
//        title: 'display data as line chart',
//        type: 'spline',
//        onclick: scope.switchType,
//        isActive: scope.options.rows[index].type === 'spline' || scope.options.rows[index].type === 'line',
//        cssClass: typeIcons.spline
//      }, {
//        title: 'display data as area chart',
//        type: 'area-spline',
//        onclick: scope.switchType,
//        isActive: scope.options.rows[index].type === 'area' || scope.options.rows[index].type === 'area-spline',
//        cssClass: typeIcons['area-spline']
//      }, {
//        title: 'display data as bar chart',
//        type: 'bar',
//        onclick: scope.switchType,
//        isActive: scope.options.rows[index].type === 'bar',
//        cssClass: typeIcons.bar
//      }, {
//        title: 'display data as scatter plot',
//        type: 'scatter',
//        onclick: scope.switchType,
//        isActive: scope.options.rows[index].type === 'scatter',
//        cssClass: typeIcons.scatter
//      }, {
//        empty: true
//      }, {
//        title: 'show this data',
//        show: true,
//        onclick: scope.switchShow,
//        isActive: show,
//        cssClass: 'flaticon-show'
//      }, {
//        title: 'hide this data',
//        show: false,
//        onclick: scope.switchShow,
//        isActive: !show,
//        cssClass: 'flaticon-hide'
//      }]
//    };
//  }
//
//};

  }

  angular
    .module('angularChart')
    .service('AngularChartEditor', AngularChartEditor);

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



