import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let actions = [];
window.actions = actions;
let interval = 500;

// Setup SVG
let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

function factNoActions(n) {
    if (n === 1) {
        return n;
    } else {
        return n * factNoActions(n - 1);
    }
}

function fact(n) {
    let res;

    // Base Case
    if (n === 1) {
        res = n;
        actions.push({type: 'base-pre', n: n, res: n});
        actions.push({type: 'base-line-pre', n: n, res: n});
        actions.push({type: 'base-post', n: n, res: n});
        actions.push({type: 'base-line-post', n: n, res: n});
    } else {
        actions.push({type: 'pre-recurse-sol', n: n, res: res});
        actions.push({type: 'pre-recurse-line', n: n, res: res});
        res = n * fact(n - 1);
        if (n < 7) {
            actions.push({type: 'post-recurse-line', n: n, res: res});
            actions.push({type: 'post-recurse-sol', n: n, res: res});
            actions.push({type: 'post-recurse-line-2', n: n, res: res});
        }
    }

    return res;
}

window.fact = fact;
function update(action) {
    let callId = action.n;
    let t = d3.transition().duration(interval).ease(d3.easeCubic);
    switch (action.type) {
        case 'base-pre': {
            g.append('text').datum(action)
                .style('opacity', 1e-6)
                .transition(t)
                .style('opacity', 1)
                .attr('class', `call-${callId}`)
                .text(`${action.n + 1} * fact(${action.n})`)
                .attr('x', action.n * 50)
                .attr('y', action.n * 50);
            break;
        }
        case 'base-post': {
            g.append('text').datum(action)
                .style('opacity', 1e-6)
                .transition(t)
                .style('opacity', 1)
                .attr('class', `call-post-${callId}`)
                .text(`${action.n + 1} * ${action.res}`)
                .attr('x', action.n * 50 + 210)
                .attr('y', action.n * 50);
            break;
        }
        case 'base-line-pre': {
            g.append('line').datum(action)
                .attr('x1', action.n * 50 + 75)
                .attr('y1', action.n * 50 - 5)
                .attr('x2', action.n * 50 + 75)
                .attr('y2', action.n * 50 - 5)
                .style('opacity', 1e-6)
                .transition(t)
                .style('opacity', 1)
                .attr('x2', action.n * 50 + 200)
                .attr('class', 'post-recurse-line');
            break;
        }
        case 'base-line-post': {
            g.append('line').datum(action)
                .attr('x1', action.n * 50 + 200)
                .attr('y1', action.n * 50 - 5)
                .attr('x2', action.n * 50 + 200)
                .attr('y2', action.n * 50 - 5)
                .style('opacity', 1e-6)
                .transition(t)
                .style('opacity', 1)
                .attr('x2', (action.n + 1) * 50 + 75)
                .attr('y2', (action.n + 1) * 50 - 5)
                .attr('class', 'post-recurse-sol');
            g.select(`.call-${action.n + 1}`)
                .text(`${action.n + 2} * ${factNoActions(action.n + 1)}`);
            break;
        }
        case 'pre-recurse-sol': {
            console.log('calling pre-recurse');
            g.append('text').datum(action)
                .attr('y', action.n * 50)
                .attr('x', action.n * 50)
                .style('opacity', 1e-6)
                .transition(t)
                .style('opacity', 1)
                .attr('class', `call-${callId}`)
                .text(d => {
                    if (action.n === 7) {
                        return `fact(7)`;
                    }
                    return `${action.n + 1} * fact(${action.n})`;
                })
            break;
        }
        case 'pre-recurse-line': {
            g.append('line').datum(action)
                .style('opacity', 1e-6)
                .attr('x1', action.n * 50 + 20)
                .attr('y1', action.n * 50 - 15)
                .attr('x2', action.n * 50 + 20)
                .attr('y2', action.n * 50 - 15)
                .transition(t)
                .style('opacity', 1)
                .attr('class', 'pre-recurse-line')
                .attr('x2', (action.n - 1) * 50 + 40)
                .attr('y2', (action.n - 1) * 50 + 10);
            break;
        }
        case 'post-recurse-line': {
            // Draw a line to the right
            console.log(action.n);
            g.append('line').datum(action)
                .attr('x1', action.n * 50 + 75)
                .attr('y1', action.n * 50 - 5)
                .attr('x2', action.n * 50 + 75)
                .attr('y2', action.n * 50 - 5)
                .style('opacity', 1e-6)
                .transition(t)
                .style('opacity', 1)
                .attr('x2', action.n * 50 + 200)
                .attr('y2', action.n * 50 - 5)
                .attr('class', 'post-recurse-line');
            break;
        }
        case 'post-recurse-line-2': {
            g.append('line').datum(action)
                .attr('x1', action.n * 50 + 200)
                .attr('y1', action.n * 50 - 5)
                .attr('x2', action.n * 50 + 200)
                .attr('y2', action.n * 50 - 5)
                .style('opacity', 1e-6)
                .transition(t)
                .style('opacity', 1)
                .attr('x2', (action.n + 1) * 50 + 75)
                .attr('y2', (action.n + 1) * 50 - 5)
                .attr('class', 'post-recurse-sol');

            g.select(`.call-${action.n + 1}`)
                .transition(t)
                .text(d => {
                    if (action.n + 1 === 7) {
                        return `${factNoActions(action.n + 1)}`;
                    }
                    return `${action.n + 2} * ${factNoActions(action.n + 1)}`
                })
                .style('fill', d => {
                    if (action.n + 1 === 7) {
                        return 'green';
                    }
                });
            break;
        }
        case 'post-recurse-sol': {
            g.append('text').datum(action)
                .attr('x', action.n * 50 + 210)
                .attr('y', action.n * 50)
                .style('opacity', 1e-6)
                .transition(t)
                .style('opacity', 1)
                .attr('class', `call-post-${callId}`)
                .text(d => {
                    return `${action.n + 1} * ${action.res}`
                })
            break;
        }
    }
}

window.update = update;

function main() {
    // Can I draw a path using vertices from polygon?
    // Write out original string
    // g.append('text').datum(str).text(d => d);
    fact(7);


    let counter = 0;
    setTimeout(() => {
        d3.interval(() => {
            if (actions[counter]) {
                update(actions[counter]);
            }
            counter++;
        }, interval);
    }, 1000);
}

main();
