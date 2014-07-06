# angular-chart [![Build Status](https://travis-ci.org/maxklenk/angular-chart.svg?branch=replaceWithC3)](https://travis-ci.org/maxklenk/angular-chart) [![Coverage Status](https://coveralls.io/repos/maxklenk/angular-chart/badge.png?branch=replaceWithC3)](https://coveralls.io/r/maxklenk/angular-chart?branch=replaceWithC3)  (https://requires.io/github/maxklenk/angular-chart/requirements/?branch=replaceWithC3) [![Dependency Status](https://gemnasium.com/maxklenk/angular-chart.svg)](https://gemnasium.com/maxklenk/angular-chart)


## Requirements

* [AngularJS](https://github.com/angular/angular.js)
* [C3](https://github.com/masayuki0812/c3)
* [D3](https://github.com/mbostock/d3)


## Usage

You can get it from [Bower](http://bower.io/):

```sh
bower install angular-chart
```

Add everything to your index.html:

```html
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/d3/d3.js"></script>
<script src="bower_components/c3/c3.js"></script>
<script src="bower_components/angular-chart/angular-chart.js"></script>
```

And specify the directive in your module dependencies:

```javascript
angular.module('myApp', ['angularChart'])
```

Then you are ready to use the directive in any view:

```html
<div ng-controller="Controller">
  <angularchart
    dataset="dataset"
    options="options">
  </angularchart>
</div>
```

And create the corresponding data in your controller:

```javascript
$scope.dataset = {
  'schema': [{
    'name': 'day',
    'type': 'datetime',
    'format': '%Y-%m-%dT%H:%M:%S'
  }, {
    'name': 'sales',
    'type': 'double'
  }, {
    'name': 'income',
    'type': 'double'
  }],
  'records': [{
    'day': '2013-01-02T00:00:00',
    'sales': 13461.295202,
    'income': 12365.053
  }]
};

$scope.options = {
  rows: [{
    name: 'income',
    type: 'bar'
  }, {
    name: 'sales'
  }],
  xAxis: {
    name: 'day',
    displayFormat: '%Y-%m-%d %H:%M:%S'
  }
};
```




## Development [![Stories in Ready](https://badge.waffle.io/maxklenk/angular-chart.png?label=ready&title=Ready)](https://waffle.io/maxklenk/angular-chart) [![Gitter chat](https://badges.gitter.im/maxklenk/angular-chart.png)](https://gitter.im/maxklenk/angular-chart)


We use Karma and jshint to ensure the quality of the code. The easiest way to run these checks is to use grunt:

```sh
npm install -g bower grunt-cli
npm install
grunt
```

Make sure your Pull-Requests pass the CI [![Build Status](https://travis-ci.org/maxklenk/angular-chart.svg?branch=replaceWithC3)](https://travis-ci.org/maxklenk/angular-chart) and add tests to cover your code [![Coverage Status](https://coveralls.io/repos/maxklenk/angular-chart/badge.png?branch=replaceWithC3)](https://coveralls.io/r/maxklenk/angular-chart?branch=replaceWithC3).