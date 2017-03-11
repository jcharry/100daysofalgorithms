import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let margin = {top: 100, right: 100, bottom: 100, left: 100},
    width = 1200 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g').attr('class', 'svg-group')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let actions = [];
window.actions = actions;

let n1 = 85423;
let n2 = 6543;
let n1d = n1.toString(2);
let n2d = n2.toString(2);
let n1data = n1d.split('').map(c => ({bit: c, active: false}));
let n2data = n2d.split('').map(c => ({bit: c, active: false}));

function pad(arr1, arr2, padding) {
    let n1 = arr1.length;
    let n2 = arr2.length;
    let diff = Math.abs(n1 - n2);
    if (n1 > n2) {
        for(let i = 0; i < diff; i++) {
            arr2.splice(0, 0, padding);
        }
    } else {
        for(let i = 0; i < diff; i++) {
            arr1.splice(0, 0, padding);
        }
    }
}

pad(n1data, n2data, {bit: '0', active: false});

let bitor = (n1 & n2).toString(2);
let bdata = bitor.split('').map(c => ({bit: c, active: false}));
pad(bdata, n1data, {bit: '0', active: false});

let s1 = g.append('g');
let s2 = g.append('g').attr('transform', 'translate(0, 40)');
let s3 = g.append('g').attr('transform', 'translate(0, 120)');
let spacing = 40;

s1.selectAll('.bg').data(n1data, (d, i) => i).enter()
    .append('rect')
    .attr('class', 'bg')
    .attr('x', (d, i) => i * spacing)
    .attr('y', 0)
    .attr('width', spacing - 5)
    .attr('height', spacing - 5);

s1.selectAll('.bit').data(n1data, (d, i) => i).enter()
    .append('text')
    .attr('class', 'bit')
    .text(d => d.bit)
    .attr('x', (d, i) => i * spacing + 17)
    .attr('y', 25)
    .style('text-anchor', 'middle');

s2.selectAll('.bg').data(n2data, (d, i) => i).enter()
    .append('rect')
    .attr('class', 'bg')
    .attr('x', (d, i) => i * spacing)
    .attr('y', 0)
    .attr('width', spacing - 5)
    .attr('height', spacing - 5);
s2.selectAll('.bit').data(n2data, (d, i) => i).enter()
    .append('text')
    .attr('class', 'bit')
    .text(d => d.bit)
    .attr('x', (d, i) => i * spacing + 17)
    .attr('y', 25)
    .style('text-anchor', 'middle');

s3.selectAll('.bg').data(bdata, (d, i) => i).enter()
    .append('rect')
    .attr('class', 'bg')
    .attr('x', (d, i) => i * spacing)
    .attr('y', 0)
    .attr('width', spacing - 5)
    .attr('height', spacing - 5)
    .style('opacity', 1e-6);

s3.selectAll('.bit').data(bdata, (d, i) => i).enter()
    .append('text')
    .attr('class', 'bit')
    .text(d => d.bit)
    .attr('x', (d, i) => i * spacing + 17)
    .attr('y', 25)
    .style('text-anchor', 'middle')
    .style('opacity', 1e-6);


g.append('line')
    .attr('x1', 0)
    .attr('y1', 100)
    .attr('x2', spacing * n1data.length)
    .attr('y2', 100)
    .style('stroke', 'darkgray');
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

for (let i = 0; i < n1data.length; i++) {
    n1data = n1data.map(d => ({...d, active: false}));
    n2data = n2data.map(d => ({...d, active: false}));
    bdata = bdata.map((d, j) => ({...d, visible: j <= i}));
    n1data[i].active = true;
    n2data[i].active = true;
    bdata[i].active = true;
    actions.push({n1: clone(n1data), n2: clone(n2data), or: clone(bdata)});
}

let text = g.append('text').text('AND')
    .attr('x', -10)
    .attr('y', 68)
    .style('text-anchor', 'end');

function update(action, counter) {
    let t = d3.transition().duration(interval);
    let bg1 = s1.selectAll('.bg').data(action.n1, (d, i) => i);
    let bg2 = s2.selectAll('.bg').data(action.n2, (d, i) => i);
    let or = s3.selectAll('.bg').data(action.or, (d, i) => i);
    let ort = s3.selectAll('.bit').data(action.or, (d, i) => i);
    let t1 = s1.selectAll('.bit').data(action.n1, (d, i) => i);
    let t2 = s2.selectAll('.bit').data(action.n1, (d, i) => i);

    bg1.transition(t).style('fill', d => {
        if (d.active) {
            if (d.bit === '1') {
                return 'green';
            } else {
                return 'red';
            }
        } else {
            return 'transparent';
        }
    });
    bg2.transition(t).style('fill', d => {
        if (d.active) {
            if (d.bit === '1') {
                return 'green';
            } else {
                return 'red';
            }
        } else {
            return 'transparent';
        }
    });
    t1.transition(t).style('fill', d => d.active ? 'white' : 'black');
    t2.transition(t).style('fill', d => d.active ? 'white' : 'black');
    or.transition(t).style('opacity', d => d.visible ? 1 : 1e-6);
    ort.transition(t).style('opacity', d => d.visible ? 1 : 1e-6);

    // s1.selectAll('.bit')

    // s2.selectAll('.bg').data(n2data).enter()
    //     .append('rect')
    //     .attr('class', 'bg')
    //     .attr('x', (d, i) => i * spacing)
    //     .attr('y', 0)
    //     .attr('width', spacing - 5)
    //     .attr('height', spacing - 5)
    // s2.selectAll('.bit').data(n2data, (d, i) => i).enter()
    //     .append('text')
    //     .text(d => d.bit)
    //     .attr('x', (d, i) => i * spacing + 17)
    //     .attr('y', 25)
    //     .style('text-anchor', 'middle');
}

let interval = 1000;
function main() {
    let counter = 0;
    setTimeout(() => {
        d3.interval(() => {
            if (actions[counter]) {
                update(actions[counter], counter);
                counter++;
            }
        }, interval);
    }, 1000);
}

main();

