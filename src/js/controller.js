(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  function angularChartController($scope, $element, angularChartWatcher, angularChartService) {
    var baseConfiguration = {
      data: {
        keys: {
          value: []
        },
        names: {},
        types: {},
        colors: {},
        axes: {}
      },
      axis: {
        y: {},
        y2: {}
      }
    };

    activate();

    ////////////

    function activate() {
      addIdentifier();
      angularChartWatcher.init($scope);
      angularChartService.init(baseConfiguration, $scope.options);
      registerDestroyListener();
    }

    // add unique identifier for each chart
    //
    function addIdentifier() {
      $scope.dataAttributeChartID = 'chartid' + Math.floor(Math.random() * 1000000001);
      angular.element($element).attr('id', $scope.dataAttributeChartID);
      baseConfiguration.bindto = '#' + $scope.dataAttributeChartID;
    }

    // remove all references when directive is destroyed
    //
    function registerDestroyListener() {
      $scope.$on('$destroy', function () {
        angularChartService.destroyChart();
        $element.remove();
      });
    }

  }

  angular
    .module('angularChart')
    .controller('angularChartController', angularChartController);

})();
