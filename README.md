# angular-chart [![Build Status](https://travis-ci.org/maxklenk/angular-chart.svg?branch=master)](https://travis-ci.org/maxklenk/angular-chart) [![Coverage Status](https://coveralls.io/repos/maxklenk/angular-chart/badge.png?branch=master)](https://coveralls.io/r/maxklenk/angular-chart?branch=master) [![Dependency Status](https://gemnasium.com/maxklenk/angular-chart.svg)](https://gemnasium.com/maxklenk/angular-chart)

angular-chart is a [AngularJS](https://github.com/angular/angular.js) directive, which is build on top of [c3](https://github.com/masayuki0812/c3) a [d3](https://github.com/mbostock/d3)-based chart library.

## Usage

You can get it from [Bower](http://bower.io/):
```sh
bower install angular-chart --save
```

Add everything to your index.html:
```html
<link rel="stylesheet" href="bower_components/c3/c3.css" />
<link rel="stylesheet" href="bower_components/angular-chart/angular-chart.css">

<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/d3/d3.js"></script>
<script src="bower_components/c3/c3.js"></script>
<script src="bower_components/angular-chart/angular-chart.js"></script>
```

And specify the directive in your module dependencies:
```javascript
angular.module('myApp', ['angularChart'])
```

Add the corresponding data in your controller:
```javascript
$scope.dataset = [
  {
    'day': '2013-01-02_00:00:00',
    'sales': 13461.295202,
    'income': 12365.053
  }
];

$scope.schema = {
  day: {
    type: 'datetime',
    format: '%Y-%m-%d_%H:%M:%S',
    name: 'Date'
  }
};

$scope.options = {
  rows: [{
    key: 'income',
    type: 'bar'
  }, {
    key: 'sales'
  }],
  xAxis: {
    key: 'day',
    displayFormat: '%Y-%m-%d %H:%M:%S'
  }
};
```

Then you are ready to use the directive in your view:
```html
<div ng-controller="Controller">
  <angularchart
    dataset="dataset"
    schema="schema"
    options="options">
  </angularchart>
</div>
```




### Schema

The Schema is optional, it provides additional information about the dataset. It contains objects for all columns of the dataset that have to specified further. Therefor it provides these keys:

#### name : String
Optional name for the row.

#### type : String
Possible values: `datetime, numeric, string`

#### format : String
The format is used to specify how the timestamps are saved if they are different to `%Y-%m-%dT%H:%M:%S`




### Options

The following attributes define the chart itself and how to display the data.

---
#### data : Object

---
##### orientation : String
Possible Values: `json(default), columns, rows`

Defines in what orientation the data is saved. Please see [C3 Data Examples](http://c3js.org/examples.html#data) for examples.

---
##### watchLimit : Integer
Define a custom limit to stop watching for changes inside the dataset and only watch for changes in the number of items. Default: 100

---
#### rows : Object (required)
Defines the columns which should be displayed in the chart. Each row can contain the following:

---
##### rows.key : String (required)
The column key which identifies the value in each record.

---
##### rows.type : String
Possible values: `line, spline, bar, scatter, area, area-spline, step, area-step, step`

---
##### rows.name : String
Optional name for the row.

---
#### rows.show : String
Defines if the row should be rendered in the chart.

---
#### rows.color : String
Defines the color for this row.

---
#### rows.axis : String
Possible values: `y, y2`

Defines the y axis the row is linked.



---
#### type : String
Possible values: `line, spline, bar, scatter, donut`

Defines which kind of chart should be rendered. The value will be the default for `rows.type`.

---
#### typeSelector : boolean
When `true` a selector to switch between multi and pie charts is displayed. Default: `false`



---
#### xAxis : Object
Defines which column to use and how to display it:

---
##### xAxis.key : String ([see example](http://maxklenk.github.io/angular-chart/examples.html#?category=xAxis&example=datetime))
The column key which identifies which value should be shown on the xAxis.

---
##### xAxis.displayFormat : String | Function  ([see example](http://maxklenk.github.io/angular-chart/examples.html#?category=xAxis&example=datetime))
If the xAxis displays a timestamp the format of if can be defined by passing a String which follows the [Time Formatting of D3](https://github.com/mbostock/d3/wiki/Time-Formatting). Alternatively a custom function can be passed.
Sample: `function (x) { return x.getFullYear(); }`

---
##### xAxis.selector : boolean ([see example](http://maxklenk.github.io/angular-chart/examples.html#?category=xAxis&example=selector))
Shows the dropdown to choose which xAxis you want to use. Default: `false`


---
#### yAxis : Object
Defines yAxis display.

---
##### yAxis.label : String
Label displayed for the [Y axis](http://c3js.org/samples/axes_label.html)


---
#### size : Object
Defines a fixed size of the chart.

---
##### size.height : Int ([see example](http://maxklenk.github.io/angular-chart/examples.html#?category=size&example=height))
A fixed height of the chart.

---
##### size.width : Int ([see example](http://maxklenk.github.io/angular-chart/examples.html#?category=size&example=width))
A fixed width of the chart.


---
#### resize: function(size)
Resize the chart, to a provided size or without parameters to fill the suronding element.


---
#### groups : Array
Stacks bar together, like in this [example](http://c3js.org/samples/chart_bar_stacked.html).



---
#### subchart : Object
Defines the subchart like in this [example](http://c3js.org/samples/options_subchart.html).

---
##### subchart.selector : boolean ([see example](http://maxklenk.github.io/angular-chart/examples.html#?category=zoom&example=navigator))
If `true` a subchart toggle button is displayed.

---
##### subchart.show : boolean ([see example](http://maxklenk.github.io/angular-chart/examples.html#?category=zoom&example=navigator))
If `true` a subchart for zooming is displayed.



---
#### zoom : Object
Defines the zoom functionality of the chart.

---
##### zoom.enable : boolean ([see example](http://maxklenk.github.io/angular-chart/examples.html#?category=zoom&example=scroll))
If `true` it is possible to zoom using the mouse wheel. Default: `false`

---
##### zoom.range : Array ```[a, b]``` ([see example](http://maxklenk.github.io/angular-chart/examples.html#?category=zoom&example=scroll))
The current zoomed in range can get and set here. Works also for the subchart.

---
##### zoom.onzoom : function
Callback whenever a zoom event is fired. Works also for the subchart.



---
#### legend : Object
Defines the legend.

---
##### legend.selector : boolean ([see example](http://maxklenk.github.io/angular-chart/examples.html#?category=legend&example=selector))
If `true` a custom legend is displayed. Default: `false`

---
##### legend.show : boolean ([see example](http://maxklenk.github.io/angular-chart/examples.html#?category=legend&example=hide))
If `flase` the default legend is hidden. Default: `true`


---
#### annotation : Array of Objects ([see example](http://maxklenk.github.io/angular-chart/examples.html#?category=annotate&example=xAxis), [see example](http://maxklenk.github.io/angular-chart/examples.html#?category=annotate&example=yAxis))
Defines the annotation lines.

`{value: X, text: 'LABEL', axis: 'AXIS'}` AXIS can be `x`, `y`, `y2`.


---
#### selection : Object
Defines which Items can be selected and are currently selected.

---
##### selection.enabled : Boolean ([see example](http://maxklenk.github.io/angular-chart/examples.html#?category=selection&example=single))
Allows selection of chart elements. Default: `false`

---
##### selection.multiple : Boolean ([see example](http://maxklenk.github.io/angular-chart/examples.html#?category=selection&example=multiple))
Allows selection of multiple chart elements if selection is enabled at all. Default: `false`

---
##### selection.onselected : function
Callback whenever a new selection is added.

---
##### selection.onunselected : function
Callback whenever a selection is removed.

---
##### selection.selected : Array
Contains an array with all selected points of the chart:

Multichart (line, spline, bar, scatter):
```
{
  value: VALUE,
  id: COLUMN_NAME,
  index: X_AXIS_INDEX
}
```

Pie-, Donut chart: _(Currently adding a selection in the Array will not add the selection in the chart)_
```
{
  id: COLUMN_NAME,
  values: [ALL_COLUMN_VALUES]
}
```

---
##### onclick : function
Triggered when you click on a data point.
Sample: `function(d, element) { console.log('Point at', d.x, 'of the serie', d.name 'has been clicked; corresponding htmlElement:', element) };`

##### resize : function
Call this function to trigger the c3 resize() function (http://c3js.org/samples/api_resize.html)

---

## Development [![Stories in Ready](https://badge.waffle.io/maxklenk/angular-chart.png?label=ready&title=Ready)](https://waffle.io/maxklenk/angular-chart) [![Gitter chat](https://badges.gitter.im/maxklenk/angular-chart.png)](https://gitter.im/maxklenk/angular-chart)


We use Karma and jshint to ensure the quality of the code. The easiest way to run these checks is to use grunt:
```sh
npm install -g bower grunt-cli
npm install
grunt
```


## Contributing

Please submit all pull requests the against develop branch. Make sure it passes the CI [![Build Status](https://travis-ci.org/maxklenk/angular-chart.svg?branch=develop)](https://travis-ci.org/maxklenk/angular-chart) and add tests to cover your code [![Coverage Status](https://coveralls.io/repos/maxklenk/angular-chart/badge.png?branch=develop)](https://coveralls.io/r/maxklenk/angular-chart?branch=develop). Thanks!


## Authors

**Max Klenk**

+ http://github.com/maxklenk


## Credit

Icons made by [Freepik](http://www.freepik.com) from [www.flaticon.com](http://www.flaticon.com) is licensed by [CC BY 3.0](http://creativecommons.org/licenses/by/3.0/)


## Copyright and license

	The MIT License

	Copyright (c) 2014 Max Klenk

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
