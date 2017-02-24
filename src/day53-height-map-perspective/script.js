import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');
import vector, {Vector} from 'vector-js';

let interval = 2000;
let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 800- margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + width / 4 + ',' + margin.top + ')');


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

let terrain = new Terrain(6);
terrain.generate(0.7);

let mapW = Math.sqrt(terrain.map.length)
let cellStep = 200 / terrain.size;
console.log(terrain.map);
let min = Math.min.apply(null, terrain.map);
let max = Math.max.apply(null, terrain.map);
console.log(max);
let colorScale = d3.scaleLinear()
    .domain([0, max])
    .range(['#c6dbef', '#a50f15']);

let points = g.selectAll('.point').data(terrain.map, (d, i) => i);
points.enter().append('rect')
    .classed('point', true)
    .attr('x', (d, i) => i % terrain.size * cellStep)
    .attr('y', (d, i) => Math.floor(i / terrain.size) * cellStep)
    .attr('width', cellStep)
    .attr('height', cellStep)
    .style('stroke', d => colorScale(d))
    .style('stroke-width', `${cellStep}px`);

let counter = 0;
setTimeout(() => {
    let t = d3.transition().duration(2000);
    // g.transition(t).attr('transform', `translate(${width / 2}, ${margin.top})`);
    g.selectAll('.point')
        .transition(t)
        .attr('x', (d, i) => {
            let x = i % terrain.size * cellStep;
            let y = Math.floor(i / terrain.size) * cellStep;
            // let screenX = (x - y) * (cellStep / 2);
            // let screenY = (x + y) * (cellStep / 2);
            return iso(x, y).x;
        })
        .attr('y', (d, i) => {
            let x = i % terrain.size * cellStep;
            let y = Math.floor(i / terrain.size) * cellStep;
            return iso(x, y).y;
        })
        // .attr('width', (d, i) => {
        //     let x = i % terrain.size * cellStep;
        //     let y = Math.floor(i / terrain.size) * cellStep;
        //     return iso(x, y).y;
        // })
        // .attr('y2', (d, i) => {
        //     let x = i % terrain.size * cellStep;
        //     let y = Math.floor(i / terrain.size) * cellStep;
        //     return iso(x, y).y - cellStep;
        // })
        // .attr('transform', (d, i) => {
        //     let x = i % mapW * cellStep;
        //     let y = Math.floor(i / mapW) * cellStep;
        //     let screenCoords = iso(x, y);
        //     return `rotate(45 ${screenCoords.x} ${screenCoords.y})`;
        // });

    // setTimeout(() => {
    //     g.selectAll('.point')
    //     .transition(t)
    //     .attr('y2', (d, i) => {
    //         // Math.floor(i / mapW) * cellStep)
    //         let x = i % mapW;
    //         let y = Math.floor(i / mapW);
    //         return (x + y) * (cellStep / 2) - d //cellStep - d;
    //     })
    // }, 3000);
}, 3000);

