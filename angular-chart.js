'use strict';

angular.module('angularChart', [])
  .directive('angularchart',

    function () {

      var nv = window.nv;
      var d3 = window.d3;

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

          // add id
          scope.options.dataAttributeChartID = 'chartid' + Math.floor(Math.random() * 1000000001);
          angular.element(element).attr('data-chartid', scope.options.dataAttributeChartID);
          if (d3.select('[data-chartid=' + scope.options.dataAttributeChartID + '] svg').empty()) {
            d3.select('[data-chartid=' + scope.options.dataAttributeChartID + ']').append('svg');
          }

          // all supported configurations
          var defaultOptions = {
            chartType: 'lineChart',
            transitionDuration: 200,
            margin: {
              left: 70 // to show yAxis-Label TODO: Apply if Label is set
            },
            xAxis: {
              axisLabel: 'xAxis',
              tickFormat: function (d) {
                return d;
              },
              axisLabelDistance: 30 // reduce distance to Numbers TODO match with Format
            },
            yAxis: {
              axisLabel: 'yAxis',
              tickFormat: function (d) {
                return d;
              },
              axisLabelDistance: 30
            }
          };

          var generateData = function () {
            var format = d3.time.format('%Y-%m-%dT%H:%M:%S.%LZ'); // '%d.%m.%Y'

            var xAxis = scope.dataset.schema[0];

            var mapDateNumber = function (xAxis, yAxis) {
              return function (line) {
                return {
                  x: format.parse(line[xAxis]),
                  y: line[yAxis]
                };
              };
            };

            var mapNumberNumber = function (xAxis, yAxis) {
              return function (line) {
                return {
                  x: line[xAxis],
                  y: line[yAxis]
                };
              };
            };

            for (var key in scope.dataset.schema) {
              var col = scope.dataset.schema[key];
              if (col.name !== xAxis.name) {
                var map = xAxis.type === 'date' ? mapDateNumber : mapNumberNumber;
                var newLine = {
                  key: col.name,
                  values: scope.dataset.records.map(map(xAxis.name, col.name))
                };
                scope.data.push(newLine);
              }
            }

            defaultOptions.xAxis.tickFormat = tickFormat.toDate;

          };

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


          var updateChart = function () {

            // merge options
            for (var key in defaultOptions) {
              if (!scope.options.hasOwnProperty(key)) {
                scope.options[key] = defaultOptions[key];
              } else if (typeof scope.options[key] === 'object') {
                // check inside objects
                for (var subkey in defaultOptions[key]) {
                  if (!scope.options[key].hasOwnProperty(subkey)) {
                    scope.options[key][subkey] = defaultOptions[key][subkey];
                  }
                }
              }
            }


            // apply options
            switch (scope.options.chartType) {
            case 'lineChart':
              scope.chart = nv.models.lineChart();
              break;

            case 'lineWithFocusChart':
              scope.chart = nv.models.lineWithFocusChart();
              break;

            case 'discreteBarChart':
              scope.chart = nv.models.discreteBarChart();
              break;

            case 'multiBarChart':
              scope.chart = nv.models.multiBarChart();
              break;

              // TODO: add more

            default:
              scope.chart = nv.models.lineChart();
            }

            scope.chart.margin(scope.options.margin);


            scope.chart.xAxis
              .axisLabel(scope.options.xAxis.axisLabel)
              .tickFormat(scope.options.xAxis.tickFormat)
              .axisLabelDistance(scope.options.xAxis.axisLabelDistance);
            scope.chart.yAxis
              .axisLabel(scope.options.yAxis.axisLabel)
              .tickFormat(scope.options.yAxis.tickFormat)
              .axisLabelDistance(scope.options.yAxis.axisLabelDistance); // reduce distance to Numbers TODO match with Format

            // chart specific options
            if (scope.options.chartType === 'lineChart') {
              scope.chart.useVoronoi(false); // solves error: https://github.com/novus/nvd3/issues/402
            }

            if (scope.options.chartType === 'lineWithFocusChart') {
              if (scope.chart.useVoronoi) { // added in my fork
                scope.chart.useVoronoi(false); // solves error: https://github.com/novus/nvd3/issues/402
              }

              scope.chart.x2Axis
                .axisLabel(scope.options.xAxis.axisLabel)
                .tickFormat(scope.options.xAxis.tickFormat)
                .axisLabelDistance(scope.options.xAxis.axisLabelDistance);
              scope.chart.y2Axis
                .axisLabel(scope.options.yAxis.axisLabel)
                .tickFormat(scope.options.yAxis.tickFormat)
                .axisLabelDistance(scope.options.yAxis.axisLabelDistance);
            }

            // draw
            d3.select('[data-chartid=' + scope.options.dataAttributeChartID + '] svg')
              .datum(scope.data)
              .call(scope.chart);
            nv.utils.windowResize(scope.chart.update);
          };



          // watcher
          scope.$watch('options', function (newValue, oldValue) {
            if (newValue === oldValue) { // Skip the first run of $watch
              return;
            }
            updateChart();
          }, true); // checks for changes inside options

          scope.$watch('data', function (newValue, oldValue) {
            if (newValue === oldValue) { // Skip the first run of $watch
              return;
            }
            updateChart();
          }, true); // checks for changes inside data



          // init
          if (scope.data.length < 1) {
            generateData();
          }
          updateChart();
        }
      };
    }
);