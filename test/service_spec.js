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
    var chartService = AngularChartService.getInstance(configuration, $scope);

    $scope.$apply();
    // generate chart
    $timeout.flush();

    chartService.destroyChart();
  });

  // callbacks
  it('callback dimensionsCallback.', function () {
    // setup
    var configuration = angular.copy(baseConfiguration);
    var chartService = AngularChartService.getInstance(configuration, $scope);

    $scope.$apply();
    $timeout.flush();

    chartService.watcher.dimensionsCallback();
  });

  it('callback dimensionsTypeCallback.', function () {
    // setup
    var configuration = angular.copy(baseConfiguration);
    var chartService = AngularChartService.getInstance(configuration, $scope);

    $scope.$apply();
    $timeout.flush();

    chartService.watcher.dimensionsTypeCallback();
  });

  it('callback chartCallback.', function () {
    // setup
    var configuration = angular.copy(baseConfiguration);
    var chartService = AngularChartService.getInstance(configuration, $scope);

    $scope.$apply();
    $timeout.flush();

    chartService.watcher.chartCallback();
  });

  it('callback dataCallback.', function () {
    // setup
    var configuration = angular.copy(baseConfiguration);
    var chartService = AngularChartService.getInstance(configuration, $scope);

    $scope.$apply();
    $timeout.flush();

    chartService.watcher.dataCallback();
  });

  it('callback stateCallback.', function () {
    // setup
    var configuration = angular.copy(baseConfiguration);
    var chartService = AngularChartService.getInstance(configuration, $scope);

    $scope.$apply();
    $timeout.flush();

    chartService.watcher.stateCallback();
  });

  it('transform types.', function () {
    // setup
    var configuration = angular.copy(baseConfiguration);
    var chartService = AngularChartService.getInstance(configuration, $scope);

    chartService.options.dimensions = {
      one: {}
    };

    $scope.$apply();
    $timeout.flush();

    chartService.transformCallback();
  });

});


describe('Service: AngularChartService', function () {

  //////////////////////////////////
  //      SETUP / INJECTION       //
  //////////////////////////////////

  beforeEach(module('angularChart'));

  // disable angular.merge to be able to test backwards compatibility
  beforeEach(function() {
    angular.merge = null;
  });

  var baseConfiguration;
  beforeEach(inject(function(_baseConfiguration_) {
    baseConfiguration = _baseConfiguration_;
  }));

  var $scope;
  beforeEach(inject(function(_$rootScope_) {
    var $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
  }));

  var $timeout;
  beforeEach(inject(function(_$timeout_) {
    $timeout = _$timeout_;
  }));

  // get the service to test
  var AngularChartService;
  beforeEach(inject(function(_AngularChartService_) {
    AngularChartService = _AngularChartService_;
  }));


  it('use custom deep merge.', function () {
    // setup
    var configuration = angular.copy(baseConfiguration);
    var chartService = AngularChartService.getInstance(configuration, $scope);

    var target = {
      data: {
        test1: true
      }
    };
    var src = {
      data: {
        test2: false
      },
      newData: {}
    };
    chartService.merge(target, src);
  });

});
