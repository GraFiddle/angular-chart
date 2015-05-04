(function () {

  'use strict';

  /* istanbul ignore next */
  var angular = window.angular ? window.angular : 'undefined' !== typeof require ? require('angular') : undefined;

  function AngularChartEditor() {

//// Remove the max-height set by c3.js
//angular.element(element).removeAttr('style');
//
//// Choose x-axis
////
//scope.chooseXAxis = function () {
//  if (scope.options.type === 'pie' || scope.options.type === 'donut' || !scope.options.xAxis || !scope.options.xAxis.selector) {
//    return;
//  }
//  var el = angular.element('<span class="chooseXAxis"/>');
//  el.append('<select ng-hide="options.type === \'pie\' || options.type === \'donut\'" ng-model="options.xAxis.key" class="form-control"><option ng-repeat="col in schema" value="{{col.id}}" ng-selected="col.id===options.xAxis.key">{{col.name ? col.name : col.id}}</option></select>');
//  $compile(el)(scope);
//  element.append(el);
//};
//
//// Choose chart-type
////
//scope.chooseChartType = function () {
//  if (scope.options.typeSelector) {
//    var el = angular.element('<div class="chooseChartType btn-group">');
//    el.append('<button ng-click="changeChartType(\'scatter\')" ng-class="{\'active\': options.type === \'scatter\'}" class="btn btn-default">Scatter</button>');
//    el.append('<button ng-click="changeChartType(\'bar\')" ng-class="{\'active\': options.type === \'bar\'}" class="btn btn-default">Bar</button>');
//    el.append('<button ng-click="changeChartType(\'line\')" ng-class="{\'active\': options.type === \'line\'}" class="btn btn-default">Line</button>');
//    el.append('<button ng-click="changeChartType(\'pie\')" ng-class="{\'active\': options.type === \'pie\'}" class="btn btn-default">Pie</button>');
//    $compile(el)(scope);
//    element.prepend(el);
//  }
//};
//// called function
//scope.changeChartType = function (type) {
//  scope.options.type = type;
//  scope.options.rows.forEach(function (element) {
//    element.type = type;
//  });
//};
//
//// Toggle Subchart
////
//scope.toggleSubchart = function () {
//  scope.options.subchart.show = !scope.options.subchart.show;
//  if (scope.options.zoom && scope.options.zoom.range) {
//    delete scope.options.zoom.range;
//  }
//};
//
//// Add Toggle Subchart Links
////
//scope.toggleSubchartLink = function () {
//  if (scope.options.type === 'pie' || scope.options.type === 'donut' || !scope.options.subchart || !scope.options.subchart.selector) {
//    return;
//  }
//  var el = angular.element('<span class="toggleSubchart"/>');
//  if (scope.options.subchart.show) {
//    // hide subchart
//    el.append('<a title="hide navigation subchart" ng-click="toggleSubchart()"><i class="flaticon-hide"></i> hide navigator</a>');
//  } else {
//    // show subchart
//    el.append('<a title="show navigation subchart" ng-click="toggleSubchart()"><i class="flaticon-show"></i> show navigator</a>');
//  }
//  $compile(el)(scope);
//  element.append(el);
//
//};
//
//// Add custom Legend
////
//scope.customLegend = function () {
//  if (!scope.options.legend || !scope.options.legend.selector) {
//    return;
//  }
//
//  var legend = angular.element('<div class="customLegend"><span ng-repeat="row in options.rows" ng-if="row.key !== options.xAxis.key" class="customLegend-item" ><circular options="rowEdit[$index]"></circular><span class="customLegend-label" data-id="{{row.name}}">{{(schema[row.key] && schema[row.key].name) ? schema[row.key].name : (row.name ? row.name : row.key)}}</span></span></div>');
//  $compile(legend)(scope);
//  element.prepend(legend);
//
//  // d3.selectAll('.customLegend span')
//  //   .each(function () {
//  //     var id = d3.select(this).attr('data-id');
//  //     d3.select(this).style('background-color', scope.chart.color(id));
//  //   })
//  //   .on('mouseover', function () {
//  //     var id = d3.select(this).attr('data-id');
//  //     scope.chart.focus(id);
//  //   })
//  //   .on('mouseout', function () {
//  //     var id = d3.select(this).attr('data-id');
//  //     scope.chart.revert();
//  //   })
//  //   .on('click', function () {
//  //     var id = d3.select(this).attr('data-id');
//  //     scope.chart.toggle(id);
//  //   });
//
//  var typeIcons = {
//    'line': 'flaticon-line',
//    'spline': 'flaticon-line',
//    'area': 'flaticon-area',
//    'area-spline': 'flaticon-area',
//    'scatter': 'flaticon-scatter',
//    'bar': 'flaticon-bar',
//    'pie': 'flaticon-pie',
//    'donut': 'flaticon-pie',
//    'step': 'flaticon-line',
//    'area-step': 'flaticon-area'
//  };
//
//  // onClick functions
//  //
//  scope.switchAxis = function (options, clicked) {
//    scope.options.rows[options.index].axis = clicked.axis;
//    scope.options.rows[options.index].show = true;
//  };
//  scope.switchType = function (options, clicked) {
//    scope.options.rows[options.index].type = clicked.type;
//    scope.options.rows[options.index].show = true;
//  };
//  scope.switchShow = function (options, clicked) {
//    scope.options.rows[options.index].show = clicked.show;
//  };
//
//  // generate circular options
//  //
//  scope.rowEdit = [];
//  for (var index in scope.options.rows) {
//
//    // hide current x-axis
//    //
//    if (scope.options.xAxis && scope.options.xAxis.key === scope.options.rows[index].key) {
//      continue;
//    }
//
//    var show = scope.options.rows[index].show === undefined || scope.options.rows[index].show === true;
//
//    scope.rowEdit[index] = {
//      row: 'sales',
//      index: index,
//      isOpen: false,
//      toggleOnClick: true,
//      background: show ? scope.options.rows[index].color || scope.chart.color(scope.options.rows[index].key) : 'gray',
//      color: 'white',
//      size: '',
//      button: {
//        content: '',
//        cssClass: typeIcons[scope.options.rows[index].type] || typeIcons.spline,
//        background: show ? scope.options.rows[index].color || scope.chart.color(scope.options.rows[index].key) : 'gray',
//        color: 'white',
//        size: 'small'
//      },
//      items: [{
//        title: 'plot data on right axis',
//        axis: 'y2',
//        onclick: scope.switchAxis,
//        isActive: scope.options.rows[index].axis === 'y2',
//        cssClass: 'flaticon-right'
//      }, {
//        title: 'plot data on left axis',
//        axis: 'y',
//        onclick: scope.switchAxis,
//        isActive: scope.options.rows[index].axis === 'y',
//        cssClass: 'flaticon-left'
//      }, {
//        empty: true
//      }, {
//        title: 'display data as line chart',
//        type: 'spline',
//        onclick: scope.switchType,
//        isActive: scope.options.rows[index].type === 'spline' || scope.options.rows[index].type === 'line',
//        cssClass: typeIcons.spline
//      }, {
//        title: 'display data as area chart',
//        type: 'area-spline',
//        onclick: scope.switchType,
//        isActive: scope.options.rows[index].type === 'area' || scope.options.rows[index].type === 'area-spline',
//        cssClass: typeIcons['area-spline']
//      }, {
//        title: 'display data as bar chart',
//        type: 'bar',
//        onclick: scope.switchType,
//        isActive: scope.options.rows[index].type === 'bar',
//        cssClass: typeIcons.bar
//      }, {
//        title: 'display data as scatter plot',
//        type: 'scatter',
//        onclick: scope.switchType,
//        isActive: scope.options.rows[index].type === 'scatter',
//        cssClass: typeIcons.scatter
//      }, {
//        empty: true
//      }, {
//        title: 'show this data',
//        show: true,
//        onclick: scope.switchShow,
//        isActive: show,
//        cssClass: 'flaticon-show'
//      }, {
//        title: 'hide this data',
//        show: false,
//        onclick: scope.switchShow,
//        isActive: !show,
//        cssClass: 'flaticon-hide'
//      }]
//    };
//  }
//
//};

  }

  angular
    .module('angularChart')
    .service('AngularChartEditor', AngularChartEditor);

})();

