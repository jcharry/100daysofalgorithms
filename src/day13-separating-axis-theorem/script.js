import * as d3 from 'd3';
// import BSArray from './BSArray';
// import BBTree from './BBTree';
require('./styles.scss');
import polygon from './Polygon';
import SAT from './SAT';
import vector, {Vector} from './Vector';

// Setup SVG
let actions = [];
window.actions = actions;
let margin = {top: 50, right: 50, bottom: 50, left: 200},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

function update(action, counter) {
    console.log('running action ' + counter);
    switch (action.type) {
        case 'sweepline-left':
        case 'sweepline-right':
            updateSweepline(action.x);
            break;
        case 'active-list':
            updateActiveList(action.activeList);
            break;
    }
}

let colors = {
    p1: 'green',
    p2: 'cyan'
};
let p1 = polygon({
    x: 100,
    y: 200,
    vertices: [
        {x: 0, y: 0},
        {x: 100, y: 0},
        {x: 100, y: 100},
        {x: 0, y: 100}
        // {x: 0, y: 0},
        // {x: 100, y: 40},
        // {x: 85, y: 65},
        // {x: 42, y: 84},
    ],
    rotation: 0,
    id: 'poly1',
    angularVelocity: Math.random() * 0.02 - 0.01,
    strokeStyle: colors.p1,
    lineWidth: 2
});
// p1.type = 'rectangle';
let p2 = polygon({
    x: 400,
    y: 300,
    vertices: [
        {x: 0, y: 0},
        {x: 100, y: 0},
        {x: 60, y: 65},
        {x: -20, y: 30}
    ],
    // rotation: .9,
    id: 'poly2',
    angularVelocity: Math.random() * 0.02 - 0.01,
    strokeStyle: colors.p2,
    lineWidth: 2
});
window.p1 = p1;
window.p2 = p2;

let interval = 1000;
function startLoop() {
    let i = 0;
    let loop = setInterval(() => {
        console.log('iteration number', i, 'num actions', actions.length);
        if (actions[i]) {
            update(actions[i], i);
        }
        if (actions.length === i) {
            finish();
            window.clearInterval(loop);
        }
        i++;
    }, interval);
}

function finish() {
    console.log('done!');
}

function drawLine(line, color, parent, dur) {
    parent = parent === undefined ? g : parent;
    dur = dur === undefined ? interval : dur;
    color === undefined ? 'magenta' : color;

    let t = d3.transition()
        .duration(dur);

    let clr = line.intersects ? 'green' : 'magenta';
    parent.append('line')
        .classed('segment', true)
        .style('stroke', clr)
        .attr('x1', line.p1.x)
        .attr('x2', line.p1.x)
        .attr('y1', line.p1.y)
        .attr('y2', line.p1.y)
        .transition(t)
        .attr('y2', line.p2.y)
        .attr('x2', line.p2.x);
}

function drawLines(lines) {
    lines.forEach(line => {
        drawLine(line);
    });
}

function drawPoints(points) {
    let ps = g.selectAll('.point')
        .data(points);

    ps.enter().append('circle')
        .classed('point', true)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 0)
        .transition()
        .duration(interval)
        .attr('r', 5);
}

let lineGenerator = d3.line()
    .x(d => d.x)
    .y(d => d.y);

let poly1 = g.append('path')
    .datum(p1)
    .attr('d', lineGenerator(p1.vertices))
    .classed('p1', true);

let poly2 = g.append('path')
    .datum(p2)
    .attr('d', lineGenerator(p2.vertices))
    .classed('p2', true);

let {axes } = SAT.polypoly(p1, p2);
let p1Axes = g.selectAll('.axes-p1')
    .data(p1.axes, d => d.id);
let p2Axes = g.selectAll('.axes-p2')
    .data(p2.axes, d => d.id);
p1Axes.enter().append('line')
    .classed('axes-p1', true)
    .attr('x1', d => d.x * 1000)
    .attr('x2', d => d.x * -1000)
    .attr('y1', d => d.y * 1000)
    .attr('y2', d => d.y * -1000)
    .attr('transform', d => {
        // let normal = Vector.perp(d).multiply(300);
        // return `translate(${width / 2}, ${height / 2})`
    });
p2Axes.enter().append('line')
    .classed('axes-p2', true)
    .attr('x1', d => d.x * 1000)
    .attr('x2', d => d.x * -1000)
    .attr('y1', d => d.y * 1000)
    .attr('y2', d => d.y * -1000)
    .attr('transform', d => {
        // let normal = Vector.perp(d).multiply(300);
        // return `translate(${width / 2}, ${height / 2})`
    });

let p1Projections = g.selectAll('.prj-p1')
    .data(p1.axesProjections, d => d.axis.id);
let p2Projections = g.selectAll('.prj-p2')
    .data(p2.axesProjections, d => d.axis.id);

