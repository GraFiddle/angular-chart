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

  var $timeout;
  beforeEach(inject(function (_$timeout_) {
    $timeout = _$timeout_;
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
    var configuration = angular.copy(baseConfiguration);
    AngularChartService.getInstance(configuration, $scope);

    $scope.$apply();
    $timeout.flush();
  });


  // destroyChart()
  it('destroy a created chart.', function () {
    // setup
    var configuration = angular.copy(baseConfiguration);
    var chartSerice = AngularChartService.getInstance(configuration, $scope);

    $scope.$apply();

    chartSerice.destroyChart();
  });

  // callbacks
  it('callback dimensionsCallback.', function () {
    // setup
    var configuration = angular.copy(baseConfiguration);
    var chartSerice = AngularChartService.getInstance(configuration, $scope);

    $scope.$apply();
    $timeout.flush();

    chartSerice.watcher.dimensionsCallback();
  });

  it('callback chartCallback.', function () {
    // setup
    var configuration = angular.copy(baseConfiguration);
    var chartSerice = AngularChartService.getInstance(configuration, $scope);

    $scope.$apply();
    $timeout.flush();

    chartSerice.watcher.chartCallback();
  });

  it('callback dataCallback.', function () {
    // setup
    var configuration = angular.copy(baseConfiguration);
    var chartSerice = AngularChartService.getInstance(configuration, $scope);

    $scope.$apply();
    $timeout.flush();

    chartSerice.watcher.dataCallback();
  });

  it('callback stateCallback.', function () {
    // setup
    var configuration = angular.copy(baseConfiguration);
    var chartSerice = AngularChartService.getInstance(configuration, $scope);

    $scope.$apply();
    $timeout.flush();

    chartSerice.watcher.stateCallback();
  });

  it('merge configuration.', function () {
    // setup
    var configuration = angular.copy(baseConfiguration);
    var chartSerice = AngularChartService.getInstance(configuration, $scope);

    chartSerice.configuration.data = {};
    chartSerice.options.chart = {
      data: {
        groups: []
      },
      value: 'test'
    };
    chartSerice.applyChartOptions();
  });

});
