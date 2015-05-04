(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  function AngularChartConverter() {

    var service = {
      convertData: convertData,
      convertDimensions: convertDimensions,
      convertSchema: convertSchema
    };

    return service;

    ////////////

    function convertData(options, configuration) {
      if (options.data) {
        // TODO support different data formats
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
        } else if (dimension.axis !== 'x') {
          configuration.axis.y.show = true;
        }

        // label
        if (dimension.label === true) {
          if (angular.isDefined(dimension.displayFormat)) {
            configuration.data.labels.format[key] = dimension.displayFormat;
          } else {
            configuration.data.labels.format[key] = true;
          }
        }

        // TODO configure http://c3js.org/samples/axes_y_tick_format.html
        // TODO configure http://c3js.org/samples/tooltip_format.html


        // x-Axis
        if (dimension.axis === 'x') {
          configuration.data.keys.x = key;
          configuration.data.x = key;

          if (angular.isDefined(dimension.displayFormat)) {
            configuration.axis.x.tick.format = dimension.displayFormat;
          }
        }

      });
    }

    function convertSchema(options, configuration) {
      // TODO configure
      //  else if (angular.isObject(options.schema) && angular.isObject(options.schema[key]) && angular.isString(options.schema[key].name)) {
      //    configuration.data.names[key] = options.schema[key].name;
      //  }
      //
      //  else if (angular.isObject(options.schema) && angular.isObject(options.schema[key]) && angular.isString(options.schema[key].color)) {
      //    configuration.data.colors[key] = options.schema[key].color;
      //  }

      // TODO apply pre/postfixes
      //if (dimension.type === 'datetime') {
      //  configuration.axis.x.type = 'timeseries';
      //  if (dimension.dataFormat) {
      //    configuration.data.xFormat = dimension.dataFormat;
      //  } else {
      //    configuration.data.xFormat = '%Y-%m-%dT%H:%M:%S'; // default
      //    // TODO brute force (and check) right format
      //  }
      //} else if (dimension.type === 'numeric') {
      //  configuration.axis.x.type = 'numeric';
      //} else {
      //  // TODO check for optimal type if nothing was provided
      //}
    }

  }

  angular
    .module('angularChart')
    .service('AngularChartConverter', AngularChartConverter);

})();



