import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let actions = [];
window.actions = actions;
let interval = 30;

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
console.log(g, colorScale);

let gridSize = 60;
for (let i = 0; i < width; i+=gridSize) {
    for (let j = 0; j < height; j += gridSize) {
        g.append('rect')
            .attr('x', i)
            .attr('y', j)
            .attr('width', gridSize)
            .attr('height', gridSize);
    }
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// http://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph07-poissondisk.pdf
// https://www.jasondavies.com/poisson-disc/
let poissonDiscSampling = function(minDist, maxDist) {
    // How many points we try before rejecting a point
    let k = 30;

    let minDist2 = minDist * minDist;

    let x, y, i, j, p, d;
    // Final array of points that we'll return
    let points = [];

    // Points that we use to find neighbours
    let activePoints = [];

    // Start at a random point
    x = (0.2 + Math.random() * 0.6) * width;
    y = (0.2 + Math.random() * 0.6) * height;
    let point = {x, y, dist: 0, id: `x${x}-y${y}`};
    points.push(point);
    activePoints.push(point);
    actions.push({type: 'add-point', point, points: clone(points), activePoints: clone(activePoints)});

    let activeIndex, currentPoint, pointAdded, angle, collision;

    while (activePoints.length) {
        // Pick a random active point
        activeIndex = Math.floor(Math.random() * activePoints.length);
        currentPoint = activePoints[activeIndex];
        pointAdded = false;

        actions.push({type: 'pick-point', currentPoint});

        let attemptedPoints = [];

        for (i = 0; i < k; i++) {
            angle = Math.random() * 360;
            d = Math.random() * (maxDist - minDist) + minDist;
            x = currentPoint.x + Math.cos(angle) * d;
            y = currentPoint.y + Math.sin(angle) * d;
            point = {x, y, dist: d, id: `x${x}-y${y}`};
            attemptedPoints.push(point);

            actions.push({type: 'attempt-point', currentPoint, attemptedPoints: clone(attemptedPoints)});

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
                // point = {x, y, dist: d, id: `x${x}-y${y}`};
                points.push(point);
                activePoints.push(point);
                pointAdded = true;
                actions.push({type: 'add-point', point, points: clone(points), activePoints: clone(activePoints)});
                break;
            }
        }

        // Failed to add point so remove it from the active list
        if (!pointAdded) {
            activePoints.splice(activeIndex, 1);
            actions.push({type: 'failed', points: clone(points), activePoints: clone(activePoints)});
        }
    }

    actions.push({type: 'finish'});
    return points;
};

// poissonDiscSampling(12, 20);
console.log(actions);

let points = poissonDiscSampling(90, 120);
// g.selectAll('.point').data(points)
// .enter().append('circle')
//     .attr('cx', d => d.x)
//     .attr('cy', d => d.y)
//     .transition().duration(1500).delay((d, i) => i * 10)
//     .attr('r', 6)
//     .style('fill', d => colorScale(d.dist));
//
console.log(points);
console.log(actions.length);
function update(action) {
    // console.log(action);

    switch(action.type) {
        case 'add-point': {
            let activePoints = g.selectAll('.active').data(action.activePoints, d => `active=${d.id}`);
            let points = g.selectAll('.point').data(action.points, d => `point-${d.id}`);
            activePoints.exit().transition().remove();
            points.exit().remove();

            // Enter
            points.enter().append('circle')
                .attr('class', 'point')
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .transition().duration(100)
                .attr('r', 6)
                .style('fill', 'black');
            activePoints.enter().append('circle')
                .attr('class', 'active')
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .transition().duration(100)
                .attr('r', 6)
                .style('fill', (d, i) => {

                    return 'red';
                });
            break;
        }
        case 'pick-point': {
            let points = g.selectAll('.point')
                .style('fill', d => {
                    if (d.id === action.currentPoint.id) {
                        return 'green';
                    } else {
                        return 'black';
                    }
                })
            break;
        }
        case 'attempt-point': {
            let attempts = g.selectAll('.attempt').data(action.attemptedPoints, d => `attempt-${d.id}`);
            attempts.exit().remove();
            attempts.enter().append('circle')
                .attr('class', 'attempt')
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .attr('r', 3)
                .style('fill', 'blue');

            g.selectAll('.active')
                .style('fill', d => {
                    if (d.id === action.currentPoint.id) {
                        return 'green';
                    } else {
                        return 'red';
                    }
                })
            break;
        }
        case 'failed': {
            console.log('failed');
            g.selectAll('.active').exit().remove();
            break;
        }
        case 'finish': {
            g.selectAll('.active').transition().duration(500).style('opacity', 0).remove();
            break;
        }

    }

    // Data join

    // Exit

    // let attempts
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
