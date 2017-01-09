import * as d3 from 'd3';
require('./styles.scss');

// the 'point' object
var Point = function(x, y) {
    this.x = x;
    this.y = y;
    Point.distance = function(a, b) {
        // euclidean distance between two points
        return Math.sqrt((a.x - b.x)*(a.x - b.x) + (a.y - b.y)*(a.y - b.y));
    }
}
window.Point = Point;

// brute force algorithm
function closestPairOfPointsBruteForce(points) {
    var minDistance = Point.distance(points[0], points[1]);
    var minI = points[0].idx;
    var minJ = points[1].idx;
    for (var i = 0; i < points.length; ++i) {
        for (var j = i + 1; j < points.length; ++j) {
            // minDistance = Math.min(minDistance, Point.distance(points[i], points[j]));
            let d = Point.distance(points[i], points[j]);
            if (d < minDistance) {
                minI = points[i].idx;
                minJ = points[j].idx;
                minDistance = d;
            }
            actions.push({
                type: 'brute',
                i: points[i].idx,
                j: points[j].idx,
                minDistance,
                minI,
                minJ
            });
        }
    }
    return {minDistance, minI, minJ};
}

// divide and conquer algorithm
let actions = [];
function closestPairOfPointsDivideAndConquer(points) {
    actions.push({
        type: 'start',
        points: points
    });

    // compare two points
    function comparePoints(a, b) {
        if (a.x < b.x) {
            return -1;
        } else if (a.x > b.x) {
            return 1;
        } else if (a.y < b.y) {
            return -1;
        } else if (a.y > b.y) {
            return 1;
        } else {
            return 0;
        }
    }

    // sort the points by the x coordinate
    points.sort(comparePoints);
    // Add idx for keeping track of points
    points.forEach((p, i) => {
        p.idx = i;
    });

    // solve recursively
    function solve(points) {

        // brute force for 3 points or less
        if (points.length >= 2 && points.length <= 3) {
            return closestPairOfPointsBruteForce(points);
        }

        var int = parseInt;
        var n   = points.length;

        // split
        var middle = int(n/2);
        var left   = points.slice(0, middle);
        var right  = points.slice(middle, n);
        actions.push({
            type: 'split',
            midpoint: points[middle]
        });

        // branch
        var leftMinDistance = solve(left);
        var rightMinDistance = solve(right);
        let minI, minJ;

        var minDistance = Math.min(leftMinDistance.minDistance, rightMinDistance.minDistance);
        if (minDistance === leftMinDistance.minDistance) {
            minI = leftMinDistance.minI;
            minJ = leftMinDistance.minJ;
        } else {
            minI = rightMinDistance.minI;
            minJ = rightMinDistance.minJ;
        }

        // middle line
        var middleX = (points[middle - 1].x + points[middle].x)/2;

        // searching area
        var leftLimitX = middleX - minDistance;
        var rightLimitX = middleX + minDistance;
        actions.push({
            type: 'area',
            leftX: leftLimitX,
            rightX: rightLimitX
        });

        var leftLimitPoints = [];
        var rightLimitPoints = [];

        for (var i = left.length - 1; i >= 0; --i) {
            if (left[i].x >= leftLimitX) {
                leftLimitPoints.push(left[i])
            } else {
                break;
            }
        }

        for (var i = 0; i < right.length; ++i) {
            if (right[i].x <= rightLimitX) {
                rightLimitPoints.push(right[i]);
            } else {
                break;
            }
        }

        var cnt = 0;
        for (var i = 0; i < leftLimitPoints.length; ++i) {
            for (var j = 0; j < rightLimitPoints.length; ++j) {
                let d = Point.distance(leftLimitPoints[i], rightLimitPoints[j]);
                if (d < minDistance) {
                    minI = leftLimitPoints[i].idx;
                    minJ = rightLimitPoints[j].idx;
                    minDistance = d;
                }
                actions.push({
                    type: 'search',
                    i: leftLimitPoints[i].idx,
                    j: rightLimitPoints[j].idx,
                    minI,
                    minJ,
                    minDistance
                })
                cnt++;
            }
        }

        return {minDistance, minI, minJ};

    }

    return solve(points);
}

