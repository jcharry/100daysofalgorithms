import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let actions = [];
window.actions = actions;
let interval = 500;

// Setup SVG
let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 1800- margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let dataColorScale = d3.scaleLinear()
    .domain([0, 11])
    .range(['#99d594', '#3288bd']);


// Bottom up version
function fibonacci(n, depth) {
    let fib = {};
    let f;
    let children = [];
    for (let i = 1; i < n + 1; i++) {
        if (i <= 2) {
            f = 1;
        } else {
            f = fib[i - 1] + fib[i - 2];
        }

        fib[i] = f;

        if (i === 1) { children = []; }
        else if (i === 2) {children = [actions[0]]}
        else {children = [actions[i - 2], actions[i - 3]]}
        actions.push({type: 'iteration', base: i, result: f, children, id: `id-${i}`});
    }
    return f;
}

window.fib = fibonacci;
let num = fibonacci(10, 1);

for (let i = 0; i < actions.length; i++) {
    let action = actions[i];
    if (i > 1) {
        action.curvePoints = [
            [i * 100 - 10, height / 2 - 20],
            [(i - 1) * 100, height / 2 - 70],
            [(i - 2) * 100 + 10, height / 2 - 20]
        ];
    }
}

let delay = 1000;
let calls = g.selectAll('.action')
    .data(actions, (d, i) => i);

let callsEnter = calls.enter().append('g');

callsEnter.append('line')
    .attr('x1', (d, i) => (i - 1) * 100 + 30)
    .attr('y1', (d, i) => height / 2 - 5)
    .attr('x2', (d, i) => (i - 1) * 100 + 30)
    .attr('y2', (d, i) => height / 2 - 5)
    .style('stroke', (d, i) => dataColorScale(i))
    .transition().duration(1000).delay((d, i) => i * delay)
    .attr('x2', (d, i) => {
        if (i < 1) { return (i - 1) * 100 + 30; }
        else { return i * 100 - 30; }
    })

let curveGenerator = d3.line()
    .x(d => d[0])
    .y(d => d[1])
    .curve(d3.curveMonotoneX)
        // d3.curveCatmullRom.alpha(0.2))

callsEnter.append('path')
    .style('stroke', (d, i) => dataColorScale(i))
    .attr('class', 'dag')
    .attr('d', (d, i) => {
        if (d.curvePoints) {
            let path = curveGenerator(d.curvePoints);
            return path;
        }
    })
    .style('opacity', 1e-6)
    .transition().duration(1000).delay((d, i) => i * delay)
    .style('opacity', 1)

callsEnter
    .append('text')
    .attr('x', (d, i) => i * 100)
    .attr('y', (d, i) => height / 2)
    .style('opacity', 1e-6)
    .transition().duration(1000).delay((d, i) => i * delay)
    .style('opacity', 1)
    .text(d => `fib(${d.base})`);

callsEnter
    .append('text')
    .attr('x', (d, i) => i * 100)
    .attr('y', (d, i) => height / 2 + 20)
    .style('opacity', 1e-6)
    .transition().duration(1000).delay((d, i) => i * delay)
    .style('opacity', 1)
    .text(d => d.result)


function update(action) {

}

window.update = update;

function main() {
    let counter = 0;
    setTimeout(() => {
        d3.interval(() => {
            if (actions[counter]) {
                update(actions[counter]);
            }
            counter++;
        }, interval);
    }, 1000);
}

main();
