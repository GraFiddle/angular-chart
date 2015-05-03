'use strict';

/*global beforeEach, afterEach, describe, it, inject, expect, spyOn, module, angular*/
describe('angularCircularNavigation', function () {

  var $scope, $compile, $controller;

  beforeEach(module('angularCircularNavigation'));
  beforeEach(inject(function (_$rootScope_, _$compile_, _$controller_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    $controller = _$controller_;

    $scope.options = {};

    $scope.getElementScope = function (element) {
      return element.scope().$$childTail;
    };
  }));

  describe('scope initialization', function () {

    it('not requires the optional options object', function () {
      expect(function () {
        $compile('<circular options="options"></circular>')($scope);
      }).not.toThrow();
      expect(function () {
        $compile('<circular options></circular>')($scope);
      }).not.toThrow();
      expect(function () {
        $compile('<circular></circular>')($scope);
      }).not.toThrow();
      expect(function () {
        $compile('<circular options="nonObject"></circular>')($scope);
      }).not.toThrow();
      expect(function () {
        $scope.nonResourceObject = {};
        $compile('<circular options="nonResourceObject"></circular>')($scope);
      }).not.toThrow();
    });
  });

  describe('basic function', function () {
    var element, elementScope;

    beforeEach(function () {
      element = $compile('<circular options="options"></circular>')($scope);
      elementScope = $scope.getElementScope(element);
    });

    it('toggleMenu()', function () {
      elementScope.toggleMenu();
      expect(element.html()).not.toBe(null);
    });

    it('perform() without onclick', function () {
      var options = {};
      var item = {};
      elementScope.perform(options, item);

      expect(element.html()).not.toBe(null);
    });

    it('perform() with non function', function () {
      var options = {};
      var item = {
        onclick: 'String'
      };
      elementScope.perform(options, item);

      expect(element.html()).not.toBe(null);
    });
    
    it('perform() with function', function () {
      var options = {};
      var item = {
        onclick: function () {}
      };
      spyOn(item, 'onclick');
      elementScope.perform(options, item);

      expect(item.onclick).toHaveBeenCalled();

      expect(element.html()).not.toBe(null);
    });
    
    it('perform() with toggle', function () {
      $scope.options.toggleOnClick = true;

      var options = {};
      var item = {};
      elementScope.perform(options, item);
      
      expect(element.html()).not.toBe(null);
    });

  });

});