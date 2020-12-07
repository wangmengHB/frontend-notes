
var a = [
  ['a1', 'a2', 'a3'],
  ['b1', 'b2'],
  ['c1', 'c2', 'c3'],
  ['d1', 'd2', 'd3'],
  ['e1', 'e2', 'e3'],
]


// TODO: 没有数组取一个有多少个组合

function getAllPossibleIdxs(input, output = [], level = 0, indexes = new Array(input.length)) {
  if (level < input.length) {
    for (let i = 0; i < input[level].length; i++) {
      indexes[level] = i;
      getAllPossibleIdxs(input, output, level + 1, indexes);
    }
  } else {
    output.push(indexes.slice());
  }
}



var output = [];
var level = 0;
var indexes = [];
getAllPossibleIdxs(a, output, level, indexes);

console.log(output);


