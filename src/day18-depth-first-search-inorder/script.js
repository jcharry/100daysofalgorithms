import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

// Setup SVG
let actions = [];
window.actions = actions;
let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

function update(action, counter) {
    console.log('running action ' + counter + ' with type ' + action.type);
    switch (action.type) {
        case 'enqueue': {
            // Highlight base node in red
            d3.select(`.node-${action.id}`)
                .classed('active', true);
                // .transition().duration(500)

            // Get all items that are in the queue
            let items = action.q._items;
            items.forEach((item, i) => {
                console.log('should move item', item);
                let id = item.data.id;
                g.select(`.bfs-${id}`)
                    .transition().duration(interval)
                    .attr('transform', `translate(${width / 2 - 50 + i * 50}, ${height - height / 3})`);
                    // .attr('x', i * 50)
                    // .attr('y', height - height / 3);
            });
            break;
        }
        case 'enqueue-left':
        case 'enqueue-right': {
            // Remove active calss from everything
            d3.selectAll('.node')
                .classed('active', false);
            let items = action.q._items;
            items.forEach((item, i) => {
                console.log('should move item', item.data.id);
                let id = item.data.id;
                // Set active class on base nodes
                d3.select(`.node-${id}`)
                    .classed('active', true);
                // Move bfs node
                g.select(`.bfs-${id}`)
                    .transition().duration(interval)
                    .attr('transform', `translate(${width / 2 - 50 + i * 50}, ${height - height / 3})`);
            });
            break;
        }
        case 'dequeue': {
            let id = action.id;
            g.select(`.node-${id}`)
                .classed('dequeue', true);
            g.select(`.bfs-${id}`)
                .transition().duration(interval)
                .attr('transform', `translate(0, ${height / 2})`)
                .style('opacity', 1e-6);
            break;
        }
        case 'traverse': {
            let id = action.id;
            g.select(`.bfs-${id}`)
                .style('stroke', 'green')
                .style('stroke-width', '5px');
        }
    }
}

let dataColorScale = d3.scaleLinear()
    .domain([0, 100])
    .range(['#d4b9da', '#67001f']);
let levelColorScale = d3.scaleOrdinal()
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8])
    // .range(['#feedde', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#8c2d04']);
    .range([
'#f7fcfd',
'#e0ecf4',
'#bfd3e6',
'#9ebcda',
'#8c96c6',
'#8c6bb1',
'#88419d',
'#810f7c',
'#4d004b'
    ]);

let queue = function(items) {
    let _items;
    if (typeof items === 'object' && items.length !== 0) _items = items;
    else _items = [];

    let enqueue = function(obj) {
        _items.push(obj);
    };
    let dequeue = function() {
        return _items.shift();
    };
    let isEmpty = function() {
        return _items.length === 0;
    };

    let copy = function() {
        return queue(_items.slice());
    };

    return {
        _items,
        enqueue,
        dequeue,
        isEmpty,
        copy
    };
};


let Node = {
    data: null,
    value: null,
    leftChild: null,
    rightChild: null
};
let Tree = {
    root: null,
    height: function(node) {
        if (node === undefined || node === null) return 0;

        let leftHeight = this.height(node.leftChild);
        let rightHeight = this.height(node.rightChild);

        let max = Math.max(leftHeight, rightHeight);
        return max + 1;
    },
    insert: function(obj) {
        let node = Object.create(Node);
        let root = this.root;
        let current;
        let value = obj.value;

        node.value = obj.value;
        node.data = obj;

        // If the root doesn't exist yet, this node must be the root;
        if (root === undefined || root === null) {
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
    },
    bfs: function(root) {
        if (root === undefined) return;

        // Create new queue
        let q = queue();

        // Enqueue root and initialize height
        q.enqueue(root);
        actions.push({type: 'enqueue', id: root.data.id, q: q.copy()});

        while (!q.isEmpty()) {
            // Get the node from the queue and remove it
            let node = q.dequeue();
            actions.push({type: 'dequeue', id: node.data.id, q: q.copy()});
            console.log(node.data.value);

            if (node.leftChild) {
                q.enqueue(node.leftChild);
                actions.push({type: 'enqueue-left', id: node.data.id, q: q.copy()});
            }

            if (node.rightChild) {
                q.enqueue(node.rightChild);
                actions.push({type: 'enqueue-right', id: node.data.id, q: q.copy()});
            }
        }
    },
    dfs: function(root, type) {
        switch (type) {
            case 'postorder':
                return this.dfsPostorder(root);
            case 'preorder':
                return this.dfsPreorder(root);
            case 'inorder':
                return this.dfsInorder(root);
            default:
                return this.dfsInorder(root);
        }
    },
    dfsPostorder: function(root) {
        if (root === undefined || root === null) {
            return;
        }

        this.dfsPostorder(root.leftChild);
        this.dfsPostorder(root.rightChild);
        actions.push({type: 'traverse', id: root.data.id});
    },
    dfsPreorder: function(root) {
        if (root === undefined || root === null) {
            return;
        }

        actions.push({type: 'traverse', id: root.data.id});
        this.dfsPreorder(root.leftChild);
        this.dfsPreorder(root.rightChild);
    },
    dfsInorder: function(root) {
        if (root === undefined || root === null) {
            return;
        }

        this.dfsInorder(root.leftChild);
        actions.push({type: 'traverse', id: root.data.id});
        this.dfsInorder(root.rightChild);
    }
};
let numPoints = 50;
let data = d3.range(numPoints).map((d, i, arr) => {
    return {
        id: `data-${i}`,
        allData: arr,
        value: Math.floor(Math.random() * 89 + 10)
    };
});
let tree = Object.create(Tree);
window.tree = tree;
data.forEach(d => tree.insert(d));
tree.dfs(tree.root, 'inorder');
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
        });
    }
});

