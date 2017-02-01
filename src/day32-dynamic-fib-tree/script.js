import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let actions = [];
window.actions = actions;
let interval = 500;

// Setup SVG
let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 1800- margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


let counter = 0;
let memo = {};
function fibNoAction(n) {
    if (n <= 2) {
        return 1;
    } else {
        return fibNoAction(n - 1) + fibNoAction(n - 2);
    }
}
window.fib = fibNoAction;

function fibonacci(n, depth, id) {
    counter++;
    // Memoized version
    if (memo[n]) {
        actions.push({
            type: 'recursion',
            depth,
            base: n,
            memoized: true,
            parent: id,
            calls: [n-1, n-2],
            id: `id-${counter}`
        });
        return memo[n];
    }

    if (n <= 2) {
        actions.push({
            type: 'base',
            depth,
            parent: id,
            base: n,
            id: `id-${counter}`
        });

        return 1;
    } else {
        let parentId = `id-${counter}`;
        actions.push({
            type: 'recursion',
            depth,
            base: n,
            parent: id,
            calls: [n-1, n-2],
            id: `id-${counter}`
        });

        let f = fibonacci(n - 1, depth + 1, parentId) + fibonacci(n - 2, depth + 1, parentId);
        memo[n] = f;

        return f;
    }
}

let num = fibonacci(7, 1);
console.log(num);
console.log('memo', memo);

let depthcounter = [];
let nodeSpacings = [];
actions.forEach((action, i) => {
    if (depthcounter[action.depth]) {
        depthcounter[action.depth]++;
    } else {
        depthcounter[action.depth] = 1;
    }
    nodeSpacings[action.depth] = 0;
});

actions[0].x = width / 2;
for (let i = 1; i < actions.length; i++) {
    let action = actions[i];
    let parent = actions.filter(a => a.id === action.parent)[0];
    let offset = 300;
    if (action.base === parent.base - 1) {
        // Put it on the left
        offset = -300;
    }

    action.x = parent.x + offset * (1.8 / action.depth);
}

let dataColorScale = d3.scaleLinear()
    .domain([0, 1, 2, 3, 4, 5, 6, 7])
    .range([
        '#d53e4f',
        '#fc8d59',
        '#fee08b',
        '#ffffbf',
        '#e6f598',
        '#99d594',
        '#3288bd'
    ]);

let depthSpacing = depthcounter.map(count => {
    return 300 / count;
});
// console.log(depthSpacing);
// actions.forEach((action, i) => {
//     action.x = nodeSpacings[action.depth];
//     nodeSpacings[action.depth] += depthSpacing[action.depth];
// });
console.log(nodeSpacings);

let delay = 1000;
let calls = g.selectAll('.action')
    .data(actions, (d, i) => i);

let callsEnter = calls.enter().append('g');

callsEnter.append('line')
    .attr('x1', d => {
        let parent = actions.filter(a => a.id === d.parent)[0];
        if (parent) {
            return parent.x;
        }
        return width / 2;
    })
    .attr('y1', d => {
        let parent = actions.filter(a => a.id === d.parent)[0];
        if (parent) {
            return parent.depth * 100;
        }
        return 100;
    })
    .attr('x2', d => {
        let parent = actions.filter(a => a.id === d.parent)[0];
        if (parent) {
            return parent.x;
        }
        return width / 2;
    })
    .attr('y2', d => {
        let parent = actions.filter(a => a.id === d.parent)[0];
        if (parent) {
            return parent.depth * 100;
        }
        return 100;
    })
    .transition().duration(1000).delay((d, i) => i * delay)
    .attr('x1', d => d.x)
    .attr('y1', d => d.depth * 100)

callsEnter
    .append('text')
    .attr('x', d => {
        return d.x;
    })
    .attr('y', d => {
        return d.depth * 100;
    })
    .style('opacity', 1e-6)
    .transition().duration(1000).delay((d, i) => i * delay)
    .style('opacity', 1)
    .text(d => { if (d.memoized) return memo[d.base];
                 else return `fib(${d.base})`
    })
    .style('fill', d => dataColorScale(d.base));


function update(action) {

}

window.update = update;

function main() {
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
