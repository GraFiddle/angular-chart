'use strict';

/*global beforeEach, afterEach, describe, it, inject, expect, module, angular*/
describe('uiCalendar', function () {

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
      }],
      'records': [{
        'day': '2013-01-02T00:00:00',
        'sales': 13461.295202
      }, {
        'day': '2013-01-03T00:00:00',
        'sales': 23461.295202
      }, {
        'day': '2013-01-04T00:00:00',
        'sales': 33461.295202
      }, {
        'day': '2013-01-05T00:00:00',
        'sales': 43461.295202
      }]
    };
    scope.options = {};

    scope.addData = function () {
      scope.dataset.records.push({
        'day': '2013-01-06T00:00:00',
        'sales': 53461.295202
      });
    };

    scope.addOptions = function () {
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
    };

  }));

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

    it('watch options', function () {
      scope.addOptions();
      scope.$apply();

      //console.log(element);
    });

  });

});