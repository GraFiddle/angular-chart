'use strict';

describe('Integration: angularChart', function () {

  beforeEach(module('angularChart'));

  //////////////////////////////////
  //      SETUP / INJECTION       //
  //////////////////////////////////

  var $compile;
  beforeEach(inject(function (_$compile_) {
    $compile = _$compile_;
  }));

  var $scope;
  beforeEach(inject(function (_$rootScope_) {
    var $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
  }));

  var chartContainer, chartElement;
  beforeEach(function () {
    chartContainer = d3.select('body').append('div').attr('class', 'testContainer');
    // add directive to DOM
    chartContainer.append('angular-chart')
      .attr('options', 'options');
    chartElement = chartContainer.select('angular-chart')[0][0];
  });

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
    return function () {
      var element = $compile(html)($scope);
      $scope.$digest();
      return element;
    };
  }

  //////////////////////////////////
  //          UNIT TESTS          //
  //////////////////////////////////

  it('render without options.', function () {
    compileHtmlFunction(chartElement)();
  });

  it('render with empty options.', function () {
    $scope.options = {};
    compileHtmlFunction(chartElement)();
  });

  it('render without data.', function () {
    $scope.options = {
      dimensions: {
        row1: {}
      }
    };
    compileHtmlFunction(chartElement)();
  });

  it('render a simple chart.', function () {
    $scope.options = {
      data: [{
        row1: 10
      }],
      dimensions: {
        row1: {}
      }
    };
    compileHtmlFunction(chartElement)();
  });

});
