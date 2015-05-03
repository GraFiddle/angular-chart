(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;
  var c3 = window.c3 ? window.c3 : 'undefined' !== typeof require ? require('c3') : undefined;

  function angularChartController($scope, $element, angularChartWatcher) {
    console.log('init');
    var configuration = {};

    addIdentifier();
    angularChartWatcher.init($scope);
    angularChartWatcher.registerChartCallback(updateCallback);


    function updateCallback() {
      applyChartOptions();
      generateChart();
    }



    // add unique identifier for each chart
    //
    function addIdentifier() {
      $scope.dataAttributeChartID = 'chartid' + Math.floor(Math.random() * 1000000001);
      angular.element($element).attr('id', $scope.dataAttributeChartID);
      configuration.bindto = '#' + $scope.dataAttributeChartID;
    }

    function applyChartOptions() {
      angular.extend(
        configuration,
        $scope.options.chart
      );
    }

    function generateChart() {
      console.log('draw', configuration);
      window.onresize = null;
      c3.generate(configuration);
    }

  }

  angular
    .module('angularChart')
    .controller('angularChartController', angularChartController);

})();
