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

let interval = 1500;
let actions = [];
window.actions = actions;

let num = 116;
// actions.push({type: 'number', val: num});
// actions.push({type: 'binary', val: Number(num).toString(2)});
// actions.push({type: 'shift', val: Number(num << 8).toString(2)});
// actions.push({type: 'last-number', val: num << 8});

let problem = "116 << 8";
let startNum = 116;
let endNum = 29696;
let before =   '000000001110100'.split('');
// let after = '111010000000000'.split('');

function shift(arr) {
    arr.push('0');
    arr.shift();
    return arr;
}

actions.push({type: 'before', data: before.slice(), val: 116});
for (let i = 1; i < 9; i++) {
    before = shift(before);
    console.log(before.join(''));
    actions.push({type: 'before', data: before.slice(), val: 116 << (i)});
}

// actions.push({type: 'before', data: before});
// actions.push({type: 'rot'})
// actions.push({type: 'after', data: after});

g.append('text').text('binary')
    .attr('x', width / 2 - 150)
    .attr('y', height / 2 - 40)
    .style('font-size', '20px');
g.append('text').text('decimal')
    .attr('x', width / 2 - 150)
    .attr('y', height / 2 + 100 - 30)
    .style('font-size', '20px');
let problemText = g.append('text').text("What is 116 << 8?")
    .attr('x', width / 2 - 150)
    .attr('y', height / 2 - 130)
    .style('font-size', '20px');
let currentNumber = g.append('text').attr('id', 'current-number')
        .attr('x', width / 2 - 150)
        .attr('y', height / 2 + 100)
        .style('font-size', '20px');
function update(action, counter) {
    let shiftText = g.selectAll('.shift-text').data(action.data, (d, i) => i);
    let t = d3.transition().duration(interval / 3);
    console.log(action.val);

    setTimeout(() => {
        currentNumber.datum(action.val).text(d => d);
    }, interval);

    shiftText.enter().append('text')
        .attr('class', 'shift-text')
        .attr('x', (d, i) => {
            console.log('enter fired');
            return i * 20 + width / 2 - 150;
        })
        .attr('y', height / 2)
        .text(d => d);

    // Update
    shiftText.transition(t).delay((d, i) => i * 50)
        .attr('y', (d, i) => {
            if (d === "1") {
                return height / 2 + 30;
            }
            return height / 2;
        })
        .attr('x', (d, i) => i * 20 + width / 2 - 150)
        .text(d => d)
        .transition(t)
        .attr('y', height / 2)
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

