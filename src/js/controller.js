(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  function AngularChartController($scope, $element, $q, baseConfiguration, AngularChartWatcher, AngularChartService) {
    var configuration = angular.copy(baseConfiguration);

    activate();

    ////////////

    function activate() {
      // unwrap promise
      $q.when($scope.options, function (options) {
        $scope.options = options;
      });

      addIdentifier();
      AngularChartWatcher.init($scope);
      AngularChartService.init(configuration, $scope);
      registerDestroyListener();
    }

    // add unique identifier for each chart
    //
    function addIdentifier() {
      $scope.dataAttributeChartID = 'chartid' + Math.floor(Math.random() * 1000000001);
      angular.element($element).attr('id', $scope.dataAttributeChartID);
      configuration.bindto = '#' + $scope.dataAttributeChartID;
    }

    // remove all references when directive is destroyed
    //
    function registerDestroyListener() {
      $scope.$on('$destroy', function () {
        AngularChartService.destroyChart();
        $element.remove();
      });
    }

  }

  angular
    .module('angularChart')
    .controller('AngularChartController', AngularChartController);

})();
