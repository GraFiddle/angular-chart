'use strict';

var dataArray = [{
  name: 'climate',
  schema: {
    rain: {
      key: 'rain',
      name: 'Rainfall',
      postfix: 'mm',
      type: 'numeric'
    },
    temp: {
      key: 'temp',
      name: 'Temperature',
      postfix: '°C',
      type: 'numeric'
    },
    raindays: {
      key: 'raindays',
      name: 'Rain Days',
      type: 'numeric'
    }
  },
  data: [{
    rain: 49.9,
    temp: 7.0,
    month: 'Jan',
    raindays: 6
  }, {
    rain: 71.5,
    temp: 6.9,
    month: 'Feb',
    raindays: 6
  }, {
    rain: 106.4,
    temp: 9.5,
    month: 'Mar',
    raindays: 12
  }, {
    rain: 129.2,
    temp: 14.5,
    month: 'Apr',
    raindays: 13
  }, {
    rain: 144.0,
    temp: 18.2,
    month: 'May',
    raindays: 16
  }, {
    rain: 176.0,
    temp: 21.5,
    month: 'Jun',
    raindays: 18
  }, {
    rain: 135.0,
    temp: 25.2,
    month: 'Jul',
    raindays: 18
  }, {
    rain: 148.5,
    temp: 26.5,
    month: 'Aug',
    raindays: 17
  }, {
    rain: 216.4,
    temp: 23.3,
    month: 'Sep',
    raindays: 16
  }, {
    rain: 194.1,
    temp: 18.3,
    month: 'Oct',
    raindays: 14
  }, {
    rain: 95.6,
    temp: 13.9,
    month: 'Nov',
    raindays: 9
  }, {
    rain: 54.4,
    temp: 9.6,
    month: 'Dec',
    raindays: 6
  }]
}, {
  name: 'default',
  schema: {
    'day': {
      'id': 'day',
      'name': 'The Day',
      'scale': 'interval',
      'type': 'datetime'
    },
    'sales': {
      'id': 'sales',
      'name': 'Sales',
      'prefix': '$',
      'scale': 'ratio',
      'type': 'numeric'
    },
    'income': {
      'id': 'income',
      'name': 'Income',
      'postfix': '€',
      'scale': 'ratio',
      'type': 'numeric'
    },
    'customers': {
      'id': 'customers'
    },
    'dayString': {
      'id': 'dayString',
      'name': 'Weekday'
    },
  },
  data: [{
    'day': '2013-01-08T00:00:00',
    'sales': 300,
    'income': 200,
    'customers': 30,
    'units': 130,
    'dayString': 'Montag'
  }, {
    'day': '2013-01-03T00:00:00',
    'sales': 200,
    'income': 130,
    'customers': 20,
    'units': 120,
    'dayString': 'Dienstag'
  }, {
    'day': '2013-01-04T00:00:00',
    'sales': 160,
    'income': 90,
    'customers': 50,
    'units': 150,
    'dayString': 'Mittwoch'
  }, {
    'day': '2013-01-05T00:00:00',
    'sales': 400,
    'income': 240,
    'customers': 40,
    'units': 140,
    'dayString': 'Donnerstag'
  }, {
    'day': '2013-01-06T00:00:00',
    'sales': 250,
    'income': 130,
    'customers': 60,
    'units': 160,
    'dayString': 'Freitag'
  }, {
    'day': '2013-01-07T00:00:00',
    'sales': 250,
    'income': 220,
    'customers': 50,
    'units': 150,
    'dayString': 'Samstag'
  }]
}];