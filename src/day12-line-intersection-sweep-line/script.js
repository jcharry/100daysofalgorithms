import * as d3 from 'd3';
// import BSArray from './BSArray';
// import BBTree from './BBTree';
let AVLTree = require('binary-search-tree').AVLTree;
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

function doIntersect(l1, l2) {
    // Find the four orientations needed for general and
    // special cases
    let p1 = l1.p1;
    let q1 = l1.p2;
    let p2 = l2.p1;
    let q2 = l2.p2;
    let o1 = orientation(p1, q1, p2);
    let o2 = orientation(p1, q1, q2);
    let o3 = orientation(p2, q2, p1);
    let o4 = orientation(p2, q2, q1);

    let action;

    // switch (counter) {
    //     case 0:
    //         action = o1;
    //         break;
    //     case 1:
    //         action = o2;
    //         break;
    //     case 2:
    //         action = o3;
    //         break;
    //     case 3:
    //         action = o4;
    //         break;
    // }

    // action.p1 = p1;
    // action.p2 = p2;
    // action.q1 = q1;
    // action.q2 = q2;
    // actions.push(action);

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

function updateSweepline(x) {
    g.select('.sweepline')
        .transition().duration(interval)
        .attr('x1', x)
        .attr('x2', x);
}

function updateActiveList(list) {
    // let list
    console.log(segments);
    console.log(allPoints);
    // Data join
    let active = g.selectAll('.active')
        .data(list, d => d.lineId)

    active.exit().remove();

    active.enter().append('line')
        .classed('active', true)
        .attr('x1', d => d.p1.x)
        .attr('x2', d => d.p2.x)
        .attr('y1', d => d.p1.y)
        .attr('y2', d => d.p2.y)
        .transition().duration(interval)
            .ease(d3.easeElastic)
            .style('stroke-width', '5px');



}
function update(action, counter) {
    console.log('running action ' + counter);
    switch (action.type) {
        case 'sweepline-left':
        case 'sweepline-right':
            updateSweepline(action.x);
            break;
        case 'active-list':
            updateActiveList(action.activeList);
            break;
    }
}

let interval = 500;
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
    updateSweepline(width);
    updateActiveList([]);
    console.log('done!');
}

function drawLine(line, color, parent, dur) {
    parent = parent === undefined ? g : parent;
    dur = dur === undefined ? interval : dur;
    color === undefined ? 'magenta' : color;

    let t = d3.transition()
        .duration(dur);

    let clr = line.intersects ? 'green' : 'magenta';
    parent.append('line')
        .classed('segment', true)
        .style('stroke', clr)
        .attr('x1', line.p1.x)
        .attr('x2', line.p1.x)
        .attr('y1', line.p1.y)
        .attr('y2', line.p1.y)
        .transition(t)
        .attr('y2', line.p2.y)
        .attr('x2', line.p2.x);
}

function drawLines(lines) {
    lines.forEach(line => {
        drawLine(line);
    });
}

function drawPoints(points) {
    let ps = g.selectAll('.point')
        .data(points);

    ps.enter().append('circle')
        .classed('point', true)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 0)
        .transition()
        .duration(interval)
        .attr('r', 5);
}


// Hold all points
let allPoints = [];
let segments = [];
function makeSegments(numSegs) {
    for (let i = 0; i < numSegs; i++) {
        let s = {
            lineId: i,
            // p1: i === 0 ? new Point(0, 600) : new Point(10, 10),
            // p2: i === 0 ? new Point(600, 0) : new Point(590, 590)
            p1: new Point(Math.random() * width, Math.random() * height),
            p2: new Point(Math.random() * width, Math.random() * height)
        };
        // Keep referece to segment points in allPoints
        s.p1.lineId = i;
        s.p2.lineId = i;
        s.p1.line = s;
        s.p2.line = s;

        // Find the left most point and label them so we know which is left and
        // which is right
        if (s.p1.x < s.p2.x) {
            s.p1.pos = 'LEFT';
            s.p2.pos = 'RIGHT';
            s.left = s.p1;
        } else {
            s.p1.pos = 'RIGHT';
            s.p2.pos = 'LEFT';
            s.left = s.p2;
        }

        allPoints.push(s.p1);
        allPoints.push(s.p2);
        segments.push(s);
    }
    // return segs;
}

