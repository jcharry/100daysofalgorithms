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

const N = 8;

/* A utility function to check if i,j are valid indexes
   for N*N chessboard */
function isSafe(x, y, sol) {
    return ( x >= 0 && x < N && y >= 0 &&
             y < N && sol[x][y] == -1);
}

/* A utility function to print solution matrix sol[N][N] */
function printSolution(sol) {
    for (let x = 0; x < N; x++) {
        for (let y = 0; y < N; y++) {
            console.log(sol[x][y]);
        }
        console.log('\n');
    }
}

/* This function solves the Knight Tour problem using
   Backtracking.  This function mainly uses solveKTUtil()
   to solve the problem. It returns false if no complete
   tour is possible, otherwise return true and prints the
   tour.
   Please note that there may be more than one solutions,
   this function prints one of the feasible solutions.  */
let sol = new Array(N);
for (let i = 0; i < N; i++) {
    sol[i] = new Array(N);
}
window.sol = sol;
function solveKT() {
    /* Initialization of solution matrix */
    for (let x = 0; x < N; x++) {
        for (let y = 0; y < N; y++) {
            sol[x][y] = -1;
        }
    }

    /* xMove[] and yMove[] define next move of Knight.
       xMove[] is for next value of x coordinate
       yMove[] is for next value of y coordinate */
    let xMove = [2, 1, -1, -2, -2, -1, 1, 2];
    let yMove = [1, 2, 2, 1, -1, -2, -2, -1];

    // Since the Knight is initially at the first block
    sol[0][0] = 0;

    /* Start from 0,0 and explore all tours using
       solveKTUtil() */
    if (solveKTUtil(0, 0, 1, sol, xMove, yMove) == false) {
        console.log('Solution does not exist');
        return false;
    } else {
        printSolution(sol);
    }

    return true;
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/* A recursive utility function to solve Knight Tour
   problem */
// let counter = 0;
function solveKTUtil(x, y, movei, sol, xMove, yMove) {
   let k, nextX, nextY;
   if (movei == N*N) {
       return true;
   }

   /* Try all next moves from the current coordinate x, y */
   for (k = 0; k < 8; k++) {
       nextX = x + xMove[k];
       nextY = y + yMove[k];
       if (isSafe(nextX, nextY, sol)) {
           sol[nextX][nextY] = movei;
           // actions.push({type: 'try', nextX, nextY, x, y, sol: clone(sol), xMove, yMove});
           // counter++;
           if (solveKTUtil(nextX, nextY, movei+1, sol, xMove, yMove) == true) {
               // counter++;
               return true;
           } else {
               // actions.push({type: 'backtrack', nextX, nextY, x, y, sol: clone(sol), xMove, yMove});
               sol[nextX][nextY] = -1; // backtracking
           }
       }
   }

   return false;
}

solveKT();
// console.log(counter);

let squareWidth = width / 8;
let grid = g.selectAll('.row').data(sol).enter().append('g').attr('class', 'row')
    .attr('transform', (d, i) => `translate(0, ${i * squareWidth})`);
let square = grid.selectAll('.square').data(d => d, (d, i) => d).enter().append('rect').attr('class', 'square');

square.attr('x', (d, i) => (i % 8) * squareWidth)
    .attr('y', (d, i) => Math.floor(i / 8) * squareWidth)
    .attr('width', squareWidth)
    .attr('height', squareWidth)
    .style('fill', (d, i) => 'transparent')
    .style('stroke', 'rgba(120, 120, 120, 1)');

let colorScale = d3.scaleLinear()
    .domain([0, 63])
    .range(['#f768a1', '#49006a']);
let squareColorScale = d3.scaleLinear()
    .domain([0, 63])
    .range(['#7fcdbb', '#2c7fb8']);

function update(counter) {
    console.log(counter);
    let t = d3.transition().duration(interval);
    square.transition(t)
        .style('fill', (d, i) => {
        if (d <= counter) {
            return squareColorScale(counter);
        } else {
            return 'transparent';
        }
    });

    if (counter > 0) {
        // Find this square and next square
        let startX, startY, endX, endY;
        for (let i = 0; i < sol.length; i++) {
            for (let j = 0; j < sol[i].length; j++) {
                if (sol[i][j] === counter) {
                    endX = j;
                    endY = i;
                }
                if (sol[i][j] === counter - 1) {
                    startX = j;
                    startY = i;
                }
            }
        }

        g.append('line')
            .attr('x1', startX * squareWidth + squareWidth / 2)
            .attr('y1', startY * squareWidth + squareWidth / 2)
            .attr('x2', startX * squareWidth + squareWidth / 2)
            .attr('y2', startY * squareWidth + squareWidth / 2)
            .style('stroke', colorScale(counter))
            .style('stroke-width', '2px')
            .transition(t)
            .attr('x2', endX * squareWidth + squareWidth / 2)
            .attr('y2', endY * squareWidth + squareWidth / 2);
    }
}

let interval = 200;
function main() {
    let counter = 0;
    setTimeout(() => {
        d3.interval(() => {
            if (counter < 64) {
                update(counter);
                counter++;
            }
        }, interval);
    }, 1000);
}

main();

