import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');
var SimplexNoise = require('simplex-noise'),
    simplex = new SimplexNoise(Math.random);
    // value2d = simplex.noise2D(x, y);

let interval = 2000;
let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 800- margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    // .attr('transform', 'translate(' + width / 4 + ',' + margin.top + ')');
window.g = g;


let actions = [];

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

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

let terrain = new Terrain(7);
terrain.generate(0.9);
console.log(terrain.map);

let mapW = Math.sqrt(terrain.map.length)
let cellStep = 300 / terrain.size;
console.log(terrain.map);
let min = Math.min.apply(null, terrain.map);
let max = Math.max.apply(null, terrain.map);
console.log(max);
let colorScale = d3.scaleLinear()
    .domain([0, max])
    .range(['#c6dbef', '#a50f15']);

// let points = g.selectAll('.point').data(terrain.map, (d, i) => i);
// points.enter().append('rect')
//     .classed('point', true)
//     .attr('width', cellStep)
//     .attr('x', (d, i) => {
//         let x = i % terrain.size * cellStep;
//         let y = Math.floor(i / terrain.size) * cellStep;
//         // let screenX = (x - y) * (cellStep / 2);
//         // let screenY = (x + y) * (cellStep / 2);
//         return project(x, y, 0).x;
//     })
//     .attr('y', (d, i) => {
//         let x = i % terrain.size * cellStep;
//         let y = Math.floor(i / terrain.size) * cellStep;
//         return project(x, y, d < 0 ? 5 : d).y;
//     })
//     .attr('height', (d, i) => {
//         if (d < 0) {
//             return 5;
//         } else {
//             // return d;
//             return map(d, min, max, 5, 200);
//         }
//     })
//     .style('stroke', d => colorScale(d))
//     .style('stroke-width', `${cellStep}px`);

function map(x, in_min, in_max, out_min, out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function iso(x, y) {
    // let x = i % mapW;
    // let y = Math.floor(i / mapW);
    // let screenX = (x - y) * (cellStep / 2);
    // let screenY = (x + y) * (cellStep / 2);
    return {
        x: 0.5 * (x - y),
        y: 0.5 * (x + y)
    }
}

function project(flatX, flatY, flatZ) {
    var point = iso(flatX, flatY);
    var x0 = width * 0.5;
    var y0 = height * 0.2;
    var z = terrain.size * 0.5 - flatZ + point.y * 0.75;
    var x = (point.x - terrain.size * 0.5) * 6;
    var y = (terrain.size - point.y) * 0.005 + 1;
    return {
        x: x0 + x / y,
        y: y0 + z / y
    };
}

let points = g.selectAll('.point').data(terrain.map, (d, i) => i);
points.enter().append('rect')
    .classed('point', true)
    .attr('width', cellStep)
    .attr('x', (d, i) => {
        let x = i % terrain.size * cellStep;
        let y = Math.floor(i / terrain.size) * cellStep;
        return project(x, y, 0).x;
    })
    .attr('y', (d, i) => {
        let x = i % terrain.size * cellStep;
        let y = Math.floor(i / terrain.size) * cellStep;
        return project(x, y, d < 0 ? 5 : d).y;
    })
    .attr('height', (d, i) => {
        return 0.1;
        if (d < 0) {
            return 5;
        } else {
            return d;
            // return map(d, min, max, 0, 200);
        }
    })
    .style('stroke', d => colorScale(d))
    .style('stroke-width', `${cellStep}px`);

let flying = -50;
let xDir = 1;
let xOff = 0;
setInterval(() => {
    flying += 1;
    xOff += 1 * xDir;
    if (xOff > 40 || xOff < -40) {
        xDir *= -1;
    }
    // console.log(flying);
    g.attr('transform', `translate(${width / 2 + xOff}, ${flying})`);
    // let points = g.selectAll('.point')
    // points.transition().duration(1500)
    //     .attr('width', cellStep)
    //     .attr('x', (d, i) => {
    //         let x = i % terrain.size * cellStep;
    //         let y = Math.floor(i / terrain.size) * cellStep;
    //         // let screenX = (x - y) * (cellStep / 2);
    //         // let screenY = (x + y) * (cellStep / 2);
    //         return project(x, y, 0).x;
    //     })
    //     .attr('y', (d, i) => {
    //         let x = i % terrain.size * cellStep;
    //         let y = Math.floor(i / terrain.size) * cellStep;
    //         return project(x, y, d < 0 ? 5 : d).y;
    //     })
    //     .attr('height', (d, i) => {
    //         if (d < 0) {
    //             return 5;
    //         } else {
    //             return d;
    //             // return map(d, min, max, 0, 200);
    //         }
    //     })
    //     .style('stroke', d => colorScale(d))
    //     .style('stroke-width', `${cellStep}px`);
}, 16)

