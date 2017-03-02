import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
window.g = g;

let interval = 800;
let actions = [];
window.actions = actions;

const djb2 = function(chars) {
        if (typeof chars === 'string') {
            let charsCopy = chars.split('');
            chars = chars.split('').map(function(str, i, arr) {
                charsCopy[i] = str.charCodeAt(0);
                return str.charCodeAt(0);
            });
        }

    if (!Array.isArray(chars)) {
        throw new Error('input must be a string or an array');
    }

    let charsCopy = chars.slice();
    let sum = 5381;
    for (let i = 0; i < chars.length; i++) {
        let shift = sum << 5;
        sum = shift + sum + chars[i];
    }

    return sum;
};

let strings = [
    'i',
    'am',
    'a',
    'guppy',
    'and',
    'guppies',
    'dont',
    'smile',
    'mypassword'
];

// let hashedStrings = strings.map(str => djb2(str));
// let binHashedStrings = hashedStrings.map(str => (str >>> 0).toString(2));
let data = strings.map(str => ({str, hash: djb2(str)}));

data.forEach((d, i) => {
    actions.push({type: 'string', str: d.str})
    actions.push({type: 'hash', hash: d.hash});
    actions.push({type: 'show', i});
});

// let hashGrid = g.append('g');
g.selectAll('.hash-cell').data(data).enter().append('rect')
    .attr('class', 'hash-cell')
    .attr('x', 500)
    .attr('y', (d, i) => i * 60)
    .attr('width', 400)
    .attr('height', 60)
    .style('stroke', 'black')
    .style('fill', 'transparent');
let hashedText = g.selectAll('.hash-cell-text').data(data, (d, i) => i).enter().append('text')
    .text(d => d.hash)
    .style('opacity', 1e-6)
    .style('text-anchor', 'middle')
    .attr('x', 700)
    .attr('y', (d, i) => i * 60 + 45);

let str = g.append('text').attr('x', 240).attr('y', 100)
    .style('text-anchor', 'middle');

g.append('rect')
    .attr('x', 50)
    .attr('y', 200)
    .attr('width', 400)
    .attr('height', 60)
    .style('stroke', 'black')
    .style('fill', 'black');
g.append('text')
    .text('djb2')
    .attr('x', 200)
    .attr('y', 240)
    .style('fill', 'white');

// let hash = g.append('text').attr('x', 240).attr('y', 300);

function update(action, counter) {
    switch (action.type) {
        case 'string': {
            str.text(action.str)
                .attr('y', 100);
            break;
        }
        case 'hash': {
            str.transition().duration(interval / 2)
                .attr('y', 240)
                .transition().duration(interval / 2)
                .text(action.hash)
                .attr('y', 340)
            break;
        }
        case 'show': {
            hashedText.style('opacity', (d, i) => {
                if (i <= action.i) {
                    return 1;
                }
                return 1e-6;
            });
        }
    }
}

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

