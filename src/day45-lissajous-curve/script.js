import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    .attr('transform', `translate(${width / 2}, ${height / 2})`);
let colorScale = d3.scaleLinear()
    .domain([0, 400])
    .range(['#fff7f3', '#7a0177']);

let t = d3.range(400);

function lissajous(t, a, b, d) {
    let A = 300;
    let B = 300;
    return {
        x: A * Math.sin(a * t + d),
        y: B * Math.sin(b * t)
    }
}

let a = 1;
let b = 2;
let d = Math.PI / 2;
// let data = t.map(t => {
//     return lissajous(t, a, b, d);
// });

console.log('t', t)
// console.log('data', data);

let update = function() {
    let data = t.map(t => {
        return lissajous(t, a, b, d);
    });

    let points = g.selectAll('.point')
        .data(data, (d, i) => i);

    // Enter
    points.enter().append('circle')
        .attr('class', 'point')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .style('fill', (d, i) => colorScale(i))
        .attr('r', 2);

    // Update
    points.attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .style('fill', (d, i) => colorScale(i));
}

let animate = function() {
    window.requestAnimationFrame(animate);
    a += .0001;
    b += .0001;
    update();
}

setTimeout(animate, 200);
