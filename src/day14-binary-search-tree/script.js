import * as d3 from 'd3';
require('./styles.scss');

// Setup SVG
let actions = [];
window.actions = actions;
let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

function update(action, counter) {
    console.log('running action ' + counter);
    switch (action.type) {
        case 'sweepline-left':
        case 'sweepline-right':
            updateSweepline(action.x);
            break;
        case 'active-list':
            updateActiveList(action.activeList);
            break;
    }
}

let colorScale = d3.scaleOrdinal()
    .domain([0, 1, 2, 3, 4, 5, 6, 7])
    .range(['#feedde', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#8c2d04']);

let data = d3.range(10).map((d, i, arr) => {
    return {
        id: `data-${i}`,
        allData: arr,
        value: Math.floor(Math.random() * 89 + 10)
    };
});

let Node = {
    data: null,
    value: null,
    leftChild: null,
    rightChild: null
};
let Tree = {
    root: null,
    insert: function(obj) {
        let node = Object.create(Node);
        let root = this.root;
        let current, parent;
        let value = obj.value;

        node.value = obj.value;
        node.data = obj;

        // If the root doesn't exist yet, this node must be the root;
        if (root === undefined || root === null) {
            // actions.push({type: 'push', data: data, key})
            obj.level = 0;
            this.root = node;
            return;
        }

        // Set the current node to the root
        current = root;

        // Move down through the tree, and check to ensure there's
        // still a node to look at
        let level = 0;
        while(current) {
            level++;
            // Data is less than parent value -> so it should go to the left
            if (value < current.value) {
                // If the left child doesnt' exist, then that's where we put
                // the data, otherwise we have to check (i.e set current to the
                // left child and loop again
                if (current.leftChild) {
                    current = current.leftChild;
                } else {
                    node.level = level;
                    obj.level = level;
                    obj.parent = current.data.id;
                    node.parent = current;
                    current.leftChild = node;
                    return;
                }
            } else {
                // We're on the right side of the tree
                if (current.rightChild) {
                    current = current.rightChild;
                } else {
                    node.parent = current;
                    node.level = level;
                    obj.level = level;
                    obj.parent = current.data.id;
                    current.rightChild = node;
                    return;
                }
            }
        }
    }
};

let tree = Object.create(Tree);
data.forEach(d => tree.insert(d));
// How many levels do we have?
let maxLevel = 0;
data.forEach(d => {
    let l = d.level;
    if (l > maxLevel) {
        maxLevel = l;
    }
});

// Build out structure for visualization
let levelStructure = {};
data.forEach(d => {
    if (levelStructure[d.level]) {
        levelStructure[d.level].push(d);
    } else {
        levelStructure[d.level] = [d];
    }
});
// Sort levels by value
Object.keys(levelStructure).forEach(idx => {
    let l = levelStructure[idx];
    if (l.length > 1) {
        l.sort((a, b) => {
            if (a.value < b.value) {
                return -1;
            }
            if (a.value > b.value) {
                return 1;
            }

            return 0;
        })
    }
});

let levelStep = height / maxLevel;
// Determine x and y positions for items based on levelStructure
// Object.keys(levelStructure).forEach(idx => {
//     let l = levelStructure[idx];
//     let numObjs = l.length;
//     let widthStep = width / numObjs;
//
//     l.forEach((obj, i) => {
//         let dir = -1;
//         if (i < numObjs / 2) { dir = 1; }
//         obj.y = levelStep * obj.level;
//         obj.x = widthStep * i;
//     });
// });


// Set height based on level scaled by max levels
let xOffset = 200;
data.forEach(d => {
    d.y = levelStep * d.level;
    if (d.parent) {
        let id = d.parent;
        let idx = Number(id.split('-')[1]);
        let p = data[idx];
        if (d.value < p.value) {
            d.x = p.x - xOffset * (1 / d.level);
        } else {
            d.x = p.x + xOffset * (1 / d.level);
        }
    } else {
        d.x = width / 2;
    }
});

console.log('we have ' + maxLevel + ' levels');
window.data = data;

let interval = 1000;
function startLoop() {
    let i = 0;
    let loop = setInterval(() => {
        console.log('iteration number', i, 'num actions', actions.length);
        if (actions[i]) {
            update(actions[i], i);
        }
        if (actions.length === i) {
            finish();
            window.clearInterval(loop);
        }
        i++;
    }, interval);
}

function finish() {
    console.log('done!');
}

let lineGenerator = d3.line()
    .x(d => d.x)
    .y(d => d.y);

function setup() {
    data.forEach(d => {
        if (d.parent) {
            let parent = data[d.parent.split('-')[1]];
            // Draw line
            let line = g.append('line')
                .attr('x1', d.x)
                .attr('x2', parent.x)
                .attr('y1', d.y)
                .attr('y2', parent.y)
                .style('stroke', colorScale(d.level));
        }
    });

    let nodes = g.selectAll('.node')
        .data(data, d => d.id);

    let nodesEnter = nodes.enter().append('g')
        .classed('node', true)
        .attr('class', d => `node-${d.id}`)
        .attr('transform', (d, i) => {
            return `translate(0, ${i * height / data.length})`;
        });

    nodesEnter.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 20)
        // .attr('fill', 'white');
        .attr('fill', d => colorScale(d.level));

    nodesEnter.append('text')
        .attr('x', -8)
        .attr('y', 5)
        .text(d => d.value);
}

function move(counter) {
    // Data join
    let nodes = d3.selectAll(`.node-data-${counter}`).data(data, d => d.id);
    nodes.transition().duration(1000).attr('transform', d => {
            return `translate(${d.x}, ${d.y})`;
        });

}
function main() {
    setup();

    // Can I draw a path using vertices from polygon?
    let counter = 0;
    setInterval(() => {
        move(counter++);
    }, 1000);
}

main();
