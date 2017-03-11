import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let margin = {top: 100, right: 100, bottom: 100, left: 100},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

const xScale = d3.scaleLinear()
    .domain([0, 160])
    .range([0, width]);
const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([height, 0]);
let axisBottom = d3.axisBottom(xScale)
    // .tickFormat(d3.format('.0%'));
let axisLeft = d3.axisLeft(yScale)
    .tickFormat(d3.format('.0%'));

let g = svg.append('g').attr('class', 'svg-group')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let leftAxis = g.append('g').call(axisLeft);
let bottomAxis = g.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(axisBottom)
let bottomLabel = bottomAxis.append('text')
    .attr('class', 'axis-label')
    .text('Number of People')
    .attr('x', width / 2)
    .attr('y', 40);
let leftLabel = leftAxis.append('text')
    .attr('class', 'axis-label')
    .text('% chance that 2 people have same birthday')
    .attr('transform', `translate(${-margin.left / 2}, ${height / 2}) rotate(-90)`)
window.g = g;

let interval = 1200;
let actions = [];
window.actions = actions;

function find(p) {
    return Math.ceil(Math.sqrt(2*365*Math.log(1/(1-p))));
}

let data = [];
for (let i = 0; i < 1; i+=.01) {
    data.push({x: find(i), y: i});
    // console.log(`prob: ${i}, people: ${find(i)}`);
}
data.push({x: find(.999999999999999), y: 1});
console.log(data);

let line = d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));

g.append('path')
    .attr('d', line(data));

function update(action, counter) {
    let t = d3.transition().duration(interval);
    switch(action.type) {
    }
}

function main() {
    let counter = 0;
    setTimeout(() => {
        d3.interval(() => {
            if (actions[counter]) {
                update(actions[counter], counter);
                counter++;
            }
        }, interval);
    }, 1000);
}

main();

