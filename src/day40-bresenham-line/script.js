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

// let dataColorScale = d3.scaleLinear()
//     .domain([0, 200])
//     .range(['#fff7f3', '#7a0177']);

function line(x0, y0, x1, y1) {
    let dx = Math.abs(x1-x0);
    let dy = Math.abs(y1-y0);
    let sx = (x0 < x1) ? 1 : -1;    // Step direction for pixels
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx-dy;                // Keep track of err as we go
    console.log(dx, dy);

    while(true) {
        // setPixel(x0,y0);  // Do what you need to for this
        actions.push({type: 'set-pixel', x0, y0, err});

        // Exit once we've reached the end point
        if ((x0==x1) && (y0==y1)) {
            actions.push({type: 'done', x0, y0, x1, y1, sx, sy, err});
            break;
        }

        let e2 = 2*err;

        // Step in the x direction
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
            actions.push({type: 'x-step', err, x0, x1, y0, y1, sx, sy});
        }
        // Step in the y-direction
        if (e2 < dx) {
            err += dx;
            y0 += sy;
            actions.push({type: 'y-step', err, x0, x1, y0, y1, sx, sy});
        }
    }
}

let x0 = 5;
let y0 = 28;
let x1 = 40;
let y1 = 16;
line(x0, y0, x1, y1);
console.log(actions);

let cellSize = 20;
let numCols = width / cellSize;
let numRows = height / cellSize;
let grid = [];
for (let i = 0; i < numRows; i++) {
    grid[i] = [];
    for (let j = 0; j < numCols; j++) {
        grid[i][j] = {row: i, col: j, key: `row-${i}-col-${j}`, val: 0};
    }
}
console.log(grid);
grid[y0][x0].val = 3;
grid[y1][x1].val = 3;

let rows = g.selectAll('.row').data(grid, (d, i) => `row-${i}`).enter().append('g')
    .attr('transform', (d, i) => `translate(0, ${i * cellSize})`)
    .classed('row', true);

rows.selectAll('.cell').data(d => d, (d, i) => {return d.key}).enter().append('rect').attr('class', 'cell')
    .attr('x', (d, i) => i * cellSize)
    .attr('y', 0)
    .attr('width', cellSize)
    .attr('height', cellSize)
    .style('fill', 'white');

let errorText = g.append('text').attr('id', 'error')
    .attr('x', width / 2)
    .attr('y', height - 100);
let dxText = g.append('text').attr('id', 'dx')
    .attr('x', width / 2)
    .attr('y', height - 130)
    .text(`dx: ${x1 - x0}`);
let dyText = g.append('text').attr('id', 'dy')
    .attr('x', width / 2)
    .attr('y', height - 160)
    .text(`dy: ${y1 - y0}`);

function update(action) {
    console.log(action);
    g.select('#error').datum(action.err).text(d => `Error: ${2 * d}`);
    let row = action.y0;
    let col = action.x0;
    switch (action.type) {
        case 'set-pixel': {
            grid[row][col].val = 1;
            // grid[row][col] = {...grid[row][col], val: 1};
            break;
        }
        case 'y-step':
        case 'x-step': {
            grid[row][col].val = 2;
            // grid[row][col] = {...grid[row][col], val: 2};
            break;
        }
    }


    let cells = rows.selectAll('.cell').data(d => d, (d, i) => {return d.key});

    cells.enter().append('rect')
        .attr('class', 'cell')
        .attr('x', (d, i) => i * cellSize)
        .attr('y', 0)
        .attr('width', cellSize)
        .attr('height', cellSize)
        // .style('stroke', 'red');

    cells.attr('class', 'cell')
        .style('fill', d => {
            switch (d.val) {
                // case 0: return 'lightgray';
                case 1: return 'darkgray';
                case 2: return 'purple';
                case 3: return 'green';
            }
        });
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
