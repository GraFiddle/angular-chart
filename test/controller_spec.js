'use strict';

describe('Controller: AngularChartController', function() {

  beforeEach(module('angularChart'));

  //////////////////////////////////
  //      SETUP / INJECTION       //
  //////////////////////////////////

  var $controller;
  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
  }));

  var $scope;
  beforeEach(inject(function(_$rootScope_) {
    var $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
  }));

  var $element;
  beforeEach(function() {
    $element = {
      setAttribute: angular.noop,
      remove: angular.noop,
      style: angular.noop,

    };
  });

  //var Factory;
  //beforeEach(inject(function(_Factory_) {
  //  Factory = _Factory_;
  //}));

  // Helper Function
  //  to create an instance of the controller with all
  //  dependencies manually injected
  //
  function setUpController() {
    return $controller('AngularChartController', {
      $scope: $scope,
      $element: $element
    });
  }

  //////////////////////////////////
  //          UNIT TESTS          //
  //////////////////////////////////

  // instantiation
  it('should instantiate DirectiveCtrl.', function() {
    // setup
    var controller = setUpController();

    // validate result
    expect(controller).toBeDefined();
  });

  // destroy
  it('should destroy DirectiveCtrl.', function() {
    // setup
    $scope.options = {};
    var controller = setUpController();

    // action
    expect(controller).toBeDefined();
    $scope.$destroy();
  });

});
