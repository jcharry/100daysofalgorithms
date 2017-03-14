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

let numDisks = 6;
let colPos = [100, 300, 500];
let colCount = [numDisks, 0, 0];

// Posts
let posts = d3.range(3);
g.selectAll('.posts').data(posts).enter().append('rect')
    .attr('width', 20)
    .attr('height', 200)
    .attr('x', (d, i) => colPos[i] - 10)
    .attr('y', height / 2 - 20)
    .style('fill', 'rgba(0, 0, 0, 0.5)');

let colorScale = d3.scaleLinear()
    .domain([0, numDisks])
    .range(['#fc8d59', '#99d594']);

let disk = {
    init: function(x, y, width, id) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.id = id;
    }
};

let disks = [];
for (let i = 0; i < numDisks; i++) {
    let d = Object.create(disk);
    d.init(colPos[0], height / 2 + i * 30, i * 20 + 50, i + 1);
    disks.push(d);
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function move(n, a, b, c) {
    if (n > 0) {
        move(n - 1, a, c, b);
        console.log("Move disk " + n + " from " + a + " to " + c);
        let activeDisk = disks[n - 1];
        colCount[a] -= 1;
        colCount[c] += 1;
        activeDisk.x = colPos[c];
        activeDisk.y = (height / 2 + numDisks * 30) - colCount[c] * 30;
        actions.push({type: 'move', disks: clone(disks), from: a, to: c, disk: n});
        move(n - 1, b, a, c);
    }
}
// move(numDisks, "A", "B", "C");
move(numDisks, 0, 1, 2);


console.log(disks);

let disksData = g.selectAll('.disk').data(disks, d => d.id);
disksData.enter().append('rect')
    .attr('class', 'disk')
    .attr('x', d => colPos[0] - d.width / 2)
    .attr('y', d => d.y)
    .attr('width', d => d.width)
    .attr('height', d => 30)
    .style('fill', d => colorScale(d.id));

function update(counter) {
    let action = actions[counter];
    let t = d3.transition().duration(interval);
    console.log(action);
    let disksData = g.selectAll('.disk').data(action.disks, d => d.id);

    disksData.transition(t)
        .attr('x', d => d.x - d.width / 2)
        .attr('y', d => d.y);
}

let interval = 200;
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