p1Projections.enter().append('line')
    .classed('prj-p1', true)
    .attr('x1', d => d.min * d.axis.x)
    .attr('y1', d => d.min * d.axis.y)
    .attr('x2', d => d.max * d.axis.x)
    .attr('y2', d => d.max * d.axis.y)
    .attr('transform', d => {
        // let normal = Vector.perp(d).multiply(300);
        // return `translate(${width / 2 + normal.x}, ${height / 2 + normal.y})`
        // return `translate(${width / 2}, ${height / 2})`
    });
p2Projections.enter().append('line')
    .classed('prj-p2', true)
    .attr('x1', d => d.min * d.axis.x)
    .attr('y1', d => d.min * d.axis.y)
    .attr('x2', d => d.max * d.axis.x)
    .attr('y2', d => d.max * d.axis.y)
    .attr('transform', d => {
        // let normal = Vector.perp(d.axis);
        // return `translate(${width / 2}, ${height / 2})`
        // return `translate(${width / 2}, ${height / 2})`
    });

function redraw() {
    window.requestAnimationFrame(redraw);
    // p1.position.x += 0.1;
    // p1.position.y += 0.1;
    // p1.rotation += 0.001;
    // p2.position.x += -0.1;
    // p2.position.y += 0.1;
    // p2.rotation += 0.01;
    // p1.updateVertices();
    // p2.updateVertices();

    let {collision} = SAT.polypoly(p1, p2);

    poly1.attr('d', lineGenerator(p1.vertices))
        .classed('p1', true)
        .classed('colliding', collision);
    poly2.attr('d', lineGenerator(p2.vertices))
        .classed('p2', true)
        .classed('colliding', collision);

    let p1axes = g.selectAll('.axes-p1').data(p1.axes, d => d.id);
    let p2axes = g.selectAll('.axes-p2').data(p2.axes, d => d.id);

    p1axes.attr('x1', d => d.x * 1000)
        .attr('x2', d => d.x * -1000)
        .attr('y1', d => d.y * 1000)
        .attr('y2', d => d.y * -1000)
        .attr('transform', d => {
            // let normal = Vector.perp(d).multiply(300);
            // return `translate(${width / 2}, ${height / 2})`
        });
    p2axes.attr('x1', d => d.x * 1000)
        .attr('x2', d => d.x * -1000)
        .attr('y1', d => d.y * 1000)
        .attr('y2', d => d.y * -1000)
        // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('transform', d => {
            // let normal = Vector.perp(d).multiply(300);
            // return `translate(${width / 2}, ${height / 2})`
        });

    let p1projections = g.selectAll('.prj-p1')
        .data(p1.axesProjections, d => d.axis.id);
    let p2projections = g.selectAll('.prj-p2')
        .data(p2.axesProjections, d => d.axis.id);
    p1projections.attr('x1', d => d.min * d.axis.x)
        .attr('y1', d => d.min * d.axis.y)
        .attr('x2', d => d.max * d.axis.x)
        .attr('y2', d => d.max * d.axis.y)
        .attr('transform', d => {
            // let normal = Vector.perp(d.axis);
            // return `translate(${width / 2}, ${height / 2})`
        });
    //
    p2projections.attr('x1', d => d.min * d.axis.x)
        .attr('y1', d => d.min * d.axis.y)
        .attr('x2', d => d.max * d.axis.x)
        .attr('y2', d => d.max * d.axis.y)
        .attr('transform', d => {
            // let normal = Vector.perp(d.axis);
            // return `translate(${width / 2}, ${height / 2})`
        });
}

function main() {
    // Can I draw a path using vertices from polygon?
    let paths = g.selectAll('.polys')
        .data([p1, p2], d => d.id);

    let lineGenerator = d3.line()
        .x(d => d.x)
        .y(d => d.y);

    //
    // g.append('path')
    //     .classed('poly1', true)
    //     .datum(p1)
    //     .attr('d', lineGenerator(p1.vertices))
    //
    // g.append('path')
    //     .classed('poly2', true)
    //     .datum(p2)
    //     .attr('d', lineGenerator(p2.vertices));


    // Draw all axes
    // g.append('path')


    // let poly2 = d3.polygonHull(p2.vertices);
    // paths.enter().append('path')
    //     .attr('d', )

    setTimeout(() => {
        window.requestAnimationFrame(redraw);
    }, 1000);
}
main();
let mouseDown = false;
document.addEventListener('mousemove', function(e) {
    if (mouseDown) {
        p2.position.x = e.clientX - margin.left;
        p2.position.y = e.clientY - margin.top;
        p2.updateVertices();
    }
});
document.addEventListener('mouseup', function(e) {
    mouseDown = false;
});
document.addEventListener('mousedown', function(e) {
    mouseDown = true;
});
