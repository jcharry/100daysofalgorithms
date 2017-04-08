import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let margin = {top: 100, right: 25, bottom: 0, left: 25},
    width = 1800 - margin.left - margin.right,
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

function findNextSmallerElem(source) {
    let length = source.length;
    let outPut = [...Array(length)].map(() => -1);
    let stack = [];
    for(let i = 0 ; i < length ; i++) {
        actions.push({type: 'iterate', stack: stack.slice(), output: outPut.slice(), i});
        let stackTopVal = stack[ stack.length - 1] && stack[ stack.length - 1].val;

        // If stack is empty or current elem is greater than stack top
        if(!stack.length || source[i] > stackTopVal ) {
            stack.push({ val: source[i], ind: i} );
            actions.push({type: 'greater-than', stack: stack.slice(), output: outPut.slice(), i});
        } else {
            // While stacktop is greater than current elem , keep popping
            while( source[i] < (stack[ stack.length - 1] && stack[ stack.length - 1].val) ){
                outPut[stack.pop().ind] = source[i];
                actions.push({type: 'less-than', stack: stack.slice(), output: outPut.slice(), i});
            }
            stack.push({ val: source[i], ind: i} );
            actions.push({type: 'push', stack: stack.slice(), output: outPut.slice(), i});
        }
    }
    return outPut;
}

function rndInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let sourceArray = d3.range(40);
sourceArray = sourceArray.map(n => rndInt(0, 100));
console.log(sourceArray);
let res = findNextSmallerElem(sourceArray);
console.log(res);
console.log(actions);

const widthScale = d3.scaleLinear()
    .domain([-1, 100])
    .range([5, 20]);
let colorScale = d3.scaleLinear()
    .domain([-1, 100])
    .range(['#fc8d59', '#99d594']);

let pathGen = d3.line()
    .x(d => d[0])
    .y(d => d[1]);
let tri = [[0, 0], [15, 0], [7.5, 15]];
let arrow = g.append('path').attr('d', pathGen(tri));
arrow.attr('transform', 'translate(0, -20)')
    .style('fill', 'orange');

g.append('text').text('Input')
    .attr('x', 0)
    .attr('y', -25);
g.append('text').text('Output')
    .attr('x', 0)
    .attr('y', 75);
g.append('text').text('Stack')
    .attr('x', 0)
    .attr('y', 175);

function update(counter) {
    let action = actions[counter];
    let t = d3.transition().duration(interval - 10);
    let spacing = 20;

    const input = g.selectAll('.input').data(sourceArray);
    const stack = g.selectAll('.stack').data(action.stack, (d, i) => `${i}-stack`);
    const output = g.selectAll('.output').data(action.output, (d, i) => `${i}-output`);

    arrow.transition(t).attr('transform', `translate(${(action.i) * spacing}, -20)`);
    input.enter().append('rect')
        .attr('class', 'input')
        .attr('x', (d, i) => i * spacing)
        .attr('y', 0)
        .attr('width', d => widthScale(d))
        .attr('height', d => widthScale(d))
        .style('fill', d => colorScale(d));

    stack.enter().append('rect')
        .attr('class', 'stack')
        .attr('x', (d, i) => i * spacing)
        .attr('y', 200)
        .attr('width', d => widthScale(d.val))
        .attr('height', d => widthScale(d.val))
        .style('fill', d => colorScale(d.val));

    stack.exit().remove();
    console.log(action);

    output.enter().append('rect')
        .attr('class', 'output')
        .attr('x', (d, i) => i * spacing)
        .attr('y', 100)
        .attr('width', d => widthScale(d))
        .attr('height', d => widthScale(d))
        .style('fill', d => colorScale(d));

    output.exit().remove();

    output.attr('width', d => widthScale(d))
        .attr('height', d => widthScale(d));




}

let interval = 300;
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

