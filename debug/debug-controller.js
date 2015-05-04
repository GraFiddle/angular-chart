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
          label: true,
          displayFormat: d3.format("$,")
        }
      },
      chart: {
      }
    };

    vm.updateChart = function () {
      vm.options.chart.size = {
        height: 300 + Math.random() * 100
      };
    };

    vm.updateData = function () {
      vm.options.data.push({data1: Math.random() * 100});
    };

    vm.updateSchema = function () {
      vm.options.schema = {
        data1: {}
      };
    };

  }

  angular
    .module('AngularChartDebug')
    .controller('DebugController', DebugController);

})();
