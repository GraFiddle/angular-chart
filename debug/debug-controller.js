(function () {

  'use strict';

  function DebugController() {
    var vm = this;

    vm.options = {
      data: [
        {data1: 30, value: 10}
      ],
      dimensions: {
        data1: {
          axis: 'y'
        },
        value: {
          type: 'bar',
          label: true
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
      },
      state: {
        selected: [{
          id: 'data1',
          index: 0
        }]
      }
    };

    vm.updateChart = function () {
      vm.options.chart.size = {
        height: 300 + Math.random() * 100
      };
      console.log('new options', vm.options);
    };

    vm.updateData = function () {
      vm.options.data.push({data1: Math.random() * 100});
    };

    vm.updateSchema = function () {
      vm.options.schema = {
        data1: {}
      };
    };

    vm.updateState = function () {
      vm.options.state.selected.push({
        id: 'value',
        index: 0
      });
    };

  }

  angular
    .module('AngularChartDebug')
    .controller('DebugController', DebugController);

})();