function sweepline() {
    // 2. Create an empty Self-Balancing BST T. It will contain all active line
    //    Segments ordered by y coordinate.
    let tree = new AVLTree({compareKeys: (a, b) => {
        if (a.y < b.y) { return -1; }
        if (a.y > b.y) { return 1; }

        return 0;
    }})


    // // Process all 2n points (n = number of lines)
    // 3. for i = 0 to 2n-1
    for (let i = 0; i < allPoints.length; i++) {
        let action = {};

        console.log('running ' + i + ' times');
        // If this point is left end of its line
        if (allPoints[i].pos === 'LEFT') {
            actions.push({
                type: 'sweepline-left',
                x: allPoints[i].x
            });

            // T.insert(Points[i].line())  // Insert into the tree
            let segIdx = allPoints[i].lineId;
            tree.insert({y: allPoints[i].line.left.y}, allPoints[i].line);

            // Check if this points intersects with its predecessor and successor
            // if (doIntersect(allPoints[i]))
            // Get all active segments into ordered array
            let activeList = tree.betweenBounds({ $lte: height, $gte: 0});
            actions.push({
                type: 'active-list',
                activeList
            });

            // Find this line in the active list
            let activeIdx;
            activeList.forEach((act, j) => {
                if (act === allPoints[i].line) {
                    activeIdx = j;
                }
            });
            let leftSeg = activeList[activeIdx - 1];
            let rightSeg = activeList[activeIdx + 1];
            if (leftSeg) {
                if (doIntersect(allPoints[i].line, leftSeg)) {
                    console.log('intersecting this line and prev line');
                    leftSeg.intersects = true;
                    allPoints[i].line.intersects = true;
                }
            }

            if (rightSeg) {
                if (doIntersect(allPoints[i].line, rightSeg)) {
                    rightSeg.intersects = true;
                    console.log('intersecting this line and next line');
                    allPoints[i].line.intersects = true;
                }
            }
        } else {
            actions.push({
                type: 'sweepline-right',
                x: allPoints[i].x
            });
        // If it's a right end of its line
           // Check if its predecessor and successor intersect with each other
            let activeList = tree.betweenBounds({ $lte: height, $gte: 0});

            // Find this line in the active list
            let activeIdx;
            activeList.forEach((act, j) => {
                if (act === allPoints[i].line) {
                    activeIdx = j;
                }
            });
            let leftSeg = activeList[activeIdx - 1];
            let rightSeg = activeList[activeIdx + 1];
            if (leftSeg && rightSeg) {
                if ( doIntersect(leftSeg, rightSeg)) {
                    console.log('intersecting!');
                    leftSeg.intersects = true;
                    rightSeg.intersects = true;
                }
            }
            // Delete from tree
            tree.delete({y: allPoints[i].line.left.y});
            activeList = tree.betweenBounds({ $lte: height, $gte: 0});
            actions.push({
                type: 'active-list',
                activeList
            });
        }
    }
}

function main() {
    // Make segments and sort points
    makeSegments(5);
    allPoints.sort((a, b) => {
        if (a.x < b.x) {
            return -1;
        }
        if (a.x > b.x) {
            return 1;
        }
        return 0;
    });

    setTimeout(() => {
        g.append('line').classed('sweepline', true)
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', 0)
            .attr('y2', height);

        // Draw initial lines and points
        drawPoints(allPoints);

        sweepline();
        console.log('segments', segments);
        drawLines(segments);

        setTimeout(startLoop, 1000);

    }, 1000);
    // startLoop();
}
main();
