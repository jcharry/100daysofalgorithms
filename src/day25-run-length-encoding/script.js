import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let actions = [];
window.actions = actions;
let interval = 200;

// Setup SVG
let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 1400 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let dataColorScale = d3.scaleLinear()
    .domain([0, 100])
    .range(['#e7e1ef', '#980043']);

// let str = 'BWWWWWWWWWWWBWWWWWWWWWWWWBBBWWWWWWWWWWWWWWWWWWWWWWWWBWWWWWWWWWWWWWW'.split('')
let str = 'IIIIIIIIIIIIBIIIIIIIIIIIIBBBIIIIIIIIIIIIIIIIIIIBIIIIIIIIII'.split('')
// str = str.map((d => {text: d})
function RLE(s) {
    let lastChar = s[0];
    let counter = 1;
    // let result = [];
    let output = str.slice();
    let insertPos = 0;

    actions.push({type: 'initialize', currentChar: s[0], str: s, pos: 0, insertPos, counter, output: output.slice()});
    for (let i = 1; i < s.length; i++) {
        if (s[i] === lastChar) {
            counter++;
            actions.push({type: 'iterate_counter', currentChar: s[i], str: s, pos: i, insertPos, counter: counter, output: output.slice()});
        } else {
            // result.push({value: lastChar, count: counter});
            output.splice(insertPos, counter, `${counter}${lastChar}`);
            insertPos++;
            counter = 1;
            actions.push({type:'splice', currentChar: s[i], str: s.slice(), pos: i, insertPos, counter, output: output.slice()});
        }

        // If we've hit the last character
        if (i === s.length - 1) {
            // output += `${counter}${s[i]}`;
            output.splice(insertPos, counter, `${counter}${lastChar}`);
            actions.push({type: 'lastchar', currentChar: s[i], str: s.slice(), pos: i, counter, insertPos, output: output.slice()});
        }

        lastChar = s[i];
    }

    return output;
}

let s = RLE(str);
console.log(s);
console.log(actions);

let letterSpacing = 25;
function update(action) {
    console.log(action);

    let t = d3.transition().duration(interval);
    let s = g.selectAll('.string')
        .data(action.output, (d, i) => i);

    switch(action.type) {
        case 'initialize': {
            // Create
            s.enter().append('text')
                .attr('class', 'string')
                .attr('x', (d, i, arr) => {return i * letterSpacing})
                .attr('y', height / 2)
                .text(d => d)
                .style('fill', 'white')
                .style('stroke', 'transparent');

            let line = g.append('line')
                .attr('x1', 0).attr('y1', height / 2 + 10)
                .attr('x2', letterSpacing).attr('y2', height / 2 + 10);
            break;
        }
        case 'iterate_counter': {
            // Draw a line from insertPos to current Pos
            g.select('line').transition(t)
                .attr('x1', (action.insertPos) * letterSpacing).attr('y1', height / 2 + 10)
                .attr('x2', (action.insertPos + action.counter) * letterSpacing).attr('y2', height / 2 + 10);
            break;
        }
        case 'lastchar':
        case 'splice': {
            s.exit().transition(t).remove();

            s.text(d => d)
                .transition(t)
                .attr('x', (d, i) => i * letterSpacing);
            // g.select('line')
            g.select('line').transition(t)
                .attr('x1', (action.insertPos) * letterSpacing).attr('y1', height / 2 + 10)
                .attr('x2', (action.insertPos + action.counter) * letterSpacing).attr('y2', height / 2 + 10);
            //     .attr('x1', action.insertPos * letterSpacing).attr('y1', 30)
            //     .attr('x2', (action.insertPos + action.counter) * letterSpacing).attr('y2', 30);
            break;
        }
    }
}

function finish() {
    let action = actions[actions.length - 1];

    let t = d3.transition().duration(interval);
    g.select('line').transition(t)
        .attr('x1', action.insertPos * letterSpacing)
        .attr('y1', height /2 + 10)
        .attr('x2', action.insertPos * letterSpacing)
        .attr('y2', height / 2 + 10)
        .style('opacity', 0);
    console.log('finished');
}
function main() {
    // Can I draw a path using vertices from polygon?
    // Write out original string
    // g.append('text').datum(str).text(d => d);

    setTimeout(() => {
        let counter = 0;
        let loopId = setInterval(() => {
            if (actions[counter]) {
                update(actions[counter]);
                counter++;
            } else {
                clearInterval(loopId);
                finish();
            }
        }, interval);
    }, 1000);
}

main();

