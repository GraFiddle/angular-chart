'use strict';

describe('Directive: angularChart', function () {

  beforeEach(module('angularChart'));

  //////////////////////////////////
  //      SETUP / INJECTION       //
  //////////////////////////////////

  var $compile;
  beforeEach(inject(function(_$compile_) {
    $compile = _$compile_;
  }));

  var $scope;
  beforeEach(inject(function(_$rootScope_) {
    var $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
  }));

  // Helper function
  //  to access scope of directive
  //
  function getElementScope(element) {
    return element.scope().$$childTail;
  }

  // Helper function
  //  to compile the given HTML inside the returned function
  //
  function compileHtmlFunction(html) {
    return function() {
      var element = $compile(html)($scope);
      $scope.$digest();
      return element;
    };
  }

  //////////////////////////////////
  //          UNIT TESTS          //
  //////////////////////////////////

  it('should compile without attributes given.', function() {
    expect(compileHtmlFunction('<angular-chart></angular-chart>'))
      .not.toThrow();
  });

  it('should compile with all attributes are given.', function() {
    $scope.options = {};

    expect(compileHtmlFunction('<angular-chart options="options"></angular-chart>'))
      .not.toThrow();
  });

  it('should add attributes to element scope.', function() {
    // setup
    $scope.options = {};
    var element = compileHtmlFunction('<angular-chart options="options"></angular-chart>')();
    var elementScope = getElementScope(element);

    // result
    expect(elementScope.options).toEqual($scope.options);
  });

});
