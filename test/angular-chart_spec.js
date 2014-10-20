'use strict';

/*global beforeEach, afterEach, describe, it, inject, expect, spyOn, module, angular*/
describe('angularChart:', function () {

  var $scope, $compile, $controller;
  var d3 = window.d3;
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
      expect(elementScope.loadChart).toBeDefined();
      expect(elementScope.updateChart).toBeDefined();
      expect(elementScope.startOptionsWatcher).toBeDefined();
      expect(elementScope.startDatasetWatcher).toBeDefined();
    });

    it('should not modify the parent $scope', function () {
      var element = $compile('<angularchart dataset="dataset" options="options"></angularchart>')($scope);

      expect($scope.addIdentifier).not.toBeDefined();
      expect($scope.loadChart).not.toBeDefined();
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
      // get elements scope
      elementScope = $scope.getElementScope(chartElement);
    });

    describe('watch', function () {

      it('dataset changes.', function () {

        var newData = {
          'day': '2013-01-06T00:00:00',
          'sales': 53461.295202
        };
        $scope.dataset.push(newData);
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


      describe('. colors', function () {

        it('- Chart should set custom color for row.', function () {
          // check configuration before
          expect(elementScope.configuration.data.colors.sales).not.toBe('#ff0000');

          // set option
          var colors = {
            sales: '#ff0000'
          };
          $scope.options.colors = colors;
          $scope.$apply();

          // check configuration change
          expect(elementScope.configuration.data.colors.sales).toBe(colors.sales);
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
          var row = $scope.options.rows[1];
          row.name = 'Verkauf';
          $scope.options.rows[1] = row;
          $scope.$apply();

          // check configuration change
          expect(elementScope.configuration.data.names[row.key]).toBe(row.name);
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

          it('should be created in rows.', function () {
            // check configuration before
            // expect(elementScope.configuration.axis.y.label).toBe('');

            // set option
            var type = 'pie';
            var rows = [{
              type: 'pie'
            }];

            $scope.options.type = type;
            $scope.options.rows = rows;
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
            expect(elementScope.configuration.axis.x.type).toBe(undefined);

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
            expect(elementScope.configuration.axis.x.type).toBe(undefined);

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
            expect(elementScope.configuration.axis.x.type).toBe(undefined);

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

          it('- Chart should add events on legend.', function () {
            // check  before
            // ToDo

            // set option
            var legend = {
              selector: true
            };
            $scope.options.legend = legend;
            $scope.$apply();

            // fire events
            d3.selectAll('.customLegend span')
              .each(function () {
                $scope.fireEvent(this, 'click');
                $scope.fireEvent(this, 'mouseover');
                $scope.fireEvent(this, 'mouseout');
              });

            // check change
            // ToDo
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

      // ToDo: Review
      describe('. subchart', function () {

        it('Creating a line chart with subchart toggle', function () {
          $scope.options.subchart = {
            selector: true
          };
          $scope.$apply();

          expect(chartElement.html()).not.toBe(null);
          expect(chartElement.html()).toContain('toggleSubchart');
        });

        it('Creating a line chart with subchart toggle and with subchart', function () {
          $scope.options.subchart = {
            selector: true,
            show: true
          };
          $scope.$apply();

          expect(chartElement.html()).not.toBe(null);
          expect(chartElement.html()).toContain('toggleSubchart');

          // toggle show subchart
          var elementScope = $scope.getElementScope(chartElement);
          elementScope.toggleSubchart();
          expect($scope.options.subchart.show).toBe(false);
        });

        it('Creating a line chart with custom legend', function () {
          $scope.options.legend = {
            selector: true
          };
          $scope.$apply();
          expect(chartElement.html()).not.toBe(null);
          expect(chartElement.html()).toContain('customLegend');

          // fire events
          d3.selectAll('.customLegend span')
            .each(function () {
              $scope.fireEvent(this, 'click');
              $scope.fireEvent(this, 'mouseover');
              $scope.fireEvent(this, 'mouseout');
            });
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

      });

    });

  });


});