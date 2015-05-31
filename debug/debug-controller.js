(function () {

  'use strict';

  function DebugController(DebugData) {
    var vm = this;
    var dataClimate =  DebugData.climateData;
    var optionsClimate = {
      dimensions: {
        temp: {
          axis: 'y',
          type: 'spline',
          label: true,
          color: 'orange',
          postfix: '°C',
          name: 'Temperatur'
        },
        rain: {
          axis: 'y2',
          type: 'bar',
          label: true,
          color: 'lightblue',
          postfix: 'mm',
          name: 'Regen'
        },
        sun: {
          axis: 'y',
          type: 'step',
          color: 'red',
          label: true,
          postfix: 'h',
          name: 'Sonnenstunden'
        },
        date: {
          axis: 'x',
          displayFormat: '%Y-%m ',
          dataType: 'datetime'
        }
      },
      chart: {
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

    optionsClimate.data = dataClimate;
    vm.climateOptions = optionsClimate;

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

    optionsTimestamps.data = dataTimestamps;
    vm.timestampOptions = optionsTimestamps;

    vm.updateChart = function () {
      vm.climateOptions = optionsClimate;
      console.log('new options', vm.climateOptions);
      //vm.options.data = data;
      //vm.options.chart.size = {
      //  height: 300 + Math.random() * 100
      //};
    };

    vm.updateData = function () {
      vm.climateOptions.data = dataClimate;
      //vm.options.data.push({data1: Math.random() * 100});
    };

    vm.updateState = function () {
      vm.climateOptions.state = {
        selected: [{
          id: 'value',
          index: 0
        }]
      };
    };

  }

  angular
    .module('AngularChartDebug')
    .controller('DebugController', DebugController);

})();
