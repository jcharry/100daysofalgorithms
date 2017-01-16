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
function orientation(p, q, r, counter) {
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


    let action = {
        type: 'orient',
        p, q, r,
        val: retVal,
        counter: counter
    };

    return action;
}

function doIntersect(p1, q1, p2, q2, counter) {
    // Find the four orientations needed for general and
    // special cases
    let o1 = orientation(p1, q1, p2, counter);
    let o2 = orientation(p1, q1, q2, counter);
    let o3 = orientation(p2, q2, p1, counter);
    let o4 = orientation(p2, q2, q1, counter);

    let action;

    switch (counter) {
        case 0:
            action = o1;
            break;
        case 1:
            action = o2;
            break;
        case 2:
            action = o3;
            break;
        case 3:
            action = o4;
            break;
    }

    action.p1 = p1;
    action.p2 = p2;
    action.q1 = q1;
    action.q2 = q2;
    actions.push(action);

    if (o1.val !== o2.val && o3.val !== o4.val) {
        return true;
    }

    // Special Cases
    // p1, q1 and p2 are colinear and p2 lies on segment p1q1
    if (o1.val == 0 && onSegment(p1, p2, q1)) return true;

    // p1, q1 and p2 are colinear and q2 lies on segment p1q1
    if (o2.val == 0 && onSegment(p1, q2, q1)) return true;

    // p2, q2 and p1 are colinear and p1 lies on segment p2q2
    if (o3.val == 0 && onSegment(p2, p1, q2)) return true;

    // p2, q2 and q1 are colinear and q1 lies on segment p2q2
    if (o4.val == 0 && onSegment(p2, q1, q2)) return true;

    return false; // Doesn't fall in any of the above cases
}

let points = g.selectAll('.point');
window.points = points;
let segments = [];
window.segments = segments;
let colors = ['magenta', 'cyan', 'yellow', 'green'];
function update(action, counter) {
    let frame = g.append('g')
        .attr('transform', `translate(0, ${counter * (height / 4)})`);
    let border = frame.append('rect')
        .classed('border', true)
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height / 4);


    // Draw points and starter lines
    let points = frame.selectAll(`point-${counter}`)
        .data([action.p1, action.p2, action.q1, action.q2])
        .enter().append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 0)
    .transition()
        .duration(300)
        .ease(d3.easeElastic)
        .attr('r', 4);


    drawLines(action.p1, action.q1, action.p2, action.q2, 'rgba(255, 255, 255, 0.5', frame, 300);


    let t = d3.transition()
        .duration(interval);

    // let p = frame.selectAll(`.point-${counter}`)
    //     .data(segments);

    // Handle 4 different action cases
    switch (action.type) {
        case 'orient':
            // Highlight three points
            // p.transition(t)
            //     .style('fill', d => {
            //         if (d.idx === action.p.idx) {
            //             return 'green';
            //         } else if (d.idx === action.q.idx) {
            //             return 'blue';
            //         } else if (d.idx === action.r.idx) {
            //             return 'magenta';
            //         }
            //         return 'rgba(255, 255, 255, 0.5)';
            //     });

            // Append two lines
            drawLines(action.p, action.q, action.q, action.r, colors[counter], frame);

            // Draw arrows
            break;
        case 'search':
            break;
        default:
            break;
    }
}

let interval = 3000;
function startLoop() {
    let i = 0;
    let loop = setInterval(() => {
        console.log('iteration number', i, 'num actions', actions.length);
        if (actions[i]) {
            update(actions[i], i);
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

function drawLine(p1, p2, color, parent, dur) {
    let t = d3.transition()
        .duration(dur);
    color = color || 'rgba(255, 255, 255, 0.5)';
    parent.append('line')
        .classed('segment', true)
        .style('stroke', color)
        .attr('x1', p1.x)
        .attr('x2', p1.x)
        .attr('y1', p1.y)
        .attr('y2', p1.y)
        .transition(t)
        .attr('y2', p2.y)
        .attr('x2', p2.x);
}

function drawLines(p1, q1, p2, q2, color, parent, dur) {
    dur = dur === undefined ? interval : dur;
    drawLine(p1, q1, color, parent, dur);
    drawLine(p2, q2, color, parent, dur);
}

function drawPoints(p1, q1, p2, q2) {
    segments = [p1, q1, p2, q2];
    segments.forEach((seg, i) => {
        seg.idx = i;
    });

    let points = g.selectAll('.point')
        .data(segments);

    points.enter().append('circle')
        .classed('point', true)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 0)
        .transition()
        .duration(interval)
        .attr('r', 5);
}

function main() {
    // P = getSomeRandomPoints(numPoints, 0, 0, width, height);
    // let segments = makePoints();
    let p1, q1, p2, q2;
    for (let i = 0; i < 4; i++) {
        if (i < 2) {
            p1 = new Point(30, 20);
            q1 = new Point(600, 100);
            p2 = new Point(450, 50);
            q2 = new Point(100, 60);
        } else {
            p1 = new Point(30, 20);
            q1 = new Point(600, 40);
            p2 = new Point(450, 90);
            q2 = new Point(100, 50);
        }

        doIntersect(p1, q1, p2, q2, i);
    }

    // drawPoints(p1, q1, p2, q2);
    // console.log(doIntersect(p1, q1, p2, q2));
    // drawLines(p1, q1, p2, q2);
    startLoop();
}

main();
