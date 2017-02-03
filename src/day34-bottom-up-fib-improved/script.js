import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let actions = [];
window.actions = actions;
let interval = 1500;

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


// Clones simple objects of primitives
// may not work on complex hierarchies
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

let fi = [
    {id: 1, val: 1, visible: false},
    {id: 2, val: 1, visible: false},
    {id: 3, val: 2, visible: false},
    {id: 4, val: 3, visible: false},
    {id: 5, val: 5, visible: false},
    {id: 6, val: 8, visible: false},
    {id: 7, val: 13, visible: false},
    {id: 8, val: 21, visible: false},
    {id: 9, val: 34, visible: false},
    {id: 10, val: 55, visible: false}
];

fi.forEach((f, i) => {
    if (i >= 2) {
        f.curvePoints = [
            [i * 100 - 10, height / 2 - 20],
            [(i - 1) * 100, height / 2 - 70],
            [(i - 2) * 100 + 10, height / 2 - 20]
        ];
    }

})
let delay = 1000;

function update(counter) {
    console.log(counter);

    console.log(fi[counter]);

    let curveGenerator = d3.line()
        .x(d => d[0])
        .y(d => d[1])
        .curve(d3.curveMonotoneX)

    // Data join
    let calls = g.selectAll('.action')
        .data(fi, (d, i) => d.id);

    // Enter
    let callsEnter = calls.enter().append('g')
        .attr('class', 'action');

    callsEnter
        .append('text')
        .attr('class', 'value')
        .style('opacity', 0)
        .attr('x', (d, i) => i * 100)
        .attr('y', (d, i) => height / 2)
        .text(d => d.val);

    callsEnter.append('line')
        .attr('class', 'val-line')
        .style('opacity', 1e-6)
        .style('stroke', (d, i) => dataColorScale(i))
        .attr('x1', (d, i) => i * 100 + 10)
        .attr('y1', height / 2 - 5)
        .attr('y2', height / 2 - 5)
        .attr('x2', (d, i) => {
            if (i === fi.length - 1) { return i * 100 + 10; }
            return (i + 1) * 100 - 10;
        });

    callsEnter.append('path')
        .style('stroke', (d, i) => dataColorScale(i))
        .attr('class', 'dag')
        .style('opacity', 1e-6)
        .attr('d', (d, i) => {
            if (d.curvePoints) {
                let path = curveGenerator(d.curvePoints);
                return path;
            }
        });

    // Text update
    g.selectAll('.value')
        // .style('opacity', 1e-6)
        .transition().duration(interval)
        .style('opacity', (d, i) => d.visible ? 1 : 1e-6)

    // Line update
    g.selectAll('.val-line')
        .transition().duration(interval)
        // .style('opacity', (d, i) => d.visible ? 1 : 1e-6);
        .attr('x1', (d, i) => i !== counter ? (i + 1) * 100 - 10 : i * 100 + 10)
        .style('opacity', (d, i) => {
            return i === counter ? 1 : 1e-6;
        });

    g.selectAll('.dag')
        .transition().duration(interval)
        .style('opacity', (d, i) => (i - 1) === counter ? 1 : 1e-6);
}

//
// window.update = update;
//
function getDistance(c, i) {
    return Math.abs(c - i);
}
function main() {
    let counter = 0;
    setTimeout(() => {
        d3.interval(() => {
            if (counter < fi.length - 1) {
                fi.forEach((f, i) => {
                    if (getDistance(counter, i) > 1) {
                        f.visible = false;
                    } else {
                        f.visible = true;
                    }
                })
                update(counter);
            }
            counter++;
        }, interval);
    }, 1000);
}

main();

// function fibonacci(n, depth) {
//     let fib = [];
//     let f;
//     let children = [];
//     for (let i = 1; i < n + 1; i++) {
//         if (i <= 2) {
//             f = 1;
//             fib[0] = fib[1] = f;
//             actions.push({counter: i, result: f, data:clone(fib)});
//         } else {
//             f = fib[0] + fib[1];
//
//             // shift the indices down
//             fib[0] = fib[1];
//             fib[1] = f;
//             actions.push({counter: i, result: f, data:clone(fib)});
//         }
//
//
//         if (i === 1) { children = []; }
//         else if (i === 2) {children = [actions[0]]}
//         else {children = [actions[i - 2], actions[i - 3]]}
//     }
//     return f;
// }
