import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let colorScale = d3.scaleLinear()
    .domain([0, 6])
    .range(['#0c2c84', '#41b6c4']);

let actions = [];

const cantor = function(x, y, len, depth) {

    actions.push({type: 'call', x, y, len, depth});
    // Call cantor two more times, at (0, +y) and at (2/3 * len, +y)
    if (len > 10) {
        cantor(x, y + 50, len / 3, depth + 1);
        cantor(x + 2 / 3 * len, y + 50, len / 3, depth + 1);
    }
}

cantor(10, 0, width, 0);
console.log(actions);

g.selectAll('.line').data(actions).enter().append('line')
        .attr('x1', d => d.x)
        .attr('y1', d => d.y)
        .attr('y2', d => d.y)
        .attr('x2', d => d.x)
        .style('stroke', d => colorScale(d.depth))
        .style('stroke-width', '5px')
        .transition().duration(1000).delay((d, i) => i * 500)
        .attr('x2', d => d.x + d.len);
// actions.forEach(action => {
//     g.append('line')
//         .attr('x1', action.x)
//         .attr('y1', action.y)
//         .transition().duration(1000).delay(100)
//         .attr('x2', action.x + action.len)
//         .attr('y2', action.y)
//         .style('stroke', 'red');
// })

let update = function() {
}


// setInterval(animate, 16);
// setTimeout(animate, 500);
