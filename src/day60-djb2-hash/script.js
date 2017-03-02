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
    actions.push({type: 'input-string', chars});
        if (typeof chars === 'string') {
            let charsCopy = chars.split('');
            chars = chars.split('').map(function(str, i, arr) {
                charsCopy[i] = str.charCodeAt(0);
                actions.push({type: 'char-code', str, chars: charsCopy.slice(), charCode: str.charCodeAt(0)});
                return str.charCodeAt(0);
            });
            actions.push({type: 'string-split', chars: chars.slice()});
        }

    if (!Array.isArray(chars)) {
        throw new Error('input must be a string or an array');
    }

    let charsCopy = chars.slice();
    let reduceArr = [5381].concat(charsCopy.slice());
    let sum = 5381;
    for (let i = 0; i < chars.length; i++) {
        actions.push({type: 'pre-sum', sum, i, chars: charsCopy.slice()})
        let shift = sum << 5;
        actions.push({type: 'shift', sum, shift, i, chars:charsCopy.slice()});
        sum = shift + sum + chars[i];
        actions.push({type: 'post-sum', sum, i, chars: charsCopy.slice()});
    }
    actions.push({type: 'final-sum', sum});
    return sum;
};

let text = 'hash me!';
let splitText = text.split('');
console.log(splitText);
let hashed = djb2(text);
console.log('hashed way', hashed);
actions.push({type: 'hashed', hashed});
console.log(actions);

// g.append('text').text('input')
g.selectAll('.input-text').data(splitText).enter().append('text')
    .text(d => d)
    .attr('x', (d, i) => width / 3 + i * 30);
let textHighlighter = g.append('rect').attr('x', 0).attr('y', 0).attr('width', 80).attr('height', 60).style('fill', 'transparent');
g.selectAll('.convert-text').data(splitText, (d, i) => i).enter().append('text')
    .text(d => d)
    .attr('class', 'convert-text')
    .attr('x', (d, i) => width / 3 + i * 30);
let reduceText = g.append('text').attr('id', 'reduce-text')
    .attr('y', 200)
    .attr('x', 30);
function update(action, counter) {
    console.log(action);
    let t = d3.transition().duration(interval);
    switch (action.type) {
        case 'input-string': {
            g.selectAll('.convert-text').transition(t)
                .attr('y', 100)
                .attr('x', (d, i) => 30 + i * 100);
            break;
        }
        case 'char-code': {
            let chars = g.selectAll('.convert-text').data(action.chars, (d, i) => i);
            chars.text(d => d);
            break;
        }
        case 'string-split': {
            g.append('text').text('5381').attr('id', 'sum').attr('x', 0).attr('y', 200);
            // g.selectAll('.reduce-text').data(action.chars, (d, i) => i).enter().append('text')
            //     .text(d => d)
            //     .attr('class', 'reduce-text')
            //     .attr('y', 100)
            //     .attr('x', (d, i) => 30 + i * 100)
            //     .transition(t)
            //     .attr('y', 200);
            break;
        }
        case 'pre-sum': {
            g.selectAll('.convert-text').transition(t)
                .attr('x', (d, i) => {
                    if (i === action.i) {
                        return width / 2 + 70;
                    } else {
                        return 30 + i * 100;
                    }
                })
                .attr('y', (d, i) => {
                    if (i === action.i) {
                        return 240;
                    }
                    return 100;
                })
                .style('opacity', (d, i) => {
                    if (i < action.i) {
                        return 1e-6;
                    }
                    return 1;
                });

            g.select('#sum').text(`${action.sum} << 5 + ${action.sum} + `);
            break;
        }
        case 'shift': {
            g.select('#sum').text(`${action.shift} + ${action.sum} + `);
            break;
        }
        case 'post-sum': {
            g.select('#sum').text(`${action.sum}`);
            g.selectAll('.convert-text').transition(t)
                .attr('x', (d, i) => {
                    if (i === action.i) {
                        return width / 2 + 30;
                    } else {
                        return 30 + i * 100;
                    }
                })
                .attr('y', (d, i) => {
                    if (i === action.i) {
                        return 240;
                    }
                    return 100;
                })
                .style('opacity', (d, i) => {
                    if (i <= action.i) {
                        return 1e-6;
                    }
                    return 1;
                });
            break;
        }
        case 'final-sum':
            g.select('#sum').text(`${action.sum}`)
                .transition(t)
                .attr('x', width / 3);
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

