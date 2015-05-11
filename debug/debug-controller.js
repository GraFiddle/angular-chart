(function () {

  'use strict';

  function DebugController() {
    var vm = this;

    vm.options = {
      data: [
        {temp: -1, rain: 100, sun: 2, month: 'Jan'},
        {temp: 2, rain: 80, sun: 3, month: 'Feb'},
        {temp: 7, rain: 90, sun: 5, month: 'Mär'},
        {temp: 11, rain: 50, sun: 7, month: 'Apr'},
        {temp: 15, rain: 40, sun: 9, month: 'Mai'},
        {temp: 22, rain: 15, sun: 12, month: 'Jun'},
        {temp: 25, rain: 10, sun: 12, month: 'Jul'},
        {temp: 28, rain: 5, sun: 13, month: 'Aug'},
        {temp: 27, rain: 30, sun: 2, month: 'Sep'},
        {temp: 21, rain: 60, sun: 6, month: 'Okt'},
        {temp: 14, rain: 40, sun: 9, month: 'Nov'},
        {temp: 5, rain: 80, sun: 5, month: 'Dec'}
      ],
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
        month: {
          axis: 'x'
        }
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

    vm.updateChart = function () {
      vm.options.chart.size = {
        height: 300 + Math.random() * 100
      };
      console.log('new options', vm.options);
    };

    vm.updateData = function () {
      vm.options.data.push({data1: Math.random() * 100});
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
