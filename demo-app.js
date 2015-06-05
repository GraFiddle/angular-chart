(function () {

    'use strict';

    angular
        .module('AngularChartDemo', ['angularChart'])
        .factory('DemoData', DemoData)
        .controller('DemoController', DemoController);

    function DemoController(DemoData) {
        var vm = this;

        // base data
        var dataClimate =  DemoData.climateData;
        var optionsClimate = {
            dimensions: {
                temp: {
                    axis: 'y',
                    type: 'spline',
                    label: true,
                    color: 'orange',
                    postfix: '°C',
                    name: 'temperature'
                },
                rain: {
                    axis: 'y2',
                    type: 'bar',
                    label: true,
                    color: 'lightblue',
                    postfix: 'mm',
                    name: 'rain'
                },
                sun: {
                    axis: 'y',
                    type: 'step',
                    color: 'red',
                    label: true,
                    postfix: 'h',
                    name: 'sunshine'
                },
                month: {
                    axis: 'x'
                }
            }
        };

        // index
        vm.indexOptions = angular.copy(optionsClimate);
        vm.indexOptions.data = dataClimate;

        // stateful
        vm.statefulOptions = angular.copy(optionsClimate);
        vm.statefulOptions.data = dataClimate;
        vm.statefulOptions.chart = {
            subchart: {
                show: true
            }
        };
        vm.statefulOptions.state = {
            range: [3, 9]
        };
    }

    function DemoData() {

        var climateData =  [
            {temp: -1, rain: 100, sun: 2, month: 'Jan', date: '2014-01-01', num: 13},
            {temp: 2, rain: 80, sun: 3, month: 'Feb', date: '2014-02-01', num: 14},
            {temp: 7, rain: 90, sun: 5, month: 'Mar', date: '2014-03-01', num: 15},
            {temp: 11, rain: 60, sun: 7, month: 'Apr', date: '2014-04-01', num: 16},
            {temp: 15, rain: 50, sun: 9, month: 'May', date: '2014-05-01', num: 17},
            {temp: 22, rain: 15, sun: 12, month: 'Jun', date: '2014-06-01', num: 18},
            {temp: 25, rain: 10, sun: 12, month: 'Jul', date: '2014-07-01', num: 19},
            {temp: 28, rain: 5, sun: 13, month: 'Aug', date: '2014-08-01', num: 20},
            {temp: 27, rain: 30, sun: 2, month: 'Sep', date: '2014-09-01', num: 21},
            {temp: 21, rain: 60, sun: 6, month: 'Oct', date: '2014-10-01', num: 22},
            {temp: 14, rain: 70, sun: 9, month: 'Nov', date: '2014-11-01', num: 23},
            {temp: 5, rain: 80, sun: 5, month: 'Dec', date: '2014-12-01', num: 24}
        ];

        return {
            climateData: climateData
        };

    }

})();
