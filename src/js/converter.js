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

      // save displayFormat for reuse
      var displayFormat = {
        isUse: false,
        y: [],
        y2: []
      };

      // apply all dimensions
      angular.forEach(options.dimensions, function (dimension, key) {
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
          displayFormat.y2.push(key);
        } else if (dimension.axis !== 'x') {
          configuration.axis.y.show = true;
          displayFormat.y.push(key);
        }

        // label
        displayFormat[key] = true;
        if (angular.isDefined(dimension.displayFormat)) {
          displayFormat.inUse = true;
          displayFormat[key] = dimension.displayFormat;
        } else if (angular.isDefined(dimension.prefix) || angular.isDefined(dimension.postfix)) {
          displayFormat.inUse = true;
          displayFormat[key] = function (label) {
            console.log(label, 'with fixes');
            return (dimension.prefix || '') + label + (dimension.postfix || '');
          };
        }

        if (dimension.label === true) {
          configuration.data.labels.format[key] = displayFormat[key];
        }

        // x-Axis
        if (dimension.axis === 'x') {
          configuration.data.keys.x = key;
          configuration.data.x = key;
          configuration.axis.x.type = 'category';

          if (angular.isFunction(displayFormat[key])) {
            configuration.axis.x.tick.format = displayFormat[key];
          }
        }

      });

      // Tooltips
      // http://c3js.org/samples/tooltip_format.html
      if (displayFormat.inUse) {
        configuration.tooltip = {
          format: {
            value: function (value, ratio, id) {
              if (angular.isFunction(displayFormat[id])) {
                return displayFormat[id](value);
              } else {
                return value;
              }
            }
          }
        };
      }

      // Y-Axes
      // http://c3js.org/samples/axes_y_tick_format.html
      angular.forEach(['y', 'y2'], function (axis) {
        var format = null;
        var formatKey = null;
        angular.forEach(displayFormat[axis], function (key) {
          if (format === null) {
            format = displayFormat[key];
            formatKey = key;
          } else if (
            format !== displayFormat[key] && !(

              // not two functuins
            (!angular.isFunction(options.dimensions[formatKey].displayFormat) && !angular.isFunction(options.dimensions[key].displayFormat)) &&

            (

              // not two prefixes
            (!angular.isDefined(options.dimensions[formatKey].prefix) && !angular.isDefined(options.dimensions[key].prefix)) ||

              // two same prefixes
            (angular.isDefined(options.dimensions[formatKey].prefix) &&
            angular.isDefined(options.dimensions[key].prefix) &&
            options.dimensions[formatKey].prefix === options.dimensions[key].prefix)

            ) && (
              // not two postfixes
            (!angular.isDefined(options.dimensions[formatKey].postfix) && !angular.isDefined(options.dimensions[key].postfix)) ||

              // two same postfixes
            (angular.isDefined(options.dimensions[formatKey].postfix) &&
            angular.isDefined(options.dimensions[key].postfix) &&
            options.dimensions[formatKey].postfix === options.dimensions[key].postfix)

            ))) {
            format = false;
          }
        });
        if (format !== false && format !== true && format !== null) {
          configuration.axis[axis].tick.format = format;
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



