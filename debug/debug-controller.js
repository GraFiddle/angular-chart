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
  }

  angular
    .module('AngularChartDebug')
    .controller('DebugController', DebugController);

})();
