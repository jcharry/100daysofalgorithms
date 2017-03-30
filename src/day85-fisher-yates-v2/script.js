import * as d3 from 'd3';
require('./styles.css');

let data = d3.range(100);

let actions = [{arr: data.slice(), diff: []}];
function shuffle(array) {
    let m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
        actions.push({
            arr: array.slice(),
            diff: [i, m]
        });
    }
    return array;
}

shuffle(data.slice());

let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 900 - margin.left - margin.right,
    height = 2000 - margin.top - margin.bottom;

let svg = d3.select('#svg-container').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Background
let rect = g.append('rect')
    .attr('x', -50)
    .attr('y', -50)
    .attr('width', 900)
    .attr('height', 2000)
    .style('fill', '#143038');


function map(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

const colorScale = d3.scaleLinear()
    .domain([0, 50, 100])
    .range(['#f1a340','#f7f7f7','#998ec3']);
actions.forEach((action, row) => {
    let r = g.selectAll(`row-${row}`)
        .data(action.arr);

    r.enter().append('rect')
        .attr('width', 1)
        .attr('height', 13)
        .attr('transform', (d, i) => {
            let angle = map(d, 0, 100, -45, 45);
          return `translate(${i * 8}, ${row * 15}) rotate(${angle})`;
        })
        .style('fill', (d, i) => {
            if (i === action.diff[0] || i === action.diff[1]) {
                return '#D13046';
            } else {
                return colorScale(d);
            }
        });
});
