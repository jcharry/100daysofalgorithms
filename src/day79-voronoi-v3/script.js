import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');
let Voronoi = require('./rhill-voronoi-core.js');
let voronoi = new Voronoi();

function convexHull(points) {
    points.sort(function (a, b) {
        return a.x != b.x ? a.x - b.x : a.y - b.y;
    });

    var n = points.length;
    var hull = [];

    for (var i = 0; i < 2 * n; i++) {
        var j = i < n ? i : 2 * n - 1 - i;
        while (hull.length >= 2 && removeMiddle(hull[hull.length - 2], hull[hull.length - 1], points[j]))
            hull.pop();
        hull.push(points[j]);
    }

    hull.pop();
    return hull;
}

function removeMiddle(a, b, c) {
    var cross = (a.x - b.x) * (c.y - b.y) - (a.y - b.y) * (c.x - b.x);
    var dot = (a.x - b.x) * (c.x - b.x) + (a.y - b.y) * (c.y - b.y);
    return cross < 0 || cross == 0 && dot <= 0;
}


var PoissonDiscSampling = function(minDist, maxDist) {
    // How many points we try before rejecting a point
    var k = 30;

    var minDist2 = minDist * minDist;

    var x, y, i, j, p, d;
    // Final array of points that we'll return
    var points = [];

    // Points that we use to find neighbours
    var activePoints = [];

    // Start at a random point
    x = (0.2 + Math.random() * 0.6) * width;
    y = (0.2 + Math.random() * 0.6) * height;
    points.push({x, y, dist: 0});
    activePoints.push({x, y, dist:0});

    var activeIndex, currentPoint, pointAdded, angle, collision;

    while (activePoints.length) {
        // Pick a random active point
        activeIndex = Math.floor(Math.random() * activePoints.length);
        currentPoint = activePoints[activeIndex];
        pointAdded = false;

        for (i = 0; i < k; i++) {
            angle = Math.random() * 360;
            d = Math.random() * (maxDist - minDist) + minDist;
            x = currentPoint.x + Math.cos(angle) * d;
            y = currentPoint.y + Math.sin(angle) * d;

            // Exclude points that are beyond the bounds of the canvas
            if (x < 0 || x > width || y < 0 || y > height) {
                continue;
            }

            // Check distance from each other point is > minDist
            collision = false;
            for (j = points.length; j--;) {
                p = points[j];
                if ((x - p.x) * (x - p.x) + (y - p.y) * (y - p.y) < minDist2) {
                    collision = true;
                    break;
                }
            }

            if (!collision) {
                points.push({x, y, dist: d});
                activePoints.push({x, y, dist: d});
                pointAdded = true;
                break;
            }
        }

        // Failed to add point so remove it from the active list
        if (!pointAdded) {
            activePoints.splice(activeIndex, 1);
        }
    }

    return points;
};


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
// et points = [];
let points = PoissonDiscSampling(30, 60);
console.log(points);
let r = 200;
// while (points.length < numPoints - 1) {
//     // let x = standard();
//     // let y = standard();
//     let x = rndInt(0, width);
//     let y = rndInt(0, height);
//     points.push(point(x, y));
// }

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

for (let i = 1; i < points.length; i++) {
    let ps = clone(points);
    let slice = points.slice(0, i);


    // for (let j = 0; j < ps.length; j++) {
    //     ps[j].x += Math.random() * 5 - 2.5;
    //     ps[j].y += Math.random() * 5 - 2.5;
    // }
    // points = ps;

    // while (ps.length < numPoints - 1) {
    //     let x = standard();
    //     let y = standard();
    //     points.push(point(x, y));
    // }

    let diagram = voronoi.compute(slice, {
        xl: 0,
        xr: width,
        yt: 0,
        yb: height
    });

    actions.push({type: 'insert', diagram, points: ps});
}

let colorScale = d3.scaleLinear()
    .domain([0, points.length / 2, points.length])
    .range(['#762a83', '#f7f7f7', '#1b7837']);
let pointColorScale = d3.scaleLinear()
    .domain([0, numPoints])
    .range(['#f768a1', '#7a0177']);

function distance(x1, y1, x2, y2) {
    return Math.sqrt( (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) );
}
function update(counter) {
    let t = d3.transition().duration(interval);
    let action = actions[counter];
    console.log(action);
    let lineGenerator = d3.line()
        .x(d => {
            return d.va.x
        })
        .y(d => d.va.y);

    let cellGenerator = d3.line()
        .x(d => d.x)
        .y(d => d.y);

    let edgedata = g.selectAll('.node').data(action.diagram.edges, (d, i) => {
        return `edge-${i}`;
    });

    let cellsdata = g.selectAll('.cell').data(action.diagram.cells, (d, i) => `cell-${i}`);

    cellsdata.enter().append('path').datum(d => d.halfedges)
        .attr('class', 'cell')
        .attr('d', d => {
            // pull out all vertices
            let edges = d.reduce((acc, curr, index, arr) => {
                acc.push(curr.edge.va);
                acc.push(curr.edge.vb);
                return acc;
            }, []);
            edges = convexHull(edges);
            // if (d.length > 0) {
            //     edges.push({x: d[0].edge.va.x, y: d[0].edge.va.y});
            // }
            // edges.push({x: d[0].va.x, y: d[0].va.y});
            return cellGenerator(edges);
        })
        .style('stroke', (d, i) => colorScale(i))
        .style('fill', (d, i) => colorScale(i))

    // cellsdata.exit().remove();

    cellsdata.datum(d => d.halfedges)
        .attr('d', d => {
            // pull out all vertices
            let edges = d.reduce((acc, curr, index, arr) => {
                acc.push(curr.edge.va);
                acc.push(curr.edge.vb);
                return acc;
            }, []);
            edges = convexHull(edges);
            return cellGenerator(edges);
        })
        // .style('fill', 'transparent')
        .style('fill', (d, i) => colorScale(i))
        .style('stroke', (d, i) => colorScale(i))

    // edgedata.enter().append('line')
    //     .attr('class', 'node')
    //     .attr('x1', d => d.va.x)
    //     .attr('y1', d => d.va.y)
    //     .attr('x2', d => d.vb.x)
    //     .attr('y2', d => d.vb.y)
    //     .style('stroke', d => colorScale(distance(d.va.x, d.va.y, d.vb.x, d.vb.y)));
    //
    // edgedata
    //     .attr('x1', d => d.va.x)
    //     .attr('y1', d => d.va.y)
    //     .attr('x2', d => d.vb.x)
    //     .attr('y2', d => d.vb.y)
    //     .style('stroke', d => colorScale(distance(d.va.x, d.va.y, d.vb.x, d.vb.y)));

    // let pointsData = g.selectAll('.point').data(action.diagram.cells, (d, i) => `point-${i}`);
    // pointsData.enter().append('circle')
    //     .attr('class', 'point')
    //     .attr('cx', d => d.site.x)
    //     .attr('cy', d => d.site.y)
    //     .attr('r', 2)
    //     .style('fill', (d, i) => pointColorScale(i))
    //     .style('stroke', 'transparent');
    // // pointsData.exit().remove();
    // pointsData
    //     .attr('cx', d => d.site.x)
    //     .attr('cy', d => d.site.y)
    //     .attr('r', 2)
    //     .style('fill', (d, i) => pointColorScale(i))
    //     .style('stroke', 'transparent');
}

let interval = 150;
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

