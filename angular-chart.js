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
          options: '=',
          schema: '='
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
              scope.configuration.data.json = scope.dataset;
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
                scope.configuration.data.keys.value.push(element.key);

                // data name
                if (element.name) {
                  scope.configuration.data.names[element.key] = element.name;
                } else if (scope.schema && scope.schema[element.key] && scope.schema[element.key].name) {
                  scope.configuration.data.names[element.key] = scope.schema[element.key].name;
                }

                // chart type
                if (element.type) {
                  // TODO valid type ERROR
                  scope.configuration.data.types[element.key] = element.type;
                }
              });
            }


            // Add x-axis
            //
            if (scope.options.xAxis && scope.options.xAxis.key) {
              // key selection changed?
              if (scope.configuration.data.keys.x && scope.configuration.data.keys.x !== scope.options.xAxis.key) {
                scope.options.selection.selected = [];
              }

              scope.configuration.data.keys.x = scope.options.xAxis.key;
              if (scope.options.xAxis.displayFormat) {
                scope.configuration.axis.x.tick.format = scope.options.xAxis.displayFormat;
              }

              // is xAxis type specified?
              scope.configuration.axis.x.type = 'category';
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

            // Zoom
            if (scope.options.zoom) {
              scope.configuration.zoom.enabled = scope.options.zoom.enabled;
            } else {
              scope.options.zoom = {};
            }
            // callback for onzoom
            scope.configuration.zoom.onzoom = function (domain) {
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

            marginBottom = 0;

            scope.chart = c3.generate(scope.configuration);
            scope.chooseXAxis();
            scope.chooseChartType();
            scope.toggleSubchartLink();
            if (scope.options.legend && scope.options.legend.selector) {
              scope.customLegend();
            }

            // apply zoom
            if (scope.options.zoom && scope.options.zoom.range) {
              scope.chart.zoom(scope.options.zoom.range);
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
            el.append('<select ng-hide="options.type === \'pie\' || options.type === \'donut\'" ng-model="options.xAxis.key" style="margin-left: 42%"><option ng-repeat="col in schema" value="{{col.id}}" ng-selected="col.id===options.xAxis.key">{{col.name ? col.name : col.id}}</option></select>');
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
              // todo show name of schema if there is no name for row
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

          // watcher of changes in options
          //
          scope.startDatasetWatcher = function () {
            scope.$watch('dataset', function (newValue, oldValue) {
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