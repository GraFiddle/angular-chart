(function () {

  'use strict';

  /*global define, module, exports, require */

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  var circular = angular.module('angularCircularNavigation', [])
    .directive('circular', ['$compile', function ($compile) {

      return {
        restrict: 'EA',
        scope: {
          options: '='
        },
        template: '<div class="cn-wrapper {{options.size}} items-{{options.items.length}}" ng-class="{\'opened-nav\': options.isOpen}"><ul>' +
          '<li ng-repeat="item in options.items">' +
          '<a ng-hide="item.empty" ng-click="perform(options, item)" ng-class="{\'is-active\': item.isActive}" class="{{item.cssClass}}" title="{{item.title}}" style="background: {{item.background ? item.background : options.background}}; color: {{item.color ? item.color : options.color}};">' +
          '<span>{{item.content}}</span>' +
          '</a></li></ul></div>' +
          '<button ng-click="toggleMenu()" class="cn-button {{options.button.size}}" ng-class="options.button.cssClass" style="background: {{options.button.background ? options.button.background : options.background}}; color: {{options.button.color ? options.button.color :options.color}};">{{options.content}}</button>',
        controller: ['$scope', '$element', '$attrs',
          function ($scope, $element, $attrs) {

            $scope.toggleMenu = function () {
              $scope.options.isOpen = !$scope.options.isOpen;
            };

            $scope.perform = function (options, item) {
              if (typeof item.onclick === 'function') {
                item.onclick(options, item);
              }

              if ($scope.options.toggleOnClick) {
                $scope.toggleMenu();
              }
            };

          }
        ]
      };
    }]);

  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define('circular', ['../../bower_components/angular/angular'], circular);
  } else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
    module.exports = circular;
  }

})();
