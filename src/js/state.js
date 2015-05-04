(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  function AngularChartState() {

//// callback for onzoom
//scope.configuration.zoom.onzoomend = function (domain) {
//  scope.updateOptions(function () {
//    scope.options.zoom.range = domain;
//  });
//
//  if (scope.options.zoom.onzoom) {
//    scope.options.zoom.onzoom();
//  }
//};
//
//// callback for onbrush
//scope.configuration.subchart.onbrush = function (domain) {
//  scope.updateOptions(function () {
//    scope.options.zoom.range = domain;
//  });
//
//  if (scope.options.zoom.onzoom) {
//    scope.options.zoom.onzoom();
//  }
//};
//
//// Apply earlier zoom
////
//if (scope.options.zoom && scope.options.zoom.range) {
//  scope.chart.zoom(scope.options.zoom.range);
//}
//
//
//// Selections
////
//scope.selections = {
//  avoidSelections: false,
//
//  // handle chart event onselection
//  addSelected: function (selection) {
//    if (!this.avoidSelections) {
//      if (!angular.isObject(scope.options.selection)) {
//        scope.options.selection = {};
//      }
//      if (!angular.isArray(scope.options.selection.selected)) {
//        scope.options.selection.selected = [];
//      }
//
//      scope.$apply(function() {
//        scope.options.selection.selected.push(selection);
//      });
//      if (scope.options.selection.onselected) {
//        scope.$apply(function(){
//          scope.options.selection.onselected();
//        });
//      }
//    }
//  },
//
//  // handle chart event onunselection
//  removeSelected: function (selection) {
//    if (!this.avoidSelections && angular.isObject(scope.options.selection) && angular.isArray(scope.options.selection.selected)) {
//      scope.$apply(
//        scope.options.selection.selected = scope.options.selection.selected.filter(function (selected) {
//          return selected.id !== selection.id || selected.index !== selection.index;
//        })
//      );
//      if (scope.options.selection.onunselected) {
//        scope.$apply(function(){
//          scope.options.selection.onunselected();
//        });
//      }
//    }
//  },
//
//  // select elements inside the chart
//  performSelections: function (selections) {
//    this.avoidSelections = true;
//    selections.forEach(function (selection) {
//      scope.chart.select([selection.id], [selection.index]);
//    });
//    this.avoidSelections = false;
//  },
//
//  // unselect elements inside the chart
//  performUnselections: function (selections) {
//    this.avoidSelections = true;
//    selections.forEach(function (selection) {
//      scope.chart.unselect([selection.id], [selection.index]);
//    });
//    this.avoidSelections = false;
//  },
//
//  // search options for added or removed selections
//  watchOptions: function (newValue, oldValue) {
//    var oldSelections = oldValue.selection && oldValue.selection.selected ? oldValue.selection.selected : [];
//    var newSelections = newValue.selection && newValue.selection.selected ? newValue.selection.selected : [];
//
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
//
//    //do actual removal /adding of selections and return if something happened.
//    var didSomething = false;
//    if (addedSelections.length > 0) {
//      this.performSelections(addedSelections);
//      didSomething = true;
//    }
//
//    if (removedSelections.length > 0) {
//      this.performUnselections(removedSelections);
//      didSomething = true;
//    }
//
//    return didSomething;
//  }
//};

  }

  angular
    .module('angularChart')
    .service('AngularChartState', AngularChartState);

})();

