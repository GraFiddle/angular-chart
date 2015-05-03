(function () {

  'use strict';

  function DebugController() {
    var vm = this;

    vm.options = {
      chart: {
        data: {
          json: {
            data1: [30]
          }
        }
      }
    };

    vm.updateChart = function () {
      vm.options.chart.data.json.data1.push(Math.random() * 100);
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
