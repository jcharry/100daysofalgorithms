import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let margin = {top: 100, right: 100, bottom: 100, left: 100},
    width = 2000 - margin.left - margin.right,
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

var doors=[];
for(let i=0; i<100; i++) {
    doors[i]=false;
}
actions.push({type: 'add', doors: doors.slice()});

function node(data) {
    return {
        next: null,
        data
    }
}

const linkedList = {
    head: null,
    insertAtEnd: function(node) {
        if (!this.head) {
            this.head = node;
            let nodeArr = this.getNodeArray();
            actions.push({type: 'add-node', nodeArr});
            return;
        }

        let currentNode = this.head;
        actions.push({type: 'next', currentNode, next: currentNode.next});
        while (currentNode.next) {
            currentNode = currentNode.next;
            actions.push({type: 'next', currentNode, next: currentNode.next});
        }

        currentNode.next = node;
        let nodeArr = this.getNodeArray();
        actions.push({type: 'add-node', currentNode, nodeToAdd: node, next: currentNode.next, nodeArr});
    },

    getNodeArray: function() {
        if (!this.head) {
            return [];
        }

        let nodes = [];
        let currentNode = this.head;
        while (currentNode) {
            nodes.push(currentNode);
            currentNode = currentNode.next;
        }
        return nodes;
    }
}

let counter = 0;
for (let i = 0; i < 10; i++) {
    linkedList.insertAtEnd(node(counter++));
}

function update(counter) {
    let action = actions[counter];
    let t = d3.transition().duration(interval - 10);
    console.log(action);

    switch (action.type) {
        case 'add-node': {
            if (action.nodeArr.length > 1) {
                g.append('line')
                    .attr('x1', (action.nodeArr.length - 2) * 45)
                    .attr('y1', 100)
                    .attr('x2', (action.nodeArr.length - 1) * 45)
                    .attr('y2', 100)
                    .style('stroke', 'lightgray')
                    .style('stroke-width', '1px')
            }

            let nodes = g.selectAll('.node')
                .data(action.nodeArr, d => d.data)
                .enter()
                .append('circle')
                .attr('class', 'node')
                .attr('id', d => `d-${d.data}`)
                .attr('cx', (d, i) => i * 45)
                .attr('cy', 100)
                .attr('r', 17)
                .style('fill', '#addd8e');

            break;
        }
        case 'next': {
            g.selectAll('.node').style('stroke', function(d, i) {
                if (d.data === action.currentNode.data) {
                    return 'red';
                }
                this.style.fill;
            })
                .attr('stroke-width', '2px');
            break;
        }
    }
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

