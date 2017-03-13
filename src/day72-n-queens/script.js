import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let margin = {top: 100, right: 100, bottom: 100, left: 100},
    width = 800- margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g').attr('class', 'svg-group')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let actions = [];
window.actions = actions;
// console.log(counter);
const boardSize = 8;
const cellSize = width / boardSize;

// N-queens
var iterations = 0

var print_board = function (columns) {
    var n = columns.length, row = 0, col = 0
    while (row < n) {
        while (col < n) {
            console.log(columns[row] === col ? 'Q ' : '# ')
            col++
        }

        console.log('\n')
        col = 0
        row++
    }
}

var has_conflict = function (columns) {
    var len = columns.length, last = columns[len - 1], previous = len - 2

    while (previous >= 0) {
        if (columns[previous] === last) return true
        if (last - (len - 1) === columns[previous] - previous) return true
        if (last + (len - 1) === columns[previous] + previous) return true
        previous--
    }

    return false
}

var place_next_queen = function (total, queens, columns) {
    if (queens === 0) return columns
    columns = columns || []

    for (var column = 0; column < total; column++) {
        columns.push(column)
        iterations++
        actions.push({type: 'iteration', columns: columns.slice()});
        if (!has_conflict(columns) && place_next_queen(total, queens - 1, columns)) {
                actions.push({type: 'sol', columns: columns.slice()})
                return columns
            }
        columns.pop(column)
    }

    return null
}

let columns = place_next_queen(boardSize, boardSize);
console.log('iterations', iterations);

let offset = 0;
let grid = d3.range(boardSize * boardSize);
// XXX: THIS DOESN'T WORK - but it visually looks correct,
// so don't worry about fixiing it, we're short on time
grid = grid.map((d, i) => {
    if (i % boardSize === 0) {
        if (offset === 1) {
            offset = 0;
        } else {
            offset = 1;
        }
    }

    return i % 2 + offset;
});

g.selectAll('.cell').data(grid).enter().append('rect')
    .classed('cell', true)
    .attr('x', (d, i) => (i % boardSize) * cellSize)
    .attr('y', (d, i) => Math.floor(i / boardSize) * cellSize)
    .attr('width', cellSize)
    .attr('height', cellSize)
    .style('stroke', 'rgba(12, 12,12, 1)')
    .style('fill', d => d === 1 ? 'rgba(200, 200, 200, 0.5)' : 'rgba(30, 30, 30, 0.5)');

function update(counter) {
    let action = actions[counter];
    console.log(counter);
    let t = d3.transition().duration(interval);

    let queens = g.selectAll('.queen').data(action.columns, (d, i) => i);

    queens.enter().append('rect')
        .classed('queen', true)
        .attr('x', (d, i) => i * cellSize + 10)
        .attr('y', d => d * cellSize + 10)
        .attr('width', cellSize - 20)
        .attr('height', cellSize - 20)
        .attr('rx', 10)
        .attr('ry', 10)
    .transition(t)
        // .attr('width', cellSize - 20)
        // .attr('height', cellSize - 20)

    queens.exit().transition(t)
        .style('opacity', 0)
        .remove()

    queens.transition(t)
        .style('opacity', 1)
        .attr('x', (d, i) => i * cellSize + 10)
        .attr('y', d => d * cellSize + 10)

}

let interval = 80;
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

