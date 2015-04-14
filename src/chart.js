(function () {

  'use strict';

  /*global define, module, exports, require */

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  var angularChart = angular.module('angularChart', ['angularCircularNavigation'])
    .directive('angularchart', ['$compile', '$q', function ($compile, $q) {

      var c3 = window.c3 ? window.c3 : 'undefined' !== typeof require ? require('c3') : undefined;
      var d3 = window.d3 ? window.d3 : 'undefined' !== typeof require ? require('d3') : undefined;

      return {
        restrict: 'EA',
        scope: {
          dataset: '=',
          options: '=',
          schema: '='
        },

        link: function (scope, element, attrs) {

          scope.options = scope.options ? scope.options : {};

          scope.chart = null;
          scope.configuration = {
            data: {
              x: '',
              keys: {
                value: [],
                x: ''
              },
              types: {},
              names: [],
              colors: {},
              selection: {},
              groups: [],
              axes: {},
              onselected: function (d, element) {
                scope.selections.addSelected(d);
              },
              onunselected: function (d, element) {
                scope.selections.removeSelected(d);
              },
              onclick: angular.noop
            },
            axis: {
              x: {
                label: '',
                tick: {}
              },
              y: {
                label: '',
                min: null,
                max: null,
                tick: {}
              },
              y2: {
                label: '',
                min: null,
                max: null,
                tick: {}
              }
            },
            tooltip: {
              format: {}
            },
            legend: {
              show: true
            },
            subchart: {
              show: false
            },
            zoom: {
              enabled: false
            },
            grid: {
              x: {
                lines: []
              },
              y: {
                lines: []
              }
            }
          };

          // add unique identifier for each chart
          //
          scope.addIdentifier = function () {
            scope.dataAttributeChartID = 'chartid' + Math.floor(Math.random() * 1000000001);
            angular.element(element).attr('id', scope.dataAttributeChartID);
            scope.configuration.bindto = '#' + scope.dataAttributeChartID;
          };

          // update the options by applying the changes to the scope,
          // but avoid triggering the charts options watcher
          //
          scope.updateOptions = function (func) {
            scope.disableOptionsWatcher = true;
            scope.$apply(func);
            scope.disableOptionsWatcher = false;
          };

          // generate or update chart with options
          //
          scope.updateChart = function () {
            // Add data
            delete scope.configuration.data.columns;
            delete scope.configuration.data.rows;
            delete scope.configuration.data.json;

            var data = scope.dataset;
            if (!angular.isArray(data)) {
              data = [];
            }

            if (scope.options.data && scope.options.data.orientation === 'columns') {
              scope.configuration.data.columns = data;
            } else if (scope.options.data && scope.options.data.orientation === 'rows') {
              scope.configuration.data.rows = data;
            } else {
              scope.configuration.data.json = data;
            }

            // Chart type
            //
            scope.configuration.data.type = scope.options.type;

            // Add lines
            //
            scope.configuration.axis.y.show = false;
            scope.configuration.axis.y2.show = false;
            scope.configuration.data.keys.value = [];
            if (angular.isArray(scope.options.rows)) {
              scope.options.rows.forEach(function (element) {
                if (element.show === undefined || element.show) {
                  scope.configuration.data.keys.value.push(element.key);
                }

                // data name
                if (element.name) {
                  scope.configuration.data.names[element.key] = element.name;
                } else if (scope.schema && scope.schema[element.key] && scope.schema[element.key].name) {
                  scope.configuration.data.names[element.key] = scope.schema[element.key].name;
                }

                // chart type
                if (!element.type) {
                  element.type = scope.options.type;
                }
                scope.configuration.data.types[element.key] = element.type;

                // color
                if (element.color) {
                  scope.configuration.data.colors[element.key] = element.color;
                }

                // axis
                if (element.axis) {
                  scope.configuration.data.axes[element.key] = element.axis;
                  scope.configuration.axis[element.axis].show = true;
                } else {
                  scope.configuration.axis.y.show = true;
                }
              });

            }


            // Selection
            //
            if (scope.options.selection && scope.options.selection.enabled) {
              scope.configuration.data.selection.enabled = scope.options.selection.enabled;
              scope.configuration.data.selection.multiple = scope.options.selection.multiple;
            }
            //if (scope.options.selection && scope.options.xAxis && scope.options.xAxis.key) {
            //  // key selection changed?
            //  if (scope.configuration.data.keys.x && scope.configuration.data.keys.x !== scope.options.xAxis.key) {
            //    scope.options.selection.selected = [];
            //  }
            //}


            // Add x-axis
            //
            scope.configuration.data.keys.x = '';
            scope.configuration.data.x = '';
            scope.configuration.axis.x.type = 'category';
            scope.configuration.axis.x.tick.format = undefined;
            if (scope.options.xAxis && scope.options.xAxis.key) {

              // set x Axis
              scope.configuration.data.keys.x = scope.options.xAxis.key;
              scope.configuration.data.x = scope.options.xAxis.key;

              // add specific display Format
              if (scope.options.xAxis.displayFormat) {
                scope.configuration.axis.x.tick.format = scope.options.xAxis.displayFormat;
              }

              // is xAxis type specified?
              if (scope.schema && scope.schema[scope.options.xAxis.key]) {
                var columne = scope.schema[scope.options.xAxis.key];

                // prefix / postfix
                if (columne.prefix || columne.postfix) {
                  scope.configuration.axis.x.tick.format = function (number) {
                    if (columne.prefix) {
                      number = columne.prefix + ' ' + number;
                    }
                    if (columne.postfix) {
                      number = number + columne.postfix;
                    }
                    return number;
                  };
                }

                // type
                if (columne.type && columne.type === 'datetime') {
                  scope.configuration.axis.x.type = 'timeseries';
                  if (columne.format) {
                    scope.configuration.data.xFormat = columne.format;
                  } else {
                    scope.configuration.data.xFormat = '%Y-%m-%dT%H:%M:%S'; // default
                  }
                } else if (columne.type === 'numeric') {
                  scope.configuration.axis.x.type = 'numeric';

                }
              }
            }

            // xAxis Label
            //
            if (scope.options.xAxis && scope.options.xAxis.label) {
              scope.configuration.axis.x.label = scope.options.xAxis.label;
            } else {
              scope.configuration.axis.x.label = '';
            }

            // Groups
            //
            if (scope.options.groups) {
              scope.configuration.data.groups = scope.options.groups;
            } else {
              scope.configuration.data.groups = [];
            }

            // onclick
            //
            if (angular.isFunction(scope.options.onclick)) {
              scope.configuration.data.onclick = scope.options.onclick;
            } else {
              scope.configuration.data.onclick = angular.noop;
            }

            // SubChart
            //
            if (scope.options.subchart) {
              scope.configuration.subchart.show = scope.options.subchart.show;
            } else {
              scope.configuration.subchart.show = false;
            }

            // Y settings
            //
            scope.configuration.axis.y.label = '';
            scope.configuration.axis.y.max = null;
            scope.configuration.axis.y.min = null;
            scope.configuration.axis.y.tick.format = undefined;
            if (angular.isObject(scope.options.yAxis)) {
              // label
              if (angular.isDefined(scope.options.yAxis.label)) {
                scope.configuration.axis.y.label = scope.options.yAxis.label;
              }

              // max value
              if (angular.isDefined(scope.options.yAxis.max)) {
                scope.configuration.axis.y.max = scope.options.yAxis.max;
              }

              // min value
              if (angular.isDefined(scope.options.yAxis.min)) {
                scope.configuration.axis.y.min = scope.options.yAxis.min;
              }

              // format
              if (angular.isDefined(scope.options.yAxis.displayFormat)) {
                scope.configuration.axis.y.tick.format = scope.options.yAxis.displayFormat;
              }
            }

            // Y2 settings
            //
            if (angular.isObject(scope.options.y2Axis)) {
              //label
              if (!angular.isUndefined(scope.options.y2Axis.label)) {
                scope.configuration.axis.y2.label = scope.options.y2Axis.label;
              } else {
                scope.configuration.axis.y2.label = '';
              }

              //max value
              if (!angular.isUndefined(scope.options.y2Axis.max)) {
                scope.configuration.axis.y2.max = scope.options.y2Axis.max;
              } else {
                scope.configuration.axis.y2.max = null;
              }

              //min value
              if (!angular.isUndefined(scope.options.y2Axis.min)) {
                scope.configuration.axis.y2.min = scope.options.y2Axis.min;
              } else {
                scope.configuration.axis.y2.min = null;
              }

              //format
              if (!angular.isUndefined(scope.options.y2Axis.displayFormat)) {
                scope.configuration.axis.y2.tick.format = scope.options.y2Axis.displayFormat;
              } else {
                scope.configuration.axis.y2.tick.format = null;
              }
            }

            // Tooltip
            //
            scope.configuration.tooltip.format = {};
            if (scope.options.tooltip) {
              if (scope.options.tooltip.displayFormat) {
                scope.configuration.tooltip.format.value = scope.options.tooltip.displayFormat;
              }
            }

            // Legend
            //
            if (scope.options.legend) {
              if (scope.options.legend.selector === undefined) {
                scope.configuration.legend.show = scope.options.legend.show;
              } else {
                scope.configuration.legend.show = !scope.options.legend.selector;
              }
            } else {
              scope.configuration.legend.show = true;
            }

            // Annotation
            //
            scope.configuration.grid.y.lines = [];
            scope.configuration.grid.x.lines = [];

            if (scope.options.annotation) {
              scope.options.annotation.forEach(function (annotation) {
                switch (annotation.axis) {
                  case 'x':
                    scope.configuration.grid.x.lines.push({
                      text: annotation.label,
                      value: annotation.value
                    });
                    break;

                  case 'y':
                    scope.configuration.grid.y.lines.push({
                      text: annotation.label,
                      value: annotation.value
                    });
                    break;

                  case 'y2':
                    scope.configuration.grid.y.lines.push({
                      text: annotation.label,
                      value: annotation.value,
                      axis: 'y2'
                    });
                    break;
                }
              });
            }

            // Size
            //
            if (scope.options.size) {
              scope.configuration.size = scope.options.size;
            } else {
              scope.configuration.size = {};
            }

            // Zoom
            //
            if (scope.options.zoom) {
              scope.configuration.zoom.enabled = scope.options.zoom.enabled;
            }

            // callback for onzoom
            scope.configuration.zoom.onzoomend = function (domain) {
              scope.updateOptions(function () {
                scope.options.zoom.range = domain;
              });

              if (scope.options.zoom.onzoom) {
                scope.options.zoom.onzoom();
              }
            };

            // callback for onbrush
            scope.configuration.subchart.onbrush = function (domain) {
              scope.updateOptions(function () {
                scope.options.zoom.range = domain;
              });

              if (scope.options.zoom.onzoom) {
                scope.options.zoom.onzoom();
              }
            };

            // Donut Options
            //
            if (scope.options.donut) {
              scope.configuration.donut = scope.options.donut;
            }

            // Remove onresize listeners of the old chart
            //
            window.onresize = null;

            // Draw chart
            //
            scope.chart = c3.generate(scope.configuration);

            // In-place editing
            //
            scope.chooseXAxis();
            scope.customLegend();
            scope.chooseChartType();
            scope.toggleSubchartLink();

            // Remove the max-height set by c3.js
            angular.element(element).removeAttr('style');

            // Apply earlier zoom
            //
            if (scope.options.zoom && scope.options.zoom.range) {
              scope.chart.zoom(scope.options.zoom.range);
            }
          };


          // Choose x-axis
          //
          scope.chooseXAxis = function () {
            if (scope.options.type === 'pie' || scope.options.type === 'donut' || !scope.options.xAxis || !scope.options.xAxis.selector) {
              return;
            }
            var el = angular.element('<span class="chooseXAxis"/>');
            el.append('<select ng-hide="options.type === \'pie\' || options.type === \'donut\'" ng-model="options.xAxis.key" class="form-control"><option ng-repeat="col in schema" value="{{col.id}}" ng-selected="col.id===options.xAxis.key">{{col.name ? col.name : col.id}}</option></select>');
            $compile(el)(scope);
            element.append(el);
          };

          // Choose chart-type
          //
          scope.chooseChartType = function () {
            if (scope.options.typeSelector) {
              var el = angular.element('<div class="chooseChartType btn-group">');
              el.append('<button ng-click="changeChartType(\'scatter\')" ng-class="{\'active\': options.type === \'scatter\'}" class="btn btn-default">Scatter</button>');
              el.append('<button ng-click="changeChartType(\'bar\')" ng-class="{\'active\': options.type === \'bar\'}" class="btn btn-default">Bar</button>');
              el.append('<button ng-click="changeChartType(\'line\')" ng-class="{\'active\': options.type === \'line\'}" class="btn btn-default">Line</button>');
              el.append('<button ng-click="changeChartType(\'pie\')" ng-class="{\'active\': options.type === \'pie\'}" class="btn btn-default">Pie</button>');
              $compile(el)(scope);
              element.prepend(el);
            }
          };
          // called function
          scope.changeChartType = function (type) {
            scope.options.type = type;
            scope.options.rows.forEach(function (element) {
              element.type = type;
            });
          };

          // Toggle Subchart
          //
          scope.toggleSubchart = function () {
            scope.options.subchart.show = !scope.options.subchart.show;
            if (scope.options.zoom && scope.options.zoom.range) {
              delete scope.options.zoom.range;
            }
          };

          // Add Toggle Subchart Links
          //
          scope.toggleSubchartLink = function () {
            if (scope.options.type === 'pie' || scope.options.type === 'donut' || !scope.options.subchart || !scope.options.subchart.selector) {
              return;
            }
            var el = angular.element('<span class="toggleSubchart"/>');
            if (scope.options.subchart.show) {
              // hide subchart
              el.append('<a title="hide navigation subchart" ng-click="toggleSubchart()"><i class="flaticon-hide"></i> hide navigator</a>');
            } else {
              // show subchart
              el.append('<a title="show navigation subchart" ng-click="toggleSubchart()"><i class="flaticon-show"></i> show navigator</a>');
            }
            $compile(el)(scope);
            element.append(el);

          };

          // Add custom Legend
          //
          scope.customLegend = function () {
            if (!scope.options.legend || !scope.options.legend.selector) {
              return;
            }

            var legend = angular.element('<div class="customLegend"><span ng-repeat="row in options.rows" ng-if="row.key !== options.xAxis.key" class="customLegend-item" ><circular options="rowEdit[$index]"></circular><span class="customLegend-label" data-id="{{row.name}}">{{(schema[row.key] && schema[row.key].name) ? schema[row.key].name : (row.name ? row.name : row.key)}}</span></span></div>');
            $compile(legend)(scope);
            element.prepend(legend);

            // d3.selectAll('.customLegend span')
            //   .each(function () {
            //     var id = d3.select(this).attr('data-id');
            //     d3.select(this).style('background-color', scope.chart.color(id));
            //   })
            //   .on('mouseover', function () {
            //     var id = d3.select(this).attr('data-id');
            //     scope.chart.focus(id);
            //   })
            //   .on('mouseout', function () {
            //     var id = d3.select(this).attr('data-id');
            //     scope.chart.revert();
            //   })
            //   .on('click', function () {
            //     var id = d3.select(this).attr('data-id');
            //     scope.chart.toggle(id);
            //   });

            var typeIcons = {
              'line': 'flaticon-line',
              'spline': 'flaticon-line',
              'area': 'flaticon-area',
              'area-spline': 'flaticon-area',
              'scatter': 'flaticon-scatter',
              'bar': 'flaticon-bar',
              'pie': 'flaticon-pie',
              'donut': 'flaticon-pie',
              'step': 'flaticon-line',
              'area-step': 'flaticon-area'
            };

            // onClick functions
            //
            scope.switchAxis = function (options, clicked) {
              scope.options.rows[options.index].axis = clicked.axis;
              scope.options.rows[options.index].show = true;
            };
            scope.switchType = function (options, clicked) {
              scope.options.rows[options.index].type = clicked.type;
              scope.options.rows[options.index].show = true;
            };
            scope.switchShow = function (options, clicked) {
              scope.options.rows[options.index].show = clicked.show;
            };

            // generate circular options
            //
            scope.rowEdit = [];
            for (var index in scope.options.rows) {

              // hide current x-axis
              //
              if (scope.options.xAxis && scope.options.xAxis.key === scope.options.rows[index].key) {
                continue;
              }

              var show = scope.options.rows[index].show === undefined || scope.options.rows[index].show === true;

              scope.rowEdit[index] = {
                row: 'sales',
                index: index,
                isOpen: false,
                toggleOnClick: true,
                background: show ? scope.options.rows[index].color || scope.chart.color(scope.options.rows[index].key) : 'gray',
                color: 'white',
                size: '',
                button: {
                  content: '',
                  cssClass: typeIcons[scope.options.rows[index].type] || typeIcons.spline,
                  background: show ? scope.options.rows[index].color || scope.chart.color(scope.options.rows[index].key) : 'gray',
                  color: 'white',
                  size: 'small'
                },
                items: [{
                  title: 'plot data on right axis',
                  axis: 'y2',
                  onclick: scope.switchAxis,
                  isActive: scope.options.rows[index].axis === 'y2',
                  cssClass: 'flaticon-right'
                }, {
                  title: 'plot data on left axis',
                  axis: 'y',
                  onclick: scope.switchAxis,
                  isActive: scope.options.rows[index].axis === 'y',
                  cssClass: 'flaticon-left'
                }, {
                  empty: true
                }, {
                  title: 'display data as line chart',
                  type: 'spline',
                  onclick: scope.switchType,
                  isActive: scope.options.rows[index].type === 'spline' || scope.options.rows[index].type === 'line',
                  cssClass: typeIcons.spline
                }, {
                  title: 'display data as area chart',
                  type: 'area-spline',
                  onclick: scope.switchType,
                  isActive: scope.options.rows[index].type === 'area' || scope.options.rows[index].type === 'area-spline',
                  cssClass: typeIcons['area-spline']
                }, {
                  title: 'display data as bar chart',
                  type: 'bar',
                  onclick: scope.switchType,
                  isActive: scope.options.rows[index].type === 'bar',
                  cssClass: typeIcons.bar
                }, {
                  title: 'display data as scatter plot',
                  type: 'scatter',
                  onclick: scope.switchType,
                  isActive: scope.options.rows[index].type === 'scatter',
                  cssClass: typeIcons.scatter
                }, {
                  empty: true
                }, {
                  title: 'show this data',
                  show: true,
                  onclick: scope.switchShow,
                  isActive: show,
                  cssClass: 'flaticon-show'
                }, {
                  title: 'hide this data',
                  show: false,
                  onclick: scope.switchShow,
                  isActive: !show,
                  cssClass: 'flaticon-hide'
                }]
              };
            }

          };

          // Selections
          //
          scope.selections = {
            avoidSelections: false,

            // handle chart event onselection
            addSelected: function (selection) {
              if (!this.avoidSelections) {
                if (!angular.isObject(scope.options.selection)) {
                  scope.options.selection = {};
                }
                if (!angular.isArray(scope.options.selection.selected)) {
                  scope.options.selection.selected = [];
                }

                scope.$apply(function() {
                  scope.options.selection.selected.push(selection);
                });
                if (scope.options.selection.onselected) {
                  scope.$apply(function(){
                    scope.options.selection.onselected();
                  });
                }
              }
            },

            // handle chart event onunselection
            removeSelected: function (selection) {
              if (!this.avoidSelections && angular.isObject(scope.options.selection) && angular.isArray(scope.options.selection.selected)) {
                scope.$apply(
                  scope.options.selection.selected = scope.options.selection.selected.filter(function (selected) {
                    return selected.id !== selection.id || selected.index !== selection.index;
                  })
                );
                if (scope.options.selection.onunselected) {
                  scope.$apply(function(){
                    scope.options.selection.onunselected();
                  });
                }
              }
            },

            // select elements inside the chart
            performSelections: function (selections) {
              this.avoidSelections = true;
              selections.forEach(function (selection) {
                scope.chart.select([selection.id], [selection.index]);
              });
              this.avoidSelections = false;
            },

            // unselect elements inside the chart
            performUnselections: function (selections) {
              this.avoidSelections = true;
              selections.forEach(function (selection) {
                scope.chart.unselect([selection.id], [selection.index]);
              });
              this.avoidSelections = false;
            },

            // search options for added or removed selections
            watchOptions: function (newValue, oldValue) {
              var oldSelections = oldValue.selection && oldValue.selection.selected ? oldValue.selection.selected : [];
              var newSelections = newValue.selection && newValue.selection.selected ? newValue.selection.selected : [];

              // addedSelections
              var addedSelections = newSelections.filter(function (elm) {
                var isNew = true;
                oldSelections.forEach(function (old) {
                  if (old.id === elm.id && old.index === elm.index) {
                    isNew = false;
                    return isNew;
                  }
                });
                return isNew;
              });

              // removedSelections
              var removedSelections = oldSelections.filter(function (elm) {
                var isOld = true;
                newSelections.forEach(function (old) {
                  if (old.id === elm.id && old.index === elm.index) {
                    isOld = false;
                    return isOld;
                  }
                });
                return isOld;
              });

              //do actual removal /adding of selections and return if something happened.
              var didSomething = false;
              if (addedSelections.length > 0) {
                this.performSelections(addedSelections);
                didSomething = true;
              }

              if (removedSelections.length > 0) {
                this.performUnselections(removedSelections);
                didSomething = true;
              }

              return didSomething;
            }
          };

          // watcher of changes in options
          //
          scope.startOptionsWatcher = function () {

            scope.$watch('options', function (newValue, oldValue) {
              if (scope.disableOptionsWatcher) {
                return;
              }

              if (scope.selections.watchOptions(newValue, oldValue)) {
                return;
              }

              // change whole chart type
              if (oldValue.type !== newValue.type) {
                scope.chart.transform(newValue.type);
                if (['pie', 'donut'].indexOf(newValue.type) >= 0) {
                  scope.options.rows.forEach(function (row) {
                    // if (['pie', 'donut'].indexOf(row.type) < 0) {
                    delete row.type;
                    // }
                  });
                }
              }

              // data watchLimit
              if (angular.isObject(newValue.data) && !angular.isObject(oldValue.data) || !angular.equals(newValue.data, oldValue.data)) {
                scope.startDatasetWatcher();
              }

              scope.updateChart();
            }, true); // checks for changes inside options
          };

          scope.smallWatcher = undefined;
          scope.bigWatcher = undefined;

          // start watcher changes in small datasets, compares whole object
          //
          scope.startSmallDatasetWatcher = function () {
            return scope.$watchCollection('dataset', function (newValue, oldValue) {
              if (!angular.equals(newValue, oldValue)) {
                scope.updateChart();
                scope.startDatasetWatcher();
              }
            });
          };

          // start watcher changes in big datasets, compares length of records
          //
          scope.startBigDatasetWatcher = function () {
            return scope.$watch(function () {
              return scope.dataset.length;
            }, function (newValue, oldValue) {
              if (!angular.equals(newValue, oldValue)) {
                scope.updateChart();
                scope.startDatasetWatcher();
              }
            });
          };

          // choose watcher for changes in datasets
          //
          scope.startDatasetWatcher = function () {
            if (angular.isArray(scope.dataset)) {
              scope.chooseDatasetWatcher();
            }
          };

          scope.chooseDatasetWatcher = function () {
            var limit = (scope.options.data && scope.options.data.watchLimit) ? scope.options.data.watchLimit : 100;
            if (scope.dataset.length < limit) {
              // start small watcher
              if (!scope.smallWatcher) {
                scope.smallWatcher = scope.startSmallDatasetWatcher();
              }
              // stop big watcher
              if (scope.bigWatcher) {
                scope.bigWatcher();
                scope.bigWatcher = undefined;
              }
            } else {
              // start big watcher
              if (!scope.bigWatcher) {
                scope.bigWatcher = scope.startBigDatasetWatcher();
              }
              // stop small watcher
              if (scope.smallWatcher) {
                scope.smallWatcher();
                scope.smallWatcher = undefined;
              }
            }
          };

          // Registers a $destroy listeners for cleanup purposes
          //
          scope.registerDestroyListener = function () {
            scope.$on('$destroy', function () {
              scope.chart.destroy();
              element.remove();
            });
          };

          // startup
          scope.addIdentifier();

          $q.all([
            $q.when(scope.dataset).then(function(data) {
              scope.dataset = data;
            }),
            $q.when(scope.options).then(function(options) {
              scope.options = options;
            }),
            $q.when(scope.schema).then(function(schema) {
              scope.schema = schema;
            })
          ]).then(function(){
            //if (angular.isObject(scope.options.selection)) {
            //  scope.selections.performSelections(scope.options.selection.selected);
            //}
            scope.startOptionsWatcher();
            scope.startDatasetWatcher();
            scope.registerDestroyListener();
          });
        }
      };
    }]);

  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define('angularChart', ['c3', 'angular'], angularChart);
  } else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
    module.exports = angularChart;
  }

})();
