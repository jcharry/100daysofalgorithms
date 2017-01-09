import * as d3 from 'd3';
require('./styles.scss');

// Setup SVG
let numPoints = 10;
let actions = [];
window.actions = actions;
let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

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

// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are colinear
// 1 --> Clockwise
// 2 --> Counterclockwise
let orientation = function(p, q, r) {
    let val = (q.y - p.y) * (r.x - q.x) -
              (q.x - p.x) * (r.y - q.y);

    if (val === 0) return 0;  // colinear
    return (val > 0)? 1 : 2; // clock or counterclock wise
};

let convexHull = function(points, n) {
    // There must be at least 3 points
    if (n < 3) return;

    // Initialize Result
    let hull = [];
    // vector<Point> hull;

    // Find the leftmost point
    let l = 0;
    for (let i = 1; i < n; i++) {
        // Compare x values to find left most point
        if (points[i].x < points[l].x) {
            l = i;
        }
        actions.push({
            type: 'compare',
            i,
            l
        });
    }

    let firstLeftPoint = l;

    // Start from leftmost point, keep moving counterclockwise
    // until reach the start point again.  This loop runs O(h)
    // times where h is number of points in result or output.
    let p = l, q;
    do {
        // Add current point to result
        hull.push(points[p]);

        // Search for a point 'q' such that orientation(p, x,
        // q) is counterclockwise for all points 'x'. The idea
        // is to keep track of last visited most counterclock-
        // wise point in q. If any point 'i' is more counterclock-
        // wise than q, then update q.
        // Initialize q to the next point in the array
        q = (p + 1) % n;
        for (let i = 0; i < n; i++) {
            // Loop through all points, starting at the beginning
           // If i is more counterclockwise than current q, then
           // update q
            actions.push({
                type: 'search',
                leftPoint: p,
                currentHullPoint: q,
                currentTestPoint: i
            });
           if (orientation(points[p], points[i], points[q]) == 2)
                // If a point is found to be more on the hull than the
                // previously stored q value, set q to the be the index of the
                // newly found point
               q = i;
        }

        // Now q is the most counterclockwise with respect to p
        // Set p as q for next iteration, so that q is added to
        // result 'hull'
        p = q;
    } while (p != l);  // While we don't come to first point

    // Just add in the last point (which is really the first point)
    // maybe
    hull.push(points[firstLeftPoint]);

    // Print Result
    for (let i = 0; i < hull.length; i++)
        console.log(`${hull[i].x}, ${hull[i].y}`);
    return hull;
};

function getSomeRandomPoints(some, minX, minY, maxX, maxY) {
    let points = [];
    for (let i = 0; i < some; ++i) {
        let point = new Point(
            parseInt((Math.random() * 10000) % (maxX - minX) + minX),
            parseInt((Math.random() * 10000) % (maxX - minX) + minX)
        );
        point.idx = i;
        points.push(point);
    }

    return points;
}


let lastLeftPoint;
function update(action) {
    let t = d3.transition()
        .duration(interval);

    // Handle 4 different action cases
    switch (action.type) {
        case 'compare':
            d3.selectAll('.point')
                .transition(t)
                .style('fill', d => {
                    if (d.idx === action.l) {
                        return 'green';
                    }
                    if (d.idx === action.i) {
                        return 'red';
                    }
                    return 'rgba(0, 0, 0, 0.5)';
                });

            break;
        case 'search':
            // When a new point has begun searching, hide all the old search
            // lines
            if (lastLeftPoint !== action.leftPoint) {
                d3.selectAll('.search-line')
                    .classed('search-line', false)
                    .classed('search-line-small', true);
                lastLeftPoint = action.leftPoint;
            }


            // Draw lines from left point to search point
            g.append('line')
                .classed('search-line', true)
                .attr('x1', P[action.leftPoint].x)
                .attr('y1', P[action.leftPoint].y)
                .attr('x2', P[action.leftPoint].x)
                .attr('y2', P[action.leftPoint].y)
            .transition(t)
                .attr('x2', P[action.currentTestPoint].x)
                .attr('y2', P[action.currentTestPoint].y);

            d3.selectAll('.point')
                .transition(t)
                .style('fill', d => {
                    if (d.idx === action.currentTestPoint) {
                        return 'red';
                    }
                    if (d.idx === action.currentHullPoint) {
                        return 'blue';
                    }
                    if (d.idx === action.leftPoint) {
                        return 'green';
                    }
                    return 'rgba(0, 0, 0, 0.5)';
                });
            // Hide any visible areas
            break;
        default:
            break;
    }
}

let interval = 500;
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

    // make all hull points green and non hull points gray
    d3.selectAll('.point')
        .transition(t)
        .style('fill', d => {
            if (hullPoints.indexOf(d) > -1) {
                return 'green';
            }
            return 'rgba(0, 0, 0, 0.5)';
        })
        .attr('r', d => {
            if (hullPoints.indexOf(d) > -1) {
                return 12;
            }
            return 3;
        });

    // Hide all search lines
    d3.selectAll('.search-line')
        .classed('search-line', false)
        .classed('search-line-small', true);
    d3.selectAll('.search-line-small')
        .classed('search-line-hidden', true);

    let line = d3.line()
        .x(d => d.x)
        .y(d => d.y);

    g.append('path')
        .classed('hull', true)
        .datum(hullPoints)
        .attr('d', line)
        .style('opacity', 1e-6)
    .transition(t)
        .style('opacity', 1);
}

let P;
let points;
let hullPoints = [];
function main() {
    P = getSomeRandomPoints(numPoints, 0, 0, width, height);

    // Data join
    points = g.selectAll('.point')
        .data(P, d => P.idx);

    points.enter()
        .append('circle')
        .classed('point', true)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 10);

    hullPoints = convexHull(P, P.length);
    lastLeftPoint = hullPoints[0].idx;

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

    startLoop();
}

main();
