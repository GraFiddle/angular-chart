(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  var angularChart = angular.module('angularChart', []);

  // HTML-Tag: <angular-chart>
  angularChart.directive('angularChart', angularChartDirective);
  // HTML-Tag <angularchart>
  angularChart.directive('angularchart', angularChartDirective);

  function angularChartDirective() {
    return {
      restrict: 'EA',
      scope: {
        options: '=',
        instance: '=?'
      },
      controller: 'AngularChartController'
    };
  }

  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define('angularChart', ['c3', 'angular'], angularChart);
  } else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
    module.exports = angularChart;
  }

})();
