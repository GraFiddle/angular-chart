(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  var baseConfiguration = {
    data: {
      keys: {
        value: []
      },
      names: {},
      types: {},
      colors: {},
      axes: {},
      labels: {
        format: {}
      }
    },
    axis: {
      y: {
        show: true
      },
      y2: {},
      x: {
        tick: {}
      }
    },
    zoom: {},
    subchart: {}
  };

  angular
    .module('angularChart')
    .value('baseConfiguration', baseConfiguration);

})();



