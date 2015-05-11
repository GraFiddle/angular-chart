(function () {

  'use strict';

  function DebugController($q, $timeout) {
    var vm = this;
    var data =  [
      {temp: -1, rain: 100, sun: 2, month: 'Jan', date: '2014-01-01', num: 13},
      {temp: 2, rain: 80, sun: 3, month: 'Feb', date: '2014-02-01', num: 14},
      {temp: 7, rain: 90, sun: 5, month: 'Mär', date: '2014-03-01', num: 15},
      {temp: 11, rain: 50, sun: 7, month: 'Apr', date: '2014-04-01', num: 16},
      {temp: 15, rain: 40, sun: 9, month: 'Mai', date: '2014-05-01', num: 17},
      {temp: 22, rain: 15, sun: 12, month: 'Jun', date: '2014-06-01', num: 18},
      {temp: 25, rain: 10, sun: 12, month: 'Jul', date: '2014-07-01', num: 19},
      {temp: 28, rain: 5, sun: 13, month: 'Aug', date: '2014-08-01', num: 20},
      {temp: 27, rain: 30, sun: 2, month: 'Sep', date: '2014-09-01', num: 21},
      {temp: 21, rain: 60, sun: 6, month: 'Okt', date: '2014-10-01', num: 22},
      {temp: 14, rain: 40, sun: 9, month: 'Nov', date: '2014-11-01', num: 23},
      {temp: 5, rain: 80, sun: 5, month: 'Dec', date: '2014-12-01', num: 24}
    ];

    var options = {
      dimensions: {
        temp: {
          axis: 'y',
          type: 'spline',
          label: true,
          color: 'orange',
          postfix: '°C',
          name: 'Temperatur'
        },
        rain: {
          axis: 'y2',
          type: 'bar',
          label: true,
          color: 'lightblue',
          postfix: 'mm',
          name: 'Regen'
        },
        sun: {
          axis: 'y',
          type: 'step',
          color: 'red',
          label: true,
          postfix: 'h',
          name: 'Sonnenstunden'
        },
        date: {
          axis: 'x',
          displayFormat: '%Y-%m ',
          dataType: 'datetime'
        },
        //month: {
        //  axis: 'x'
        //},
        //num: {
        //  axis: 'x',
        //  dataType: 'numeric'
        //}
      },
      chart: {
        data: {
          selection: {
            enabled: true
          }
        },
        zoom: {
          enabled: true
        }
      }
    };

    //vm.options = $q(function(resolve) {
    //  $timeout(function(){
    //  resolve(options);
    //  },100);
    //});

    vm.updateChart = function () {
      vm.options = options;
      //vm.options.data = data;
      //vm.options.chart.size = {
      //  height: 300 + Math.random() * 100
      //};
      console.log('new options', vm.options);
    };

    vm.updateData = function () {
      vm.options.data = data;
      //vm.options.data.push({data1: Math.random() * 100});
    };

    vm.updateState = function () {
      vm.options.state = {
        selected: [{
          id: 'value',
          index: 0
        }]
      };
    };

  }

  angular
    .module('AngularChartDebug')
    .controller('DebugController', DebugController);

})();
