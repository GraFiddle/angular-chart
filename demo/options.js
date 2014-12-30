'use strict';

var optionsArray = [
{
  id: 1,
  name: 'Multichart',
  description: 'You can combine line, spline, bar, area and scatter charts in a single chart.',
  options: {
    rows: [{
      key: 'income',
      type: 'line'
    }, {
      key: 'sales',
      type: 'spline'
    }, {
      key: 'customers',
      type: 'area'
    }, {
      key: 'units',
      type: 'bar',
    }]
  }
}, {
  id: 2,
  name: 'Timeseries',
  description: 'The xAxis displayFormat can be defined to timeseries.',
  options: {
    rows: [{
      key: 'income'
    }],
    xAxis: {
      key: 'day',
      displayFormat: '%Y-%m-%d'
    }
  }
}, {
  id: 3,
  name: 'xAxis Selector',
  description: 'The xAxis selector allows the user to choose the xAxis.',
  options: {
    rows: [{
      key: 'sales'
    }],
    xAxis: {
      key: 'income',
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
      key: 'sales'
    }, {
      key: 'income'
    }],
    xAxis: {
      key: 'dayString',
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
      key: 'sales'
    }, {
      key: 'income'
    }],
    subchart: {
      selector: true,
      show: true
    }
  }
}, {
  id: 6,
  name: 'Type Selector',
  description: 'The type selector allows the user to choose the chart type.',
  options: {
    rows: [{
      key: 'sales'
    }],
    typeSelector: true,
    xAxis: {
      key: 'income'
    }
  }
}, {
  id: 7,
  name: 'Selections',
  description: 'You can select one or multiple points in a chart.',
  options: {
    rows: [{
      key: 'income',
      type: 'line'
    }, {
      key: 'sales',
      type: 'spline'
    }, {
      key: 'customers',
      type: 'area'
    }, {
      key: 'units',
      type: 'bar',
    }],
    selection: {
      enabled: true,
      multiple: true
    }
  }
}, {
  id: 8,
  name: 'Zoom',
  description: 'This chart can be zoomed using the mouse wheel.',
  options: {
    rows: [{
      key: 'income',
      type: 'line'
    }, {
      key: 'sales',
      type: 'spline'
    }],
    zoom: {
      enabled: true
    }
  }
}, {
  id: 9,
  name: 'Annotation',
  description: 'Annotation lines can be added on every axis',
  options: {
    rows: [{
      key: 'income',
      type: 'line'
    }, {
      key: 'sales',
      type: 'spline'
    }],
    xAxis: {
      key: 'dayString',
    },
    annotation: [{
      axis: 'x',
      value: 1,
      label: 'one'
    }, {
      axis: 'y',
      value: 200,
      label: 'two hundred'
    }, {
      axis: 'y2',
      value: 0,
      label: 'none'
    }]
  }
}, {
  id: 10,
  name: 'Define Rows',
  description: 'You can combine line, spline, bar, area and scatter charts in a single chart.',
  options: {
    rows: [{
      key: 'sales',
      type: 'spline'
    }],
    legend: {
      selector: true
    }
  }
}];
