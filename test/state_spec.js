'use strict';

describe('Service: AngularChartConverter', function () {

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
      .and.callFake(function (watcher, func) {
        func();
      });
    spyOn(AngularChartWatcher, 'applyFunction')
      .and.callFake(function (watcher, func) {
        func();
      });
  }));

  var pointSelection = {
    id: 'data1',
    index: 0,
    name: 'data1',
    value: 30,
    x: 0
  };

  // get the service to test
  var AngularChartState;
  beforeEach(inject(function (_AngularChartState_) {
    AngularChartState = _AngularChartState_;
  }));

  //////////////////////////////////
  //          UNIT TESTS          //
  //////////////////////////////////

  // synchronizeZoom()
  it('should do nothing when zoom is not enabled.', function () {
    // setup
    var options = {};
    var configuration = angular.copy(baseConfiguration);
    var watcher = {};
    AngularChartState.synchronizeZoom(options, configuration, watcher);

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
    AngularChartState.synchronizeZoom(options, configuration);

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
    var watcher = {};
    AngularChartState.synchronizeZoom(options, configuration, watcher);

    // event
    var range = [0, 1];
    configuration.zoom.onzoomend(range);

    // result
    expect(options.state.range).toEqual(range);
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
    var watcher = {};
    AngularChartState.synchronizeZoom(options, configuration, watcher);
    spyOn(options.chart.zoom, 'onzoomend');
    AngularChartState.synchronizeZoom(options, configuration, watcher);

    // event
    var range = [0, 1];
    configuration.zoom.onzoomend(range);

    // result
    expect(options.state.range).toEqual(range);
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
    var watcher = {};
    AngularChartState.synchronizeZoom(options, configuration, watcher);

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
    var watcher = {};
    AngularChartState.synchronizeZoom(options, configuration, watcher);
    AngularChartState.synchronizeZoom(options, configuration, watcher);

    // event
    var range = [0, 1];
    configuration.subchart.onbrush(range);

    // result
    expect(options.state.range).toEqual(range);
  });

  it('should update range and call callback when onbrush is fired.', function () {
    // setup
    var options = {
      chart: {
        subchart: {
          show: true,
          onbrush: angular.noop
        }
      },
      state: {
        range: [-1, 2]
      }
    };
    var configuration = angular.copy(baseConfiguration);
    var watcher = {};
    AngularChartState.synchronizeZoom(options, configuration, watcher);
    spyOn(options.chart.subchart, 'onbrush');

    // event
    var range = [0, 1];
    configuration.subchart.onbrush(range);

    // result
    expect(options.state.range).toEqual(range);
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
        range: [0, 1]
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
        range: [0, 1]
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


  // synchronizeSelection()
  it('should do nothing if selections are not enabled.', function () {
    // setup
    var options = {};
    var configuration = angular.copy(baseConfiguration);
    var watcher = {};
    AngularChartState.synchronizeSelection(options, configuration, watcher);

    // result
    expect(configuration).toEqual(baseConfiguration);
  });

  it('should add add selection listener.', function () {
    // setup
    var options = {
      chart: {
        data: {
          selection: {
            enabled: true
          }
        }
      }
    };
    var configuration = angular.copy(baseConfiguration);
    var watcher = {};
    AngularChartState.synchronizeSelection(options, configuration, watcher);

    // result
    expect(configuration.data.onselected).toBeDefined();
  });

  it('should add remove selection listener.', function () {
    // setup
    var options = {
      chart: {
        data: {
          selection: {
            enabled: true
          }
        }
      }
    };
    var configuration = angular.copy(baseConfiguration);
    var watcher = {};
    AngularChartState.synchronizeSelection(options, configuration, watcher);

    // result
    expect(configuration.data.onunselected).toBeDefined();

  });

  it('should add selection when add selection is fired.', function () {
    // setup
    var options = {
      chart: {
        data: {
          selection: {
            enabled: true
          }
        }
      }
    };
    var configuration = angular.copy(baseConfiguration);
    var watcher = {};
    AngularChartState.synchronizeSelection(options, configuration, watcher);

    // event
    configuration.data.onselected(pointSelection);

    // result
    expect(options.state.selected.length).toBe(1);
    expect(options.state.selected[0]).toEqual(pointSelection);
  });

  it('should remove selection when remove selection is fired.', function () {
    // setup
    var options = {
      chart: {
        data: {
          selection: {
            enabled: true
          }
        }
      },
      state: {
        selected: [pointSelection]
      }
    };
    var configuration = angular.copy(baseConfiguration);
    var watcher = {};
    AngularChartState.synchronizeSelection(options, configuration, watcher);

    // event
    configuration.data.onunselected(pointSelection);

    // result
    expect(options.state.selected.length).toBe(0);
  });

  it('should not add selection when add selection is fired but the disabled flag is set.', function () {
    // setup
    var options = {
      chart: {
        data: {
          selection: {
            enabled: true
          }
        }
      }
    };
    var configuration = angular.copy(baseConfiguration);
    var watcher = {};
    AngularChartState.synchronizeSelection(options, configuration, watcher);

    // event
    AngularChartState.disableSelectionListener = true;
    configuration.data.onselected(pointSelection);

    // result
    expect(options.state).toBeUndefined();
  });

  it('should remove selection when remove selection is fired but the disabled flag is set.', function () {
    // setup
    var options = {
      chart: {
        data: {
          selection: {
            enabled: true
          }
        }
      },
      state: {
        selected: [pointSelection]
      }
    };
    var configuration = angular.copy(baseConfiguration);
    var watcher = {};
    AngularChartState.synchronizeSelection(options, configuration, watcher);

    // event
    AngularChartState.disableSelectionListener = true;
    configuration.data.onunselected(pointSelection);

    // result
    expect(options.state.selected.length).toBe(1);
  });

  it('should add selection and call callback when add selection is fired.', function () {
    // setup
    var options = {
      chart: {
        data: {
          selection: {
            enabled: true
          },
          onselected: angular.noop
        }
      }
    };
    var configuration = angular.copy(baseConfiguration);
    var watcher = {};
    AngularChartState.synchronizeSelection(options, configuration, watcher);
    spyOn(options.chart.data, 'onselected');

    // event
    configuration.data.onselected(pointSelection);

    // result
    expect(options.state.selected.length).toBe(1);
    expect(options.state.selected[0]).toEqual(pointSelection);
    expect(options.chart.data.onselected).toHaveBeenCalled();
  });

  it('should remove selection and call callback when remove selection is fired.', function () {
    // setup
    var options = {
      chart: {
        data: {
          selection: {
            enabled: true
          },
          onunselected: angular.noop
        }
      },
      state: {
        selected: [pointSelection]
      }
    };
    var configuration = angular.copy(baseConfiguration);
    var watcher = {};
    AngularChartState.synchronizeSelection(options, configuration, watcher);
    spyOn(options.chart.data, 'onunselected');

    // event
    configuration.data.onunselected(pointSelection);

    // result
    expect(options.state.selected.length).toBe(0);
    expect(options.chart.data.onunselected).toHaveBeenCalled();
  });


  // applySelection()
  it('should not apply selections if selections are not enabled.', function () {
    // setup
    var options = {};
    var chart = {
      select: angular.noop
    };
    AngularChartState.applySelection(options, chart);
    spyOn(chart, 'select');

    // result
    expect(chart.select).not.toHaveBeenCalled();
  });

  it('should reset selections if none provided and selections are enabled.', function () {
    // setup
    var options = {
      chart: {
        data: {
          selection: {
            enabled: true
          }
        }
      }
    };
    var chart = {
      unselect: angular.noop
    };
    AngularChartState.applySelection(options, chart);
    spyOn(chart, 'unselect');

    // result
    // TODO spy doesn't work
    //expect(chart.unselect).toHaveBeenCalled();
  });

  it('should apply provided selections if selections are enabled.', function () {
    // setup
    var options = {
      chart: {
        data: {
          selection: {
            enabled: true
          }
        }
      },
      state: {
        selected: [pointSelection]
      }
    };
    var chart = {
      select: angular.noop
    };
    AngularChartState.applySelection(options, chart);
    spyOn(chart, 'select');

    // result
    // TODO spy doesn't work
    //expect(chart.select).toHaveBeenCalled();
  });

});
