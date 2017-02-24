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
console.log(terrain.map);

let mapW = Math.sqrt(terrain.map.length)
let cellStep = 200 / terrain.size;
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



// PERLIN
function Grad(x, y, z) {
    this.x = x; this.y = y; this.z = z;
}

Grad.prototype.dot2 = function(x, y) {
    return this.x*x + this.y*y;
};
Grad.prototype.dot3 = function(x, y, z) {
    return this.x*x + this.y*y + this.z*z;
};

var grad3 = [new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),
    new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),
    new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)];

var p = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
// To remove the need for index wrapping, double the permutation table length
var perm = new Array(512);
var gradP = new Array(512);

// This isn't a very good seeding function, but it works ok. It supports 2^16
// different seed values. Write something better if you need more seeds.
function seed(seed) {
    if(seed > 0 && seed < 1) {
        // Scale the seed out
        seed *= 65536;
    }

    seed = Math.floor(seed);
    if(seed < 256) {
        seed |= seed << 8;
    }

    for(var i = 0; i < 256; i++) {
        var v;
        if (i & 1) {
            v = p[i] ^ (seed & 255);
        } else {
            v = p[i] ^ ((seed>>8) & 255);
        }

        perm[i] = perm[i + 256] = v;
        gradP[i] = gradP[i + 256] = grad3[v % 12];
    }
};

seed(23);

function fade(t) {
    return t*t*t*(t*(t*6-15)+10);
}

function lerp(a, b, t) {
    return (1-t)*a + t*b;
}

// 2D Perlin Noise
function perlin2(x, y) {
    // Find unit grid cell containing point
    var X = Math.floor(x), Y = Math.floor(y);
    // Get relative xy coordinates of point within that cell
    x = x - X; y = y - Y;
    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    X = X & 255; Y = Y & 255;

    // Calculate noise contributions from each of the four corners
    var n00 = gradP[X+perm[Y]].dot2(x, y);
    var n01 = gradP[X+perm[Y+1]].dot2(x, y-1);
    var n10 = gradP[X+1+perm[Y]].dot2(x-1, y);
    var n11 = gradP[X+1+perm[Y+1]].dot2(x-1, y-1);

    // Compute the fade curve value for x
    var u = fade(x);

    // Interpolate the four results
    return lerp(
        lerp(n00, n10, u),
        lerp(n01, n11, u),
        fade(y));
};

let noiseMap = new Float32Array(terrain.size * terrain.size);
console.log(terrain.size);
for (let i = 0; i < terrain.size * terrain.size; i++) {
    let x = i % terrain.size; // * cellStep;
    let y = Math.floor(i / terrain.size); // * cellStep;
    // perlinMap[i] = perlin2(x, y);
    noiseMap[i] = simplex.noise2D(x, y) * 100;
}

min = Math.min.apply(null, noiseMap);
max = Math.max.apply(null, noiseMap);

let points = g.selectAll('.point').data(terrain.map, (d, i) => i);
points.enter().append('rect')
    .classed('point', true)
    .attr('width', cellStep)
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
            return d;
            // return map(d, min, max, 0, 200);
        }
    })
    .style('stroke', d => colorScale(d))
    .style('stroke-width', `${cellStep}px`);

setTimeout(() => {
    let points = g.selectAll('.point').data(noiseMap, (d, i) => i);
    points.transition().duration(1500)
        .attr('width', cellStep)
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
                return d;
                // return map(d, min, max, 0, 200);
            }
        })
        .style('stroke', d => colorScale(d))
        .style('stroke-width', `${cellStep}px`);
}, 3000)