let levelStep = height / maxLevel;

// Set height based on level scaled by max levels
let xOffset = 180;
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

// let interval = 1000;
// function startLoop() {
//     let i = 0;
//     let loop = setInterval(() => {
//         console.log('iteration number', i, 'num actions', actions.length);
//         if (actions[i]) {
//             update(actions[i], i);
//         }
//         if (actions.length === i) {
//             finish();
//             window.clearInterval(loop);
//         }
//         i++;
//     }, interval);
// }

// function finish() {
//     console.log('done!');
// }

// let lineGenerator = d3.line()
//     .x(d => d.x)
//     .y(d => d.y);

function setup(clone) {
    if (!clone) {
        data.forEach(d => {
            if (d.parent) {
                let parent = data[d.parent.split('-')[1]];
                // Draw line
                g.append('line')
                    .attr('x1', d.x)
                    .attr('x2', parent.x)
                    .attr('y1', d.y)
                    .attr('y2', parent.y)
                    .style('stroke', dataColorScale(d.value));
                    // .style('stroke', levelColorScale(d.level));
            }
        });
    }

    let nodes = g.selectAll(clone ? '.bfs' : '.node')
        .data(data, d => d.id);

    let nodesEnter = nodes.enter().append('g')
        // .classed('node', true)
        .attr('class', d => clone ? `bfs-node bfs-${d.id}` : `node node-${d.id}`)
        .attr('transform', (d, i) => {
            return `translate(0, ${i * height / data.length})`;
        });

    nodesEnter.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 6)
        // .attr('fill', 'white');
        // .attr('fill', d => levelColorScale(d.level));
        .attr('fill', d => dataColorScale(d.value));

    // nodesEnter.append('text')
    //     .attr('x', -8)
    //     .attr('y', 5)
    //     .text(d => d.value);
}

function move(counter) {
    // Data join
    let nodes = d3.selectAll(`.node-data-${counter}`).data(data, d => d.id);
    nodes.transition().duration(1000).attr('transform', d => {
            return `translate(${d.x}, ${d.y})`;
        });

    let bfsnodes = d3.selectAll(`.bfs-data-${counter}`).data(data, d => d.id);
    bfsnodes.transition().duration(1000).attr('transform', d => {
            return `translate(${d.x}, ${d.y})`;
        });
}

function finish() {
    d3.selectAll('.node').classed('active', false);

    d3.selectAll('.bfs-node')
        .transition().duration(interval)
        .attr('transform', `translate(0, ${height / 2})`)
        .style('opacity', 1e-6);
    console.log('finished');
}

let interval = 500;
function runBfs() {
    console.log('should run bfs');
    let counter = 0;
    let loopId = setInterval(function() {
        if (counter < actions.length) {
            update(actions[counter], counter);
            counter++;
        } else {
            clearInterval(loopId);
            finish();
        }
    }, interval);
}

function main() {
    setup();
    setup(true);

    // Can I draw a path using vertices from polygon?
    let counter = 0;
    setTimeout(function() {
        let id = setInterval(() => {
            move(counter++);
            console.log('counting');
            if (counter >= data.length) {
                clearInterval(id);
                setTimeout(runBfs, 1500);
            }
        }, 100);
    }, 1000);
}

main();
