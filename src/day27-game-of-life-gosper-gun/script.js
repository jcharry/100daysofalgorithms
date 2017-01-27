import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');
import {rleDecompress} from './rle.js';

let actions = [];
window.actions = actions;
let interval = 50;

// Setup SVG
let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let Cell = function(x, y, width, state) {
    let previous = state;
    return {
        x, y, width, state, previous
    };
};

let CA = function(cellWidth) {
    let cells = [];
    cellWidth = cellWidth === undefined ? 10 : cellWidth;
    let columns = Math.floor(width / cellWidth);
    let rows = Math.floor(height / cellWidth);
    console.log(rows, columns);

    // Initialize board based on cell width
    let board = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            // let state = 0; //Math.random() < 0.8 ? 0 : 1;
            let state = Math.random() < 0.8 ? 0 : 1;
            let c = Cell(j * cellWidth, i * cellWidth, cellWidth, state);
            c.key = `row-${i}-col-${j}`;
            if (board[i]) {
                board[i][j] = c;
            } else {
                board[i] = [c];
            }
        }
    }

    // function parseRLE()
    function parseRLE (str) {
        let lines = str.split("\n");
        lines = lines.filter(l => {
            if (l[0] === '#') {
                return false;
            }
            return true;
        });

        // Get row and column count
        let sizeString = lines.shift().split(',');
        let cols = parseInt(sizeString[0].split('=')[1]);
        let rows = parseInt(sizeString[1].split('=')[1])

        let pattern = create2DArray(rows);

        let patternString = lines.shift();

        // Decode pattern
        function decode (str) {
            return str.replace(/(\d+)(\w)/g,
                function(m,n,c){
                    return new Array( parseInt(n,10)+1 ).join(c);
                }
            );
        }

        let decodedStr = decode(patternString);
        let patternStrings = decodedStr.split('$');

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let ch = patternStrings[i][j];
                // console.log(ch);

                if (ch === undefined || ch === '!') ch = 'b';
                let state = 0;
                if (ch === 'o') { state = 1; }
                pattern[i][j] = state;
            }
        }

        return pattern;
    }

    function insertPattern(startRow, startCol, p) {
        Object.keys(p).forEach(rowIdx => {
            let row = p[rowIdx];
            Object.keys(row).forEach(colIdx => {
                if (rowIdx < rows && colIdx < columns) {
                    // let c = Cell((startRow + rowIdx) * cellWidth, (startCol + colIdx) * cellWidth, cellWidth, 1);
                    // c.key = `row-${startRow + rowIdx}-col-${startCol + colIdx}`;
                    // console.log(`row: ${rowIdx}, col: ${colIdx}`);
                    board[startRow + parseInt(rowIdx)][startCol + parseInt(colIdx)].state = 1;
                }
            });
        });
        // let rows = p.length;
        // let cols = p[0].length;
        // for (let i = 0; i < rows; i++) {
        //     for (let j = 0; j < cols; j++) {
        //         let c = Cell((startRow + i) * cellWidth, (startCol + j) * cellWidth, cellWidth, pattern[i][j]);
        //         c.key = `row-${startRow + i}-col-${startCol + j}`;
        //         board[startRow + i][startCol + j] = c;
        //     }
        // }
    }

    return {
        cells,
        board,
        cellWidth,
        columns, rows,
        insertPattern,
        parseRLE
    };
};

let ca = CA(10);
window.ca = ca;
console.log(ca);
let board = g.append('g').attr('class', 'board');
let rows = board.selectAll('.row')
    .data(ca.board)
    .enter().append('g')
    .attr('class', 'row');

function create2DArray(rows) {
    let arr = [];
    for (let i = 0; i < rows; i++) {
        arr[i] = [];
    }

    return arr;
}

// let rleString = "#C This is a glider.\nx = 3, y = 3\nbo$2bo$3o!"
let rleString = "#N Rich's p16\n#O Rich Holmes\n#C http://conwaylife.com/wiki/Rich%27s_p16\n#C http://conwaylife.com/patterns/richsp16.rle\nx = 13, y = 10, rule = B3/S23\n4bo3bo$2b2obobob2o$bo3bobo3bo$o3b2ob2o3bo$obo7bobo$bo9bo2$4b2ob2o$3bobobobo$4bo3bo!"
let gosperGliderGunRLE = `24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4bo
bo$10bo5bo7bo$11bo3bo$12b2o!`;

let p177oscRLE = `16bo12bo16b$9b2o24b2o9b$8b3o3b2o14b2o3b3o8b$14b2ob2o8b2ob2o14b$16bo12b
o16b4$2bo40bo2b$b2o40b2ob$b2o40b2ob4$2b2o38b2o2b$2b2o38b2o2b$o3bo36bo
3bo$3bo38bo3b$3bo38bo3b9$3bo38bo3b$3bo38bo3b$o3bo36bo3bo$2b2o38b2o2b$
2b2o38b2o2b4$b2o40b2ob$b2o40b2ob$2bo40bo2b4$16bo12bo16b$14b2ob2o8b2ob
2o14b$8b3o3b2o14b2o3b3o8b$9b2o24b2o9b$16bo12bo!
`;
let backrake2RLE = `3bo15b$2b3o14b$b2obo5bo8b$b3o5b3o7b$2b2o4bo2b2o3b3o$8b3o4bo2bo$18bo$
18bo$18bo$2b3o12bob$2bo2bo13b$2bo16b$2bo16b$3bo15b7$3o16b$o2bo11bo3b$o
13b3o2b$o12b2obo2b$o12b3o3b$bo12b2o!`;

