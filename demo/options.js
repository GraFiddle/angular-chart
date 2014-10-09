'use strict';

var optionsArray = [{
  name: 'default',
  options: {
    rows: [{
      name: 'income',
      type: 'line'
    }, {
      name: 'sales',
      type: 'spline'
    }, {
      name: 'customers',
      type: 'area'
    }, {
      name: 'units',
      type: 'bar',
    }],
    xAxis: {
      name: 'dayString',
    }
  }
}, {
  name: 'first',
  options: {
    rows: [{
      name: 'sales',
      type: 'line'
    }],
    xAxis: {
      name: 'dayString',
    }
  }
}, {
  name: 'second',
  options: {
    rows: [{
      name: 'income',
      type: 'spline'
    }],
    xAxis: {
      name: 'dayString',
    }
  }
}];