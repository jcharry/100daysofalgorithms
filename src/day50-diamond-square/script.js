import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');
import vector, {Vector} from 'vector-js';

let interval = 100;
let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


let actions = [];

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// let cellSize = 50;
// let gridSize = height / cellSize;
// if (gridSize % 2 !== 0) {
//     gridSize -= 1;
// }
// let numCols = height / cellSize;
// let numRows = height / cellSize;
// // Create grid
// let grid = [];
// for (let i = 0; i < numRows; i++) {
//     grid[i] = [];
//     for (let j = 0; j < numCols; j++) {
//         grid[i][j] = {
//             x: j * cellSize,
//             y: i * cellSize,
//             value: -1
//         };
//     }
//
// }

// Code taken from - http://www.playfuljs.com/realistic-terrain-in-130-lines/
function Terrain(detail) {
    this.size = Math.pow(2, detail) + 1;
    this.max = this.size - 1;
    this.map = new Float32Array(this.size * this.size);
}
Terrain.prototype.get = function(x, y) {
    if (x < 0 || x > this.max || y < 0 || y > this.max) return -1;
    return this.map[x + this.size * y];
};
Terrain.prototype.set = function(x, y, val) {
    this.map[x + this.size * y] = val;
};
Terrain.prototype.generate = function(roughness) {
    var self = this;
    this.set(0, 0, self.max);
    this.set(this.max, 0, self.max / 2);
    this.set(this.max, this.max, 0);
    this.set(0, this.max, self.max / 2);

    divide(this.max);
    function divide(size) {
        var x, y, half = size / 2;
        var scale = roughness * size;
        if (half < 1) return;
        for (y = half; y < self.max; y += size) {
            for (x = half; x < self.max; x += size) {
                square(x, y, half, Math.random() * scale * 2 - scale);
            }
        }
        for (y = 0; y <= self.max; y += half) {
            for (x = (y + half) % size; x <= self.max; x += size) {
                diamond(x, y, half, Math.random() * scale * 2 - scale);
            }
        }
        divide(size / 2);
    }
    function average(values) {
        var valid = values.filter(function(val) { return val !== -1; });
        var total = valid.reduce(function(sum, val) { return sum + val; }, 0);
        return total / valid.length;
    }
    function square(x, y, size, offset) {
        var ave = average([
            self.get(x - size, y - size),   // upper left
            self.get(x + size, y - size),   // upper right
            self.get(x + size, y + size),   // lower right
            self.get(x - size, y + size)    // lower left
        ]);
        let ul = [x - size, y - size];
        let ur = [x + size, y - size];
        let lr = [x + size, y + size];
        let ll = [x - size, y + size];
        actions.push({type: 'square', x, y, ul, ur, lr, ll, size, map: self.map.slice()});
        self.set(x, y, ave + offset);
    }
    function diamond(x, y, size, offset) {
        var ave = average([
            self.get(x, y - size),      // top
            self.get(x + size, y),      // right
            self.get(x, y + size),      // bottom
            self.get(x - size, y)       // left
        ]);

        let t = [x, y - size];
        let r = [x + size, y];
        let b = [x, y + size];
        let l = [x - size, y];

        actions.push({type: 'diamond', x, y, t, r, b, l, size, map: self.map.slice()});
        self.set(x, y, ave + offset);
    }
};

let terrain = new Terrain(5);
terrain.generate(0.7);

let mapW = Math.sqrt(terrain.map.length)
let cellStep = height / mapW;
console.log(terrain.map);
let min = 0;
let max = Math.max.apply(null, terrain.map);
console.log(max);
let colorScale = d3.scaleLinear()
    .domain([0, max])
    .range(['#c6dbef', '#a50f15']);

const update = function(action) {
    // console.log(action);
    // Data join
    let points = g.selectAll('.point').data(action.map, (d, i) => i);

    // Enter
    // points.enter().append('circle')
    //     .classed('point', true)
    //     .attr('cx', (d, i) => (i % mapW) * cellStep)
    //     .attr('cy', (d, i) => Math.floor(i / mapW) * cellStep)
    //     .attr('r', 10)
    //     .style('opacity', d => d === 1 ? 1 : 1);
    points.enter().append('rect')
        .classed('point', true)
        .attr('x', (d, i) => (i % mapW) * cellStep)
        .attr('y', (d, i) => Math.floor(i / mapW) * cellStep)
        .attr('width', cellStep)
        .attr('height', cellStep)
        .style('opacity', d => d === 1 ? 1 : 1);

    let t = d3.transition().duration(interval);
    switch (action.type) {
        case 'square':
            points.transition(t)
                .style('opacity', d => d === 0 ? 0 : 0.5)
                .style('fill', (d, i) => {
                    let x = i % mapW,
                        y = Math.floor(i / mapW);
                    if (x === action.x && y === action.y) {
                        return 'green';
                    } else if (x === action.ul[0] && y === action.ul[1] ||
                        x === action.ur[0] && y === action.ur[1] ||
                        x === action.lr[0] && y === action.lr[1] ||
                        x === action.ll[0] && y === action.ll[1]) {
                        return 'green';
                    } else {
                        return colorScale(d);
                    }
                });
            break;
        case 'diamond':
            points.transition(t)
                .style('opacity', d => d === 0 ? 0 : 0.5)
                .style('fill', (d, i) => {
                    let x = i % mapW,
                        y = Math.floor(i / mapW);
                    if (x === action.x && y === action.y) {
                        return 'green';
                    } else if (x === action.l[0] && y === action.l[1] ||
                        x === action.r[0] && y === action.r[1] ||
                        x === action.b[0] && y === action.b[1] ||
                        x === action.t[0] && y === action.t[1]) {
                        return 'green';
                    } else {
                        return colorScale(d);
                    }
                });
            break;
    }
}

let counter = 0;
let main = function() {
    setTimeout(() => {
        d3.interval(() => {
            if (actions[counter]) {
                update(actions[counter]);
            }
            counter++;
        }, interval);
    }, 1000);
};

main();
