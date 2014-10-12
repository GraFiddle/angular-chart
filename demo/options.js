'use strict';

var optionsArray = [{
  id: 1,
  name: 'Multichart',
  description: 'You can combine line, spline, bar, area and scatter charts in a single chart.',
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
    }]
  }
}, {
  id: 2,
  name: 'Timeseries',
  description: 'The xAxis displayFormat can be defined to timeseries.',
  options: {
    rows: [{
      name: 'income'
    }],
    xAxis: {
      name: 'day',
      displayFormat: '%Y-%m-%d'
    }
  }
}, {
  id: 3,
  name: 'xAxis Selector',
  description: 'The xAxis selector allows the user to choose the xAxis.',
  options: {
    rows: [{
      name: 'sales'
    },{
      name: 'income'
    }],
    xAxis: {
      name: 'day',
      displayFormat: '%Y-%m-%d',
      selector: true
    }
  }
}, {
  id: 4,
  name: 'Axis Labels',
  description: 'The xAxis selector allows the user to choose the xAxis.',
  options: {
    rows: [{
      name: 'sales'
    },{
      name: 'income'
    }],
    xAxis: {
      name: 'dayString',
      label: 'Weekday'
    },
    yAxis: {
      label: 'Amount'
    }
  }
}, {
  id: 5,
  name: 'Subchart',
  description: '',
  options: {
    rows: [{
      name: 'sales'
    },{
      name: 'income'
    }],
    subchart: {
            selector: true,
            show: true
          }
  }
}];


