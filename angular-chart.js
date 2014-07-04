'use strict';

angular.module('angularChart', [])
  .directive('angularchart',

    function () {

      var c3 = window.c3;

      return {
        restrict: 'EA',
        scope: {
          dataset: '=?',
          options: '=?'
        },
        // controller: ['$scope', '$element', '$attrs',
        //   function ($scope, $element, $attrs) {
        //     console.log('controller', $scope, $element, $attrs);
        //   }
        // ],

        link: function (scope, element, attrs) {

          // optional bindings
          if (!scope.options) {
            scope.options = {};
          }
          
          scope.data = [];

          var chart;
          var configuration;

          // add id
          scope.options.dataAttributeChartID = 'chartid' + Math.floor(Math.random() * 1000000001);
          angular.element(element).attr('id', scope.options.dataAttributeChartID);

          // all supported configurations
          var defaultOptions = {
            chartType: 'lineChart',
            margin: {
              left: 70 // to show yAxis-Label TODO: Apply if Label is set
            },
            xAxis: {
              axisLabel: 'xAxis',
              tickFormat: function (d) {
                return d;
              }
            },
            yAxis: {
              axisLabel: 'yAxis',
              tickFormat: function (d) {
                return d;
              }
            }
          };

          // var generateData = function () {

          //   var format = d3.time.format('%Y-%m-%dT%H:%M:%S.%LZ'); // '%d.%m.%Y'

          //   var xAxis = scope.dataset.schema[0];

          //   var mapDateNumber = function (xAxis, yAxis) {
          //     return function (line) {
          //       return {
          //         x: format.parse(line[xAxis]),
          //         y: line[yAxis]
          //       };
          //     };
          //   };

          //   var mapNumberNumber = function (xAxis, yAxis) {
          //     return function (line) {
          //       return {
          //         x: line[xAxis],
          //         y: line[yAxis]
          //       };
          //     };
          //   };

          //   for (var key in scope.dataset.schema) {
          //     var col = scope.dataset.schema[key];
          //     if (col.name !== xAxis.name) {
          //       var map = xAxis.type === 'datetime' ? mapDateNumber : mapNumberNumber;
          //       var newLine = {
          //         key: col.name,
          //         values: scope.dataset.records.map(map(xAxis.name, col.name))
          //       };
          //       scope.data.push(newLine);
          //     }
          //   }

          //   defaultOptions.xAxis.tickFormat = tickFormat.toDate;

          // };

          var tickFormat = {
            toFixed: function (fixed) {
              return function (d) {
                return d.toFixed(fixed);
              };
            },
            toDate: function (d) {
              return d3.time.format('%x')(new Date(d));
            }
          };

          var loadChart = function () {
            if (chart && configuration) {
              chart.load(
                configuration.data
              );
            }
          };

          var updateChart = function () {

            configuration = {
              bindto: '#' + scope.options.dataAttributeChartID,
              data: {
                json: scope.dataset.records,
                keys: {
                  value: []
                },
                type: 'line',
                types: {}
              },

              axis: {
                x: {
                  type: 'category',
                  tick: {}
                }
              }
            };

            // options
            var rows = [{
              name: 'income',
              type: 'bar'
            }, {
              name: 'sales'
            }];
            var xAxis = {
              name: 'dayString',
              // displayFormat: '%Y-%m-%d %H:%M:%S'
            };

            // Add lines
            //
            rows.forEach(function(element) {
              // TODO exists check? ERROR
              configuration.data.keys.value.push(element.name);

              if(element.type) {
                // TODO valid type ERROR
                configuration.data.types[element.name] = element.type;
              }
            });

            // Add x-axis
            //
            if (xAxis.name) {
              configuration.data.keys.x = xAxis.name;
              if (xAxis.displayFormat) {
                configuration.axis.x.tick.format = xAxis.displayFormat;
              }

              // is Datetime?
              scope.dataset.schema.forEach(function(element) {
                if (element.name === xAxis.name) {
                  if (element.type === 'datetime') {
                    if (!element.format) {
                      return console.error('For data of the type "datetime" a format has to be defined.');
                    }
                    configuration.axis.x.type = 'timeseries';
                    configuration.data.x_format = element.format;
                  }
                  return;
                }
              });
            }

           
            chart = c3.generate(configuration);

            // merge options
            // for (var key in defaultOptions) {
            //   if (!scope.options.hasOwnProperty(key)) {
            //     scope.options[key] = defaultOptions[key];
            //   } else if (typeof scope.options[key] === 'object') {
            //     // check inside objects
            //     for (var subkey in defaultOptions[key]) {
            //       if (!scope.options[key].hasOwnProperty(subkey)) {
            //         scope.options[key][subkey] = defaultOptions[key][subkey];
            //       }
            //     }
            //   }
            // }


            // scope.chart.xAxis
            //   .axisLabel(scope.options.xAxis.axisLabel)
            //   .tickFormat(scope.options.xAxis.tickFormat)
            //   .axisLabelDistance(scope.options.xAxis.axisLabelDistance);
            // scope.chart.yAxis
            //   .axisLabel(scope.options.yAxis.axisLabel)
            //   .tickFormat(scope.options.yAxis.tickFormat)
            //   .axisLabelDistance(scope.options.yAxis.axisLabelDistance); // reduce distance to Numbers TODO match with Format


            //   scope.chart.x2Axis
            //     .axisLabel(scope.options.xAxis.axisLabel)
            //     .tickFormat(scope.options.xAxis.tickFormat)
            //     .axisLabelDistance(scope.options.xAxis.axisLabelDistance);
            //   scope.chart.y2Axis
            //     .axisLabel(scope.options.yAxis.axisLabel)
            //     .tickFormat(scope.options.yAxis.tickFormat)
            //     .axisLabelDistance(scope.options.yAxis.axisLabelDistance);
            // }

            // // draw
            // d3.select('[data-chartid=' + scope.options.dataAttributeChartID + '] svg')
            //   .datum(scope.data)
            //   .call(scope.chart);
            // nv.utils.windowResize(scope.chart.update);
          };



          // watcher
          //
          scope.$watch('options', function (newValue, oldValue) {
            //console.log('watch options');
            if (newValue === oldValue) { // Skip the first run of $watch
              return;
            }
            updateChart();
          }, true); // checks for changes inside options

          scope.$watch('dataset', function (newValue, oldValue) {
            //console.log('watch dataset');
            if (newValue === oldValue) { // Skip the first run of $watch
              return;
            }
            loadChart();
          }, true); // checks for changes inside data

          updateChart();
        }
      };
    }
);