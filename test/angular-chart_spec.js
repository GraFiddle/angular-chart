'use strict';

/*global beforeEach, afterEach, describe, it, inject, expect, spyOn, module, angular*/
describe('angularChart', function () {

  var scope, $compile, $controller;
  var d3 = window.d3;

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

    scope.fireEvent = function (element, event) {
      if (element.fireEvent) {
        element.fireEvent('on' + event);
      } else {
        var evObj = document.createEvent('Events');

        evObj.initEvent(event, true, false);

        element.dispatchEvent(evObj);
      }
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

    it('should register onclick handler', function () {
      var handler = function () {};
      scope.options.onclick = handler;
      var element = $compile('<angularchart dataset="dataset" options="options"></angularchart>')(scope);

      var elementScope = scope.getElementScope(element);
      expect(elementScope.configuration.data.onclick).toBe(handler);
    });

    it('should set custom color', function () {
      var colors = {
        sales: '#ff0000'
      };
      scope.options.colors = colors;
      var element = $compile('<angularchart dataset="dataset" options="options"></angularchart>')(scope);

      var elementScope = scope.getElementScope(element);
      expect(elementScope.configuration.data.colors).toBe(colors);
    });

    it('should add label on y-axis', function () {
      var yAxis = {
        label: 'yAxis label'
      };
      scope.options.yAxis = yAxis;
      var element = $compile('<angularchart dataset="dataset" options="options"></angularchart>')(scope);

      var elementScope = scope.getElementScope(element);
      expect(elementScope.configuration.axis.y.label).toBe(yAxis.label);
    });
  });

  describe('The basic functionality: ', function () {

    var element;

    beforeEach(function () {
      var chartContainer = d3.select('body').append('div').attr('class', 'testContainer');
      chartContainer.append('angularchart').attr('dataset', 'dataset').attr('options', 'options');
      element = $compile(chartContainer.select('angularchart')[0][0])(scope);
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

    it('Creating a pie chart with defined rows', function () {
      scope.options.rows[0].type = 'pie';
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

    it('Creating a chart without xAxis by default', function () {
      scope.options.type = 'line';
      scope.options.xAxis.name = 'sales';
      scope.$apply();
      expect(element.html()).not.toContain('chooseXAxis');
    });

    it('Creating a chart with xAxis selector', function () {
      scope.options.type = 'line';
      scope.options.xAxis.name = 'sales';
      scope.options.xAxis.selector = true;
      scope.$apply();

      expect(element.html()).toContain('chooseXAxis');
    });


    it('Creating a line chart with subchart', function () {
      scope.options.subchart = {
        show: true
      };
      scope.$apply();

      expect(element.html()).not.toBe(null);
      expect(element.html()).not.toContain('toggleSubchart');
      // expect(element.html()).toContain('subchart');
    });

    it('Creating a line chart with subchart toggle and without subchart', function () {
      scope.options.subchart = {
        selector: true
      };
      scope.$apply();

      expect(element.html()).not.toBe(null);
      expect(element.html()).toContain('toggleSubchart');

      // toggle show subchart
      var elementScope = scope.getElementScope(element);
      elementScope.toggleSubchart();
      expect(scope.options.subchart.show).toBe(true);
    });

    it('Creating a line chart with subchart toggle and with subchart', function () {
      scope.options.subchart = {
        selector: true,
        show: true
      };
      scope.$apply();

      expect(element.html()).not.toBe(null);
      expect(element.html()).toContain('toggleSubchart');

      // toggle show subchart
      var elementScope = scope.getElementScope(element);
      elementScope.toggleSubchart();
      expect(scope.options.subchart.show).toBe(false);
    });

    it('Creating a line chart with custom legend', function () {
      scope.options.legend = {
        selector: true
      };
      scope.$apply();
      expect(element.html()).not.toBe(null);
      expect(element.html()).toContain('customLegend');

      // fire events
      d3.selectAll('.customLegend span')
        .each(function () {
          scope.fireEvent(this, 'click');
          scope.fireEvent(this, 'mouseover');
          scope.fireEvent(this, 'mouseout');
        });
    });

    it('Creating a line chart without legend', function () {
      scope.options.legend = {
        show: false
      };
      scope.$apply();
      expect(element.html()).not.toBe(null);
      expect(element.html()).not.toContain('customLegend');
    });

    it('Stacks 2 bar charts', function () {
      scope.options.groups = [
        ['sales', 'income']
      ];
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

      var chartContainer = d3.select('body').append('div').attr('class', 'testContainer');
      chartContainer.append('angularchart').attr('dataset', 'dataset').attr('options', 'options');
      element = $compile(chartContainer.select('angularchart')[0][0])(scope);

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