'use strict';

/*jshint -W079 */
/*jshint -W020 */
var require;
/*global beforeEach, afterEach, describe, it, inject, expect, spyOn, module, angular*/
describe('angularChart:', function () {

  var $scope, $compile, $controller;
  var angular = window.angular;
  window.angular = undefined;
  var d3 = window.d3;
  var c3 = window.c3;
  var dataArray = window.dataArray;
  var optionsArray = window.optionsArray;


  beforeEach(module('angularChart'));
  beforeEach(inject(function (_$rootScope_, _$compile_, _$controller_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    $controller = _$controller_;


    $scope.getElementScope = function (element) {
      return element.scope().$$childTail;
    };

    $scope.fireEvent = function (element, event) {
      if (element.fireEvent) {
        element.fireEvent('on' + event);
      } else {
        var evObj = document.createEvent('Events');

        evObj.initEvent(event, true, false);

        element.dispatchEvent(evObj);
      }
    };

  }));

  describe('$scope initialization', function () {

    beforeEach(function () {
      $scope.dataset = JSON.parse(JSON.stringify(dataArray[0].data));
      $scope.schema = JSON.parse(JSON.stringify(dataArray[0].schema));
      $scope.options = JSON.parse(JSON.stringify(optionsArray[0].options));
    });

    it('requires a valid dataset object', function () {
      expect(function () {
        $compile('<angularchart dataset="dataset" options="options"></angularchart>')($scope);
      }).not.toThrow();
      expect(function () {
        $compile('<angularchart dataset options="options"></angularchart>')($scope);
      }).toThrow();
      expect(function () {
        $compile('<angularchart options="options"></angularchart>')($scope);
      }).toThrow();
      expect(function () {
        $compile('<angularchart dataset="nonObject" options="options"></angularchart>')($scope);
      }).toThrow();
      expect(function () {
        $scope.nonResourceObject = {};
        $compile('<angularchart dataset="nonResourceObject" options="options"></angularchart>')($scope);
      }).toThrow();
    });

    it('not requires the optional options object', function () {
      expect(function () {
        $compile('<angularchart dataset="dataset" options="options"></angularchart>')($scope);
      }).not.toThrow();
      expect(function () {
        $compile('<angularchart dataset="dataset" options></angularchart>')($scope);
      }).not.toThrow();
      expect(function () {
        $compile('<angularchart dataset="dataset"></angularchart>')($scope);
      }).not.toThrow();
      expect(function () {
        $compile('<angularchart dataset="dataset" options="nonObject"></angularchart>')($scope);
      }).not.toThrow();
      expect(function () {
        $scope.nonResourceObject = {};
        $compile('<angularchart dataset="dataset" options="nonResourceObject"></angularchart>')($scope);
      }).not.toThrow();
    });

    it('not requires the optional schema object', function () {
      expect(function () {
        $compile('<angularchart dataset="dataset" schema="schema"></angularchart>')($scope);
      }).not.toThrow();
      expect(function () {
        $compile('<angularchart dataset="dataset" schema></angularchart>')($scope);
      }).not.toThrow();
      expect(function () {
        $compile('<angularchart dataset="dataset"></angularchart>')($scope);
      }).not.toThrow();
      expect(function () {
        $compile('<angularchart dataset="dataset" schema="nonObject"></angularchart>')($scope);
      }).not.toThrow();
      expect(function () {
        $scope.nonResourceObject = {};
        $compile('<angularchart dataset="dataset" schema="nonResourceObject"></angularchart>')($scope);
      }).not.toThrow();
    });

    it('should attach methods to the $scope', function () {
      var element = $compile('<angularchart dataset="dataset" options="options"></angularchart>')($scope);
      var elementScope = $scope.getElementScope(element);

      expect(elementScope.addIdentifier).toBeDefined();
      expect(elementScope.updateChart).toBeDefined();
      expect(elementScope.startOptionsWatcher).toBeDefined();
      expect(elementScope.startDatasetWatcher).toBeDefined();
    });

    it('should not modify the parent $scope', function () {
      var element = $compile('<angularchart dataset="dataset" options="options"></angularchart>')($scope);

      expect($scope.addIdentifier).not.toBeDefined();
      expect($scope.updateChart).not.toBeDefined();
      expect($scope.startOptionsWatcher).not.toBeDefined();
      expect($scope.startDatasetWatcher).not.toBeDefined();
    });

    it('should have equal object in both $scopes', function () {
      var element = $compile('<angularchart dataset="dataset" options="options"></angularchart>')($scope);
      var elementScope = $scope.getElementScope(element);

      expect($scope.options).toEqual(elementScope.options);
      expect($scope.dataset).toEqual(elementScope.dataset);
    });

    it('should be able to not find angular', function () {
      require = undefined;
      window.angular = undefined;

      // expect(function () {
      $compile('<angularchart dataset="dataset" options="options"></angularchart>')($scope);
      // }).toThrow();

      // reset
      window.angular = angular;
    });

    it('should be able to inject c3 using require', function () {
      var requireMock = function (val) {
        return angular;
      };
      require = requireMock;
      window.angular = undefined;

      var element = $compile('<angularchart dataset="dataset" options="options"></angularchart>')($scope);

      // reset
      window.angular = angular;
    });

    it('should be able to not find c3', function () {
      require = undefined;
      window.c3 = undefined;

      expect(function () {
        $compile('<angularchart dataset="dataset" options="options"></angularchart>')($scope);
      }).toThrow();

      // reset
      window.c3 = c3;
    });

    it('should be able to inject c3 using require', function () {
      var requireMock = function (val) {
        return c3;
      };
      require = requireMock;
      window.c3 = undefined;

      var element = $compile('<angularchart dataset="dataset" options="options"></angularchart>')($scope);

      // reset
      window.c3 = c3;
    });

    it('should be able to not find d3', function () {
      require = undefined;
      window.d3 = undefined;

      expect(function () {
        $compile('<angularchart dataset="dataset" options="options"></angularchart>')($scope);
      }).toThrow();

      // reset
      window.d3 = d3;
    });


    it('should be able to inject d3 using require', function () {
      var requireMock = function (val) {
        return d3;
      };
      require = requireMock;
      window.d3 = undefined;

      var element = $compile('<angularchart dataset="dataset" options="options"></angularchart>')($scope);

      // reset
      window.d3 = d3;
    });

  });

  describe('#', function () {

    var chartContainer;
    var chartElement;
    var elementScope;

    beforeEach(function () {
      $scope.dataset = JSON.parse(JSON.stringify(dataArray[0].data));
      $scope.schema = JSON.parse(JSON.stringify(dataArray[0].schema));
      $scope.options = JSON.parse(JSON.stringify(optionsArray[0].options));

      // create DOM elements
      chartContainer = d3.select('body').append('div').attr('class', 'testContainer');
      // add directive to DOM
      chartContainer.append('angularchart')
        .attr('dataset', 'dataset')
        .attr('schema', 'schema')
        .attr('options', 'options');
      // select chart
      chartElement = $compile(chartContainer.select('angularchart')[0][0])($scope);

      // $scope.$digest();
      // get elements scope
      elementScope = $scope.getElementScope(chartElement);
    });

    describe('watch', function () {

      it('small dataset changes when updating an element', function () {
        // set new data
        $scope.dataset[0].sales = 1000;
        $scope.$apply();
      });

      it('small dataset changes when adding an element', function () {
        // define new data
        var newRecord = {
          'day': '2013-01-06T00:00:00',
          'sales': 53461.295202
        };
        // add new record
        for (var i = 0; i < 1; i++) {
          $scope.dataset.push(newRecord);
        }
        $scope.$apply();
      });

      it('update a small to a big dataset', function () {
        // define new data
        var newRecord = {
          'day': '2013-01-06T00:00:00',
          'sales': 53461.295202
        };
        // add new record
        for (var i = 0; i < 100; i++) {
          $scope.dataset.push(newRecord);
        }
        $scope.$apply();
      });

      it('big dataset changes when adding an element', function () {
        // define new data
        var newRecord = {
          'day': '2013-01-06T00:00:00',
          'sales': 53461.295202
        };
        // add new records
        for (var j = 0; j < 100; j++) {
          $scope.dataset.push(newRecord);
        }
        $scope.$apply();
      });

      it('upgrade a big to a small dataset', function () {
        // define new data
        var newRecord = {
          'day': '2013-01-06T00:00:00',
          'sales': 53461.295202
        };
        // add new records
        for (var i = 0; i < 100; i++) {
          $scope.dataset.push(newRecord);
        }
        $scope.$apply();

        // remove records
        for (var j = 0; j < 100; j++) {
          $scope.dataset.pop();
        }
        $scope.$apply();
      });

      it('options changes.', function () {

        var xAxis = {
          key: 'dayString'
        };
        $scope.options.xAxis = xAxis;
        $scope.$apply();
      });

    });


    describe('options', function () {

      describe('. onclick', function () {

        it('- Chart should register onclick handler.', function () {
          // check configuration before
          expect(elementScope.configuration.data.onclick).toBe(angular.noop);

          // set option
          var handler = function () {};
          $scope.options.onclick = handler;
          $scope.$apply();

          // check configuration change
          expect(elementScope.configuration.data.onclick).toBe(handler);
        });

      });

      describe('. data', function () {

        describe('. orientation', function () {

          it('- Chart should be able to handle column based data.', function () {
            // check configuration before
            // expect(elementScope.configuration.data.onclick).toBe(angular.noop);

            // set option
            var data = {
              orientation: 'columns'
            };
            $scope.options.data = data;
            $scope.$apply();

            // check configuration change
            // expect(elementScope.configuration.data.onclick).toBe(handler);
          });

          it('- Chart should be able to handle row based data.', function () {
            // check configuration before
            // expect(elementScope.configuration.data.onclick).toBe(angular.noop);

            // set option
            var data = {
              orientation: 'rows'
            };
            $scope.options.data = data;
            $scope.$apply();

            // check configuration change
            // expect(elementScope.configuration.data.onclick).toBe(handler);
          });

        });

        describe('. watchLimit', function () {

          it('- Chart should watch inside dataset when defined.', function () {
            // check configuration before
            // expect(elementScope.configuration.data.onclick).toBe(angular.noop);

            // set option
            var data = {
              watchLimit: 200
            };
            $scope.options.data = data;
            $scope.$apply();

            // check configuration change
            // expect(elementScope.configuration.data.onclick).toBe(handler);
          });

        });

      });

      describe('. yAxis', function () {

        describe('. label', function () {

          it('- Chart should add label on y-axis.', function () {
            // check configuration before
            expect(elementScope.configuration.axis.y.label).toBe('');

            // set option
            var yAxis = {
              label: 'yAxis label'
            };
            $scope.options.yAxis = yAxis;
            $scope.$apply();

            // check configuration change
            expect(elementScope.configuration.axis.y.label).toBe(yAxis.label);
          });

        });

      });

      describe('. rows', function () {

        it('- Chart should have defined name for row.', function () {
          // check configuration before
          // expect(elementScope.configuration.data.groups.length).toBe(0);

          // set option
          var row = $scope.options.rows[0];
          row.name = 'Verkauf';
          $scope.options.rows[0] = row;
          $scope.$apply();

          // check configuration change
          expect(elementScope.configuration.data.names[row.key]).toBe(row.name);
        });

        it('- Chart should have line type if none defined.', function () {
          var row = $scope.options.rows[0];

          // check configuration before
          expect(elementScope.configuration.data.types[row.key]).toBe(row.type);

          // set option
          delete $scope.options.rows[0].type;
          $scope.$apply();

          // check configuration change
          expect(elementScope.configuration.data.types[row.key]).toBe('line');
        });

        it('- Chart should set custom color for row.', function () {
          var row = $scope.options.rows[0];

          // check configuration before
          expect(elementScope.configuration.data.colors.sales).not.toBe('#ff0000');

          // set option
          row.color = '#ff0000';
          $scope.options.rows[0] = row;
          $scope.$apply();

          // check configuration change
          expect(elementScope.configuration.data.colors[row.key]).toBe(row.color);
        });

        it('- Chart rows can be hidden.', function () {
          var row = $scope.options.rows[0];

          // check configuration before
          expect(elementScope.configuration.data.keys.value.length).toBe(4);

          // set option
          row.show = false;
          $scope.options.rows[0] = row;
          $scope.$apply();

          // check configuration change
          expect(elementScope.configuration.data.keys.value.length).toBe(3);
        });

      });

      describe('Rows/Type', function () {

        // ToDo: add expect
        describe('- Pie Chart', function () {

          it('should be created.', function () {
            // check configuration before
            // expect(elementScope.configuration.axis.y.label).toBe('');

            // set option
            var type = 'pie';

            $scope.options.type = type;
            $scope.$apply();

            // check configuration change
            // expect(elementScope.configuration.axis.y.label).toBe(type);
          });

          it('should be created and changed.', function () {
            // check configuration before
            // expect(elementScope.configuration.axis.y.label).toBe('');

            // set option
            var type = 'pie';

            $scope.options.type = type;
            $scope.$apply();

            type = 'line';

            $scope.options.type = type;
            $scope.$apply();

            type = 'pie';

            $scope.options.type = type;
            $scope.$apply();

            // check configuration change
            // expect(elementScope.configuration.axis.y.label).toBe(type);
          });

        });

        describe('- Type Selector', function () {

          it('should not be added by default.', function () {
            // check configuration before
            expect(chartElement.html()).not.toContain('chooseChartType');
          });

          it('should be added.', function () {
            // check configuration before
            expect(chartElement.html()).not.toContain('chooseChartType');

            // set option
            var typeSelector = true;

            $scope.options.typeSelector = typeSelector;
            $scope.$apply();

            // check configuration change
            expect(chartElement.html()).toContain('chooseChartType');
          });

          it('should reset rows type on change.', function () {
            // check configuration before
            expect(chartElement.html()).not.toContain('chooseChartType');

            // set option
            var typeSelector = true;
            $scope.options.typeSelector = typeSelector;
            $scope.$apply();

            // interact: change type to 'pie'
            elementScope.changeChartType('pie');

            // check configuration change
            expect(chartElement.html()).toContain('chooseChartType');
          });

        });

      });

      describe('. xAxis', function () {

        describe('. key', function () {

          it('- Chart should add defined x-axis.', function () {
            // check configuration before
            expect(elementScope.configuration.data.keys.x).toBe('');

            // set option
            var xAxis = {
              key: 'dayString'
            };
            $scope.options.xAxis = xAxis;
            $scope.$apply();

            // check configuration change
            expect(elementScope.configuration.data.keys.x).toBe(xAxis.key);
          });

          it('- Chart should change defined x-axis.', function () {
            // check configuration before
            expect(elementScope.configuration.data.keys.x).toBe('');

            // set option
            var xAxis = {
              key: 'dayString'
            };
            $scope.options.xAxis = xAxis;
            $scope.$apply();

            // check configuration change
            expect(elementScope.configuration.data.keys.x).toBe(xAxis.key);

            // set option
            xAxis = {
              key: 'day'
            };
            $scope.options.xAxis = xAxis;
            $scope.$apply();

            // check configuration change
            expect(elementScope.configuration.data.keys.x).toBe(xAxis.key);
          });

          it('- Chart should use default format for timestamps.', function () {
            // check configuration before
            // expect(elementScope.configuration.data.keys.x).toBe('');

            // set option
            // delete $scope.dataset.schema[0].format;
            var xAxis = {
              key: 'day'
            };
            $scope.options.xAxis = xAxis;
            $scope.$apply();

            // check configuration change
            // expect(elementScope.configuration.data.keys.x).toBe(xAxis.key);
          });

        });

        describe('. displayFormat', function () {

          // ToDo: add expect
          it('- Chart should add x-axis with specific format.', function () {
            // check configuration before
            // expect(elementScope.configuration.axis.x.label).toBe('');

            // set option
            var xAxis = {
              key: 'day',
              displayFormat: '%Y-%m-%d'
            };
            $scope.options.xAxis = xAxis;
            $scope.$apply();

            // check configuration change
            // expect(elementScope.configuration.axis.x.label).toBe(xAxis.label);
          });

        });

        describe('. label', function () {

          it('- Chart should add label on x-axis.', function () {
            // check configuration before
            expect(elementScope.configuration.axis.x.label).toBe('');

            // set option
            var xAxis = {
              label: 'xAxis label'
            };
            $scope.options.xAxis = xAxis;
            $scope.$apply();

            // check configuration change
            expect(elementScope.configuration.axis.x.label).toBe(xAxis.label);
          });

        });

        describe('. selector', function () {

          it('- Chart should not add choose xAxis selector by default.', function () {
            // check configuration before
            expect(chartElement.html()).not.toContain('chooseXAxis');
          });

          it('- Chart should add choose xAxis selector.', function () {
            // check configuration before
            expect(chartElement.html()).not.toContain('chooseXAxis');

            // set option
            var xAxis = {
              selector: true
            };
            $scope.options.xAxis = xAxis;
            $scope.$apply();

            // check configuration change
            expect(chartElement.html()).toContain('chooseXAxis');
          });

        });

        describe('- schema', function () {

          it('- Chart use schema to format datetime.', function () {
            // check configuration before
            expect(elementScope.configuration.axis.x.type).toBe('category');

            // set option
            $scope.schema.day.format = '%Y-%m-%dT%H:%M:%S';
            var xAxis = {
              key: 'day'
            };
            $scope.options.xAxis = xAxis;
            $scope.$apply();

            // check configuration change
            expect(elementScope.configuration.axis.x.type).toBe('timeseries');
            expect(elementScope.configuration.data.xFormat).toBe($scope.schema.day.format);
          });

          it('- Chart use schema to display numeric xAxis.', function () {
            // check configuration before
            expect(elementScope.configuration.axis.x.type).toBe('category');

            // set option
            var xAxis = {
              key: 'income'
            };
            $scope.options.xAxis = xAxis;
            $scope.$apply();

            // check configuration change
            expect(elementScope.configuration.axis.x.type).toBe('numeric');
          });

          it('- xAxis type is category if not in schema defined.', function () {
            // check configuration before
            expect(elementScope.configuration.axis.x.type).toBe('category');

            // set option
            delete $scope.schema.dayString;
            var xAxis = {
              key: 'dayString'
            };
            $scope.options.xAxis = xAxis;
            $scope.$apply();

            // check configuration change
            expect(elementScope.configuration.axis.x.type).toBe('category');
          });

          it('- Do not format function if no post-/prefix is defined.', function () {
            // check configuration before
            expect(elementScope.configuration.axis.x.tick.format).not.toBeDefined();

            // set option
            var xAxis = {
              key: 'dayString'
            };
            $scope.options.xAxis = xAxis;
            $scope.$apply();

            // check configuration change
            expect(elementScope.configuration.axis.x.tick.format).not.toBeDefined();
          });

          it('- prefix - Add prefix if defined.', function () {
            // check configuration before
            expect(elementScope.configuration.axis.x.tick.format).not.toBeDefined();

            // set option
            var xAxis = {
              key: 'sales'
            };
            $scope.options.xAxis = xAxis;
            $scope.$apply();

            // check configuration change
            expect(elementScope.configuration.axis.x.tick.format).toBeDefined();
          });

          it('- postfix - Add postfix if defined.', function () {
            // check configuration before
            expect(elementScope.configuration.axis.x.tick.format).not.toBeDefined();

            // set option
            var xAxis = {
              key: 'income'
            };
            $scope.options.xAxis = xAxis;
            $scope.$apply();

            // check configuration change
            expect(elementScope.configuration.axis.x.tick.format).toBeDefined();
          });
        });

      });

      describe('. groups', function () {

        it('- Chart should stack two bar charts.', function () {
          // check configuration before
          expect(elementScope.configuration.data.groups.length).toBe(0);

          // set option
          var groups = [
            ['sales', 'income']
          ];
          $scope.options.groups = groups;
          $scope.$apply();

          // check configuration change
          expect(elementScope.configuration.data.groups).toBe(groups);
        });

      });

      describe('. annotation', function () {

        it('- Chart have annotations on x-Axis.', function () {
          // check configuration before
          expect(elementScope.configuration.grid.x.lines.length).toBe(0);

          // set option
          var line = {
            axis: 'x',
            value: 1,
            text: 'one'
          };
          $scope.options.annotation = [line];
          $scope.$apply();

          // check configuration change
          expect(elementScope.configuration.grid.x.lines.length).toBe(1);
        });

        it('- Chart have annotations on y-Axis.', function () {
          // check configuration before
          expect(elementScope.configuration.grid.y.lines.length).toBe(0);

          // set option
          var line = {
            axis: 'y',
            value: 1,
            text: 'one'
          };
          $scope.options.annotation = [line];
          $scope.$apply();

          // check configuration change
          expect(elementScope.configuration.grid.y.lines.length).toBe(1);
        });

        it('- Chart have annotations on y2-Axis.', function () {
          // check configuration before
          expect(elementScope.configuration.grid.y.lines.length).toBe(0);

          // set option
          var line = {
            axis: 'y2',
            value: 1,
            text: 'one'
          };
          $scope.options.annotation = [line];
          $scope.$apply();

          // check configuration change
          expect(elementScope.configuration.grid.y.lines.length).toBe(1);
        });

      });

      describe('. legend', function () {

        describe('. selector', function () {

          it('- Chart should hide default legend.', function () {
            // check configuration before
            expect(elementScope.configuration.legend.show).toBe(true);

            // set option
            var legend = {
              selector: true
            };
            $scope.options.legend = legend;
            $scope.$apply();

            // check configuration change
            expect(elementScope.configuration.legend.show).toBe(false);
          });

          it('- Chart should add customLegend.', function () {
            // check element before
            expect(chartElement.html()).not.toContain('customLegend');

            // set option
            var legend = {
              selector: true
            };
            $scope.options.legend = legend;
            $scope.$apply();

            // check element change
            expect(chartElement.html()).toContain('customLegend');
          });

          it('- Custom Legend should switch axis.', function () {
            // check element before
            expect(chartElement.html()).not.toContain('customLegend');

            // set option
            var legend = {
              selector: true
            };
            $scope.options.legend = legend;
            $scope.$apply();

            //
            var options = {
              index: 0
            };
            var clicked = {
              axis: 'y2'
            };
            elementScope.switchAxis(options, clicked);

            // check element change
            expect(chartElement.html()).toContain('customLegend');
          });

          it('- Custom Legend should switch type.', function () {
            // check element before
            expect(chartElement.html()).not.toContain('customLegend');

            // set option
            var legend = {
              selector: true
            };
            $scope.options.legend = legend;
            $scope.$apply();

            //
            var options = {
              index: 0
            };
            var clicked = {
              type: 'line'
            };
            elementScope.switchType(options, clicked);

            // check element change
            expect(chartElement.html()).toContain('customLegend');
          });

          it('- Custom Legend should switch show/hide.', function () {
            // check element before
            expect(chartElement.html()).not.toContain('customLegend');

            // set option
            var legend = {
              selector: true
            };
            $scope.options.legend = legend;
            $scope.$apply();

            //
            var options = {
              index: 0
            };
            var clicked = {
              show: false
            };
            elementScope.switchShow(options, clicked);

            // check element change
            expect(chartElement.html()).toContain('customLegend');
          });

          it('- Custom Legend should hide xAxis in legend.', function () {
            // check element before
            expect(chartElement.html()).not.toContain('customLegend');

            // set option
            var legend = {
              selector: true
            };
            $scope.options.legend = legend;
            var xAxis = {
              key: 'income'
            };
            $scope.options.xAxis = xAxis;
            $scope.$apply();

            // check element change
            expect(chartElement.html()).toContain('customLegend');
          });

          it('- Custom Legend should show rows set on true.', function () {
            // check element before
            expect(chartElement.html()).not.toContain('customLegend');

            // set option
            var legend = {
              selector: true
            };
            $scope.options.legend = legend;
            $scope.options.rows[0].show = true;
            $scope.$apply();

            // check element change
            expect(chartElement.html()).toContain('customLegend');
          });

          it('- Custom Legend should show rows set on true.', function () {
            // check element before
            expect(chartElement.html()).not.toContain('customLegend');

            // set option
            var legend = {
              selector: true
            };
            $scope.options.legend = legend;
            $scope.options.rows[0].show = false;
            $scope.$apply();

            // check element change
            expect(chartElement.html()).toContain('customLegend');
          });

        });

        describe('. show', function () {

          it('- Chart should hide default legend.', function () {
            // check configuration before
            expect(elementScope.configuration.legend.show).toBe(true);

            // set option
            var legend = {
              show: false
            };
            $scope.options.legend = legend;
            $scope.$apply();

            // check configuration change
            expect(elementScope.configuration.legend.show).toBe(false);
          });

        });

      });

      describe('. zoom', function () {

        describe('. enabled', function () {

          it('- Chart should not be zoomable by default.', function () {
            // check configuration before
            expect(elementScope.configuration.zoom.enabled).toBe(false);

            // set option
            $scope.$apply();

            // check configuration change
            expect(elementScope.configuration.zoom.enabled).not.toBeDefined();
          });

          it('- Chart should be zoomable if set.', function () {
            // check configuration before
            expect(elementScope.configuration.zoom.enabled).toBe(false);

            // set option
            var zoom = {
              enabled: true
            };
            $scope.options.zoom = zoom;
            $scope.$apply();

            // check configuration change
            expect(elementScope.configuration.zoom.enabled).toBe(zoom.enabled);
          });

        });

        describe('. range', function () {

          it('- Chart should update range when zoomed.', function () {
            // check configuration before
            expect(elementScope.configuration.zoom.enabled).toBe(false);

            // set option
            var zoom = {
              enabled: true
            };
            $scope.options.zoom = zoom;
            $scope.$apply();

            // fire event
            var range = [0, 0];
            elementScope.configuration.zoom.onzoomend(range);

            // check configuration change
            expect($scope.options.zoom.range).toBe(range);
          });

          it('- Chart should update range when subchart zoomed.', function () {
            // check configuration before
            expect(elementScope.configuration.zoom.enabled).toBe(false);

            // set option
            var zoom = {
              enabled: true
            };
            $scope.options.zoom = zoom;
            $scope.$apply();

            // fire event
            var range = [0, 0];
            elementScope.configuration.subchart.onbrush(range);

            // check configuration change
            expect($scope.options.zoom.range).toBe(range);
          });

          it('- Chart should apply zoom if range is set.', function () {
            // check configuration before
            expect(elementScope.configuration.zoom.enabled).toBe(false);

            // set option
            var zoom = {
              enabled: true,
              range: [0, 1]
            };
            $scope.options.zoom = zoom;
            $scope.$apply();

            // check configuration change
            expect(elementScope.configuration.zoom.enabled).toBe(zoom.enabled);
          });

        });

        describe('. onzoom', function () {

          it('- Chart should call onzoom when zoomed.', function () {
            // check configuration before
            expect(elementScope.configuration.zoom.enabled).toBe(false);

            // set option
            var zoom = {
              enabled: true,
              onzoom: function () {}
            };
            $scope.options.zoom = zoom;
            $scope.$apply();

            elementScope.configuration.zoom.onzoomend([0, 0]);

            // check configuration change
            expect(elementScope.configuration.zoom.enabled).toBe(zoom.enabled);
          });

          it('- Chart should call onzoom when subchart zoomed.', function () {
            // check configuration before
            expect(elementScope.configuration.zoom.enabled).toBe(false);

            // set option
            var zoom = {
              enabled: true,
              onzoom: function () {}
            };
            $scope.options.zoom = zoom;
            $scope.$apply();

            elementScope.configuration.subchart.onbrush([0, 0]);

            // check configuration change
            expect(elementScope.configuration.zoom.enabled).toBe(zoom.enabled);
          });

        });

      });

      describe('. size', function () {

          it('- Chart should be sized.', function () {
            // check configuration before
            // expect(elementScope.configuration.size).toBe({});

            // set option
            var size = {
              width: 200,
              heigth: 200
            };
            $scope.options.size = size;
            $scope.$apply();

            // check configuration change
            expect(elementScope.configuration.size).toBe(size);
          });

      });

      describe('. donut', function () {

          it('- Chart should be a donut with title set.', function () {
            // check configuration before
            // expect(elementScope.configuration.donut).toBe({});

            // set option
            var donut = {
              title: 'Yummy Donut'
            };
            $scope.options.donut = donut;
            $scope.$apply();

            // check configuration change
            expect(elementScope.configuration.donut).toBe(donut);
          });

      });

      describe('. resize', function () {

          it('- Chart should be resized when called.', function () {
            // setup spys
            spyOn(elementScope.chart, 'resize');

            // set option
            var size = {
              width: 300,
              heigth: 100
            };
            $scope.options.resize(size);

            // check configuration change
            expect(elementScope.configuration.size).toBe(size);
            expect(elementScope.chart.resize).toHaveBeenCalled();
          });

      });

      describe('. subchart', function () {

        it('Creating a line chart with subchart toggle', function () {
          // check rendering before
          expect(chartElement.html()).not.toContain('toggleSubchart');

          // set option
          var subchart = {
            selector: true
          };
          $scope.options.subchart = subchart;
          $scope.$apply();

          // check rendering change
          expect(chartElement.html()).not.toBe(null);
          expect(chartElement.html()).toContain('toggleSubchart');
        });

        it('Creating a line chart with subchart toggle and with subchart', function () {
          // check configuration before
          expect(elementScope.configuration.subchart.show).toBe(false);
          // check rendering before
          expect(chartElement.html()).not.toContain('toggleSubchart');

          // set option
          var subchart = {
            selector: true,
            show: true
          };
          $scope.options.subchart = subchart;
          $scope.$apply();

          // check configuration change
          expect(elementScope.configuration.subchart.show).toBe(subchart.show);

          // check rendering
          expect(chartElement.html()).not.toBe(null);
          expect(chartElement.html()).toContain('toggleSubchart');

          // interact with chart
          //   toggle show subchart
          elementScope.toggleSubchart();

          // check options change
          expect($scope.options.subchart.show).toBe(false);
        });

        it('Hide subchart should reset zoom.', function () {
          // check configuration before
          expect(elementScope.configuration.subchart.show).toBe(false);

          // set option - show subchart
          var subchart = {
            selector: true,
            show: true
          };
          $scope.options.subchart = subchart;
          $scope.$apply();

          // set option - set zoom
          var range = [0, 1];
          $scope.options.zoom.range = range;
          $scope.$apply();

          // interact with chart
          //   hide subchart
          elementScope.toggleSubchart();

          // check options change
          expect($scope.options.subchart.show).toBe(false);
          expect($scope.options.zoom.range).not.toBeDefined();
        });

      });

      // ToDo: Review
      describe('. selection', function () {

        beforeEach(function () {
          $scope.options.selection = {
            enabled: true
          };
          $scope.$apply();
        });

        it('Runs with selections enabled', function () {
          expect(chartElement.html()).not.toBe(null);
        });

        it('watch add selections', function () {
          $scope.options.selection.selected = [];

          // add external selection
          $scope.options.selection.selected.push({
            id: 'test',
            index: 3
          });
          $scope.$apply();

          // external unselection
          $scope.options.selection.selected = $scope.options.selection.selected.splice(0, 1);
          $scope.$apply();
        });

        it('watch add multiple selections at once', function () {
          $scope.options.selection.selected = [];

          // add external selection
          $scope.options.selection.selected.push({
            id: 'test',
            index: 3
          });
          $scope.options.selection.selected.push({
            id: 'test',
            index: 4
          });
          $scope.$apply();

          // external unselection
          $scope.options.selection.selected = $scope.options.selection.selected.splice(0, 1);
          $scope.$apply();
        });

        it('watch remove selections', function () {
          $scope.options.selection.selected = [];

          // add external selection
          $scope.options.selection.selected.push({
            id: 'test',
            index: 3
          });
          $scope.$apply();

          $scope.options.selection.selected.push({
            id: 'test',
            index: 4
          });
          $scope.$apply();

          // external unselection
          $scope.options.selection.selected = $scope.options.selection.selected.splice(1, 1);
          $scope.$apply();
        });

        it('watch view selections', function () {
          expect($scope.options.selection.selected.length).toBe(0);

          // chart selection
          elementScope.configuration.data.onselected({}, {});
          expect(chartElement.html()).not.toBe(null);

          expect($scope.options.selection.selected.length).toBe(1);
        });

        it('watch view selections, if not disabled', function () {
          expect($scope.options.selection.selected.length).toBe(0);

          // avoid selections
          elementScope.selections.avoidSelections = true;

          // chart selection
          elementScope.configuration.data.onselected({}, {});

          // was not added
          expect($scope.options.selection.selected.length).toBe(0);
          elementScope.selections.avoidSelections = false;
        });

        it('watch view unselections without existing selections', function () {
          // chart unselection
          elementScope.configuration.data.onunselected({}, {});
          expect(chartElement.html()).not.toBe(null);
        });

        it('watch view unselections with existing selections', function () {
          // add external selection
          $scope.options.selection.selected.push({
            id: 'test',
            index: 3
          });
          $scope.$apply();
          expect($scope.options.selection.selected.length).toBe(1);

          // chart unselection
          elementScope.configuration.data.onunselected({
            id: 'test',
            index: 3
          }, {});
          expect($scope.options.selection.selected.length).toBe(0);
        });

        it('watch view selections, if not disabled', function () {
          // add selection
          $scope.options.selection.selected.push({
            id: 'test',
            index: 3
          });
          $scope.$apply();
          expect($scope.options.selection.selected.length).toBe(1);

          // avoid selections
          elementScope.selections.avoidSelections = true;

          // chart unselection
          elementScope.configuration.data.onunselected({
            id: 'test',
            index: 3
          }, {});

          // was not added
          expect($scope.options.selection.selected.length).toBe(1);
          elementScope.selections.avoidSelections = false;
        });

        describe('. onselected', function () {

          it('- Chart should call onselected when selection is added.', function () {
            // set option
            var selection = {
              enabled: true,
              onselected: function () {}
            };
            $scope.options.selection = selection;
            $scope.$apply();

            // fire event
            elementScope.configuration.data.onselected({
              id: 'test',
              index: 3
            }, {});
          });

          it('- Chart should call onunselected when selection is removed.', function () {
            // set option
            var selection = {
              enabled: true,
              onunselected: function () {}
            };
            $scope.options.selection = selection;
            $scope.$apply();

            // fire event
            elementScope.configuration.data.onunselected({
              id: 'test',
              index: 3
            }, {});
          });

        });

      });

    });

  });


});