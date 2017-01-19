import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');
// import linkedList from './LinkedList';
import Tree from './BST';

let actions = [];
window.actions = actions;

let interval = 500;
let tree = Object.create(Tree);
window.tree = tree;

// Setup SVG
let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 800- margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let dataColorScale = d3.scaleLinear()
    .domain([0, 100])
    .range(['#e7e1ef', '#980043']);

// Setup data
let numPoints = 50;
let data = d3.range(numPoints).map((d, i, arr) => {
    return {
        id: `data-${i}`,
        allData: arr,
        value: Math.floor(Math.random() * 89 + 10)
    };
});

// Insert all data into tree
data.forEach(d => tree.insert(d));

// Convert BST to sorted array
let sortedArr = tree.convertToSortedArray(tree.root);
sortedArr.splice(0, 0, {});


let heap = {root: sortedArr[1]};
/*
its left child is located at 2*k index
its right child is located at 2*k+1. index
its parent is located at k/2 index
*/
let heapMaxLevel = 0;
let buildHeap = function(parentIndex) {
    if (parentIndex < sortedArr.length / 2 - 1) {
        let left = sortedArr[2 * parentIndex];
        let right = sortedArr[2 * parentIndex + 1];
        let parent = sortedArr[parentIndex / 2];
        let element = sortedArr[parentIndex];


        let level = Math.floor(Math.log2(parentIndex) + 1);
        if (level > heapMaxLevel) {
            heapMaxLevel = level;
        }
        element.level = level;

        left.parent = element;
        right.parent = element;
        left.level = Math.floor(Math.log2(2 * parentIndex) + 1);
        right.level = Math.floor(Math.log2(2 * parentIndex + 1) + 1);

        element.leftChild = left;
        element.rightChild = right;

        buildHeap(parentIndex + 1);
    }
}
buildHeap(1);
// Splice out first element
sortedArr.shift();
window.sortedArr = sortedArr;


// Get levels
let maxLevel = 0;
data.forEach(d => {
    let l = d.level;
    if (l > maxLevel) {
        maxLevel = l;
    }
});

let levelStep = height / maxLevel;

// Set height based on level scaled by max levels
let xOffset = 150;
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

console.log('data', data);
let heapData = sortedArr.map(d => {
    let parent;
    let side;
    if (d.parent) {
        parent = d.parent.data.id

        side = 'left';
        let leftChild = d.parent.leftChild;
        let rightChild = d.parent.rightChild;
        if (d === rightChild) {
            side = 'right';
        }
    }
    return {
        id: d.data.id,
        level: d.level,
        value: d.value,
        parent: parent,
        side
    }
});

console.log(heapData);
window.heapData = heapData;
heapData[heapData.length - 1].level = heapData[heapData.length - 2].level;
heapData.forEach((d, i, arr) => {
    d.y = levelStep * d.level;
    if (d.parent) {
        let id = d.parent;

        // Find parent in heapData
        let p = arr.filter(a => { return a.id === id})[0];

        if (d.side === 'left') {
            d.x = p.x - xOffset * (1 / d.level);
        } else {
            d.x = p.x + xOffset * (1 / d.level);
        }
    } else {
        d.x = width / 2;
    }
});


// sortedArr.forEach((d, i, arr) => {
//     d.y = levelStep * d.level;
//     if (d.parent) {
//         let leftChild = d.parent.leftChild;
//         let rightChild = d.parent.rightChild;
//         if (leftChild === d) {
//             d.x = d.parent.x - xOffset * (1 / d.level);
//         }
//         else if (rightChild === d) {
//             d.x = d.parent.x + xOffset * (1 / d.level);
//         }
//     } else {
//         d.x = width / 2;
//     }
// });
sortedArr.shift();
console.log(sortedArr.length);

console.log('we have ' + maxLevel + ' levels');
window.data = data;

function setup() {
    data.forEach(d => {
        if (d.parent) {
            let parent = data[d.parent.split('-')[1]];
            // Draw line
            g.append('line')
                .classed('node-line', true)
                .attr('x1', d.x)
                .attr('x2', parent.x)
                .attr('y1', d.y)
                .attr('y2', parent.y)
                .style('stroke', dataColorScale(d.value));
        }
    });

    let nodes = g.selectAll('.node')
        .data(data, d => d.id);

    let nodesEnter = nodes.enter().append('g')
        // .classed('node', true)
        .attr('class', d => `node node-${d.id}`)
        .attr('transform', (d, i) => {
            return `translate(0, ${i * height / data.length})`;
        });

    nodesEnter.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 6)
        .attr('fill', d => dataColorScale(d.value));
}

function move(counter) {
    // Data join
    let nodes = d3.selectAll(`.node-data-${counter}`).data(data, d => d.id);
    nodes.transition().duration(1000).attr('transform', d => {
            return `translate(${d.x}, ${d.y})`;
        });
}

function finish() {
    d3.selectAll('.node').classed('active', false);

    console.log('finished');
}

let update = function() {
    console.log('should update');
    // Data join
    g.selectAll('.node-line').remove();
    setTimeout(() => {
        heapData.forEach((d, i, arr) => {
            if (d.parent) {
                let p = arr.filter(a => { return a.id === d.parent})[0];
                g.append('line')
                    .attr('x1', d.x)
                    .attr('x2', p.x)
                    .attr('y1', d.y)
                    .attr('y2', p.y)
                    .style('stroke', dataColorScale(d.value))
                    .style('stroke-width', '2px');
            }
        });
    }, 1000);
    // data.forEach(d => {
    //     if (d.parent) {
    //         let parent = data[d.parent.split('-')[1]];
    //         // Draw line
    //         g.append('line')
    //             .classed('.node-line', true)
    //             .attr('x1', d.x)
    //             .attr('x2', parent.x)
    //             .attr('y1', d.y)
    //             .attr('y2', parent.y)
    //             .style('stroke', dataColorScale(d.value));
    //     }
    // });
    let nodes = g.selectAll('.node')
        .data(heapData, d => {
            return d.id;
        });

    nodes.transition().duration(1000)
        .attr('transform', d => {
            return `translate(${d.x}, ${d.y})`;
        });
}


function main() {
    setup();
    // setTimeout(update, 4000);

    // Can I draw a path using vertices from polygon?
    let counter = 0;
    setTimeout(function() {
        let id = setInterval(() => {
            move(counter++);
            console.log('counting');
            if (counter >= data.length) {
                clearInterval(id);
                setTimeout(update, 1500);
                // setTimeout(runActions, 1500);
            }
        }, 100);
    }, 1000);
}

main();
