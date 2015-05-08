'use strict';

describe('Service: AngularChartService', function () {

  //////////////////////////////////
  //      SETUP / INJECTION       //
  //////////////////////////////////

  beforeEach(module('angularChart'));

  var baseConfiguration;
  beforeEach(inject(function (_baseConfiguration_) {
    baseConfiguration = _baseConfiguration_;
  }));

  var $scope;
  beforeEach(inject(function (_$rootScope_) {
    var $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
  }));

  // get the service to test
  var AngularChartService;
  beforeEach(inject(function (_AngularChartService_) {
    AngularChartService = _AngularChartService_;
  }));

  //////////////////////////////////
  //          UNIT TESTS          //
  //////////////////////////////////

  // init()
  it('setup the service.', function () {
    // setup
    var options = {
      data: []
    };
    var configuration = angular.copy(baseConfiguration);
    AngularChartService.init(configuration, options);

    $scope.$apply();
  });


  // destroyChart()
  it('destroy a created chart.', function () {
    // setup
    var options = {
      data: []
    };
    var configuration = angular.copy(baseConfiguration);
    AngularChartService.init(configuration, options);

    $scope.$apply();

    AngularChartService.destroyChart();
  });

  it('call destroy before generating a chart.', function () {
    AngularChartService.destroyChart();
  });

});