function map(x, in_min, in_max, out_min, out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

// Project
setTimeout(() => {
    let t = d3.transition().duration(2000);
    g.transition(t).attr('transform', `translate(${width / 2}, ${margin.top})`);
    g.selectAll('.point')
        .transition(t)
        .attr('x', (d, i) => {
            let x = i % terrain.size * cellStep;
            let y = Math.floor(i / terrain.size) * cellStep;
            // let screenX = (x - y) * (cellStep / 2);
            // let screenY = (x + y) * (cellStep / 2);
            return project(x, y, 0).x;
        })
        .attr('y', (d, i) => {
            let x = i % terrain.size * cellStep;
            let y = Math.floor(i / terrain.size) * cellStep;
            return project(x, y, d < 0 ? 5 : d).y;
        })
        .attr('height', (d, i) => {
            if (d < 0) {
                return 5;
            } else {
                // return d;
                return map(d, min, max, 5, 200);
            }
        })
        // .attr('transform', (d, i) => {
        //     let x = i % mapW * cellStep;
        //     let y = Math.floor(i / mapW) * cellStep;
        //     return `rotate(45 ${screenCoords.x} ${screenCoords.y})`;
        // });

    // setTimeout(() => {
    //     g.selectAll('.point')
    //     .transition(t)
    //     .attr('y2', (d, i) => {
    //         // Math.floor(i / mapW) * cellStep)
    //         let x = i % mapW;
    //         let y = Math.floor(i / mapW);
    //         return (x + y) * (cellStep / 2) - d //cellStep - d;
    //     })
    // }, 3000);
}, 6000);
//
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
//
//
//
//
// const update = function(action) {
//     // console.log(action);
//     // Data join
//     let points = g.selectAll('.point').data(action.map, (d, i) => i);
//
//     // Enter
//     // points.enter().append('circle')
//     //     .classed('point', true)
//     //     .attr('cx', (d, i) => (i % mapW) * cellStep)
//     //     .attr('cy', (d, i) => Math.floor(i / mapW) * cellStep)
//     //     .attr('r', 10)
//     //     .style('opacity', d => d === 1 ? 1 : 1);
//     // screen.x = (map.x - map.y) * TILE_WIDTH_HALF;
//     // screen.y = (map.x + map.y) * TILE_HEIGHT_HALF;
//
//     let t = d3.transition().duration(interval);
//     switch (action.type) {
//         case 'square':
//             points.transition(t)
//                 .style('opacity', d => d === 0 ? 0 : 0.5)
//                 .style('fill', (d, i) => {
//                     let x = i % mapW,
//                         y = Math.floor(i / mapW);
//                     if (x === action.x && y === action.y) {
//                         return 'green';
//                     } else if (x === action.ul[0] && y === action.ul[1] ||
//                         x === action.ur[0] && y === action.ur[1] ||
//                         x === action.lr[0] && y === action.lr[1] ||
//                         x === action.ll[0] && y === action.ll[1]) {
//                         return 'green';
//                     } else {
//                         return colorScale(d);
//                     }
//                 });
//             break;
//         case 'diamond':
//             points.transition(t)
//                 .style('opacity', d => d === 0 ? 0 : 0.5)
//                 .style('fill', (d, i) => {
//                     let x = i % mapW,
//                         y = Math.floor(i / mapW);
//                     if (x === action.x && y === action.y) {
//                         return 'green';
//                     } else if (x === action.l[0] && y === action.l[1] ||
//                         x === action.r[0] && y === action.r[1] ||
//                         x === action.b[0] && y === action.b[1] ||
//                         x === action.t[0] && y === action.t[1]) {
//                         return 'green';
//                     } else {
//                         return colorScale(d);
//                     }
//                 });
//             break;
//     }
// }
//
// let main = function() {
//     // setTimeout(() => {
//     //     d3.interval(() => {
//     //         if (actions[counter]) {
//     //             // update(actions[counter]);
//     //         }
//     //         counter++;
//     //     }, interval);
//     // }, 1000);
// };
//
// main();

// function Terrain(detail) {
//     this.size = Math.pow(2, detail) + 1;
//     this.max = this.size - 1;
//     this.map = new Float32Array(this.size * this.size);
// }
// Terrain.prototype.get = function(x, y) {
//     if (x < 0 || x > this.max || y < 0 || y > this.max) return -1;
//     return this.map[x + this.size * y];
// };
// Terrain.prototype.set = function(x, y, val) {
//     this.map[x + this.size * y] = val;
// };
// Terrain.prototype.generate = function(roughness) {
//     var self = this;
//     this.set(0, 0, self.max);
//     this.set(this.max, 0, self.max / 2);
//     this.set(this.max, this.max, 0);
//     this.set(0, this.max, self.max / 2);
//     divide(this.max);
//     function divide(size) {
//         var x, y, half = size / 2;
//         var scale = roughness * size;
//         if (half < 1) return;
//         for (y = half; y < self.max; y += size) {
//             for (x = half; x < self.max; x += size) {
//                 square(x, y, half, Math.random() * scale * 2 - scale);
//             }
//         }
//         for (y = 0; y <= self.max; y += half) {
//             for (x = (y + half) % size; x <= self.max; x += size) {
//                 diamond(x, y, half, Math.random() * scale * 2 - scale);
//             }
//         }
//         divide(size / 2);
//     }
//     function average(values) {
//         var valid = values.filter(function(val) { return val !== -1; });
//         var total = valid.reduce(function(sum, val) { return sum + val; }, 0);
//         return total / valid.length;
//     }
//     function square(x, y, size, offset) {
//         var ave = average([
//             self.get(x - size, y - size),   // upper left
//             self.get(x + size, y - size),   // upper right
//             self.get(x + size, y + size),   // lower right
//             self.get(x - size, y + size)    // lower left
//         ]);
//         self.set(x, y, ave + offset);
//     }
//     function diamond(x, y, size, offset) {
//         var ave = average([
//             self.get(x, y - size),      // top
//             self.get(x + size, y),      // right
//             self.get(x, y + size),      // bottom
//             self.get(x - size, y)       // left
//         ]);
//         self.set(x, y, ave + offset);
//     }
// };
// Terrain.prototype.draw = function(ctx, width, height) {
//     var self = this;
//     var waterVal = this.size * 0.3;
//     for (var y = 0; y < this.size; y++) {
//         for (var x = 0; x < this.size; x++) {
//             var val = this.get(x, y);
//             var top = project(x, y, val);
//             var bottom = project(x + 1, y, 0);
//             var water = project(x, y, waterVal);
//             var style = brightness(x, y, this.get(x + 1, y) - val);
//             rect(top, bottom, style);
//             rect(water, bottom, 'rgba(50, 150, 200, 0.15)');
//         }
//     }
//     function rect(a, b, style) {
//         if (b.y < a.y) return;
//         ctx.fillStyle = style;
//         ctx.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
//     }
//     function brightness(x, y, slope) {
//         if (y === self.max || x === self.max) return '#000';
//         var b = ~~(slope * 50) + 128;
//         return ['rgba(', b, ',', b, ',', b, ',1)'].join('');
//     }
//     function iso(x, y) {
//         return {
//             x: 0.5 * (self.size + x - y),
//             y: 0.5 * (x + y)
//         };
//     }
//     function project(flatX, flatY, flatZ) {
//         var point = iso(flatX, flatY);
//         var x0 = width * 0.5;
//         var y0 = height * 0.2;
//         var z = self.size * 0.5 - flatZ + point.y * 0.75;
//         var x = (point.x - self.size * 0.5) * 6;
//         var y = (self.size - point.y) * 0.005 + 1;
//         return {
//             x: x0 + x / y,
//             y: y0 + z / y
//         };
//     }
// };
// // var display = document.getElementById('display');
// let display = document.createElement('canvas');
// document.body.appendChild(display);
// var ctx = display.getContext('2d');
// var width = display.width = window.innerWidth;
// var height = display.height = window.innerHeight;
// var terrain = new Terrain(9);
// terrain.generate(0.7);
// terrain.draw(ctx, width, height);
