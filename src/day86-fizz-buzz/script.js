import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let margin = {top: 100, right: 100, bottom: 100, left: 100},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g').attr('class', 'svg-group')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let actions = [];
window.actions = actions;

function rnd(min, max) {
    return Math.random() * (max - min) + min;
}
function rndInt(min, max) {
    return Math.floor(rnd(min, max));
}

// Create a bunch of random points
function point(x, y) {
    return { x, y };
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

let data = d3.range(100);

function fizzbuzz(numbers) {
    let ret = numbers.slice();
    for (let i = 0; i < numbers.length; i++) {
        let n = numbers[i];
        if (i == 0) {
            ret[i] = 0;
        } else if (n % 3 === 0 && n % 5 === 0) {
            ret[i] = 'fizzbuzz';
        } else if (n % 3 === 0) {
            ret[i] = 'fizz';
        } else if (n % 5 === 0) {
            ret[i] = 'buzz';
        } else {
            ret[i] = n;
        }

        let action = {type: 'iterate', i, result: ret[i], data: ret.slice()};
        actions.push(action);
    }
    return ret;
}

console.log(fizzbuzz(data));

// function that tries every possible solution by calling itself recursively
// let min = Infinity;
// let max = -Infinity;
// txt.split('').forEach(char => {
//     let charCode = char.charCodeAt(0);
//     if (charCode < min) min = charCode;
//     if (charCode > max) max = charCode;
// });

// let heightScale = d3.scaleLinear()
//     .domain([min, max])
//     .range([50, 200]);
//     // .range(['#fc8d59', '#99d594']);
// let colorScale = d3.scaleLinear()
//     .domain([min, max])
//     .range(['#fc8d59', '#99d594']);


const cellSize = 30;
let text = g.append('text');
function update(counter) {
    let t = d3.transition().duration(interval);
    let action = actions[counter];
    console.log(action);

    let circles = g.selectAll('.circle').data(action.data, (d, i) => i);

    let r = 300
    let angleStep = Math.PI * 2 / data.length;
    let angles = data.map((d, i) => i * angleStep);
    circles.enter().append('circle').attr('class', 'circle')
        .attr('cx', (d, i) => width / 2 + r * Math.cos(angles[i]))
        .attr('cy', (d, i) => height / 2 + r * Math.sin(angles[i]))
        .attr('r', (d, i) => i === action.i ? 10 : 5)
        .style('fill', (d, i) => i === action.i ? 'green' : 'blue');

    circles
        .attr('r', (d, i) => i === action.i ? 10 : 5)
        .style('fill', (d, i) => i === action.i ? 'green' : 'blue');

    text.datum(action.result).text(d => d)
        .style('opacity', 1e-6)
        .attr('x', width / 2)
        .attr('y', height / 2 + 30)
        .style('font-size', '24pt')
        .style('fill', d => {
            if (d === 'fizz') {
                return 'red';
            } else if (d === 'buzz') {
                return 'blue';
            } else if (d === 'fizzbuzz') {
                return 'orange';
            } else {
                return 'black';
            }
        })
    .transition().duration(interval / 2.1)
        .style('opacity', 1)
        .attr('y', height / 2)
        .style('font-size', d => {
            if (d === 'fizz' || d === 'buzz' ) {
                return '64pt';
            }else if (d === 'fizzbuzz') {
                return '120pt';
            } else {
                return '24pt';
            }
        })
    .transition().duration(interval / 2.1)
        .style('opacity', 1e-6)
        .attr('y', height / 2)
        // .style('font-size', '12pt')
}

let interval = 1000;
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

