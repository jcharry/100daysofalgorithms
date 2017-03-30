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

function choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function midpoint(v1, v2) {
    return {
        x: Math.floor((v1.x + v2.x) / 2),
        y: Math.floor((v1.y + v2.y) / 2)
    };
}

function chaosGame() {
    let x = rndInt(200, width - 200);
    let y = rndInt(300, height);
    let point = {x, y};

    let vertices = [{x: width / 2, y: 0}, {x: 0, y: height}, {x: width, y:height}];
    let points = [];

    // iterate
    for (let i = 0; i < 1000; i++) {
        // Choose random vertex
        let v = choice(vertices);
        point = midpoint(point, v);
        points.push(point);
        actions.push({points: points.slice()});
    }
}

chaosGame();


function update(counter) {
    let t = d3.transition().duration(interval);
    let action = actions[counter];

    let points = g.selectAll('.point').data(action.points, (d, i) => i);

    points.enter().append('circle')
        .attr('class', 'point')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 6)
        .style('fill', '#e34a33');

    points.transition(t)
        .style('fill', '#fdbb84')
        .attr('r', 2)

}

let interval = 80;
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

