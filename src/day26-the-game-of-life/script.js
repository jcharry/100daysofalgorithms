import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let actions = [];
window.actions = actions;
let interval = 100;

// Setup SVG
let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// let dataColorScale = d3.scaleLinear()
//     .domain([0, 100])
//     .range(['#e7e1ef', '#980043']);

let Cell = function(x, y, width, state) {
    let previous = state;
    return {
        x, y, width, state, previous
    };
};

let CA = function() {
    let cells = [];
    let cellWidth = 10;
    let columns = Math.floor(width / cellWidth);
    let rows = Math.floor(height / cellWidth);

    // Initialize board based on cell width
    let board = [];
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            let state = Math.random() < 0.8 ? 0 : 1;
            let c = Cell(i * cellWidth, j * cellWidth, cellWidth, state);
            c.key = `row-${i}-col-${j}`;
            if (board[i]) {
                board[i][j] = c;
            } else {
                board[i] = [c];
            }
        }
    }

    return {
        cells,
        board,
        cellWidth,
        columns, rows
    };
};

let ca = CA();
window.ca = ca;
console.log(ca);
let board = g.append('g').attr('class', 'board');
let rows = board.selectAll('.row')
    .data(ca.board)
    .enter().append('g')
    .attr('class', 'row');

function update(boardData) {
    let cells = rows.selectAll('.cell')
        .data(d => d, d => d.key);

    // Update
    cells.style('fill', d => d.state === 1 ? 'white' : 'black');

    // Enter
    cells.enter().append('rect')
        .attr('class', 'cell')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('width', d => d.width)
        .attr('height', d => d.width)
        .style('fill', d => d.state === 1 ? 'white' : 'black');
}

window.update = update;
update(ca.board);

function playTheGameOfLife() {
    console.log('playing the game');
    let newBoard = [];
    for (let i = 0; i < ca.columns; i++) {
        for (let j = 0; j < ca.rows; j++) {
            let neighbors = 0;
            let cell = ca.board[i][j];
            for (let k = i - 1; k <= i + 1; k++) {
                for (let l = j - 1; l <= j + 1; l++) {
                    let cIdx = k;
                    let rIdx = l;
                    // If we're on an edge, swap the i or j index so neighbor
                    // selection wraps around
                    if (i === 0) cIdx = ca.columns - 1;
                    else if (i === ca.columns - 1) cIdx = 0;

                    if (j === 0) rIdx = ca.rows - 1;
                    else if (j === ca.rows - 1) rIdx = 0;

                    neighbors += ca.board[cIdx][rIdx].state;
                }
            }
            neighbors -= cell.state;

            // Rules!
            let newState = cell.state;
            if ((cell.state == 1) && (neighbors < 2)) newState = 0;
            else if ((cell.state == 1) && (neighbors > 3)) newState = 0;
            else if ((cell.state == 0) && (neighbors == 3)) newState = 1;

            let newCell = Cell(cell.x, cell.y, cell.width, newState);
            newCell.key = `row-${i}-col-${j}`;

            if (newBoard[i]) {
                newBoard[i][j] = newCell;
            } else {
                newBoard[i] = [newCell];
            }
        }
    }
    // Copy over first row and last row, since we're ignoring them for now
    // newBoard[0] = ca.board[0];
    // newBoard[ca.board.length - 1] = ca.board[ca.board.length - 1];

    // Loop through all new data, and overwrite old data
    for (let i = 1; i < ca.columns - 1; i++) {
        for (let j = 1; j < ca.rows - 1; j++) {
            ca.board[i][j].state = newBoard[i][j].state;
        }
    }
    update(ca.board);
}

function main() {
    // Can I draw a path using vertices from polygon?
    // Write out original string
    // g.append('text').datum(str).text(d => d);

    setTimeout(() => {
        d3.interval(playTheGameOfLife, interval);
        // setInterval(() => {
        //     playTheGameOfLife();
        // }, interval);
    }, 1000);
}

main();

