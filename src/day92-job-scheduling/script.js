import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let margin = {top: 100, right: 100, bottom: 100, left: 100},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let canvas = d3.select('body').append('canvas')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);
    // .attr('transform', `translate(${margin.left}, ${margin.top})`);
let ctx = canvas.node().getContext('2d');

let g = svg.append('g').attr('class', 'svg-group')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let actions = [];
window.actions = actions;

// Prints a maximum set of activities that can be done by a single
// person, one at a time.
//  n   -->  Total number of activities
//  s[] -->  An array that contains start time of all activities
//  f[] -->  An array that contains finish time of all activities
function printMaxActivities(s, f, n) {
    let i, j;

    console.log("Following activities are selected \n");

    // The first activity always gets selected
    i = 0;
    console.log(`${i}`);

    // Consider rest of the activities
    for (j = 1; j < n; j++) {
        // If this activity has start time greater than or
        // equal to the finish time of previously selected
        // activity, then select it
        actions.push({type: 'try', s: s.slice(), f: f.slice(), n, i, j});

        if (s[j] >= f[i]) {
            console.log(j);
            i = j;
            actions.push({type: 'next', s: s.slice(), f: f.slice(), n, i, j});
        }
    }
}

// driver program to test above function
// let s =  [0, 45, 20, 65, 150, 65];
// let f =  [40, 60, 70, 100, width, width];
let s =  [1, 3, 0, 5, 8, 5];
let f =  [2, 4, 6, 7, 9, 9];
s = s.map(s => s * 60);
f = f.map(f => f * 60);
let max = s.reduce((acc, curr) => {
    if (curr > acc) {
        acc = curr;
    }
    return acc;
}, 0);

let n = s.length;

printMaxActivities(s, f, n);

let colorScale = d3.scaleLinear()
    .domain([0, max])
    .range(['#fff7bc', '#d95f0e']);
function update(counter) {
    let action = actions[counter];
    console.log(action);

    let jobs = g.selectAll('.job').data(action.s, (d, i) => `start-${i}`);
    // let finish = g.selectAll('.finish').data(action.f, (d, i) => `finish-${i}`);

    jobs.enter().append('rect')
        .attr('class', 'job')
        .attr('x', (d, i) => action.s[i])
        .attr('y', (d, i) => i * 20)
        .attr('width', (d, i) => action.f[i] - action.s[i])
        .attr('height', 10)
        .style('fill', (d, i) => {
            if (i === action.i) {
                return 'green';
            }

            return colorScale(action.s[i]);
        });

    jobs.style('fill', function(d, i) {
        if (i === action.i) {
            return 'green';
        }

        return this.style.fill;
    });
}

let interval = 100;
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