let backrake2 = rleDecompress(backrake2RLE);
// console.log(s);

// let pattern = ca.parseRLE(gosperGliderGun);

// Backrake 2
// ca.insertPattern(40, 10, backrake2);

// Gosper Gun
// ca.insertPattern(10, 10, rleDecompress(gosperGliderGunRLE));

// p177 Oscillator
// ca.insertPattern(12, 12, rleDecompress(p177oscRLE));

// Backrake 1
let backrake = `5b3o11b3o5b$4bo3bo9bo3bo4b$3b2o4bo7bo4b2o3b$2bobob2ob2o5b2ob2obobo2b$b
2obo4bob2ob2obo4bob2ob$o4bo3bo2bobo2bo3bo4bo$12bobo12b$2o7b2obobob2o7b
2o$12bobo12b$6b3o9b3o6b$6bo3bo9bo6b$6bobo4b3o11b$12bo2bo4b2o5b$15bo11b
$11bo3bo11b$11bo3bo11b$15bo11b$12bobo!`;
// ca.insertPattern(40, 30, rleDecompress(backrake));

// Pulsar
let pulsar = `2b3o3b3o2b2$o4bobo4bo$o4bobo4bo$o4bobo4bo$2b3o3b3o2b2$2b3o3b3o2b$o4bob
o4bo$o4bobo4bo$o4bobo4bo2$2b3o3b3o!`;
// ca.insertPattern(10, 10, rleDecompress(pulsar));

// Noah's Ark
let noahsArk = `10bobo2b$9bo5b$10bo2bob$12b3o6$bo13b$obo12b2$o2bo11b$2b2o11b$3bo!`;
// ca.insertPattern(30, 30, rleDecompress(noahsArk));

// console.log(pattern);

function update(boardData) {
    let cells = rows.selectAll('.cell')
        .data(d => d, d => d.key);

    let t = d3.transition().duration(interval);

    // Update
    cells
        .style('fill', d => {
            // return d.state === 1 ? 'white' : 'black';
            if (d.state === 1 && d.previous === 0) {
                return 'blue';
            } else if (d.state === 0 && d.previous === 1) {
                return 'red';
            } else if (d.state === 1) {
                return 'white';
            } else if (d.state === 0) {
                return 'black';
            }
        })
        .style('opacity', 1)

    // Enter
    cells.enter().append('circle')
        .attr('class', 'cell')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', ca.cellWidth/2)
        // .attr('width', d => d.width)
        // .attr('height', d => d.width)
        .style('fill', d => {
            return d.state === 1 ? 'white' : 'black';
        });
}

window.update = update;
update(ca.board);

let newBoard = new Array(ca.rows);
for (let i = 0; i < newBoard.length; i++) {
    newBoard[i] = new Array(ca.columns);
}

function playTheGameOfLife() {
    // console.log('playing the game');
    // let newBoard = [];
    for (let i = 0; i < ca.rows; i++) {
        for (let j = 0; j < ca.columns; j++) {
            let neighbors = 0;
            let cell = ca.board[i][j];
            for (let k = i - 1; k <= i + 1; k++) {
                for (let l = j - 1; l <= j + 1; l++) {
                    let rIdx = k;
                    let cIdx = l;

                    if (k === -1) {rIdx = ca.rows - 1;}
                    else if (k === ca.rows) {rIdx = 0;}

                    if (l === -1) {cIdx = ca.columns - 1;}
                    else if (l === ca.columns) {cIdx = 0;}

                    // If we're on an edge, swap the i or j index so neighbor
                    // selection wraps around
                    // if (rIdx === -1) rIdx = ca.rows - 1;
                    // else if (rIdx === ca.rows) rIdx = 0;
                    //
                    // if (cIdx === -1) cIdx = ca.columns - 1;
                    // else if (cIdx === ca.columns) cIdx = 0;
                    // if (i === 0) rIdx = ca.rows - 1;
                    // else if (i === ca.rows - 1) rIdx = 0;
                    //
                    // if (j === 0) cIdx = ca.columns - 1;
                    // else if (j === ca.columns - 1) cIdx = 0;

                    // if (rIdx === -1) {
                    //     debugger;
                    // }
                    // if (rIdx === 3) {
                    //     debugger;
                    // }
                    // if (cIdx === -1) {
                    //     debugger;
                    // }
                    // debugger;
                    neighbors += ca.board[rIdx][cIdx].state;
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
            // newCell.previous = cell.state;

            // if (newBoard[i]) {
            newBoard[i][j] = newCell;
            // } else {
            //     newBoard[i] = [newCell];
            // }
        }
    }
    // Copy over first row and last row, since we're ignoring them for now
    // newBoard[0] = ca.board[0];
    // newBoard[ca.board.length - 1] = ca.board[ca.board.length - 1];

    // Loop through all new data, and overwrite old data
    for (let i = 1; i < ca.rows - 1; i++) {
        for (let j = 1; j < ca.columns - 1; j++) {
            ca.board[i][j].previous = ca.board[i][j].state;
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
    }, 1000);
}

main();







