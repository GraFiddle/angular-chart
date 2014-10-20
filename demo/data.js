'use strict';

var dataArray = [{
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