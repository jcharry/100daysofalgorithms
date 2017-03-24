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

var isPalindrome = function(str) {
    // base case #1
    if (str.length < 2) {
        return true;
    }
    // base case #2
    if (str.slice(0, 1) !== str.slice(-1)) {
        return false;
    }

    // recursive case
    return isPalindrome(str.slice(1, -1));
};

const palindrome = function(str) {
    let n = str.length;
    for (let i = 0; i < n / 2; i++) {
        actions.push({type: 'test', str: str.slice(), i, j: n - 1 - i});
        if (str.charAt(i) !== str.charAt(n - 1 - i)) {
            return false;
        }
    }
    return true;
}

console.log(palindrome('ratsliveonnoevilstarratsliveonnoevilstar'));
let min = Infinity;
let max = -Infinity;
let charCodes = 'rats live on no evil star'.split('').map(char => {
    if (char.charCodeAt(0) < min) min = char.charCodeAt(0);
    if (char.charCodeAt(0) > max) max = char.charCodeAt(0);
    return char.charCodeAt(0);
});
console.log(min, max);

let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('').reduce((acc, curr, i) => {
    acc[curr] = (i + 1) * 12;
    return acc;
}, {});
console.log(alphabet);

let colorScale = d3.scaleLinear()
    .domain([alphabet['a'], alphabet['z']])
    .range(['#fc8d59', '#99d594']);

function update(counter) {
    let t = d3.transition().duration(interval);
    let action = actions[counter];
    let selection = g.selectAll('.item').data(action.str.split(''), (d, i) => i);
    let N = action.str.length;
    let step = width / N;

    selection.enter().append('rect')
        .attr('class', 'item')
        .attr('x', (d, i) => i * step)
        .attr('y', 0)
        .attr('width', step)
        .transition(t)
        .attr('height', d => alphabet[d])
        .attr('fill', (d, i) => {
            if (i === action.i || i === action.j) {
                return 'green';
            }
            return colorScale(alphabet[d]);
        });

    selection
        .transition(t)
        .attr('fill', (d, i) => {
            if (i === action.i || i === action.j) {
                return 'green';
            }
            return colorScale(alphabet[d]);
        });
}

let interval = 400;
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

