import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let actions = [];
window.actions = actions;
let interval = 500;

// Setup SVG
let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let colorScale = d3.scaleLinear()
    .domain([12, 20])
    // .range(['#abc', '#def']);
    .range(['#fff7f3', '#7a0177']);

// http://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph07-poissondisk.pdf
// https://www.jasondavies.com/poisson-disc/
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

let points = PoissonDiscSampling(12, 20);
g.selectAll('.point').data(points).enter().append('circle')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .transition().duration(1500).delay((d, i) => i * 10)
    .attr('r', 6)
    .style('fill', d => colorScale(d.dist));

console.log(points);
function update(action) {
    console.log('update called');

}

function main() {
    let counter = 0;
    setTimeout(() => {
        d3.interval(() => {
            if (actions[counter]) {
                update(actions[counter]);
                counter++;
            }
        }, interval);
    }, 1000);
}

main();
