'use strict';

var rows = [{
  key: 'sales',
  type: 'spline'
}, {
  key: 'customers',
  type: 'area'
}, {
  key: 'units',
  type: 'bar',
}];

var exampleCategories = {
  'zoom': {
  slug: 'zoom',
  title: 'Zoom / Navigator',
  examples: {
    'navigator': {
      slug: 'navigator',
      title: 'Subchart',
      subtitle: 'Choose zoom in extra chart',
      description: 'Select an area in the bottom chart to zoom, drag the area move it.',
      options: {
        rows: rows,
        subchart: {
          selector: true,
          show: true
        },
        zoom: {
          range: [
            1.1,
            3.9
          ]
        }
      }
    },
    'scroll': {
      slug: 'scroll',
      title: 'Scroll Zoom',
      subtitle: 'Zoom by scrolling',
      description: 'Use the mouse wheel inside the chart to zoom, drag to move the area.',
      options: {
        rows: rows,
        zoom: {
          enabled: true
        }
      }
    }
  }
  },

  'xAxis': {
    slug: 'xAxis',
    title: 'x-Axis',
    examples: {
      'selector': {
        slug: 'selector',
        title: 'Choose x-Axis',
        subtitle: 'Show dropdown to change x-Axis',
        description: 'Use the dropdown in the bottom center to change the x-Axis.',
        options: {
          rows: rows,
          xAxis: {
            selector: true
          }
        }
      },
      'datetime': {
        slug: 'datetime',
        title: 'Timeseries',
        subtitle: 'Render timestamps in a custom format',
        description: 'Render timestamps in a custom format.',
        options: {
          rows: rows,
          xAxis: {
            key: 'day',
            displayFormat: '%Y-%m-%d'
          }
        }
      }
    }
  },

  'size': {
    slug: 'size',
    title: 'Chart Size',
    examples: {
      'height': {
        slug: 'height',
        title: 'Height',
        subtitle: 'Define a chart height',
        description: 'Define a chart height.',
        options: {
          rows: rows,
          size: {
            height: 150
          }
        }
      },
      'width': {
        slug: 'width',
        title: 'Width',
        subtitle: 'Define a chart width',
        description: 'Define a chart width.',
        options: {
          rows: rows,
          size: {
            width: 300
          }
        }
      },
    }
  },

  'legend': {
    slug: 'legend',
    title: 'Legend',
    examples: {
      'selector': {
        slug: 'selector',
        title: 'In-Place Editor',
        subtitle: 'change visualization interactive',
        description: 'Change the visualization by clicking the legend.',
        options: {
          rows: rows,
          legend: {
            selector: true
          }
        }
      },
      'hide': {
        slug: 'hide',
        title: 'Hide Legend',
        subtitle: 'disable the legend',
        description: 'Do not show the legend',
        options: {
          rows: rows,
          legend: {
            show: false
          }
        }
      }
    }
  },

  'annotate': {
    slug: 'annotate',
    title: 'Annotations',
    examples: {
      'xAxis': {
        slug: 'xAxis',
        title: 'vertical Lines',
        subtitle: '',
        description: 'Add annotations on specific x-Axis points.',
        options: {
          rows: rows,
          annotation: [{
            axis: 'x',
            value: 1,
            label: 'one'
          }]
        }
      },
      'yAxis': {
        slug: 'yAxis',
        title: 'horizontal Lines',
        subtitle: '',
        description: 'Add annotations on specific y-Axis points.',
        options: {
          rows: rows,
          annotation: [{
            axis: 'y',
            value: 200,
            label: 'two hundred'
          }, {
            axis: 'y2',
            value: 0,
            label: 'zero'
          }]
        }
      }
    }
  },

  'selection': {
    slug: 'selection',
    title: 'Selections',
    examples: {
      'single': {
        slug: 'single',
        title: 'Single Points',
        subtitle: '',
        description: 'Select single points in the chart by clicking on them.',
        options: {
          rows: rows,
          selection: {
            enabled: true,
            multiple: false
          }
        }
      },
      'multiple': {
        slug: 'multiple',
        title: 'Multiple Points',
        subtitle: '',
        description: 'Select points by drawing a rectangle.',
        options: {
          rows: rows,
          selection: {
            enabled: true,
            multiple: true
          }
        }
      }
    }
  },

  'yAxis': {
    slug: 'yAxis',
    title: 'y-Axis',
    examples: {
      'single': {
        slug: 'minmax',
        title: 'minimal / maximal',
        subtitle: '',
        description: 'Choose where the y-Axis should start and end.',
        options: {
          rows: rows,
          yAxis: {
            min: 100,
            max: 400
          }
        }
      },
      'multiple': {
        slug: 'label',
        title: 'Custom Label',
        subtitle: '',
        description: 'Add a label for your axis.',
        options: {
          rows: rows,
          yAxis: {
            label: 'The amazing Axis'
          }
        }
      }
    }
  },

};

// To be Added
// {
//   id: 4,
//   name: 'Axis Labels',
//   description: 'The xAxis selector allows the user to choose the xAxis.',
//   options: {
//     rows: [{
//       key: 'sales'
//     }, {
//       key: 'income'
//     }],
//     xAxis: {
//       key: 'dayString',
//       label: 'Weekday'
//     },
//     yAxis: {
//       label: 'Amount'
//     }
//   }
// }, {
//   id: 6,
//   name: 'Type Selector',
//   description: 'The type selector allows the user to choose the chart type.',
//   options: {
//     rows: [{
//       key: 'sales'
//     }],
//     typeSelector: true,
//     xAxis: {
//       key: 'income'
//     }
//   }
// }
// additional y-Axis
