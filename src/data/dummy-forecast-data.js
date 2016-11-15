let totalData = [{
  x: new Date(Date.UTC(2016, 10, 16, 0, 0, 0)),
  low: 0.35,
  high: 0.7
},{
  x: new Date(Date.UTC(2016, 10, 16, 1, 0, 0)),
  low: 0.42,
  high: 0.79
}, {
  x: new Date(Date.UTC(2016, 10, 16, 2, 0, 0)),
  low: 0.49,
  high: 0.87
}, {
  x: new Date(Date.UTC(2016, 10, 16, 3, 0, 0)),
  low: 0.45,
  high: 0.82
}, {
  x: new Date(Date.UTC(2016, 10, 16, 4, 0, 0)),
  low: 0.50,
  high: 0.89
}, {
  x: new Date(Date.UTC(2016, 10, 16, 5, 0, 0)),
  low: 0.40,
  high: 0.72
}, {
  x: new Date(Date.UTC(2016, 10, 16, 6, 0, 0)),
  low: 0.32,
  high: 0.64
}, {
  x: new Date(Date.UTC(2016, 10, 16, 7, 0, 0)),
  low: 0.24,
  high: 0.59
}, {
  x: new Date(Date.UTC(2016, 10, 16, 8, 0, 0)),
  low: 0.14,
  high: 0.44
}, {
  x: new Date(Date.UTC(2016, 10, 16, 9, 0, 0)),
  low: 0.13,
  high: 0.40
}, {
  x: new Date(Date.UTC(2016, 10, 16, 10, 0, 0)),
  low: 0.26,
  high: 0.46
}, {
  x: new Date(Date.UTC(2016, 10, 16, 11, 0, 0)),
  low: 0.36,
  high: 0.69
}, {
  x: new Date(Date.UTC(2016, 10, 16, 12, 0, 0)),
  low: 0.54,
  high: 0.80
}, {
  x: new Date(Date.UTC(2016, 10, 16, 13, 0, 0)),
  low: 0.50,
  high: 0.73
}, {
  x: new Date(Date.UTC(2016, 10, 16, 14, 0, 0)),
  low: 0.55,
  high: 0.75
}, {
  x: new Date(Date.UTC(2016, 10, 16, 15, 0, 0)),
  low: 0.47,
  high: 0.68
}, {
  x: new Date(Date.UTC(2016, 10, 16, 16, 0, 0)),
  low: 0.35,
  high: 0.60
}, {
  x: new Date(Date.UTC(2016, 10, 16, 17, 0, 0)),
  low: 0.25,
  high: 0.44
}, {
  x: new Date(Date.UTC(2016, 10, 16, 18, 0, 0)),
  low: 0.26,
  high: 0.47
}, {
  x: new Date(Date.UTC(2016, 10, 16, 19, 0, 0)),
  low: 0.34,
  high: 0.50
}, {
  x: new Date(Date.UTC(2016, 10, 16, 20, 0, 0)),
  low: 0.30,
  high: 0.46
}, {
  x: new Date(Date.UTC(2016, 10, 16, 21, 0, 0)),
  low: 0.28,
  high: 0.38
}, {
  x: new Date(Date.UTC(2016, 10, 16, 22, 0, 0)),
  low: 0.20,
  high: 0.32
}, {
  x: new Date(Date.UTC(2016, 10, 16, 23, 0, 0)),
  low: 0.22,
  high: 0.34
}],

farmData = [{
  x: new Date(Date.UTC(2016, 10, 16, 0, 0, 0)),
  low: 0.30,
  high: 0.64
},{
  x: new Date(Date.UTC(2016, 10, 16, 1, 0, 0)),
  low: 0.40,
  high: 0.76
}, {
  x: new Date(Date.UTC(2016, 10, 16, 2, 0, 0)),
  low: 0.50,
  high: 0.90
}, {
  x: new Date(Date.UTC(2016, 10, 16, 3, 0, 0)),
  low: 0.30,
  high: 0.70
}, {
  x: new Date(Date.UTC(2016, 10, 16, 4, 0, 0)),
  low: 0.20,
  high: 0.49
}, {
  x: new Date(Date.UTC(2016, 10, 16, 5, 0, 0)),
  low: 0.30,
  high: 0.62
}, {
  x: new Date(Date.UTC(2016, 10, 16, 6, 0, 0)),
  low: 0.42,
  high: 0.69
}, {
  x: new Date(Date.UTC(2016, 10, 16, 7, 0, 0)),
  low: 0.20,
  high: 0.45
}, {
  x: new Date(Date.UTC(2016, 10, 16, 8, 0, 0)),
  low: 0.14,
  high: 0.44
}, {
  x: new Date(Date.UTC(2016, 10, 16, 9, 0, 0)),
  low: 0.28,
  high: 0.50
}, {
  x: new Date(Date.UTC(2016, 10, 16, 10, 0, 0)),
  low: 0.38,
  high: 0.58
}, {
  x: new Date(Date.UTC(2016, 10, 16, 11, 0, 0)),
  low: 0.50,
  high: 0.80
}, {
  x: new Date(Date.UTC(2016, 10, 16, 12, 0, 0)),
  low: 0.54,
  high: 0.83
}, {
  x: new Date(Date.UTC(2016, 10, 16, 13, 0, 0)),
  low: 0.64,
  high: 0.90
}, {
  x: new Date(Date.UTC(2016, 10, 16, 14, 0, 0)),
  low: 0.55,
  high: 0.75
}, {
  x: new Date(Date.UTC(2016, 10, 16, 15, 0, 0)),
  low: 0.47,
  high: 0.68
}, {
  x: new Date(Date.UTC(2016, 10, 16, 16, 0, 0)),
  low: 0.54,
  high: 0.72
}, {
  x: new Date(Date.UTC(2016, 10, 16, 17, 0, 0)),
  low: 0.30,
  high: 0.52
}, {
  x: new Date(Date.UTC(2016, 10, 16, 18, 0, 0)),
  low: 0.22,
  high: 0.47
}, {
  x: new Date(Date.UTC(2016, 10, 16, 19, 0, 0)),
  low: 0.12,
  high: 0.38
}, {
  x: new Date(Date.UTC(2016, 10, 16, 20, 0, 0)),
  low: 0.23,
  high: 0.39
}, {
  x: new Date(Date.UTC(2016, 10, 16, 21, 0, 0)),
  low: 0.28,
  high: 0.38
}, {
  x: new Date(Date.UTC(2016, 10, 16, 22, 0, 0)),
  low: 0.20,
  high: 0.32
}, {
  x: new Date(Date.UTC(2016, 10, 16, 23, 0, 0)),
  low: 0.22,
  high: 0.34
}];

export {totalData, farmData}