'use strict';

angular.module('angularChart', [])
  .directive('angularchart',

    function ($compile) {

      var c3 = window.c3;
      var d3 = window.d3;

      return {
        restrict: 'EA',
        scope: {
          dataset: '=',
          options: '='
        },
        // controller: ['$scope', '$element', '$attrs',
        //   function ($scope, $element, $attrs) {
        //     console.log('controller', $scope, $element, $attrs);
        //   }
        // ],

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
            }
          };
          var marginBottom = 0;

          // add unique identifier for each chart
          //
          scope.addIdentifier = function () {
            scope.options.dataAttributeChartID = 'chartid' + Math.floor(Math.random() * 1000000001);
            angular.element(element).attr('id', scope.options.dataAttributeChartID);
            scope.configuration.bindto = '#' + scope.options.dataAttributeChartID;
            angular.element(element).attr('style', 'display: block;');
          };

          // reload the charts data
          //
          scope.loadChart = function () {
            scope.chart.load(
              scope.configuration.data
            );
          };

          // generate or update chart with options
          //
          scope.updateChart = function () {
            // Options
            scope.options.selection = scope.options.selection ? scope.options.selection : {};
            scope.options.selection.selected = scope.options.selection.selected ? scope.options.selection.selected : [];


            // Add data
            if (!scope.dataset || !scope.dataset.records) {
              throw 'No data provided. The dataset has to contains a records array.';
            } else {
              scope.configuration.data.json = scope.dataset.records;
            }


            // Chart type
            // 
            if (scope.options.type) {
              scope.configuration.data.type = scope.options.type;
            }


            // Add lines
            //
            if (!scope.options.rows) {
              // console.warn('The rows to display have to be defined.');
            } else {
              scope.configuration.data.keys.value = [];
              scope.options.rows.forEach(function (element) {
                // TODO exists check? ERROR
                scope.configuration.data.keys.value.push(element.name);

                // data label
                scope.configuration.data.names[element.name] = element.label ? element.label : element.name;

                // chart type
                if (element.type) {
                  // TODO valid type ERROR
                  scope.configuration.data.types[element.name] = element.type;
                }
              });
            }


            // Add x-axis
            //
            if (scope.options.xAxis && scope.options.xAxis.name) {
              // key selection changed?
              if (scope.configuration.data.keys.x && scope.configuration.data.keys.x !== scope.options.xAxis.name) {
                scope.options.selection.selected = [];
              }

              scope.configuration.data.keys.x = scope.options.xAxis.name;
              if (scope.options.xAxis.displayFormat) {
                scope.configuration.axis.x.tick.format = scope.options.xAxis.displayFormat;
              }

              // is Datetime?
              scope.dataset.schema.forEach(function (element) {
                if (element.name === scope.options.xAxis.name) {
                  if (element.type === 'datetime') {
                    if (!element.format) {
                      element.format = '%Y-%m-%dT%H:%M:%S';
                    }
                    scope.configuration.axis.x.type = 'timeseries';
                    scope.configuration.data.xFormat = element.format;
                  } else if (element.type === 'string') {
                    scope.configuration.axis.x.type = 'category';
                  }
                  return;
                }
              });
            }

            // xAxis Label
            //
            if (scope.options.xAxis && scope.options.xAxis.label) {
              scope.configuration.axis.x.label = scope.options.xAxis.label;
            } else {
              scope.configuration.axis.x.label = '';
            }

            // Colors
            //
            if (scope.options.colors) {
              scope.configuration.data.colors = scope.options.colors;
            }

            // Selection
            //
            if (scope.options.selection && scope.options.selection.enabled) {
              scope.configuration.data.selection.enabled = scope.options.selection.enabled;
              scope.configuration.data.selection.multiple = scope.options.selection.multiple;
            }

            // Groups
            //
            if (scope.options.groups) {
              scope.configuration.data.groups = scope.options.groups;
            }

            // onclick
            //
            if (scope.options.onclick) {
              scope.configuration.data.onclick = scope.options.onclick;
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

            marginBottom = 0;

            scope.chart = c3.generate(scope.configuration);
            scope.chooseXAxis();
            scope.chooseChartType();
            scope.toggleSubchartLink();
            if (scope.options.legend && scope.options.legend.selector) {
              scope.customLegend();
            }

            angular.element(element).attr('style', angular.element(element).attr('style') + ' margin-bottom: ' + marginBottom + 'px');
          };


          // Choose x-axis
          //
          scope.chooseXAxis = function () {
            if (scope.options.type === 'pie' || scope.options.type === 'donut' || !scope.options.xAxis || !scope.options.xAxis.selector) {
              return;
            }
            var el = angular.element('<span class="chooseXAxis"/>');
            el.append('<select ng-hide="options.type === \'pie\' || options.type === \'donut\'" ng-model="options.xAxis.name" style="margin-left: 42%"><option ng-repeat="col in dataset.schema" value="{{col.name}}" ng-selected="col.name==options.xAxis.name">{{col.label ? col.label : col.name}}</option></select>');
            $compile(el)(scope);
            element.append(el);

            marginBottom = 30;
          };

          // Choose chart-type
          //
          scope.chooseChartType = function () {
            if (scope.options.typeSelector) {
              var el = angular.element('<span class="chooseChartType">');
              el.attr('style', 'float: right');
              el.append('<button ng-click="options.type = \'line\'" ng-disabled="options.type === \'line\'">Multi</button>');
              el.append('<button ng-click="options.type = \'pie\'" ng-disabled="options.type === \'pie\'">Pie</button>');
              $compile(el)(scope);
              element.prepend(el);
            }
          };

          // Toggle Subchart
          //
          scope.toggleSubchart = function () {
            scope.options.subchart.show = !scope.options.subchart.show;
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
              el.append('<a  ng-click="toggleSubchart()" style="margin-left: 90%">hide subchart</a>');
            } else {
              // show subchart
              el.append('<a  ng-click="toggleSubchart()" style="margin-left: 90%">show subchart</a>');
            }
            $compile(el)(scope);
            element.append(el);

          };

          // Add custom Legend
          //
          scope.customLegend = function () {
            var legend = angular.element('<div class="customLegend"/>');
            element.prepend(legend);
            scope.options.rows.forEach(function (row) {
              legend.append('<div><span data-id="' + row.name + '">' + row.name + '</span></div>');
            });

            d3.selectAll('.customLegend span')
              .each(function () {
                var id = d3.select(this).attr('data-id');
                d3.select(this).style('background-color', scope.chart.color(id));
              })
              .on('mouseover', function () {
                var id = d3.select(this).attr('data-id');
                scope.chart.focus(id);
              })
              .on('mouseout', function () {
                var id = d3.select(this).attr('data-id');
                scope.chart.revert();
              })
              .on('click', function () {
                var id = d3.select(this).attr('data-id');
                scope.chart.toggle(id);
              });
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

              if (addedSelections.length > 0) {
                this.performSelections(addedSelections);
                return true;
              }

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
              if (removedSelections.length > 0) {
                this.performUnselections(removedSelections);
                return true;
              }

              return false;
            }
          };

          // watcher of changes in options
          //
          scope.startOptionsWatcher = function () {

            scope.$watch('options', function (newValue, oldValue) {

              if (scope.selections.watchOptions(newValue, oldValue)) {
                return;
              }

              // change whole chart type
              if (oldValue.type !== newValue.type) {
                scope.chart.transform(newValue.type);
                if (['pie', 'donut'].indexOf(newValue.type) >= 0) {
                  scope.options.rows.forEach(function (row) {
                    if (['pie', 'donut'].indexOf(row.type) < 0) {
                      delete row.type;
                    }
                  });
                }
              }

              scope.updateChart();
            }, true); // checks for changes inside options
          };

          // watcher of changes in options
          //
          scope.startDatasetWatcher = function () {
            scope.$watch('dataset.records', function (newValue, oldValue) {
              scope.loadChart();
            }, true); // checks for changes inside data

            scope.$watch('dataset.schema', function (newValue, oldValue) {
              scope.updateChart();
            }, true); // checks for changes inside data
          };


          // startup
          scope.addIdentifier();
          scope.updateChart();

          scope.selections.performSelections(scope.options.selection.selected);
          scope.startOptionsWatcher();
          scope.startDatasetWatcher();

        }
      };
    });