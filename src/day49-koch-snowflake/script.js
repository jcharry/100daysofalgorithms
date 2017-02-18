import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');
import vector, {Vector} from 'vector-js';

let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let colorScale = d3.scaleLinear()
    .domain([0, 7])
    .range(['#0c2c84', '#41b6c4']);

let actions = [];

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// let lines = [];
let baselineY = height / 2;
function kochLine(start, end, gen) {
    return {
        start,
        end,
        gen
    };
}

kochLine.getA = function(start, end) {
    return start.clone();
}
kochLine.getB = function(start, end) {
    let line = end.clone();
    line.subtract(start);
    line.multiply(1/3);
    line.add(start);
    return line;
}
kochLine.getC = function(start, end) {
    let s = start.clone();
    let l = Vector.subtract(end, start);
    l.multiply(1/3);
    s.add(l);
    l.rotate(-Math.PI / 3);
    l.add(s);
    return l;
}

kochLine.getD = function(start, end) {
    let line = end.clone();
    line.subtract(start);
    line.multiply(2/3);
    line.add(start);
    return line;
}
kochLine.getE = function(start, end) {
    return end.clone();
}

const getLength = function(start, end) {
    return Math.sqrt((end.x - start.x) * (end.x - start.x) + (end.y - start.y) * (end.y - start.y));
};

// Initialize with a starting line
function makeSnowflake(cx, cy, size, gen) {
    let snowflakeLines = [];
    snowflakeLines.push(kochLine(
        vector(cx - size / 2, cy),
        vector(cx, cy - size / 2)
    ));
    snowflakeLines.push(kochLine(
        vector(cx, cy - size / 2),
        vector(cx + size / 2, cy)
    ));
    snowflakeLines.push(kochLine(
        vector(cx + size / 2, cy),
        vector(cx, cy + size / 2)
    ));
    snowflakeLines.push(kochLine(
        vector(cx, cy + size / 2),
        vector(cx - size / 2, cy)
    ));

    return kochCurve(snowflakeLines, gen);

    // return snowflakeLines;
}

function drawSnowflake(lines) {
    g.selectAll('line').data(lines).enter().append('line')
        .attr('class', 'koch-line')
        .attr('x1', d => d.start.x)
        .attr('y1', d => d.start.y)
        .attr('x2', d => d.end.x)
        .attr('y2', d => d.end.y)
        .style('stroke', 'black');
}

// Draw a few snowflakes
for (let i = 0; i < 6; i++) {
    let sLines = makeSnowflake(width / 2, height / 2, i * 130 + 40, i);
    // drawSnowflake(sLines);
}

function kochCurve(lines, numGenerations) {
    // For each line, we need 4 new lines to make up the koch curve
    let nextLines = [];

    for (let i = 0; i < numGenerations; i++) {
        lines.forEach(line => {
            let a = kochLine.getA(line.start, line.end);
            let b = kochLine.getB(line.start, line.end);
            let c = kochLine.getC(line.start, line.end);
            let d = kochLine.getD(line.start, line.end);
            let e = kochLine.getE(line.start, line.end);

            nextLines.push(kochLine(a, b));
            nextLines.push(kochLine(b, c));
            nextLines.push(kochLine(c, d));
            nextLines.push(kochLine(d, e));
        });
        lines = nextLines;
    }
    actions.push({type: 'lines', lines: clone(lines)});
    return lines;
}

// let numGenerations = 5;
// for (let i = 0; i < numGenerations; i++) {
//     kochCurve(i);
// }
// console.log(lines);
console.log('actions', actions);

// let lineGenerator = d3.line()
//     .x(d => d.start.x)
//     .y(d => d.start.y);

// g.append('path'); //.attr('d', lineGenerator(lines));
// g.selectAll('.koch-line').data(lines, (d, i) => i).enter()
//     .append('path')

let update = function(action) {
    console.log('update with action: ', action);
    let t = d3.transition().duration(interval);
    let l = g.selectAll('.koch-line').data(action.lines);
    console.log(action.generation);

    // Enter
    l.enter().append('line')
        .attr('class', 'koch-line')
        .attr('x1', d => d.start.x - 10)
        .attr('y1', d => d.start.y - 10)
        .attr('x2', d => d.end.x + 10)
        .attr('y2', d => d.end.y + 10)
        .transition(t)
        .attr('x1', d => d.start.x)
        .attr('y1', d => d.start.y)
        .attr('x2', d => d.end.x)
        .attr('y2', d => d.end.y)
        .style('stroke', 'black');
        // .attr('x2', d => d.end.x)
        // .attr('y2', d => d.end.y)

    // Update
    // l.attr('x1', d => d.start.x)
    //     .attr('y1', d => d.start.y)
    //     .attr('x2', d => d.end.x)
    //     .attr('y2', d => d.end.y)
        // .transition(t)
        // .attr('x2', d => d.end.x)
        // .attr('y2', d => d.end.y)
    // g.select('path').attr('d', lineGenerator(action.lines));
};

let counter = 0;
let interval = 1000;
let main = function() {
    setTimeout(() => {
        d3.interval(() => {
            if (actions[counter]) {
                update(actions[counter]);
            }
            counter++;
        }, interval);
    }, 1000);
};

main();
