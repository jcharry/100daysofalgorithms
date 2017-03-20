import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');
let Voronoi = require('./rhill-voronoi-core.js');
let voronoi = new Voronoi();

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

let numPoints = 150;
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

for (let i = 1; i < points.length; i++) {
    let slice = points.slice(0, i);
    let diagram = voronoi.compute(slice, {
        xl: 0,
        xr: width,
        yt: 0,
        yb: height
    });

    actions.push({type: 'insert', diagram, points: slice});
}

//
// let min = Infinity;
// let max = -Infinity;
// actions[actions.length - 1].nodes.forEach(node => {
//     if (node._bounds.width < min) min = node._bounds.width;
//     if (node._bounds.width > max) max = node._bounds.width;
// });
// console.log(min, max);
//
let colorScale = d3.scaleLinear()
    .domain([0, 800])
    .range(['#fc8d59', '#99d594']);
let pointColorScale = d3.scaleLinear()
    .domain([0, numPoints])
    .range(['#f768a1', '#7a0177']);
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

let edgePath = g.append('path').attr('id', 'edges');
function distance(x1, y1, x2, y2) {
    return Math.sqrt( (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) );
}
function update(counter) {
    let t = d3.transition().duration(interval);
    let action = actions[counter];
    //
    let lineGenerator = d3.line()
        .x(d => {
            return d.va.x
        })
        .y(d => d.va.y);


    let cellsdata = g.selectAll('.node').data(action.diagram.edges, (d, i) => {
        return `edge-${i}`;
    });

    cellsdata.enter().append('line')
        .attr('class', 'node')
        .attr('x1', d => d.va.x)
        .attr('y1', d => d.va.y)
        .attr('x2', d => d.vb.x)
        .attr('y2', d => d.vb.y)
        .style('stroke', d => colorScale(distance(d.va.x, d.va.y, d.vb.x, d.vb.y)));

    cellsdata
        .attr('x1', d => d.va.x)
        .attr('y1', d => d.va.y)
        .attr('x2', d => d.vb.x)
        .attr('y2', d => d.vb.y)
        .style('stroke', d => colorScale(distance(d.va.x, d.va.y, d.vb.x, d.vb.y)));
    // .transition(t)
    //     .attr('x2', d => d.vb.x)
    //     .attr('y2', d => d.vb.y)
    // let cellsdata = g.selectAll('.node').data(action.diagram.cells, (d, i) => {
    //     return `${d.site.x}-${d.site.y}`;
    // });

    // edgePath.transition(t).attr('d', lineGenerator(action.diagram.edges))
    //     .style('fill', 'transparent')
    //     .style('stroke', 'red');

    // cellsdata.enter().append('path')
    //     .attr('class', 'node')
    //     .attr('d', d => {debugger; lineGenerator(d)})
    //     .attr('stroke', d => colorScale(d.site.x))
    //     .attr('fill', 'transparent');
    //
    // cellsdata.exit().remove();
    //
    // cellsdata.transition(t)
    //     .attr('d', d => lineGenerator(d.halfedges))

    console.log(action);
    let pointsData = g.selectAll('.point').data(action.diagram.cells, (d, i) => `point-${i}`);
    pointsData.enter().append('circle')
        .attr('cx', d => d.site.x)
        .attr('cy', d => d.site.y)
        .attr('r', 2)
        .style('fill', (d, i) => pointColorScale(i))
        .style('stroke', 'transparent');
    // pointsData.transition(t)
    //     .attr('cx', d => d.x)
    //     .attr('cy', d => d.y)
    //     .attr('r', 2);


    // nodesData.enter().append('rect')
    //     .attr('class', 'node')
    //     .attr('x', d => d[0][0])
    //     .attr('y', d => d[1][0])
    //     .attr('width', d => d[0][1] - d[0][0])
    //     .attr('height', d => d[1][1] - d[1][0])
    //     .style('fill', 'transparent')
    //     .style('stroke', d => {
    //         // get area
    //         let width = d[0][1] - d[0][0];
    //         let height = d[1][1] - d[1][0];
    //         let area = width * height;
    //         return colorScale(area);
    //     });
    //
    // nodesData.exit().remove();
    //
    // nodesData
    //     .attr('x', d => d[0][0])
    //     .attr('y', d => d[1][0])
    //     .attr('width', d => d[0][1] - d[0][0])
    //     .attr('height', d => d[1][1] - d[1][0])
    //     .style('fill', 'transparent')
    //     .style('stroke', d => {
    //         // get area
    //         let width = d[0][1] - d[0][0];
    //         let height = d[1][1] - d[1][0];
    //         let area = width * height;
    //         return colorScale(area);
    //     });
    //
    // pointsData.enter().append('circle')
    //     .attr('cx', d => d.x)
    //     .attr('cy', d => d.y)
    //     .attr('r', 2);
}

let interval = 250;
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

