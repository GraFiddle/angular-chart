(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  function AngularChartController($scope, $element, $q, baseConfiguration, AngularChartService) {
    var configuration = angular.copy(baseConfiguration);
    var chartService = null;

    activate();

    ////////////

    function activate() {
      unwrapPromise();
      addIdentifier();
      addInlineStyle();
      getInstance();
      registerDestroyListener();
    }

    /**
     * Unwrap a options promise if onw exists
     */
    function unwrapPromise() {
      $q.when($scope.options, function (options) {
        $scope.options = options;
      });
    }

    /**
     * Add unique identifier for each chart
     */
    function addIdentifier() {
      $scope.dataAttributeChartID = 'chartid' + Math.floor(Math.random() * 1000000001);
      angular.element($element).attr('id', $scope.dataAttributeChartID);
      configuration.bindto = '#' + $scope.dataAttributeChartID;
    }

    /**
     * Add inline style to avoid additional css file
     */
    function addInlineStyle() {
      angular.element($element).css('display', 'block');
    }

    function getInstance() {
      chartService = AngularChartService.getInstance(configuration, $scope);
      $scope.instance = chartService.chart;
    }

    /**
     * Remove all references when directive is destroyed
     */
    function registerDestroyListener() {
      $scope.$on('$destroy', function () {
        chartService.destroyChart(configuration);
        $element.remove();
      });
    }

  }

  angular
    .module('angularChart')
    .controller('AngularChartController', AngularChartController);

})();
