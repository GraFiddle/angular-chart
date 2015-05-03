(function () {

  'use strict';

  function DebugController() {
    var vm = this;

    vm.options = {};
  }

  angular
    .module('AngularChartDebug')
    .controller('DebugController', DebugController);

})();
