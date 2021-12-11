var queSquares = [
  [1, 1],
  [1, 5],
  [1, 7],
  [1, 9],
  [1, 15],
  [1, 17],
  [1, 19],
  [1, 25],
  [3, 3],
  [3, 5],
  [3, 11],
  [3, 13],
  [3, 19],
  [3, 23],
  [5, 3],
  [5, 5],
  [5, 21],
  [7, 1],
  [7, 7],
  [7, 9],
  [7, 13],
  [7, 17],
  [7, 19],
  [7, 21],
  [7, 23],
  [7, 25],
  [9, 1],
  [9, 7],
  [9, 9],
  [9, 11],
  [9, 13],
  [9, 19],
  [9, 21],
  [11, 3],
  [11, 5],
  [11, 7],
  [11, 9],
  [11, 11],
  [11, 13],
  [11, 19],
  [11, 21],
  [11, 25],
  [13, 1],
  [13, 3],
  [13, 7],
  [13, 15],
  [13, 17],
  [15, 1],
  [15, 5],
  [15, 17],
  [15, 19],
  [17, 1],
  [17, 3],
  [17, 5],
  [17, 7],
  [17, 9],
  [17, 11],
  [17, 13],
  [17, 15],
  [17, 17],
  [17, 19],
  [17, 21],
  [17, 23],
  [17, 25],
  [19, 3],
  [19, 5],
  [19, 9],
  [19, 17],
  [19, 21],
  [19, 23],
  [19, 25],
  [21, 3],
  [21, 5],
  [21, 7],
  [21, 9],
  [21, 11],
  [21, 21],
  [21, 23],
  [21, 25],
  [22, 1],
  [22, 3],
  [23, 3],
  [23, 11],
  [23, 13],
  [23, 15],
  [23, 17],
  [23, 19],
  [25, 1],
  [25, 11],
  [25, 13],
  [25, 15],
  [25, 17],
  [25, 19],
  [25, 23],
  [25, 25],
  [5, 9],
  [5, 15],
  [5, 19],
  [5, 25],
  [7, 3],
  [9, 3],
  [9, 15],
  [9, 23],
  [13, 5],
  [13, 13],
  [13, 19],
  [13, 23],
  [15, 7],
  [19, 19],
  [23, 21],
  [23, 25],
  [25, 9],
];

var queMap = new Map();

queSquares.forEach((e, i) => {
  var key = String(e[0]) + "-" + String(e[1]);
  queMap.set(key, String(i + 1));
});

export { queMap };
