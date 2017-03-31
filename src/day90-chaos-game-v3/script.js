import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let margin = {top: 100, right: 100, bottom: 100, left: 100},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// let svg = d3.select('body').append('svg')
//     .attr('width', width + margin.left + margin.right)
//     .attr('height', height + margin.top + margin.bottom);

let canvas = d3.select('body').append('canvas')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);
    // .attr('transform', `translate(${margin.left}, ${margin.top})`);
let ctx = canvas.node().getContext('2d');

// let g = svg.append('g').attr('class', 'svg-group')
//     .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

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

// let vertices = [];
function constructVertices(numVerts) {
    // let numVerts = 8;
    let vertices = [];
    let r = 300;
    let angleStep = Math.PI * 2 / numVerts;
    for (let i = 0; i < numVerts; i++) {
        // let d = i % 2 === 0 ? r : r / 6;
        let d = r;
        let x = width / 2 + d * Math.cos(i * angleStep);
        let y = height / 2 + d * Math.sin(i * angleStep);
        vertices.push({x, y});
    }

    return vertices;
}
function chaosGame(vertices) {
    actions = [];
    let x = rndInt(200, width - 200);
    let y = rndInt(300, height);
    let point = {x, y};


    // let vertices = [{x: 0, y: 0}, {x: 0, y: height}, {x: width, y:height}];
    let points = [];

    // iterate
    for (let i = 0; i < 5000; i++) {
        // Choose random vertex
        let v = choice(vertices);
        point = midpoint(point, v);
        points.push(clone(point));
        // actions.push({points: points.slice()});
    }
    actions.push({points: points.slice()});
    return points.slice();
}

function drawVertices(vertices) {

    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 0.5;
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < vertices.length; i++) {
        let v = vertices[i];
        ctx.lineTo(v.x, v.y);
    }
    ctx.closePath();
    ctx.stroke();
}

// chaosGame();


function update(points) {
    let t = d3.transition().duration(interval - 100);
    // let action = actions[counter];

    let p = d3.selectAll('.custom').data(points, (d, i) => i);

    p.enter().append('custom')
        .attr('class', 'custom')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('size', 2)
        .attr('fill', '#e34a33');

    p.attr('fill', '#fdbb84')
        .transition(t)
        .attr('x', d => d.x)
        .attr('y', d => d.y);

}


function drawCanvas(points, vertices) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    let elts = d3.selectAll('.custom');
    elts.each(function(d) {
        var node = d3.select(this);

        ctx.beginPath();
        ctx.fillStyle = node.attr('fill');
        ctx.rect(node.attr('x'), node.attr('y'), node.attr('size'), node.attr('size'));
        ctx.fill();
        ctx.closePath();
    });
    drawVertices(vertices);

}

// update(actions.length - 1);

let interval = 2000;
function main() {
    let counter = 0;
    let n = 10;
    let vertices = constructVertices(8);
    setTimeout(() => {
        d3.timer(() => {
            drawCanvas(null, vertices)
        });
        d3.interval(() => {
            if (n > 3) {
                vertices = constructVertices(--n)
                let points = chaosGame(vertices);
                update(points);
                drawCanvas(points, vertices);
            }
            // if (actions[counter]) {
            //     update(counter);
            //     counter++;
            // }
        }, interval);
        // d3.interval(() => {
        //     if (actions[counter]) {
        //         update(counter);
        //         counter++;
        //     }
        // }, interval);
    }, 1000);
}

main();

