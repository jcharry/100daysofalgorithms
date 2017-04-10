import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let margin = {top: 100, right: 100, bottom: 0, left: 100},
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

let arr = [1, [2, 3], [[1,2], [6, 7], [[1,2], [9,10]]], [12], 6];
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function deeplyFlatten(arr, flatArr) {
    flatArr = flatArr || [];
    actions.push({type: 'call', source: clone(arr), flatArr: flatArr.slice()});

    for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        if (typeof item === 'number' || typeof item === 'string' || typeof item === 'boolean') {
            flatArr.push(item);
            actions.push({type: 'push', source: clone(arr), flatArr: flatArr.slice()});
        } else {
            deeplyFlatten(item, flatArr);
        }
    }

    return flatArr;
}

deeplyFlatten(arr);
// console.log(actions);
g.append('text').text('[').attr('x', -20);
g.append('text').text('[').attr('x', 30);
g.append('text').text(']').attr('x', 90);
g.append('text').text('[').attr('x', 100);
g.append('text').text('[').attr('x', 110);
g.append('text').text(']').attr('x', 175);
g.append('text').text('[').attr('x', 190);
g.append('text').text(']').attr('x', 250);
g.append('text').text('[').attr('x', 260);
g.append('text').text('[').attr('x', 265);
g.append('text').text(']').attr('x', 330);
g.append('text').text('[').attr('x', 350);
g.append('text').text(']').attr('x', 420);
g.append('text').text(']').attr('x', 425);
g.append('text').text(']').attr('x', 430);
g.append('text').text('[').attr('x', 435);
g.append('text').text(']').attr('x', 460);
g.append('text').text(']').attr('x', 500);

let source = g.selectAll('.source').data(actions[actions.length - 1].flatArr, (d, i) => `source-${i}`);
source.enter().append('text').attr('class', 'source').text(d => d)
    .attr('x', (d, i) => {
        return i * 40;
    });
let pathGen = d3.line()
    .x(d => d[0])
    .y(d => d[1]);
let tri = [[0, 0], [15, 0], [7.5, 15]];
let arrow = g.append('path').attr('d', pathGen(tri));
arrow.attr('transform', 'translate(-3, -35)')
    .style('fill', 'orange');
let arrowPos = 0;
function update(counter) {
    let action = actions[counter];
    let t = d3.transition().duration(interval - 10);
    console.log(action);

    switch (action.type) {
        case 'push':
            arrowPos += 40;
            arrow.transition(t)
                .attr('transform', `translate(${arrowPos}, -35)`)
    }


    let flat = g.selectAll('.flat').data(action.flatArr, (d, i) => `flat-${i}`);
    flat.enter().append('text').attr('class', 'flat').text(d => d)
        .attr('x', (d, i) => i * 40)
        .attr('y', 100);

}

let interval = 500;
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

