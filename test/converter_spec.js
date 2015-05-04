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

  // get the service to test
  var AngularChartConverter;
  beforeEach(inject(function (_AngularChartConverter_) {
    AngularChartConverter = _AngularChartConverter_;
  }));

  //////////////////////////////////
  //          UNIT TESTS          //
  //////////////////////////////////

  // convertData()
  it('should do nothing when no data is provided.', function() {
    // setup
    var options = {};
    var configuration = angular.copy(baseConfiguration);
    AngularChartConverter.convertData(options, configuration);

    // result
    expect(configuration).toEqual(baseConfiguration);
  });

  it('should copy provided data into configuration.', function() {
    // setup
    var options = {
      data: {
        row1: 10
      }
    };
    var configuration = angular.copy(baseConfiguration);
    AngularChartConverter.convertData(options, configuration);

    // result
    var expectedResult = angular.copy(baseConfiguration);
    expectedResult.data.json = options.data;
    expect(configuration).toEqual(expectedResult);
  });


  // convertDimensions()
  it('should do nothing if no dimensions are provided.', function() {
    // setup
    var options = {};
    var configuration = angular.copy(baseConfiguration);
    AngularChartConverter.convertDimensions(options, configuration);

    // result
    expect(configuration).toEqual(baseConfiguration);
  });

  it('should add the key for each dimension.', function() {
    // setup
    var options = {
      dimensions: {
        row1: {}
      }
    };
    var configuration = angular.copy(baseConfiguration);
    AngularChartConverter.convertDimensions(options, configuration);

    // result
    var expectedResult = angular.copy(baseConfiguration);
    expectedResult.data.keys.value = ['row1'];
    expect(configuration).toEqual(expectedResult);
  });

  it('should add the key for shown dimension.', function() {
    // setup
    var options = {
      dimensions: {
        row1: {
          show: false
        },
        row2: {
          show: true
        }
      }
    };
    var configuration = angular.copy(baseConfiguration);
    AngularChartConverter.convertDimensions(options, configuration);

    // result
    var expectedResult = angular.copy(baseConfiguration);
    expectedResult.data.keys.value = ['row2'];
    expect(configuration).toEqual(expectedResult);
  });

  it('should add dimension name when provided.', function() {
    // setup
    var options = {
      dimensions: {
        row1: {
          name: 'NewName'
        }
      }
    };
    var configuration = angular.copy(baseConfiguration);
    AngularChartConverter.convertDimensions(options, configuration);

    // result
    var expectedResult = angular.copy(baseConfiguration);
    expectedResult.data.keys.value = ['row1'];
    expectedResult.data.names.row1 = options.dimensions.row1.name;
    expect(configuration).toEqual(expectedResult);
  });

  it('should add dimension type when provided.', function() {
    // setup
    var options = {
      dimensions: {
        row1: {
          type: 'bar'
        }
      }
    };
    var configuration = angular.copy(baseConfiguration);
    AngularChartConverter.convertDimensions(options, configuration);

    // result
    var expectedResult = angular.copy(baseConfiguration);
    expectedResult.data.keys.value = ['row1'];
    expectedResult.data.types.row1 = options.dimensions.row1.type;
    expect(configuration).toEqual(expectedResult);
  });

  it('should add dimension color when provided.', function() {
    // setup
    var options = {
      dimensions: {
        row1: {
          color: 'green'
        }
      }
    };
    var configuration = angular.copy(baseConfiguration);
    AngularChartConverter.convertDimensions(options, configuration);

    // result
    var expectedResult = angular.copy(baseConfiguration);
    expectedResult.data.keys.value = ['row1'];
    expectedResult.data.colors.row1 = options.dimensions.row1.color;
    expect(configuration).toEqual(expectedResult);
  });

  it('should do nothing when dimension axis is y.', function() {
    // setup
    var options = {
      dimensions: {
        row1: {
          axis: 'y'
        }
      }
    };
    var configuration = angular.copy(baseConfiguration);
    AngularChartConverter.convertDimensions(options, configuration);

    // result
    var expectedResult = angular.copy(baseConfiguration);
    expectedResult.data.keys.value = ['row1'];
    expect(configuration).toEqual(expectedResult);
  });

  it('should add dimension to axis when provided and show only used axes.', function() {
    // setup
    var options = {
      dimensions: {
        row1: {
          axis: 'y2'
        }
      }
    };
    var configuration = angular.copy(baseConfiguration);
    AngularChartConverter.convertDimensions(options, configuration);

    // result
    var expectedResult = angular.copy(baseConfiguration);
    expectedResult.data.keys.value = ['row1'];
    expectedResult.data.axes.row1 = 'y2';
    expectedResult.axis.y2.show = true;
    expectedResult.axis.y.show = false;
    expect(configuration).toEqual(expectedResult);
  });

  it('should add dimension to axis when provided and show all used axes.', function() {
    // setup
    var options = {
      dimensions: {
        row1: {
          axis: 'y2'
        },
        row2: {
          axis: 'y'
        }
      }
    };
    var configuration = angular.copy(baseConfiguration);
    AngularChartConverter.convertDimensions(options, configuration);

    // result
    var expectedResult = angular.copy(baseConfiguration);
    expectedResult.data.keys.value = ['row1', 'row2'];
    expectedResult.data.axes.row1 = 'y2';
    expectedResult.axis.y2.show = true;
    expectedResult.axis.y.show = true;
    expect(configuration).toEqual(expectedResult);
  });

  it('should set x-Axis if dimension axis x.', function() {
    // setup
    var options = {
      dimensions: {
        row1: {
          axis: 'x'
        }
      }
    };
    var configuration = angular.copy(baseConfiguration);
    AngularChartConverter.convertDimensions(options, configuration);

    // result
    var expectedResult = angular.copy(baseConfiguration);
    expectedResult.data.keys.value = ['row1'];
    expectedResult.data.keys.x = 'row1';
    expectedResult.data.x = 'row1';
    expectedResult.axis.y.show = false;
    expect(configuration).toEqual(expectedResult);
  });

  it('should set x-Axis format if dimension and displayFormat present.', function() {
    // setup
    var options = {
      dimensions: {
        row1: {
          axis: 'x',
          displayFormat: function(){}
        }
      }
    };
    var configuration = angular.copy(baseConfiguration);
    AngularChartConverter.convertDimensions(options, configuration);

    // result
    var expectedResult = angular.copy(baseConfiguration);
    expectedResult.data.keys.value = ['row1'];
    expectedResult.data.keys.x = 'row1';
    expectedResult.data.x = 'row1';
    expectedResult.axis.y.show = false;
    expectedResult.axis.x.tick.format = options.dimensions.row1.displayFormat;
    expect(configuration).toEqual(expectedResult);
  });

  it('should add dimension label when true.', function() {
    // setup
    var options = {
      dimensions: {
        row1: {
          label: true
        }
      }
    };
    var configuration = angular.copy(baseConfiguration);
    AngularChartConverter.convertDimensions(options, configuration);

    // result
    var expectedResult = angular.copy(baseConfiguration);
    expectedResult.data.keys.value = ['row1'];
    expectedResult.data.labels.format.row1 = true;
    expect(configuration).toEqual(expectedResult);
  });

  it('should add dimension label with format.', function() {
    // setup
    var options = {
      dimensions: {
        row1: {
          label: true,
          displayFormat: function() {}
        }
      }
    };
    var configuration = angular.copy(baseConfiguration);
    AngularChartConverter.convertDimensions(options, configuration);

    // result
    var expectedResult = angular.copy(baseConfiguration);
    expectedResult.data.keys.value = ['row1'];
    expectedResult.data.labels.format.row1 = options.dimensions.row1.displayFormat;
    expect(configuration).toEqual(expectedResult);
  });


  // convertDimensions()
  it('should do nothing if no schema is provided.', function() {
    // setup
    var options = {};
    var configuration = angular.copy(baseConfiguration);
    AngularChartConverter.convertSchema(options, configuration);

    // result
    expect(configuration).toEqual(baseConfiguration);
  });

});
