import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');
import kdTree from './kdtree.js';

let margin = {top: 100, right: 100, bottom: 100, left: 100},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g').attr('class', 'svg-group')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let actions = [];
window.actions = actions;

function distance(a, b) {
    var dx = a.x-b.x;
    var dy = a.y-b.y;
    return dx*dx + dy*dy;
}

function rnd(min, max) {
    return Math.random() * (max - min) + min;
}
function rndInt(min, max) {
    return Math.floor(rnd(min, max));
}
// Create a bunch of random points
function point(x, y) {
    return { x, y };
}

// function search(nodes, node) {
//     // Recursively search through nodes
//     if (node.children.length > 0) {
//         nodes.push(node);
//         return nodes;
//     } else {
//         node.nodes.forEach(n => {
//             search(nodes, n);
//         });
//     }
//     return nodes;
// }

// returns a gaussian random function with the given mean and stdev.
function gaussian(mean, stdev) {
    var y2;
    var use_last = false;
    return function() {
        var y1;
        if(use_last) {
           y1 = y2;
           use_last = false;
        }
        else {
            var x1, x2, w;
            do {
                 x1 = 2.0 * Math.random() - 1.0;
                 x2 = 2.0 * Math.random() - 1.0;
                 w  = x1 * x1 + x2 * x2;
            } while( w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w))/w);
            y1 = x1 * w;
            y2 = x2 * w;
            use_last = true;
       }

       var retval = mean + stdev * y1;
       if(retval > 0)
           return retval;
       return -retval;
   }
}

// make a standard gaussian variable.
var standard = gaussian(width / 2, 100);

let numPoints = 300;
let points = [];
let r = 200;
while (points.length < numPoints - 1) {
    let x = standard();
    let y = standard();
    points.push(point(x, y));
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function search(objs, nodes, node, bounds) {
    // base case
    if (node === null) {
        return;
    }

    const leftBounds = [];
    leftBounds[0] = bounds[0].slice(0);
    leftBounds[1] = bounds[1].slice(0);

	const rightBounds = [];
	rightBounds[0] = bounds[0].slice(0);
	rightBounds[1] = bounds[1].slice(0);

    if (node.dimension == 0) {
        // split on the x
        leftBounds[0][1] = node.obj.x;
        rightBounds[0][0] = node.obj.x;
    } else {
        leftBounds[1][1] = node.obj.y;
        rightBounds[1][0] = node.obj.y;
    }

    nodes.push(bounds);
    objs.push(node.obj);

    // Get bounds from node
    search(objs, nodes, node.left, leftBounds);
    search(objs, nodes, node.right, rightBounds);

    return {nodes, objs};
}

for (let i = 1; i < points.length; i++) {
    let slice = points.slice(0, i);
    let kdtree = new kdTree.kdTree(points.slice(0, i), distance, ['x', 'y']);

    // Recursively search through kd tree for bounds
    // let nodes = [];
    // let objs = [];
    let {nodes, objs} = search([], [], kdtree.root, [[0, width], [0, height]]);
    actions.push({type: 'insert', kdtree, nodes, objs, points: slice});
}

//
let min = Infinity;
let max = -Infinity;
// actions[actions.length - 1].nodes.forEach(node => {
//     if (node._bounds.width < min) min = node._bounds.width;
//     if (node._bounds.width > max) max = node._bounds.width;
// });
// console.log(min, max);
//
let colorScale = d3.scaleLinear()
    .domain([0, 30000])
    .range(['#fc8d59', '#99d594']);
// let pointColorScale = d3.scaleLinear()
//     .domain([0, numPoints])
//     .range(['#f768a1', '#7a0177']);
//
// g.append('rect')
//     .attr('x', 0)
//     .attr('y', 0)
//     .attr('width', width)
//     .attr('height', height)
//     .style('fill', '#e9fff1');
// g.selectAll('.node').data(nodes).enter().append('rect')
//         .attr('x', d => d._bounds.x)
//         .attr('y', d => d._bounds.y)
//         .attr('width', d => d._bounds.width)
//         .attr('height', d => d._bounds.height)
//         .style('fill', d => colorScale(d._bounds.width))
//         // .each(function(d, i) {
//         //     this.style.fill = `rgba(0, ${rndInt(50, 180)}, 0, 1)`;
//         // })
//         .style('stroke', 'white');
//
// g.selectAll('.point').data(points).enter().append('circle')
//     .attr('cx', d => d.x)
//     .attr('cy', d => d.y)
//     .attr('r', 3)
//     .style('fill', (d, i) => pointColorScale(i));
// points.forEach(p => drawPoint(p));



// console.log(Quadtree);


// draw qtree
// function drawTree

function update(counter) {
    let action = actions[counter];

    let pointsData = g.selectAll('.point').data(action.objs, (d, i) => `point-${i}`);
    let nodesData = g.selectAll('.node').data(action.nodes, (d, i) => `node-${i}`);

    nodesData.enter().append('rect')
        .attr('class', 'node')
        .attr('x', d => d[0][0])
        .attr('y', d => d[1][0])
        .attr('width', d => d[0][1] - d[0][0])
        .attr('height', d => d[1][1] - d[1][0])
        .style('fill', 'transparent')
        .style('stroke', d => {
            // get area
            let width = d[0][1] - d[0][0];
            let height = d[1][1] - d[1][0];
            let area = width * height;
            return colorScale(area);
        });

    nodesData.exit().remove();

    nodesData
        .attr('x', d => d[0][0])
        .attr('y', d => d[1][0])
        .attr('width', d => d[0][1] - d[0][0])
        .attr('height', d => d[1][1] - d[1][0])
        .style('fill', 'transparent')
        .style('stroke', d => {
            // get area
            let width = d[0][1] - d[0][0];
            let height = d[1][1] - d[1][0];
            let area = width * height;
            return colorScale(area);
        });

    pointsData.enter().append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 2);
}

let interval = 80;
function main() {
    let counter = 0;
    setTimeout(() => {
        d3.interval(() => {
            if (actions[counter]) {
                update(counter);
                counter++;
            }
        }, interval);
    }, 1000);
}

main();

