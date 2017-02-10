import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let actions = [];
window.actions = actions;
let interval = 500;

// Setup SVG
let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 1800- margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let dataColorScale = d3.scaleLinear()
    .domain([0, 11])
    .range(['#99d594', '#3288bd']);

// Clones simple objects of primitives
// may not work on complex hierarchies
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// 2D
// N X M (rows x cols)
let problemMatrix = [
	[ 4,  5,  6,  7,  8,  7,  6,  5,  4,  3,  2],
	[ 5,  6,  7,  8,  9,  8,  7,  6,  5,  4,  3],
	[ 6,  7,  8,  9, 10,  9,  8,  7,  6,  5,  4],
	[ 7,  8,  9, 10, 11, 10,  9,  8,  7,  6,  5],
	[ 8,  9, 10, 11, 12, 11, 10,  9,  8,  7,  6],
	[ 7,  8,  9, 10, 11, 10,  9,  8,  7,  6,  5],
	[ 6,  7,  8,  9, 10,  9,  8,  7,  6,  5,  4],
	[ 5,  6,  7,  8,  9,  8,  7,  6,  5,  4,  3],
	[ 4,  5,  6,  7,  8,  7,  6,  5,  4,  3,  2],
	[ 3,  4,  5,  6,  7,  6,  5,  4,  3,  2,  1],
	[ 2,  3,  4,  5,  6,  5,  4,  3,  2,  1,  0]
];

let dataMatrix = problemMatrix.map((row, i) => {
    return row.map((col, j) => {
        return {i, j, value: col};
    });
});

console.log(dataMatrix);

actions.push({type: 'initialize', data: dataMatrix});
window.prob = problemMatrix;

let N = problemMatrix.length;
let M = problemMatrix[0].length;

function peakfinder2d(problem, c1, c2) {
    // Pick the middle column - j = m / 2
    let mid = Math.floor((c1 + c2) / 2);
    actions.push({type: 'highlight-col', col: mid, c1, c2});

    // Create a list of index locations for the dividing column
    let divider = []
    for (let i = 0; i < N; i++) {
        divider.push([i, mid]);
    }

    // Find a global max on column (i, j) - (row i, col j)
    // Capture the best location's indices
    let max = -Infinity
    let bestLoc;
    for (let i = 0; i < divider.length; i++) {
        if (problem[i][mid] > max) {
            max = problem[i][mid]
            bestLoc = [i, mid];
        }
        actions.push({type: 'find-max', col: mid, row: i, best: [bestLoc[0], bestLoc[1]], max: max, c1, c2});
    }

    // Check conditions
    let r = bestLoc[0];
    let c = bestLoc[1];

    // If there is a column to the left...
    if (c - 1 >= 0) {
        actions.push({type: 'check-left', row: r, col: c - 1, c1, c2});
        // If the number to the left is larger, recurse into
        // left half of matrix
        if (problem[r][c - 1] > problem[r][c]) {
            //  Solve the new problem with half the number of columns
            actions.push({type: 'current-best', best: [bestLoc[0], bestLoc[1]]});
            bestLoc = peakfinder2d(problem, 0, c - 1);
        }
    }

    // If there's a column to the right...
    if (c + 1 <= M - 1) {
        actions.push({type: 'check-right', row: r, col: c + 1, c1, c2});
        if (problem[r][c + 1] > problem[r][c]) {
            actions.push({type: 'current-best', best: [bestLoc[0], bestLoc[1]]});
            bestLoc = peakfinder2d(problem, c + 1, c2);
        }
    }

    // If neither condition fires above, then we have a peak!
    return bestLoc;
}

let peak = peakfinder2d(problemMatrix, 0, M);
actions.push({type: 'finished', peak});
console.log('peak found at ', peak);

let spacing = 50;
let cellWidth = 40;
let highlightColor = 'blue';
let inactiveColor = 'rgba(80, 80, 80, 0.5)';
let activeColor = 'rgba(180, 180, 180, 0.5)';
let checkingColor = 'purple';
let maxColor = 'green';

function update(counter) {
    let action = actions[counter];
    console.log('called update with type: ', action.type);

    switch (action.type) {
        case 'initialize': {
            let currentRow = 0;
            let rows = g.selectAll('.row').data(action.data).enter().append('g').attr('class', d => {
                return 'row'
            }).attr('transform', (d, i) => `translate(0, ${i * spacing})`);

            let cell = rows.selectAll('.cell').data(d => d);

            let cellEnter = cell.enter().append('g')
                .attr('transform', d => `translate(${d.j * spacing}, 0)`)
                .attr('class', 'cell');

            cellEnter.append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', cellWidth)
                .attr('height', cellWidth)
                .style('fill', activeColor)
                .attr('class', 'cell-bg');

            cellEnter.append('text')
                .attr('x', spacing / 2 - 5)
                .attr('y', spacing / 2)
                .text(d => d.value);
            break;
        }
        case 'highlight-col':
            d3.selectAll('.cell-bg')
                .style('fill', function(d) {
                    // Are we outside the bounds?
                    if (d.j < action.c1 || d.j > action.c2) {
                        return inactiveColor;
                    }
                    if (action.col === d.j) {
                        return highlightColor;
                    }
                    return this.style.fill;
                });
            break;
        case 'find-max':
            d3.selectAll('.cell-bg')
                .style('fill', function(d) {
                    if (d.i === action.row && d.j === action.col) {
                        return checkingColor;
                    } else if (d.i === action.best[0] && d.j === action.best[1]) {
                        return maxColor;
                    } else if (d.j === action.col) {
                        return highlightColor;
                    }

                    // If we're inactive...
                    if (d.j < action.c1 || d.j > action.c2) {
                        return inactiveColor;
                    }

                    return activeColor;
                });
            break;
        case 'check-left':
            d3.selectAll('.cell-bg')
                .style('fill', function(d) {
                    if (d.j === action.col && d.i === action.row) {
                        if (d.value > problemMatrix[action.row][action.col + 1]) {
                            return maxColor;
                        } else {
                            return checkingColor;
                        }
                    } else {
                        return this.style.fill;
                    }
                });
            break;
        case 'check-right': {
            d3.selectAll('.cell-bg')
                .style('fill', function(d) {
                    if (d.j === action.col && d.i === action.row) {
                        if (d.value > problemMatrix[action.row][action.col - 1]) {
                            return maxColor;
                        } else {
                            return checkingColor;
                        }
                    } else {
                        return this.style.fill;
                    }
                });
            break;
        }
        case 'finished': {
            d3.selectAll('.cell-bg')
                .style('fill', function(d) {
                    if (d.i === action.peak[0] && d.j === action.peak[1]) {
                        return maxColor;
                    }
                    return inactiveColor;
                });
            break;
        }
        case 'current-best':
            break;
        default:
            break;
    }

}

function init() {
    g.selectAll('.row').data(acti)
}

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
