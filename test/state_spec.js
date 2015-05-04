'use strict';

describe('Service: AngularChartConverter', function() {

  //////////////////////////////////
  //      SETUP / INJECTION       //
  //////////////////////////////////

  beforeEach(module('angularChart'));

  var baseConfiguration;
  beforeEach(inject(function (_baseConfiguration_) {
    baseConfiguration = _baseConfiguration_;
  }));

  var AngularChartWatcher;
  beforeEach(inject(function (_AngularChartWatcher_) {
    AngularChartWatcher = _AngularChartWatcher_;
    spyOn(AngularChartWatcher, 'updateState')
      .and.callFake(function(func) {
        func();
      });
    spyOn(AngularChartWatcher, 'applyFunction')
      .and.callFake(function(func) {
        func();
      });
  }));

  // get the service to test
  var AngularChartState;
  beforeEach(inject(function (_AngularChartState_) {
    AngularChartState = _AngularChartState_;
  }));

  //////////////////////////////////
  //          UNIT TESTS          //
  //////////////////////////////////

  // syncronizeZoom()
  it('should do nothing when zoom is not enabled.', function () {
    // setup
    var options = {};
    var configuration = angular.copy(baseConfiguration);
    AngularChartState.syncronizeZoom(options, configuration);

    // result
    expect(configuration).toEqual(baseConfiguration);
  });

  it('should setup onzoomend listener.', function () {
    // setup
    var options = {
      chart: {
        zoom: {
          enabled: true
        }
      }
    };
    var configuration = angular.copy(baseConfiguration);
    AngularChartState.syncronizeZoom(options, configuration);

    // result
    expect(configuration.zoom.onzoomend).toBeDefined();
  });

  it('should update range when onzoomend is fired.', function () {
    // setup
    var options = {
      chart: {
        zoom: {
          enabled: true
        }
      }
    };
    var configuration = angular.copy(baseConfiguration);
    AngularChartState.syncronizeZoom(options, configuration);

    // event
    var range = [0, 1];
    configuration.zoom.onzoomend(range);

    // result
    expect(options.state.zoom.range).toEqual(range);
  });

  it('should update range and call callback when onzoomend is fired.', function () {
    // setup
    var options = {
      chart: {
        zoom: {
          enabled: true,
          onzoomend: angular.noop
        }
      }
    };
    var configuration = angular.copy(baseConfiguration);
    AngularChartState.syncronizeZoom(options, configuration);
    spyOn(options.chart.zoom, 'onzoomend');
    AngularChartState.syncronizeZoom(options, configuration);

    // event
    var range = [0, 1];
    configuration.zoom.onzoomend(range);

    // result
    expect(options.state.zoom.range).toEqual(range);
    expect(options.chart.zoom.onzoomend).toHaveBeenCalled();
  });

  it('should setup onbrush listener.', function () {
    // setup
    var options = {
      chart: {
        subchart: {
          show: true
        }
      }
    };
    var configuration = angular.copy(baseConfiguration);
    AngularChartState.syncronizeZoom(options, configuration);

    // result
    expect(configuration.subchart.onbrush).toBeDefined();
  });

  it('should update range when onbrush is fired.', function () {
    // setup
    var options = {
      chart: {
        subchart: {
          show: true
        }
      }
    };
    var configuration = angular.copy(baseConfiguration);
    AngularChartState.syncronizeZoom(options, configuration);
    AngularChartState.syncronizeZoom(options, configuration);

    // event
    var range = [0, 1];
    configuration.subchart.onbrush(range);

    // result
    expect(options.state.zoom.range).toEqual(range);
  });

  it('should update range and call callback when onbrush is fired.', function () {
    // setup
    var options = {
      chart: {
        subchart: {
          show: true,
          onbrush: angular.noop
        }
      }
    };
    var configuration = angular.copy(baseConfiguration);
    AngularChartState.syncronizeZoom(options, configuration);
    spyOn(options.chart.subchart, 'onbrush');

    // event
    var range = [0, 1];
    configuration.subchart.onbrush(range);

    // result
    expect(options.state.zoom.range).toEqual(range);
    expect(options.chart.subchart.onbrush).toHaveBeenCalled();
  });


  // applyZoom()
  it('should do nothing if neither zoom nor subchart is enabled.', function () {
    // setup
    var options = {};
    var chart = {
      zoom: angular.noop
    };
    AngularChartState.applyZoom(options, chart);
    spyOn(chart, 'zoom');

    // result
    expect(chart.zoom).not.toHaveBeenCalled();
  });

  it('should reset the zoom if none is set and zoom is enabled.', function () {
    // setup
    var options = {
      chart: {
        zoom: {
          enabled: true
        }
      }
    };
    var chart = {
      zoom: angular.noop,
      unzoom: angular.noop
    };
    AngularChartState.applyZoom(options, chart);
    spyOn(chart, 'zoom');
    spyOn(chart, 'unzoom');

    // result
    expect(chart.zoom).not.toHaveBeenCalled();
    // TODO spy does not work?!
    //expect(chart.unzoom).toHaveBeenCalled();
  });

  it('should reset the zoom if none is set and subchart is shown.', function () {
    // setup
    var options = {
      chart: {
        subchart: {
          show: true
        }
      }
    };
    var chart = {
      zoom: angular.noop,
      unzoom: angular.noop
    };
    AngularChartState.applyZoom(options, chart);
    spyOn(chart, 'zoom');
    spyOn(chart, 'unzoom');

    // result
    expect(chart.zoom).not.toHaveBeenCalled();
    // TODO spy does not work?!
    //expect(chart.unzoom).toHaveBeenCalled();
  });

  it('should apply the zoom if range is set and zoom is enabled.', function () {
    // setup
    var options = {
      chart: {
        zoom: {
          enabled: true
        }
      },
      state: {
        zoom: {
          range: [0, 1]
        }
      }
    };
    var chart = {
      zoom: angular.noop,
      unzoom: angular.noop
    };
    AngularChartState.applyZoom(options, chart);
    spyOn(chart, 'zoom');
    spyOn(chart, 'unzoom');

    // result
    // TODO spy does not work?!
    //expect(chart.zoom).toHaveBeenCalled();
    expect(chart.unzoom).not.toHaveBeenCalled();
  });

  it('should apply the zoom if range is set and subchart is shown.', function () {
    // setup
    var options = {
      chart: {
        subchart: {
          show: true
        }
      },
      state: {
        zoom: {
          range: [0, 1]
        }
      }
    };
    var chart = {
      zoom: angular.noop,
      unzoom: angular.noop
    };
    AngularChartState.applyZoom(options, chart);
    spyOn(chart, 'zoom');
    spyOn(chart, 'unzoom');

    // result
    // TODO spy does not work?!
    //expect(chart.zoom).toHaveBeenCalled();
    expect(chart.unzoom).not.toHaveBeenCalled();
  });

});
