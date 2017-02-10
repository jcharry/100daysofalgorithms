import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let actions = [];
window.actions = actions;
let interval = 800;

// Setup SVG
let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let dataColorScale = d3.scaleLinear()
    .domain([0, 200])
    .range(['#fff7f3', '#7a0177']);

// Clones simple objects of primitives
// may not work on complex hierarchies
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// A Dynamic Programming based C++ program to find minimum
// number operations to convert str1 to str2


// Returns the maximum value that can be put in a knapsack of capacity W
let W = 50;
let val = d3.range(50).map(d => Math.floor(Math.random() * 50)); //[60, 100, 120];
let wt = val.map(v => Math.floor(Math.random() * 50));

// let val = [60, 100, 120];
// let wt = [10, 20, 30];
let n = val.length; // /sizeof(val[0]);

let K = [];
for (let i = 0; i < n + 1; i++) {
    K[i] = new Array(W + 1);
}
function knapSack(W, wt, val, n) {
    // Build table K[][] in bottom up manner
    for (let i = 0; i <= n; i++) {
        for (let w = 0; w <= W; w++) {
            if (i === 0 || w === 0) {
                K[i][w] = 0;
            }
            else if (wt[i-1] <= w) {
                K[i][w] = Math.max(val[i-1] + K[i-1][w-wt[i-1]],  K[i-1][w]);
            }
            else {
                K[i][w] = K[i-1][w];
            }
        }
    }


    return K[n][W];
}

let weight = knapSack(W, wt, val, n);
console.log(weight);

let t = d3.transition().duration(1500).delay((d, i) => i * 30);

let cellSize = height / val.length;
// let text = g.selectAll('.labels').data(d3.range(51)).enter().append('text')
//     .attr('x', (d, i) => i * cellSize)
//     .text(d => d);
let row = g.selectAll('.col').data(K, (d, i) => i).enter().append('g')
    .attr('class', 'col')
    .attr('transform', (d, i) => `translate(${i * cellSize}, 0)`);

row.selectAll('.cell').data(d => d, (d, i) => `${i}-${d}`).enter().append('rect')
    .attr('class', 'cell')
    .transition(t)
    .attr('x', 0)
    .attr('y', (d, i) => i * cellSize)
    .attr('width', cellSize).attr('height', cellSize)
    .style('fill', d => dataColorScale(d));

function update(counter) {

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