function getSomeRandomPoints(some, minX, minY, maxX, maxY) {
    var points = [];
    for (var i = 0; i < some; ++i) {
        var point = new Point(
            parseInt((Math.random() * 10000) % (maxX - minX) + minX),
            parseInt((Math.random() * 10000) % (maxX - minX) + minX)
        );
        points.push(point);
    }

    return points;
}

function performSomeTests(some) {
    var results = {
        correctCount : 0,
        wrongCount   : 0
    };

    var flag = false;

    for (var i = 0; i < some; ++i) {
        var points = getSomeRandomPoints(4, 0, 0, 100, 100);
        var dc = closestPairOfPointsDivideAndConquer(points);
        var bf = closestPairOfPointsBruteForce(points);
        if (Math.abs(dc.minDistance - bf.minDistance) < 0.00005) {
            results.correctCount++;
        } else {
            results.wrongCount++;
            if (results.wrongCount > 5) { continue; flag = true;}
            var str = '';
            // for (var j in points) {
            //     str += ('(' + points[j].x + ', ' + points[j].y + ') ');
            // }
            // str[str.length - 1] = '.';
            // console.log('Wrong! The correct answer is',
            //     Math.round(bf.minDistance * 100)/100 +
            //     ', answer given is', Math.round(dc * 100)/100 +
            //     '. Points:',
            //     str);
        }
    }

    if (flag) { console.log('...'); }

    return results;
}

let margin = {top: 50, right: 50, bottom: 50, left: 50},
// let margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let numPoints = 25;
let P = getSomeRandomPoints(numPoints, 0, 0, width, height);
console.log(P);
window.P = P;
let results = closestPairOfPointsDivideAndConquer(P);
window.results = results;
console.log(results);
// let tests = performSomeTests(100);
// console.log(tests);



let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var circles = g.selectAll('circle')
    .data(P, d => {
        return d.idx;
    });

circles.enter().append('circle')
    .classed('point', true)
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', 10)
    .style('fill', 'red');

let minLine = g.append('line').classed('min-line', true);

let interval = 500;

function updateMinPoints(i, j, mi, mj) {
    let circles = g.selectAll('.point').data(P, d => d.idx);

    circles.transition().duration(500)
        .style('fill', d => {
            if (d.idx === mi || d.idx === mj) {
                return 'green';
            }
            if (d.idx === i || d.idx === j) {
                return 'red';
            }
            return 'rgba(0, 0, 0, 0.5)';
        });

    let p1 = P[mi],
        p2 = P[mj];
    minLine
        .attr('x1', p1.x)
        .attr('y1', p1.y)
        .attr('x2', p1.x)
        .attr('y2', p1.y)
    .transition().duration(10)
        .attr('x2', p2.x)
        .attr('y2', p2.y);
}

