import * as d3 from 'd3';
import nytimesHtml from './nytimes.html.txt';
import testText from './test.txt';
window.d3 = d3;
require('./styles.scss');

import testHtml from './testHtml.txt';
let margin = {top: 100, right: 25, bottom: 0, left: 25},
    width = 1800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let canvas = d3.select('body').append('canvas')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);
    // .attr('transform', `translate(${margin.left}, ${margin.top})`);
let ctx = canvas.node().getContext('2d');

let g = svg.append('g').attr('class', 'svg-group')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let actions = [];
window.actions = actions;

let dummyDiv = document.createElement('div');
dummyDiv.innerHTML = nytimesHtml;
// document.body.appendChild(dummyDiv);

let nodes = [];
function node(elt, parent, level) {
    return {
        element: elt,
        parent,
        level,
        children: null
    }
}

let levelCount = {}
window.levelCount = levelCount;
// nodes.push(node(dummyDiv, null, 0));
let root = node(dummyDiv, null, 0);
// Walk down the tree collecting nodes
function walk(root, parent, level) {
    let children = root.element.children;
    if (!levelCount[level]) { levelCount[level] = 0; }

    if (children.length === 0) {
        let leaf = node(root.element, parent, level - 1);
        return leaf;
    }

    let childNodes = [];
    for (let i = 0; i < children.length; i++) {
        levelCount[level] = levelCount[level] + 1;
        let child = children[i];
        let n = node(child, root, level);
        // nodes.push(n);
        let childNode = walk(n, root, level + 1);
        childNodes.push(childNode);
    }
    root.children = childNodes;
    return root;
}

walk(root, null, 1);
console.log(root);
//
let tree = d3.tree();
root.x = width / 2;
root.y = 0;


let colorScale = d3.scaleLinear()
    .domain([0, 11])
    .range(['#fff7f3', '#fa9fb5', '#66c2a4']);
// walk again and set x's and y's
function setPos(root, bounds) {
    if (!root.children) {
        return;
    }

    // Space out remaining bounds evenly to children
    let n = root.children.length;
    let spacing = (bounds.max - bounds.min) / n;

    for (let i = 0; i < root.children.length; i++) {
        let child = root.children[i];
        child.x = bounds.min + (spacing * i) + (spacing / 2);
        child.y = child.level * 30;
        g.append('text').attr('x', child.x).attr('y', child.y).text(child.element.tagName).style('fill', colorScale(child.level));
        setPos(child, {min: child.x - (spacing / 2), max: child.x + (spacing / 2)});
    }
}

setPos(root, {min: 0, max: width});
console.log(root);

g.selectAll('.node').data(root)

// Initialize usedLevel
// let usedLevel = {};
// Object.keys(levelCount).forEach(key => {
//     usedLevel[key] = 0;
// });
//

// console.log(nodes);
// console.log(levelCount);

// nodes[0].x = width / 2;
// nodes[0].y = 0;

nodes.forEach(n => {
    console.log(n.parent);
    if (n.parent) {
        n.y = n.parent.y + 20;
    }
});

// g.selectAll('.node').data(nodes).enter().append('text')
//     .attr('x', width / 2)
//     .attr('y', d => {
//         if (d.y) return d.y;
//         else return 0;
//     })
//
//     .text(d => {
//         console.log(d.element.tagName);
//         return d.element.tagName;
//     });

function update(counter) {
    let action = actions[counter];
    let t = d3.transition().duration(interval - 10);
}

let interval = 400;
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

