import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');
var SimplexNoise = require('simplex-noise'),
    simplex = new SimplexNoise(Math.random);
    // value2d = simplex.noise2D(x, y);

let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 800- margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    // .attr('transform', 'translate(' + width / 4 + ',' + margin.top + ')');
window.g = g;

let interval = 500;
let actions = [];
window.actions = actions;

let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

function replaceAt(str, idx, char) {
    return str.substr(0, idx) + char + str.substr(idx + char.length);
}

function rot13(str) {
    for (let i = 0; i < str.length; i++) {
        let char = str[i].toLowerCase();
        let idx = alphabet.indexOf(char);
        let newIdx = (idx + 13) % alphabet.length;
        str = replaceAt(str, i, alphabet[newIdx]);
    }
    return str;
}

function getNext(char, alphabet) {

}

function shift(str) {
    for (let i = 0; i < str.length; i++) {
        let char = str[i].toLowerCase();
        if (char !== ' ') {
            let idx = alphabet.indexOf(char);
            let newIdx = (idx + 1) % alphabet.length;
            str = replaceAt(str, i, alphabet[newIdx]);
        }
    }
    return str;
}

let s = 'I am a guppy';
actions.push({str: s.split('')});
for (let i = 0; i < 13; i++) {
    s = shift(s);
    actions.push({str: s.split('')});
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}


function update(action) {
    console.log(action.str);
    let t = d3.transition().duration();

    let text = g.selectAll('.text').data(action.str, (d, i) => i);
    let bgRect = g.selectAll('.bg-rect').data(action.str, (d, i) => i);
    // let text = g.selectAll('.text').data(action.str, d => d);


    let spacing = 30;
    let offset = 50;

    // Enter
    bgRect.enter().append('rect').attr('class', 'bg-rect')
        .attr('x', (d, i) => i * spacing + offset)
        .attr('y', 200 - 40)
        .attr('width', spacing - 5)
        .attr('height', 60);
    text.enter().append('text').attr('class', 'text')
        .text(d => d)
        .attr('x', (d, i) => i * spacing + offset)
        .attr('y', 200);

    // Exit
    // text.exit().remove();

    // Update
    bgRect.transition().duration(interval / 2).delay((d, i) => i * 50)
        .attr('y', 200 + 20)
        .style('opacity', 1e-6)
        .transition().duration(1)
        .attr('y', 200 - 80)
        .transition().duration(interval / 2)
        .attr('y', 200 - 40)
        .style('opacity', 1);
    text.transition().duration(interval / 2).delay((d, i) => i * 50)
        .attr('y', 200 + 20)
        .style('opacity', 1e-6)
        .transition().duration(1)
        .attr('y', 200 - 20)
        .text(d => d)
        .transition().duration(interval / 2)
        .attr('y', 200)
        .style('opacity', 1);
}

function main() {
    let counter = 0;
    setTimeout(() => {
        d3.interval(() => {
            if (actions[counter]) {
                update(actions[counter]);
                counter++;
            }
        }, interval);
    }, 1000);
}

main();

