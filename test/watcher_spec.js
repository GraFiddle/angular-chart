'use strict';

describe('Service: AngularChartWatcher', function () {

  //////////////////////////////////
  //      SETUP / INJECTION       //
  //////////////////////////////////

  beforeEach(module('angularChart'));

  var $scope;
  beforeEach(inject(function (_$rootScope_) {
    var $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
  }));

  // get the service to test
  var AngularChartWatcher;
  beforeEach(inject(function (_AngularChartWatcher_) {
    AngularChartWatcher = _AngularChartWatcher_;
  }));

  //////////////////////////////////
  //          UNIT TESTS          //
  //////////////////////////////////

  // init()
  it('should setup the service.', function () {
    // setup
    AngularChartWatcher.init($scope);
  });


  // registerDimensionsCallback()
  describe('call the dimensions callback', function () {

    // setup for all tests in this block
    var callbacks = {};
    beforeEach(function () {
      callbacks = {
        func: angular.noop
      };
      spyOn(callbacks, 'func');
    });

    it('when dimensions are set.', function () {
      // setup
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();
      watcher.dimensionsCallback = callbacks.func;

      // action
      $scope.options = {
        dimensions: {}
      };
      $scope.$apply();

      // result
      expect(callbacks.func).toHaveBeenCalled();
    });

    it('when dimensions are removed.', function () {
      // setup
      $scope.options = {
        dimensions: {}
      };
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();
      watcher.dimensionsCallback = callbacks.func;

      // action
      $scope.options = {};
      $scope.$apply();

      // result
      expect(callbacks.func).toHaveBeenCalled();
    });

    it('not when something else is updated.', function () {
      // setup
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();
      watcher.dimensionsCallback = callbacks.func;

      // action
      $scope.options = {
        something: 'else'
      };
      $scope.$apply();

      // result
      expect(callbacks.func).not.toHaveBeenCalled();
    });

    it('not when only dimension.type is updated.', function () {
      // setup
      $scope.options = {
        dimensions: {
          one: {}
        }
      };
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();
      watcher.dimensionsCallback = callbacks.func;

      // action
      $scope.options = {
        dimensions: {
          one: {
            type: 'line'
          }
        }
      };
      $scope.$apply();

      // result
      expect(callbacks.func).not.toHaveBeenCalled();
    });

  });

  // registerDimensionsTypeCallback()
  describe('call the dimensionsType callback', function () {

    // setup for all tests in this block
    var callbacks = {};
    beforeEach(function () {
      callbacks = {
        func: angular.noop
      };
      spyOn(callbacks, 'func');
    });

    it('not when dimensions without type are set.', function () {
      // setup
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();
      watcher.dimensionsTypeCallback = callbacks.func;

      // action
      $scope.options = {
        dimensions: {}
      };
      $scope.$apply();

      // result
      expect(callbacks.func).not.toHaveBeenCalled();
    });

    it('not when dimensions without type are removed.', function () {
      // setup
      $scope.options = {
        dimensions: {}
      };
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();
      watcher.dimensionsTypeCallback = callbacks.func;

      // action
      $scope.options = {};
      $scope.$apply();

      // result
      expect(callbacks.func).not.toHaveBeenCalled();
    });

    it('not when something else is updated.', function () {
      // setup
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();
      watcher.dimensionsTypeCallback = callbacks.func;

      // action
      $scope.options = {
        something: 'else'
      };
      $scope.$apply();

      // result
      expect(callbacks.func).not.toHaveBeenCalled();
    });

    it('when only dimension.type is updated.', function () {
      // setup
      $scope.options = {
        dimensions: {
          one: {}
        }
      };
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();
      watcher.dimensionsTypeCallback = callbacks.func;

      // action
      $scope.options = {
        dimensions: {
          one: {
            type: 'line'
          }
        }
      };
      $scope.$apply();

      // result
      expect(callbacks.func).toHaveBeenCalled();
    });

  });


  // registerChartCallback()
  describe('call the chart callback', function () {

    // setup for all tests in this block
    var callbacks = {};
    beforeEach(function () {
      callbacks = {
        func: angular.noop
      };
      spyOn(callbacks, 'func');
    });

    it('when chart is set.', function () {
      // setup
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();
      watcher.chartCallback = callbacks.func;

      // action
      $scope.options = {
        chart: {}
      };
      $scope.$apply();

      // result
      expect(callbacks.func).toHaveBeenCalled();
    });

    it('when chart is removed.', function () {
      // setup
      $scope.options = {
        chart: {}
      };
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();
      watcher.chartCallback = callbacks.func;

      // action
      $scope.options = {};
      $scope.$apply();

      // result
      expect(callbacks.func).toHaveBeenCalled();
    });

    it('not when something else is updated.', function () {
      // setup
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();
      watcher.chartCallback = callbacks.func;

      // action
      $scope.options = {
        something: 'else'
      };
      $scope.$apply();

      // result
      expect(callbacks.func).not.toHaveBeenCalled();
    });

  });


  // registerStateCallback()
  describe('call the state callback', function () {

    // setup for all tests in this block
    var callbacks = {};
    beforeEach(function () {
      callbacks = {
        func: angular.noop
      };
      spyOn(callbacks, 'func');
    });

    it('when state is set.', function () {
      // setup
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();
      watcher.stateCallback = callbacks.func;

      // action
      $scope.options = {
        state: {}
      };
      $scope.$apply();

      // result
      expect(callbacks.func).toHaveBeenCalled();
    });

    it('when state is removed.', function () {
      // setup
      $scope.options = {
        state: {}
      };
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();
      watcher.stateCallback = callbacks.func;

      // action
      $scope.options = {};
      $scope.$apply();

      // result
      expect(callbacks.func).toHaveBeenCalled();
    });

    it('not when something else is updated.', function () {
      // setup
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();
      watcher.stateCallback = callbacks.func;

      // action
      $scope.options = {
        something: 'else'
      };
      $scope.$apply();

      // result
      expect(callbacks.func).not.toHaveBeenCalled();
    });

  });


  // registerDataCallback()
  describe('call the data callback', function () {

    // setup for all tests in this block
    var callbacks = {};
    beforeEach(function () {
      callbacks = {
        func: angular.noop
      };
      spyOn(callbacks, 'func');
    });

    it('when data is set.', function () {
      // setup
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();
      watcher.dataCallback = callbacks.func;

      // action
      $scope.options = {
        data: []
      };
      $scope.$apply();

      // result
      expect(callbacks.func).toHaveBeenCalled();
    });

    it('when small data is removed.', function () {
      // setup
      $scope.options = {
        data: []
      };
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();
      watcher.dataCallback = callbacks.func;

      // action
      $scope.options = {};
      $scope.$apply();

      // result
      expect(callbacks.func).toHaveBeenCalled();
    });

    it('when big data is removed.', function () {
      // setup
      $scope.options = {
        data: []
      };
      for (var i = 0; i <= 100; i++) {
        $scope.options.data.push({data: i});
      }
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();
      watcher.dataCallback = callbacks.func;

      // action
      $scope.options = {};
      $scope.$apply();

      // result
      expect(callbacks.func).toHaveBeenCalled();
    });

    it('not when something else is updated.', function () {
      // setup
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();
      watcher.dataCallback = callbacks.func;

      // action
      $scope.options = {
        something: 'else'
      };
      $scope.$apply();

      // result
      expect(callbacks.func).not.toHaveBeenCalled();
    });

    it('when data inside the data array changes.', function () {
      // setup
      $scope.options = {
        data: [{
          data: 1
        }]
      };
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();
      watcher.dataCallback = callbacks.func;

      // action
      $scope.options.data[0].data = 2;
      $scope.$apply();

      // result
      expect(callbacks.func).toHaveBeenCalled();
    });

    it('when data is added to the data array.', function () {
      // setup
      $scope.options = {
        data: [{
          data: 1
        }]
      };
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();
      watcher.dataCallback = callbacks.func;

      // action
      $scope.options.data.push({data: 2});
      $scope.$apply();

      // result
      expect(callbacks.func).toHaveBeenCalled();
    });

    it('not when data inside a big data array changes.', function () {
      // setup
      $scope.options = {
        data: []
      };
      for (var i = 0; i <= 100; i++) {
        $scope.options.data.push({data: i});
      }
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();
      watcher.dataCallback = callbacks.func;

      // action
      $scope.options.data[0].data = 2;
      $scope.$apply();

      // result
      expect(callbacks.func).not.toHaveBeenCalled();
    });

    it('when data is added inside a big data array.', function () {
      // setup
      $scope.options = {
        data: []
      };
      for (var i = 0; i <= 100; i++) {
        $scope.options.data.push({data: i});
      }
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();
      watcher.dataCallback = callbacks.func;

      // action
      $scope.options.data.push({data: 2});
      $scope.$apply();

      // result
      expect(callbacks.func).toHaveBeenCalled();
    });

    it('when big data is updated to small data and then data is changed.', function () {
      // setup with 101 elements
      $scope.options = {
        data: []
      };
      for (var i = 0; i < 101; i++) {
        $scope.options.data.push({data: i});
      }
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();

      // remove to 50 elements
      $scope.options.data.splice(50, 50);
      $scope.$apply();

      // register callback
      watcher.dataCallback = callbacks.func;

      // change an element in small data
      $scope.options.data[0].data = 2;
      $scope.$apply();

      // result
      expect(callbacks.func).toHaveBeenCalled();
    });

    it('when small data is updated to big data and then data is added.', function () {
      // setup
      $scope.options = {
        data: []
      };
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();

      // add 101 elements
      for (var i = 0; i < 101; i++) {
        $scope.options.data.push({data: i});
      }
      $scope.$apply();

      // register callback
      watcher.dataCallback = callbacks.func;

      // change an element in small data
      $scope.options.data.push({data: 101});
      $scope.$apply();

      // result
      expect(callbacks.func).toHaveBeenCalled();
    });

    it('not when watchlimit is set and data inside a big data array changes.', function () {
      // setup
      $scope.options = {
        chart: {
          data: {
            watchLimit: 5
          }
        },
        data: []
      };
      for (var i = 0; i < 5; i++) {
        $scope.options.data.push({data: i});
      }
      var watcher = AngularChartWatcher.init($scope);
      $scope.$apply();
      watcher.dataCallback = callbacks.func;

      // action
      $scope.options.data[0].data = 2;
      $scope.$apply();

      // result
      expect(callbacks.func).not.toHaveBeenCalled();
    });

  });


  // updateState()
  it('should not call state callback state is updated with updateState().', function () {
    // setup
    var callbacks = {
      func: angular.noop
    };
    spyOn(callbacks, 'func');
    var watcher = AngularChartWatcher.init($scope);
    $scope.$apply();
    watcher.stateCallback = callbacks.func;

    // action
    AngularChartWatcher.updateState(watcher, function () {
      $scope.options = {
        state: {}
      };
    });
    $scope.$apply();

    // result
    expect(callbacks.func).not.toHaveBeenCalled();
  });


  // applyFunction()
  it('should call function with apply.', function () {
    // setup
    var callbacks = {
      func: angular.noop
    };
    spyOn(callbacks, 'func');
    var watcher = AngularChartWatcher.init($scope);
    $scope.$apply();

    // action
    AngularChartWatcher.applyFunction(watcher, callbacks.func);

    // result
    expect(callbacks.func).toHaveBeenCalled();
  });

});
