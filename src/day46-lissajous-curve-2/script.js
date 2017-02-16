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

let t = d3.range(800);

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

console.log('t', t)

let curve = g.append('path');

let update = function() {
    let data = t.map(t => {
        return lissajous(t/50, a, b, d);
    });

    // console.log('data', data);

    let pathGenerator = d3.line()
        .x(d => d.x)
        .y(d => d.y);
    let path = pathGenerator(data);

    curve.attr('d', path);
}

let animate = function() {
    window.requestAnimationFrame(animate);
    a += .001;
    b += .001;
    update();
}

// setInterval(animate, 16);
setTimeout(animate, 500);
