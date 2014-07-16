'use strict';

/*global beforeEach, afterEach, describe, it, inject, expect, module, angular*/
describe('angularChart', function () {

  var scope, $compile, $controller;

  beforeEach(module('angularChart'));
  beforeEach(inject(function (_$rootScope_, _$compile_, _$controller_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $controller = _$controller_;

    scope.dataset = {
      'metadata': {
        'name': 'demo-dataset'
      },
      'schema': [{
        'name': 'day',
        'type': 'datetime',
        'format': '%Y-%m-%dT%H:%M:%S'
      }, {
        'name': 'sales',
        'type': 'double'
      }, {
        'name': 'dayString',
        'type': 'string'
      }],
      'records': [{
        'day': '2013-01-02T00:00:00',
        'sales': 13461.295202,
        'dayString': 'Monday'
      }, {
        'day': '2013-01-03T00:00:00',
        'sales': 23461.295202,
        'dayString': 'Tuesday'
      }, {
        'day': '2013-01-04T00:00:00',
        'sales': 33461.295202,
        'dayString': 'Wednesday'
      }, {
        'day': '2013-01-05T00:00:00',
        'sales': 43461.295202,
        'dayString': 'Thursday'
      }]
    };
    scope.options = {
        rows: [{
          name: 'sales',
          type: 'bar'
        }],
        xAxis: {
          name: 'day',
          displayFormat: '%Y-%m-%d %H:%M:%S'
        },
        yAxis: {}
      };

    scope.addData = function () {
      scope.dataset.records.push({
        'day': '2013-01-06T00:00:00',
        'sales': 53461.295202
      });
    };

    scope.addOptions = function () {
      scope.options = {
        rows: [{
          name: 'sales'
        }],
        xAxis: {
          name: 'dayString'
        },
        yAxis: {}
      };
    };

    scope.getElementScope = function (element) {
      return element.scope().$$childTail;
    };

  }));

  describe('scope initialization', function () {

    it('requires a valid dataset object', function () {
      expect(function () {
        $compile('<angularchart dataset="dataset" options="options"></angularchart>')(scope);
      }).not.toThrow();
      expect(function () {
        $compile('<angularchart dataset options="options"></angularchart>')(scope);
      }).toThrow();
      expect(function () {
        $compile('<angularchart options="options"></angularchart>')(scope);
      }).toThrow();
      expect(function () {
        $compile('<angularchart dataset="nonObject" options="options"></angularchart>')(scope);
      }).toThrow();
      expect(function () {
        scope.nonResourceObject = {};
        $compile('<angularchart dataset="nonResourceObject" options="options"></angularchart>')(scope);
      }).toThrow();
    });

    it('not requires the optional options object', function () {
      expect(function () {
        $compile('<angularchart dataset="dataset" options="options"></angularchart>')(scope);
      }).not.toThrow();
      expect(function () {
        $compile('<angularchart dataset="dataset" options></angularchart>')(scope);
      }).not.toThrow();
      expect(function () {
        $compile('<angularchart dataset="dataset"></angularchart>')(scope);
      }).not.toThrow();
      expect(function () {
        $compile('<angularchart dataset="dataset" options="nonObject"></angularchart>')(scope);
      }).not.toThrow();
      expect(function () {
        scope.nonResourceObject = {};
        $compile('<angularchart dataset="dataset" options="nonResourceObject"></angularchart>')(scope);
      }).not.toThrow();
    });

    it('should attach methods to the scope', function () {
      var element = $compile('<angularchart dataset="dataset" options="options"></angularchart>')(scope);
      var elementScope = scope.getElementScope(element);

      expect(elementScope.addIdentifier).toBeDefined();
      expect(elementScope.loadChart).toBeDefined();
      expect(elementScope.updateChart).toBeDefined();
      expect(elementScope.startOptionsWatcher).toBeDefined();
      expect(elementScope.startDatasetWatcher).toBeDefined();
    });

    it('should not modify the parent scope', function () {
      var element = $compile('<angularchart dataset="dataset" options="options"></angularchart>')(scope);

      expect(scope.addIdentifier).not.toBeDefined();
      expect(scope.loadChart).not.toBeDefined();
      expect(scope.updateChart).not.toBeDefined();
      expect(scope.startOptionsWatcher).not.toBeDefined();
      expect(scope.startDatasetWatcher).not.toBeDefined();
    });

    it('should have equal object in both scopes', function () {
      var element = $compile('<angularchart dataset="dataset" options="options"></angularchart>')(scope);
      var elementScope = scope.getElementScope(element);

      expect(scope.options).toEqual(elementScope.options);
      expect(scope.dataset).toEqual(elementScope.dataset);
    });
  });

  describe('first test calls', function () {

    var element;

    beforeEach(function () {
      element = $compile('<angularchart dataset="dataset" options="options"></angularchart>')(scope);
      scope.$apply();
    });

    it('basic chart', function () {
      //console.log(element);
    });

    it('watch data', function () {
      scope.addData();
      scope.$apply();

      //console.log(element);
    });

    it('no datetime format provided data', function () {
      delete scope.dataset.schema[0].format;
      scope.$apply();

      //console.log(element);
    });

    it('watch options', function () {
      scope.addOptions();
      scope.$apply();

      //console.log(element);
    });

    it('watch selections', function () {
      var elementScope = scope.getElementScope(element);

      // chart selection
      elementScope.configuration.data.onselected({}, {});
      
      // chart unselection
      elementScope.configuration.data.onunselected({}, {});

      // external selection
      scope.options.selection.selected.push({id: 'test', index: 3});
      scope.$apply();
      scope.options.selection.selected.push({id: 'test', index: 4});
      scope.$apply();

      // external unselection
      scope.options.selection.selected = scope.options.selection.selected.splice(0,1);
      scope.$apply();
    });

  });

});