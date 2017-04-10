import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let margin = {top: 100, right: 100, bottom: 0, left: 100},
    width = 1800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g').attr('class', 'svg-group')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let actions = [];
window.actions = actions;

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function linkedList() {
    let _head = null, _tail = null, _nodeId = 0;

    function node(data) {
        return {
            next: null,
            data: data,
            id: _nodeId++
        }
    }

    function insert(data) {
        let n = node(data);
        if (_head === null) {
            _head = n;
            return;
        }

        let current = _head;
        while (current.next) {
            current = current.next;
        }

        current.next = n;
        _tail = n;
    }

    function getKthElement(k) {
        if (!_head) {
            return new Error('no head');
        }

        let current = _head;
        for (let i = 0; i < k - 1; i++) {
            if (!current) {
                return new Error('k value too high');
            }
            current = current.next;
        }

        return current;
    }

    // less efficient way to check for cycle
    // requires extra data structure, but O(n) time
    function hasCycle() {
        if (!_head) {
            return false;
        }

        let current = _head;
        let map = {};
        do {
            if (map[current.id]) { return true; }
            else { map[current.id] = true; }
            map[current.id] = true;
            current = current.next;
        } while (current.next);

        return false;
    }

    // More efficient, using slow iterator and fast iterator
    function hasLoop() {
        let slowNode = _head; let fastNode = _head;
        actions.push({type: 'initialize', slowNode: slowNode.id, fastNode: fastNode.id});
        // Move slowNode by 1 and fastNode by 2

        while (slowNode.next && fastNode.next.next) {
            slowNode = slowNode.next;
            fastNode = fastNode.next.next;
            actions.push({type: 'loop', slowNode: slowNode.id, fastNode: fastNode.id});
            if (slowNode === fastNode) {
                actions.push({type: 'loop-found', slowNode: slowNode.id, fastNode: fastNode.id});
                return true;
            }
        }

        return false;
    }

    function getArrayOfNodes() {
        if (!_head) { return [] }

        let current = _head;
        let result = [];
        while (current) {
            result.push(current);
            current = current.next;
        }

        return result;
    }

    return {
        insert,
        getKthElement,
        hasCycle,
        hasLoop,
        getArrayOfNodes,
        get tail() {
            return _tail;
        },
        get head() {
            return _head;
        }
    }

}

let ll = linkedList();
let range = d3.range(20);

for (let i = 0; i < range.length; i++) {
    ll.insert(range[i]);
}
let fourthElement = ll.getKthElement(4);
let fifteenthElement = ll.getKthElement(15);

let allNodes = ll.getArrayOfNodes();

// Induce a cycle
fifteenthElement.next = fourthElement;
ll.hasLoop();

let colorScale = d3.scaleLinear()
    .domain([0, allNodes.length])
    .range(['#fc8d59', '#99d594']);

let nodeElts = g.selectAll('.node').data(allNodes, (d, i) => d.id);
nodeElts.enter().append('circle').attr('class', 'node')
    .attr('cx', (d, i) => {
        d.x1 = i * 45;
        if (d.next) {
            d.x2 = (i + 1) * 45;
        }
        return d.x1;
    })
    .attr('cy', d => {
        d.y = height / 2
        return d.y;
    })
    .attr('r', 15)
    .style('fill', d => colorScale(d.data));

// Draw an arc where the loop is happening
let curvePoints = [[14 * 45 - 10, height / 2 - 20],
    [9 * 45, height / 2 - 150],
    [4 * 45 + 10, height / 2 - 20]]

let curve = d3.line()
    .x(d => d[0])
    .y(d => d[1])
    .curve(d3.curveMonotoneX);

let lineElts = g.selectAll('.line').data(allNodes, (d, i) => `line-${d.id}`);
lineElts.enter().append('path').attr('d', d => {
    if (d.next && d.id !== 14) {
        let path = d3.path();
        path.moveTo(d.x1 + 10, d.y);
        path.lineTo(d.x2 - 10, d.y);
        return path._;
    } else if (d.id === 14) {
        return curve(curvePoints);
    }
    })
    .style('fill', 'none')
    .style('stroke', 'red');



console.log(actions);
function update(counter) {
    let action = actions[counter];
    let t = d3.transition().duration(interval - 10);

    console.log(action);
    g.selectAll('.node').transition(t).style('fill', function(d) {
        if (action.slowNode === d.id) {
            return 'blue';
        } else if (action.fastNode === d.id) {
            return 'black';
        } else {
            return colorScale(d.id);
        }
    })
}

let interval = 1500;
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

