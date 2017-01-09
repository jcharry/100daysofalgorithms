import * as d3 from 'd3';
require('./styles.scss');

// Setup SVG
let actions = [];
window.actions = actions;
let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

svg.append('svg:defs').append('svg:marker')
    .attr('id', 'triangle')
    .attr('refX', 6)
    .attr('refY', 6)
    .attr('markerWidth', 30)
    .attr('markerHeight', 30)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M 0 0 12 6 0 12 3 6')
    .style('fill', 'black');


let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
// the 'point' object
let Point = function(x, y) {
    this.x = x;
    this.y = y;
    Point.distance = function(a, b) {
        // euclidean distance between two points
        return Math.sqrt((a.x - b.x)*(a.x - b.x) + (a.y - b.y)*(a.y - b.y));
    };
};

// Given three colinear points p, q, r, the function checks if
// point q lies on line segment 'pr'
function onSegment(p, q, r) {
    if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
        q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
       return true;

    return false;
}

// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are colinear
// 1 --> Clockwise
// 2 --> Counterclockwise
function orientation(p, q, r) {
    // See http://www.geeksforgeeks.org/orientation-3-ordered-points/
    // for details of below formula.
    let val = (q.y - p.y) * (r.x - q.x) -
              (q.x - p.x) * (r.y - q.y);

    let retVal = 0;


    if (val == 0) {
        retVal = 0;  // colinear
    } else {
        retVal = (val > 0)? 1: 2; // clock or counterclock wise
    }

    actions.push({
        type: 'orient',
        p, q, r,
        val: retVal
    });

    return retVal;
}

function doIntersect(p1, q1, p2, q2) {
    // Find the four orientations needed for general and
    // special cases
    let o1 = orientation(p1, q1, p2);
    let o2 = orientation(p1, q1, q2);
    let o3 = orientation(p2, q2, p1);
    let o4 = orientation(p2, q2, q1);

    if (o1 !== o2 && o3 !== o4) {
        return true;
    }

    // Special Cases
    // p1, q1 and p2 are colinear and p2 lies on segment p1q1
    if (o1 == 0 && onSegment(p1, p2, q1)) return true;

    // p1, q1 and p2 are colinear and q2 lies on segment p1q1
    if (o2 == 0 && onSegment(p1, q2, q1)) return true;

    // p2, q2 and p1 are colinear and p1 lies on segment p2q2
    if (o3 == 0 && onSegment(p2, p1, q2)) return true;

     // p2, q2 and q1 are colinear and q1 lies on segment p2q2
    if (o4 == 0 && onSegment(p2, q1, q2)) return true;

    return false; // Doesn't fall in any of the above cases
}

let points = g.selectAll('.point');
window.points = points;
let segments = [];
window.segments = segments;
function update(action) {
    let t = d3.transition()
        .duration(interval);

    let p = d3.selectAll('.point')
        .data(segments);

    // Handle 4 different action cases
    switch (action.type) {
        case 'orient':
            // Highlight three points
            p.transition(t)
                .style('fill', d => {
                    if (d.idx === action.p.idx) {
                        return 'green';
                    } else if (d.idx === action.q.idx) {
                        return 'blue';
                    } else if (d.idx === action.r.idx) {
                        return 'magenta';
                    }
                    return 'rgba(0, 0, 0, 0.5)';
                });

            // Draw arrows
            break;
        case 'search':
            break;
        default:
            break;
    }
}

let interval = 1000;
function startLoop() {
    let i = 0;
    let loop = setInterval(() => {
        console.log('iteration number', i, 'num actions', actions.length);
        if (actions[i]) {
            update(actions[i]);
        }
        if (actions.length === i) {
            finish();
            window.clearInterval(loop);
        }
        i++;
    }, interval);
}

function finish() {
    console.log('done!');

    let t = d3.transition()
        .duration(2000);
}

let lines = [];
function drawArrow(p, q, r) {

}

function drawLine(p1, p2) {
    let t = d3.transition()
        .duration(interval);
    g.append('line')
        .classed('segment', true)
        .attr('x1', p1.x)
        .attr('x2', p1.x)
        .attr('y1', p1.y)
        .attr('y2', p1.y)
    .transition(t)
        .attr('y2', p2.y)
        .attr('x2', p2.x);
}

function drawLines(p1, q1, p2, q2) {
    drawLine(p1, q1);
    drawLine(p2, q2);
}

function makePoints(numPoints) {
    let ps = [];
    for (var i = 0; i < numPoints; i++) {
        let p = new Point(Math.random() * width, Math.random() * height);
        p.idx = i;
        ps.push(p);
    }
    return ps;
}

function main() {
    // P = getSomeRandomPoints(numPoints, 0, 0, width, height);
    // let segments = makePoints();
    let p1 = new Point(35, 80);
    let q1 = new Point(500, 200);
    let p2 = new Point(600, 0);
    let q2 = new Point(0, 600);
    segments = [ p1, q1, p2, q2 ];
    segments.forEach((seg, i) => {
        seg.idx = i;
    });

    points = g.selectAll('.point')
        .data(segments);
    console.log(points);

    points.enter().append('circle')
        .classed('point', true)
        .transition()
        .duration(interval)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 10);



    console.log(doIntersect(p1, q1, p2, q2));
    drawLines(p1, q1, p2, q2);
    startLoop();

    // Data join
    // points = g.selectAll('.point')
    //     .data(P, d => P.idx);
    //
    // points.enter()
    //     .append('circle')
    //     .classed('point', true)
    //     .attr('cx', d => d.x)
    //     .attr('cy', d => d.y)
    //     .attr('r', 10);
    //
    // hullPoints = convexHull(P, P.length);
    // lastLeftPoint = hullPoints[0].idx;

    // let hullLines = g.selectAll('.hull')
    //     .data(hull, d => d.idx);

    // let line = d3.line()
    //     .x(d => d.x)
    //     .y(d => d.y);

    // hullLines.enter()
    // g.append('path')
    //     .classed('hull', true)
    //     .datum(hull)
    //     .attr('d', line)
    //     .style('fill', 'transparent');

    // startLoop();
}

main();
