'use strict';

/*global beforeEach, afterEach, describe, it, inject, expect, spyOn, module, angular*/
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
        type: 'bar',
        label: 'sold'
      }],
      xAxis: {
        name: 'day',
        displayFormat: '%Y-%m-%d %H:%M:%S'
      },
      type: 'line'
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
        }
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

  describe('The basic functionality: ', function () {

    var element;

    beforeEach(function () {
      element = $compile('<angularchart dataset="dataset" options="options"></angularchart>')(scope);
      scope.$apply();
    });

    it('Creating basic chart', function () {
      expect(element.html()).not.toBe(null);
    });

    it('Watching dataset changes', function () {
      scope.addData();
      scope.$apply();

      expect(element.html()).not.toBe(null);
    });

    it('Watching options changes', function () {
      scope.addOptions();
      scope.$apply();

      expect(element.html()).not.toBe(null);
    });

    it('Warning if no datetime format is provided', function () {
      spyOn(console, 'warn');

      // remove format
      delete scope.dataset.schema[0].format;
      scope.$apply();

      expect(element.html()).not.toBe(null);
      expect(console.warn).toHaveBeenCalled();
    });

    it('Creating a pie chart', function () {
      scope.options.type = 'pie';
      scope.$apply();

      expect(element.html()).not.toBe(null);
    });

    it('Creating a line chart with Double xAxis', function () {
      scope.options.type = 'line';
      scope.options.xAxis.name = 'sales';
      scope.$apply();

      expect(element.html()).not.toBe(null);
    });

  });


  describe('Selections: ', function () {

    var element, elementScope;

    beforeEach(function () {
      scope.options.selection = {
        enabled: true
      };

      element = $compile('<angularchart dataset="dataset" options="options"></angularchart>')(scope);
      elementScope = scope.getElementScope(element);
    });

    it('Runs with selections enabled', function () {
      expect(element.html()).not.toBe(null);
    });

    it('watch add selections', function () {
      scope.options.selection.selected = [];

      // add external selection
      scope.options.selection.selected.push({
        id: 'test',
        index: 3
      });
      scope.$apply();

      // external unselection
      scope.options.selection.selected = scope.options.selection.selected.splice(0, 1);
      scope.$apply();
    });

    it('watch add multiple selections at once', function () {
      scope.options.selection.selected = [];

      // add external selection
      scope.options.selection.selected.push({
        id: 'test',
        index: 3
      });
      scope.options.selection.selected.push({
        id: 'test',
        index: 4
      });
      scope.$apply();

      // external unselection
      scope.options.selection.selected = scope.options.selection.selected.splice(0, 1);
      scope.$apply();
    });

    it('watch remove selections', function () {
      scope.options.selection.selected = [];

      // add external selection
      scope.options.selection.selected.push({
        id: 'test',
        index: 3
      });
      scope.$apply();

      scope.options.selection.selected.push({
        id: 'test',
        index: 4
      });
      scope.$apply();

      // external unselection
      scope.options.selection.selected = scope.options.selection.selected.splice(1, 1);
      scope.$apply();
    });

    it('watch view selections', function () {
      expect(scope.options.selection.selected.length).toBe(0);

      // chart selection
      elementScope.configuration.data.onselected({}, {});
      expect(element.html()).not.toBe(null);

      expect(scope.options.selection.selected.length).toBe(1);
    });

    it('watch view selections, if not disabled', function () {
      expect(scope.options.selection.selected.length).toBe(0);

      // avoid selections
      elementScope.selections.avoidSelections = true;

      // chart selection
      elementScope.configuration.data.onselected({}, {});

      // was not added
      expect(scope.options.selection.selected.length).toBe(0);
      elementScope.selections.avoidSelections = false;
    });

    it('watch view unselections without existing selections', function () {
      // chart unselection
      elementScope.configuration.data.onunselected({}, {});
      expect(element.html()).not.toBe(null);
    });

    it('watch view unselections with existing selections', function () {
      // add external selection
      scope.options.selection.selected.push({
        id: 'test',
        index: 3
      });
      scope.$apply();
      expect(scope.options.selection.selected.length).toBe(1);

      // chart unselection
      elementScope.configuration.data.onunselected({
        id: 'test',
        index: 3
      }, {});
      expect(scope.options.selection.selected.length).toBe(0);
    });

    it('watch view selections, if not disabled', function () {
      // add selection
      scope.options.selection.selected.push({
        id: 'test',
        index: 3
      });
      scope.$apply();
      expect(scope.options.selection.selected.length).toBe(1);

      // avoid selections
      elementScope.selections.avoidSelections = true;

      // chart unselection
      elementScope.configuration.data.onunselected({
        id: 'test',
        index: 3
      }, {});

      // was not added
      expect(scope.options.selection.selected.length).toBe(1);
      elementScope.selections.avoidSelections = false;
    });

  });

});