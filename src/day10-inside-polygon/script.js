import * as d3 from 'd3';
import ray from './Ray';
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

function testPoint(hull, cb) {
    // CLear out all old stuff....
    // d3.selectAll('.test-point').remove();
    // d3.selectAll('.point-intersect').remove();
    // d3.selectAll('.line-intersect').remove();

    // Pick a random point
    let p = new Point(Math.random() * width, Math.random() * height);
    let r = ray(p.x, p.y, 0);
    let ips = [];
    for (let i = 0; i < hull.length; i++) {
        let p1, p2;
        p1 = hull[i];
        p2 = i === hull.length - 1 ? hull[0] : hull[i + 1];
        let seg = [p1, p2];

        let ip = r.intersectSegment(seg);
        if (ip) {
            ips.push(ip);
        }
    }

    // Draw p
    g.append('circle')
        .classed('test-point', true)
        .attr('cx', p.x)
        .attr('cy', p.y)
        .attr('r', 0)
        .style('opacity', 1e-6)
    .transition()
        .duration(400)
        .ease(d3.easeElastic)
        .style('opacity', 1)
        .attr('r', 7)
        .on('end', function() {
            drawTestLine(p, ips, this, cb);
        });
}

function drawTestLine(point, ips, circle, cb) {
    // Draw line out
    g.append('line').classed('line-intersect', true)
        .attr('x1', point.x)
        .attr('y1', point.y)
        .attr('x2', point.x)
        .attr('y2', point.y)
    .transition()
        .duration(1000)
        .attr('x2', 1000)
        .on('end', function(d) {
            if (ips.length > 0) {
                drawIntersectionPoints(ips, this, circle, cb);
            } else {
                circle.style.fill= 'red';
                this.style.stroke = 'red';
                cb();
            }
        });
}

function drawIntersectionPoints(points, line, point, cb) {
    points.forEach((pt, i) => {
        // Draw point
        g.append('circle')
            .classed('point-intersect', true)
            .attr('cx', pt.intPoint.x)
            .attr('cy', pt.intPoint.y)
            .attr('r', 0)
        .transition()
            .duration(500)
            .delay(200)
            .ease(d3.easeElastic)
            .attr('r', 10)
        .on('end', function() {
            if (points.length % 2 === 0) {
                line.style.stroke = 'red';
                point.style.fill = 'red';
            } else {
                line.style.stroke = 'green';
                point.style.fill = 'green';
            }
            if (i === points.length - 1) {
                cb();
            }
        });
    });
}

function startTestLoop(hull) {
    testPoint(hull, () => { startTestLoop(hull); });
}

function main() {
    let t = d3.transition()
        .duration(2000);
    // Polygon Vertices
    let points = d3.range(8).map(() => {
        return new Point(Math.random() * width, Math.random() * height);
    });
    let hull = convexHull(points, points.length);

    let line = d3.line()
        .x(d => d.x)
        .y(d => d.y);

    g.append('path')
        .classed('hull', true)
        .datum(hull)
        .attr('d', line)
        // .style('opacity', 0)
        .style('stroke-width', '0px')
        .transition(t)
        .ease(d3.easeElastic)
        // .style('opacity', 1)
        .style('stroke-width', '5px')
        .on('end', () => {
            startTestLoop(hull);
        });
}

setTimeout(main, 1000);
// main();
