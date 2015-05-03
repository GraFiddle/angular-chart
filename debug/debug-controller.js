(function () {

  'use strict';

  function DebugController() {
    var vm = this;

    vm.options = {
      data: {
        data1: [30]
      },
      chart: {}
    };

    vm.updateChart = function () {
      vm.options.chart.size = {
        height: 300 + Math.random() * 100
      };
    };

    vm.updateData = function () {
      vm.options.data.data1.push(Math.random() * 100);
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
