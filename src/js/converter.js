(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  function angularChartConverter() {


    var service = {
      convertData: convertData,
      convertDimensions: convertDimensions,
      convertSchema: convertSchema
    };

    return service;

    ////////////

    function convertData(options, configuration) {
      if (options.data) {
        configuration.data.json = options.data;
      }
    }

    function convertDimensions(options, configuration) {
      if (!angular.isObject(options.dimensions)) {
        return;
      }

      // only show used axes
      configuration.axis.y.show = false;

      // apply all dimensions
      angular.forEach(options.dimensions, function(dimension, key) {
        // TODO only when JSON (array of objects) data
        // set dimensions to show
        if (!angular.isDefined(dimension.show) || dimension.show) {
          configuration.data.keys.value.push(key);
        }

        // set name
        if (angular.isString(dimension.name)) {
          configuration.data.names[key] = dimension.name;
        }

        // set type
        if (angular.isDefined(dimension.type)) {
          configuration.data.types[key] = dimension.type;
        }

        // set color
        if (angular.isString(dimension.color)) {
          configuration.data.colors[key] = dimension.color;
        }

        // axis
        if (dimension.axis === 'y2') {
          configuration.data.axes[key] = 'y2';
          configuration.axis.y2.show = true;
        } else if (dimension.axis === 'x') {

          configuration.data.keys.x = key;
          configuration.data.x = key;

          if (angular.isDefined(dimension.displayFormat)) {
            configuration.axis.x.tick.format = dimension.displayFormat;
          }

        } else {
          configuration.axis.y.show = true;
        }

      });

    }

    function convertSchema(options, configuration) {
      //  else if (angular.isObject(options.schema) && angular.isObject(options.schema[key]) && angular.isString(options.schema[key].name)) {
      //    configuration.data.names[key] = options.schema[key].name;
      //  }
      //
      //  else if (angular.isObject(options.schema) && angular.isObject(options.schema[key]) && angular.isString(options.schema[key].color)) {
      //    configuration.data.colors[key] = options.schema[key].color;
      //  }
    }

  }

  angular
    .module('angularChart')
    .service('angularChartConverter', angularChartConverter);

})();



