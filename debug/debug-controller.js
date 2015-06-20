(function () {

  'use strict';

  function DebugController($q, $timeout, DebugData) {
    var vm = this;

    /*
     * Climate Diagram
     */
    // base data
    var dataClimate =  DebugData.climateData;
    var optionsClimate = {
      dimensions: {
        temp: {
          axis: 'y',
          type: 'spline',
          label: true,
          color: 'orange',
          postfix: '°C',
          name: 'temperature'
        },
        rain: {
          axis: 'y2',
          type: 'bar',
          label: true,
          color: 'lightblue',
          postfix: 'mm',
          name: 'rain'
        },
        sun: {
          axis: 'y',
          type: 'step',
          color: 'red',
          label: true,
          postfix: 'h',
          name: 'sunshine'
        },
        month: {
          axis: 'x'
        }
        //date: {
        //  axis: 'x',
        //  displayFormat: '%Y-%m ',
        //  dataType: 'datetime'
        //}
      },
      chart: {
        data: {
          selection: {
            enabled: true
          }
        }
      },
      state: {
      }
    };

    // add to view
    optionsClimate.data = dataClimate;
    vm.climateOptions = optionsClimate;

    // Update
    vm.updateClimateDimension = function () {
      vm.climateOptions.dimensions.temp.type = vm.climateOptions.dimensions.temp.type === 'spline' ? 'bar' : 'spline';
      console.log('new options', vm.climateOptions);
    };


    /*
     * Climate Diagram
     */
    // base data
    var dataTimestamps = DebugData.manyTimestamps;
    var optionsTimestamps = {
      dimensions: {
        n: {
          axis: 'y',
          type: 'scatter',
          name: '# wishes'
        },
        r: {
          axis: 'y',
          type: 'scatter',
          name: '# reactions'
        },
        created_at: {
          axis: 'x',
          dataFormat: '%Y-%m-%d %H:%M:%S',
          displayFormat: '%Y-%m-%d',
          dataType: 'datetime'
        }
      },
      chart: {
        axis: {
          x: {
            tick: {
              count: 8,
              fit: true,
            }
          },
          y: {
            min: 0,
            padding: {
              bottom: 0
            }
          }
        },
        data: {
          selection: {
            enabled: true
          }
        },
        zoom: {
          enabled: true
        }
      }
    };

    // add to view
    optionsTimestamps.data = dataTimestamps;
    vm.timestampOptions = $q(function(resolve) {
      $timeout(function() {
          resolve(optionsTimestamps);
      }, 500);
    });

    // Update
    vm.updateTimestampDimension = function () {
      vm.timestampOptions.dimensions.n.type = vm.timestampOptions.dimensions.n.type === 'scatter' ? 'line' : 'scatter';
      console.log('new options', vm.timestampOptions);
    };

  }

  angular
    .module('AngularChartDebug')
    .controller('DebugController', DebugController);

})();
