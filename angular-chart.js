'use strict';

angular.module('angularChart', [])
  .directive('angularchart',

    function ($compile) {

      var c3 = window.c3;

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
                value: []
              },
              types: {},
              names: [],
              selection: {
                enabled: true,
                multiple: false,
              },
              onselected: function (d, element) {
                if (!scope.avoidSelections) {
                  scope.addSelected(d);
                }
              },
              onunselected: function (d, element) {
                if (!scope.avoidSelections) {
                  scope.removeSelected(d);
                }
              }
            },
            axis: {
              x: {
                tick: {}
              }
            },
            legend: {
              position: 'right'
            }
          };

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

            // Add data
            if (!scope.dataset || !scope.dataset.records) {
              console.error('No data provided.');
            } else {
              scope.configuration.data.json = scope.dataset.records;
            }

            // Chart type
            // 
            if(scope.options.type) {
              scope.configuration.data.type = scope.options.type;
            }


            // Add lines
            //
            if (!scope.options.rows) {
              console.error('The rows to display have to be defined.');
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
            if (!scope.options.xAxis || !scope.options.xAxis.name) {
              console.error('no xAxis provided');
            } else {
              // key selection changed?
              if (scope.configuration.data.keys.x !== null && scope.configuration.data.keys.x !== scope.options.xAxis.name) {
                scope.options.selected = [];
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
                      return console.error('For data of the type "datetime" a format has to be defined.');
                    }
                    scope.configuration.axis.x.type = 'timeseries';
                    scope.configuration.data.x_format = element.format;
                  } else if (element.type === 'string') {
                    scope.configuration.axis.x.type = 'category';
                  }
                  return;
                }
              });
            }

            scope.chart = c3.generate(scope.configuration);
            scope.chooseXAxis();
          };

          // Choose x-axis
          scope.chooseXAxis = function () {
            if (scope.options.type === 'pie' ||scope.options.type === 'donut' ) {
              return;
            }
            var el = angular.element('<span/>');
            el.append('<select ng-model="options.xAxis.name" style="margin-left: 42%"><option ng-repeat="col in dataset.schema" value="{{col.name}}" ng-selected="col.name==options.xAxis.name">{{col.label ? col.label : col.name}}</option></select>');
            $compile(el)(scope);
            element.append(el);

            angular.element(element).attr('style', angular.element(element).attr('style') + ' padding-bottom: 30px');
          };

          // Selections
          //
          scope.avoidSelections = false;
          scope.options.selected = scope.options.selected ? scope.options.selected : [];

          // handle chart event onselection 
          scope.addSelected = function (selection) {
            scope.$apply(
              scope.options.selected.push(selection)
            );
          };

          // handle chart event onunselection
          scope.removeSelected = function (selection) {
            scope.$apply(
              scope.options.selected = scope.options.selected.filter(function (selected) {
                return selected.id !== selection.id || selected.index !== selection.index;
              })
            );
          };

          // select elements inside the chart
          scope.performSelections = function (selections) {
            scope.avoidSelections = true;
            selections.forEach(function (selection) {
              scope.chart.select([selection.id], [selection.index]);
            });
            scope.avoidSelections = false;
          };

          // unselect elements inside the chart
          scope.performUnselections = function (selections) {
            scope.avoidSelections = true;
            selections.forEach(function (selection) {
              scope.chart.unselect([selection.id], [selection.index]);
            });
            scope.avoidSelections = false;
          };


          // watcher of changes in options
          //
          scope.startOptionsWatcher = function () {

            scope.$watch('options', function (newValue, oldValue) {
              if (newValue === oldValue) { // skip the first run of $watch
                return;
              }

              oldValue.selected = oldValue.selected ? oldValue.selected : [];
              newValue.selected = newValue.selected ? newValue.selected : [];

              // newSelections
              var newSelections = newValue.selected.filter(function (elm) {
                var isNew = true;
                oldValue.selected.forEach(function (old) {
                  if (old.id === elm.id && old.index === elm.index) {
                    isNew = false;
                    return;
                  }
                });
                return isNew;
              });
              if (newSelections.length > 0) {
                return scope.performSelections(newSelections);
              }

              // removedSelections
              var removedSelections = oldValue.selected.filter(function (elm) {
                var isOld = true;
                newValue.selected.forEach(function (old) {
                  if (old.id === elm.id && old.index === elm.index) {
                    isOld = false;
                    return;
                  }
                });
                return isOld;
              });
              if (removedSelections.length > 0) {
                return scope.performUnselections(removedSelections);
              }

              scope.updateChart();
            }, true); // checks for changes inside options
          };

          // watcher of changes in options
          //
          scope.startDatasetWatcher = function () {
            scope.$watch('dataset.records', function (newValue, oldValue) {
              if (newValue === oldValue) { // skip the first run of $watch
                return;
              }
              scope.loadChart();
            }, true); // checks for changes inside data

            scope.$watch('dataset.schema', function (newValue, oldValue) {
              if (newValue === oldValue) { // skip the first run of $watch
                return;
              }
              scope.updateChart();
            }, true); // checks for changes inside data
          };


          // startup
          scope.addIdentifier();
          scope.updateChart();
          scope.performSelections(scope.options.selected);
          scope.startOptionsWatcher();
          scope.startDatasetWatcher();

        }
      };
    });