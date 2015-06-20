(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  function AngularChartState(AngularChartWatcher) {
    var service = {
      disableSelectionListener: false,
      synchronizeZoom: synchronizeZoom,
      applyZoom: applyZoom,
      synchronizeSelection: synchronizeSelection,
      applySelection: applySelection
    };

    return service;

    ////////////

    /**
     * Apply earlier zoom
     */
    function applyZoom(options, chart) {
      if (angular.isObject(options.state) && angular.isObject(options.state) && angular.isArray(options.state.range)) {
        chart.zoom(options.state.range);
      } else {
        chart.unzoom();
      }
    }

    /**
     * Create nested options objects.
     */
    function createZoomRangePath(options) {
      if (!angular.isObject(options.state)) {
        options.state = {};
      }
      if (!angular.isObject(options.state.range)) {
        options.state.range = [];
      }
    }

    /**
     * Setup zoom event listeners which update the state
     */
    function synchronizeZoom(options, configuration, watcher) {
      if (angular.isObject(options.chart) && angular.isObject(options.chart.zoom) && options.chart.zoom.enabled === true) {

        // setup onzoomend listener
        configuration.zoom.onzoomend = function (domain) {

          // update state
          AngularChartWatcher.updateState(watcher, function () {
            createZoomRangePath(options);
            options.state.range = domain;
          });

          // call user defined callback
          if (angular.isFunction(options.chart.zoom.onzoomend)) {
            AngularChartWatcher.applyFunction(watcher, function () {
              options.chart.zoom.onzoomend(domain);
            });
          }
        };
      }

      if (angular.isObject(options.chart) && angular.isObject(options.chart.subchart) && options.chart.subchart.show === true) {
        // setup onbrush listener
        configuration.subchart.onbrush = function (domain) {

          // update state
          AngularChartWatcher.updateState(watcher, function () {
            createZoomRangePath(options);
            options.state.range = domain;
          });

          // call user defined callback
          if (angular.isFunction(options.chart.subchart.onbrush)) {
            AngularChartWatcher.applyFunction(watcher, function () {
              options.chart.subchart.onbrush(domain);
            });
          }
        };
      }
    }

    /**
     * Add passed selection to the chart.
     */
    function addSelections(chart, selections) {
      service.disableSelectionListener = true;
      selections.forEach(function (selection) {
        chart.select([selection.id], [selection.index]);
      });
      service.disableSelectionListener = false;
    }

    /**
     * Remove passed selections from the chart.
     */
    //function removeSelections(chart, selections) {
    //  disableSelectionListener = true;
    //  selections.forEach(function (selection) {
    //    chart.unselect([selection.id], [selection.index]);
    //  });
    //  disableSelectionListener = false;
    //}

    /**
     * Remove all selections present in the chart.
     */
    function removeAllSelections(chart) {
      service.disableSelectionListener = true;
      chart.unselect();
      service.disableSelectionListener = false;
    }

    /**
     * Apply earlier selections.
     */
    function applySelection(options, chart) {
      if (angular.isObject(options.state) && angular.isArray(options.state.selected)) {
        // TODO: get new selections
        // TODO: get removed selections
        // var chartSelections = chart.selected();
        //    // addedSelections
        //    var addedSelections = newSelections.filter(function (elm) {
        //      var isNew = true;
        //      oldSelections.forEach(function (old) {
        //        if (old.id === elm.id && old.index === elm.index) {
        //          isNew = false;
        //          return isNew;
        //        }
        //      });
        //      return isNew;
        //    });
        //
        //    // removedSelections
        //    var removedSelections = oldSelections.filter(function (elm) {
        //      var isOld = true;
        //      newSelections.forEach(function (old) {
        //        if (old.id === elm.id && old.index === elm.index) {
        //          isOld = false;
        //          return isOld;
        //        }
        //      });
        //      return isOld;
        //    });

        // alternative: deselect all and select again
        //removeAllSelections(chart);
        addSelections(chart, options.state.selected);

      } else {
        removeAllSelections(chart);
      }
    }

    /**
     * Create nested options object.
     */
    function createSelectionsPath(options) {
      if (!angular.isObject(options.state)) {
        options.state = {};
      }
      if (!angular.isArray(options.state.selected)) {
        options.state.selected = [];
      }
    }

    /**
     * Listen to chart events to save selections into to state object.
     */
    function synchronizeSelection(options, configuration, watcher) {
      if (angular.isObject(options.chart) && angular.isObject(options.chart.data) && angular.isObject(options.chart.data.selection) && options.chart.data.selection.enabled === true) {

        // add onselected listener
        configuration.data.onselected = function (data, element) {

          // check if listener is disabled currently
          if (service.disableSelectionListener) {
            return;
          }

          // update state
          AngularChartWatcher.updateState(watcher, function () {
            createSelectionsPath(options);
            options.state.selected.push(data);
          });

          // call user defined callback
          if (angular.isFunction(options.chart.data.onselected)) {
            AngularChartWatcher.applyFunction(watcher, function () {
              options.chart.data.onselected(data, element);
            });
          }

        };

        // add onunselection listener
        configuration.data.onunselected = function (data, element) {

          // check if listener is disabled currently
          if (service.disableSelectionListener) {
            return;
          }

          // update state
          AngularChartWatcher.updateState(watcher, function () {
            createSelectionsPath(options);
            options.state.selected = options.state.selected.filter(function (selected) {
              return selected.id !== data.id || selected.index !== data.index;
            });
          });

          // call user defined callback
          if (angular.isFunction(options.chart.data.onunselected)) {
            AngularChartWatcher.applyFunction(watcher, function () {
              options.chart.data.onunselected(data, element);
            });
          }

        };

      }
    }

  }

  angular
    .module('angularChart')
    .service('AngularChartState', AngularChartState);

})();

