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
        template: '<button ng-click="toggleMenu()" class="cn-button {{options.button.size}}" ng-class="options.button.cssClass" style="background: {{options.button.background ? options.button.background : options.background}}; color: {{options.button.color ? options.button.color :options.color}};">{{options.content}}</button>' +
          '<div class="cn-wrapper {{options.size}} items-{{options.items.length}}" ng-class="{\'opened-nav\': options.isOpen}"><ul>' +
          '<li ng-repeat="item in options.items">' +
          '<a ng-hide="item.empty" ng-click="perform(options, item)" ng-class="{\'is-active\': item.isActive}" class="{{item.cssClass}}" title="{{item.title}}" style="background: {{item.background ? item.background : options.background}}; color: {{item.color ? item.color : options.color}};">' +
          '<span>{{item.content}}</span>' +
          '</a></li></ul></div>',
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

  /*global define, module, exports, require */

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  var angularChart = angular.module('angularChart', ['angularCircularNavigation'])
    .directive('angularchart', ['$compile', function ($compile) {

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
                label: ''
              },
              y2: {
                label: ''
              }
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
            // Options
            scope.options.selection = scope.options.selection ? scope.options.selection : {};
            scope.options.selection.selected = scope.options.selection.selected ? scope.options.selection.selected : [];


            // Add data
            if (!scope.dataset) {
              throw 'No data provided. The dataset has to be an array with the records.';
            } else {
              if (scope.options.data && scope.options.data.orientation === 'columns') {
                scope.configuration.data.columns = scope.dataset;
              } else if (scope.options.data && scope.options.data.orientation === 'rows') {
                scope.configuration.data.rows = scope.dataset;
              } else {
                scope.configuration.data.json = scope.dataset;
              }
            }


            // Chart type
            //
            if (!scope.options.type) {
              scope.options.type = 'line';
            }
            scope.configuration.data.type = scope.options.type;

            // Add lines
            //
            scope.configuration.axis.y.show = false;
            scope.configuration.axis.y2.show = false;
            scope.configuration.data.keys.value = [];
            if (scope.options.rows) {
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
                if (!element.axis) {
                  element.axis = 'y';
                }
                scope.configuration.data.axes[element.key] = element.axis;
                scope.configuration.axis[element.axis] = {
                  show: true
                };
              });

            }


            // Selection
            //
            if (scope.options.selection && scope.options.selection.enabled) {
              scope.configuration.data.selection.enabled = scope.options.selection.enabled;
              scope.configuration.data.selection.multiple = scope.options.selection.multiple;
            }
            if (scope.options.xAxis && scope.options.xAxis.key) {
              // key selection changed?
              if (scope.configuration.data.keys.x && scope.configuration.data.keys.x !== scope.options.xAxis.key) {
                scope.options.selection.selected = [];
              }
            }


            // Add x-axis
            //
            scope.configuration.data.keys.x = '';
            scope.configuration.axis.x.type = 'category';
            scope.configuration.axis.x.tick.format = undefined;
            if (scope.options.xAxis && scope.options.xAxis.key) {

              // set x Axis
              scope.configuration.data.keys.x = scope.options.xAxis.key;

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
            if (scope.options.onclick) {
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

            // Y label
            //
            if (scope.options.yAxis && scope.options.yAxis.label) {
              scope.configuration.axis.y.label = scope.options.yAxis.label;
            } else {
              scope.configuration.axis.y.label = '';
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

            // expose resize function of c3 to outside
            //
            scope.options.resize = function (size) {
              scope.options.size = size;
              scope.configuration.size = size;
              scope.chart.resize(size);
            };

            // Zoom
            //
            if (scope.options.zoom) {
              scope.configuration.zoom.enabled = scope.options.zoom.enabled;
            } else {
              scope.options.zoom = {};
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
            if(scope.options.donut)
            {
              scope.configuration.donut = scope.options.donut;
            }

            // Remove onresize listeners of the old chart
            //
            window.onresize = null;

            // Draw chart
            //
            scope.chart = c3.generate(scope.configuration);


            // Get Colors
            //
            if (scope.options.rows) {
              scope.options.rows.forEach(function (element) {
                element.color = scope.chart.color(element.key);
              });
            }

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
                background: show ? scope.options.rows[index].color : 'gray',
                color: 'white',
                size: '',
                button: {
                  content: '',
                  cssClass: typeIcons[scope.options.rows[index].type],
                  background: show ? scope.options.rows[index].color : 'gray',
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
                  cssClass: typeIcons['area-spline'],
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
                scope.$apply(
                  scope.options.selection.selected.push(selection)
                );
                if (scope.options.selection.onselected) {
                  scope.options.selection.onselected();
                }
              }
            },

            // handle chart event onunselection
            removeSelected: function (selection) {
              if (!this.avoidSelections) {
                scope.$apply(
                  scope.options.selection.selected = scope.options.selection.selected.filter(function (selected) {
                    return selected.id !== selection.id || selected.index !== selection.index;
                  })
                );
                if (scope.options.selection.onunselected) {
                  scope.options.selection.onunselected();
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
                    return;
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
                    return;
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

              scope.updateChart();
            }, true); // checks for changes inside options
          };

          scope.smallWatcher = undefined;
          scope.bigWatcher = undefined;

          // start watcher changes in small datasets, compares whole object
          //
          scope.startSmallDatasetWatcher = function () {
            return scope.$watchCollection('dataset', function (newValue, oldValue) {
              scope.updateChart();
              scope.startDatasetWatcher();
            });
          };

          // start watcher changes in big datasets, compares length of records
          //
          scope.startBigDatasetWatcher = function () {
            return scope.$watch(function () {
              return scope.dataset.length;
            }, function (newValue, oldValue) {
              scope.updateChart();
              scope.startDatasetWatcher();
            });
          };

          // choose watcher for changes in datasets
          //
          scope.startDatasetWatcher = function () {
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
          scope.registerDestroyListener = function() {
            scope.$on('$destroy', function() {
                scope.chart.destroy();
                element.remove();
            });
          };

          // startup
          scope.addIdentifier();
          scope.updateChart();

          scope.selections.performSelections(scope.options.selection.selected);
          scope.startOptionsWatcher();
          scope.startDatasetWatcher();
          scope.registerDestroyListener();
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
