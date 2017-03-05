import * as d3 from 'd3';
import words from './words.txt';
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

const loselose = function(chars) {
    if (typeof chars === 'string') {
        chars = chars.split('').map(function(str, i, arr) {
            return str.charCodeAt(0);
        });
    }

    let sum = 0;
    for (let i = 0; i < chars.length; i++) {
        sum += chars[i];
    }

    return sum;
}
const djb2 = function(chars) {
        if (typeof chars === 'string') {
            chars = chars.split('').map(function(str, i, arr) {
                return str.charCodeAt(0);
            });
        }

    if (!Array.isArray(chars)) {
        throw new Error('input must be a string or an array');
    }

    // let charsCopy = chars.slice();
    let sum = 5381;
    for (let i = 0; i < chars.length; i++) {
        sum = ((sum << 5)+ sum) ^ chars[i];
    }

    return sum;
};

// let testwords = uniqueWords.slice(0, 1000);
// let strings = cleaned.split(' ');
// let strings = txt.split(',');
let strings = words.split('\n');

// let hashedStrings = strings.map(str => djb2(str));
// let binHashedStrings = hashedStrings.map(str => (str >>> 0).toString(2));
let data = strings.map(str => djb2(str));
let count = data.map(hash =>
    ({count: 1, hash})
).reduce((a, b) => {
    a[b.hash] = (a[b.hash] || 0) + b.count;
    return a;
}, {});

let uniqueWords = Object.keys(count).map(key => ({hash: key, count: count[key]}));

let dupes = Object.keys(count).filter(hash => count[hash] > 1);
console.log(dupes.length);
console.log(Object.keys(count).length);


let hashGrid = g.selectAll('.hash-cell').data(uniqueWords, (d, i) => i)
    .enter().append('rect')
    .attr('width', (d, i) => {
        if (d.count > 1) {
            return 5;
        } else {
            return 1;
        }
    })
    .attr('height', (d, i) => {
        if (d.count > 1) {
            return 5;
        } else {
            return 1;
        }
    })
    .attr('x', (d, i) => i % width)
    .attr('y', (d, i) => Math.floor(i / width))
    .style('fill', d => {
        return d.count === 1 ? 'rgba(40, 40, 40, 0.3)' : 'red'
    });

function update(action, counter) {
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

