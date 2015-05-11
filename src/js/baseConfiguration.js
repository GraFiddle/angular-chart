(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  var baseConfiguration = {
    data: {
      json: [],
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
        show: true,
        tick: {}
      },
      y2: {
        tick: {}
      },
      x: {
        tick: {}
      }
    },
    zoom: {},
    subchart: {},
    tooltip: {
      format: {}
    }
  };

  angular
    .module('angularChart')
    .value('baseConfiguration', baseConfiguration);

})();