let md = Infinity;
function update(action) {
    console.log(action);

    let t = d3.transition()
        .duration(interval);
    // Handle 4 different action cases
    switch (action.type) {
        case 'split':{
            g.append('line')
                .classed('split', true)
                .attr('x1', action.midpoint.x)
                .attr('y1', 0)
                .attr('x2', action.midpoint.x)
                .attr('y2', 0)
            .transition(t)
                .attr('y2', height)
            break;
        }
        case 'brute':
            // Hide any visible areas
            d3.selectAll('.area')
                .transition()
                .duration(100)
                .style('opacity', 0);

            // Draw search line and min line and data points in green
            // Only update the min point if it changes
            if (md && md !== action.minDistance) {
                updateMinPoints(action.i, action.j, action.minI, action.minJ);
                md = action.minDistance;
            }
            g.append('line')
                .classed('search-line', true)
                .attr('x1', P[action.i].x)
                .attr('y1', P[action.i].y)
                .attr('x2', P[action.i].x)
                .attr('y2', P[action.i].y)
            .transition(t)
                .attr('x2', P[action.j].x)
                .attr('y2', P[action.j].y)
                .on('end', function(d) {
                    this.style.strokeWidth = 1;
                    this.style.opacity = 0.7;
                })


            // Draw current min green and keep it there unless it changes
            // d3.selectAll('.search-line-min')
            //     .transition(t)
            //     .style('opacity', 1e-6);
            // g.append('line')
            //     .classed('search-line-min', true)
            //     .attr('x1', P[action.minI].x)
            //     .attr('y1', P[action.minI].y)
            //     .attr('x2', P[action.minI].x)
            //     .attr('y2', P[action.minI].y)
            // .transition(t)
            //     .attr('x2', P[action.minJ].x)
            //     .attr('y2', P[action.minJ].y)
            //     .on('end', d => {
            //         // this.style('opacity', 1e-6);
            //     })
            break;
        case 'area':
            // Hide all previous areas
            d3.selectAll('.area')
                .transition()
                .duration(500)
                .style('opacity', 0);

            g.append('rect')
                .classed('area', true)
                .attr('x', action.leftX)
                .attr('y', 0)
                .attr('width', action.rightX - action.leftX)
                .attr('height', height)
                .style('opacity', 1e-6)
                .style('fill', 'black')
            .transition()
                .duration(500)
                .style('opacity', 0.2)
            break;
        case 'search':
            // Draw search line and min line and data points in green
            // Only update the min point if it changes
            if (md && md !== action.minDistance) {
                updateMinPoints(action.i, action.j, action.minI, action.minJ);
                md = action.minDistance;
            }
            g.append('line')
                .classed('search-line', true)
                .attr('x1', P[action.i].x)
                .attr('y1', P[action.i].y)
                .attr('x2', P[action.i].x)
                .attr('y2', P[action.i].y)
            .transition()
                .duration(500)
                .attr('x2', P[action.j].x)
                .attr('y2', P[action.j].y)
                .on('end', function(d) {
                    this.style.strokeWidth = 1;
                    this.style.opacity = 0.7;
                })

            // Draw current min green and keep it there unless it changes
            // d3.selectAll('.search-line-min')
            //     .transition(t)
            //     .style('opacity', 1e-6);
            // g.append('line')
            //     .classed('search-line-min', true)
            //     .attr('x1', P[action.minI].x)
            //     .attr('y1', P[action.minI].y)
            //     .attr('x2', P[action.minI].x)
            //     .attr('y2', P[action.minI].y)
            // .transition(t)
            //     .attr('x2', P[action.minJ].x)
            //     .attr('y2', P[action.minJ].y)
            //     .on('end', d => {
            //         // this.style('opacity', 1e-6);
            //     })
            break;
    }
}

window.actions = actions;
let i = 0;
console.log(actions.length);
let loop = setInterval(() => {
    i++;
    console.log('iteration number', i);
    if (actions[i]) {
        update(actions[i]);
    }
    if (actions.length === i) {
        finish();
        clearInterval(loop);
    }

}, interval)

function finish() {
    // d3.selectAll('circle').transition()
    //     .duration(1000)
    //     .delay((d, i) => i * 20)
    //     .style('fill', d => {
    //         if (d.idx === results.minI || d.idx === results.minJ) {
    //             return 'green';
    //         }
    //         return 'red';
    //     })
    //     .style('opacity', 0.3);

    // Hide any areas if they're visible
    d3.selectAll('.area')
        .transition()
        .duration(500)
        .style('opacity', 0);

    // Update min points
    updateMinPoints(null, null, results.minI, results.minJ);

    let points = d3.selectAll('.point')
        .data(P, d => d.idx);

    points.transition()
        .duration(1000)
        .attr('r', d => {
            if (d.idx === results.minI || d.idx === results.minJ) {
                return 12;
            }
            return 3;
        })
        .style('fill', d => {
            if (d.idx === results.minI || d.idx === results.minJ) {
                return 'green';
            }
            return 'rgba(0, 0, 0, 0.5)';
        });

    d3.selectAll('.search-line')
        .transition()
        .duration(1000)
        .style('stroke', 'rgba(0, 0, 0, 0.5)');

    // Draw line between them
    console.log('finished');
}

