import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let margin = {top: 25, right: 25, bottom: 25, left: 25},
    width = 2000 - margin.left - margin.right,
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

var doors=[];
for(let i=0; i<100; i++) {
    doors[i]=false;
}
actions.push({type: 'add', doors: doors.slice()});

for(let i=1; i<=100; i++) {
    for(let i2=i-1; i2<100; i2+=i) {
        doors[i2] = !doors[i2];
        actions.push({type: 'toggle', doors: doors.slice(), i, i2});
    }
}
for(let i=1; i<=100; i++) {
    console.log('Door %d is %s', i, doors[i-1] ? 'open' : 'closed');
}

// let colorScale = d3.scaleLinear()
//     .domain([0, max])
//     .range(['#fff7bc', '#d95f0e']);
let pathGen = d3.line()
    .x(d => d[0])
    .y(d => d[1]);
let tri = [[0, 0], [15, 0], [7.5, 15]];

let arrow = g.append('path').attr('d', pathGen(tri));
arrow.attr('transform', 'translate(0, 75)')
    .style('fill', 'orange');

function update(counter) {
    let action = actions[counter];
    let t = d3.transition().duration(interval - 10);
    console.log(action);

    let doors = g.selectAll('.door').data(action.doors, (d, i) => `door-${i}`);

    doors.enter().append('rect').attr('class', 'door')
        .attr('x', (d, i) => i * 15)
        .attr('y', 100)
        .attr('width', 13)
        .attr('height', 25)
        .style('fill',  '#e6550d')
        .style('transform-origin', '50%');

    doors
        .style('transform', d => d ? 'skewY(.3rad)' : '')
        .transition(t)
        .style('fill', d => d ? '#a1d99b' : '#e6550d');

    arrow.transition(t).attr('transform', `translate(${(action.i2 + 1) * 15}, 75)`);
}

let interval = 150;
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

