import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let actions = [];
window.actions = actions;
let interval = 10;

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
let numPoints = 15;
let idCounter = 0;
function Point(x, y) {
    this.x = x;
    this.y = y;
    this.id = `id-${idCounter++}`;
}
Point.prototype.distance = function(p) {
    return Math.sqrt((p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y));
}

// Create a set of arbitrary points
let gridSize = 50;
let points = [];
for (let i = 0; i < width; i += gridSize) {
    for (let j = 0; j < height; j += gridSize) {
        if (Math.random() < 0.8) {
            points.push(new Point(i, j));
        }
    }
}

let V = points.length;

function setup() {
    console.log('setup');
}

function finish() {
    console.log('finished');
    let action = actions[actions.length - 1];
    let parent = action.parent.slice(1);
    let ps = g.selectAll('.point')
        .transition().duration(1000)
        .style('fill', 'green');

    let t = d3.transition().duration(interval);
    let parentLines = g.selectAll('.parent-line')
        .data(parent, (d, i) => points[i].id);

    // Exit
    // parentLines.exit().remove();

    // Update
    // parentLines.transition(t)
    //     .attr('class', 'parent-line')
    //     .attr('x1', (d, i) => points[i + 1].x)
    //     .attr('y1', (d, i) => points[i + 1].y)
    //     .attr('x2', (d, i) => points[d].x)
    //     .attr('y2', (d, i) => points[d].y)
    //     // .style('stroke', 'green');
    //     .style('stroke', 'white');

    parentLines.enter().append('line')
        .transition(t)
        .attr('class', 'parent-line')
        .attr('x1', (d, i) => points[i + 1].x)
        .attr('y1', (d, i) => points[i + 1].y)
        .attr('x2', (d, i) => points[d].x)
        .attr('y2', (d, i) => points[d].y)
        .style('stroke', d => {
            // return 'green';
            return 'white';
        })
        // .style('stroke-width', '10px');

    startPathfinding();
}

function startPathfinding() {
    console.log('starting path finding');
    let lastPointIdx = points.length - 1;
    let parent = actions[actions.length - 1].parent;

    // Make my life easy, just put another circle on top of last point in red
    // to show desitnation
    g.append('circle').datum(lastPointIdx)
        .attr('cx', d => points[d].x)
        .attr('cy', d => points[d].y)
        .attr('r', 10)
        .style('fill', 'red');
    printPath(parent, lastPointIdx);
    console.log(path);
    let counter = 0;
    let robot = g.append('circle').attr('class', 'robot')
        .datum(path[counter]);

    robot.attr('cx', d => points[0].x)
        .attr('cy', d => points[0].y)
        .attr('r', 10);

    let loopId = setInterval(loop, 600);
    function loop() {
        // Data join
        if (counter < path.length) {
        robot.datum(path[counter++]);

        robot.transition().duration(500)
            .attr('cx', d => points[d].x)
            .attr('cy', d => points[d].y)
            .attr('r', 10);
        } else {
            clearInterval(loopId);
        }
    }
}

// A utility function to find the vertex with minimum key value, from
// the set of vertices not yet included in MST
function minKey(key, mstSet) {
    let min = Infinity,
        minIndex;

    for (let v = 0; v < V; v++) {
        if (mstSet[v] === false && key[v] < min) {
            min = key[v];
            minIndex = v;
        }
    }

    return minIndex;
}

function printMST(parent, n, graph) {
    console.log('Edge     Weight\n');
    for (let i = 1; i < V; i++) {
        console.log(`${parent[i]} - ${i}    ${graph[i][parent[i]]}`);
    }
}

function primMST(graph) {
     let parent = []; // Array to store constructed MST
     let key = [];   // Key values used to pick minimum weight edge in cut
     let mstSet = [];  // To represent set of vertices not yet included in MST

     // Initialize all keys as INFINITE
     for (let i = 0; i < V; i++) {
        key[i] = Infinity, mstSet[i] = false;
     }

     // Always include first 1st vertex in MST.
     key[0] = 0;     // Make key 0 so that this vertex is picked as first vertex
     parent[0] = -1; // First node is always root of MST

     // The MST will have V vertices
     for (let count = 0; count < V-1; count++)
     {
        // Pick the minimum key vertex from the set of vertices
        // not yet included in MST
        let u = minKey(key, mstSet);

        // Add the picked vertex to the MST Set
        mstSet[u] = true;

        // Update key value and parent index of the adjacent vertices of
        // the picked vertex. Consider only those vertices which are not yet
        // included in MST
        for (let v = 0; v < V; v++) {
           // graph[u][v] is non zero only for adjacent vertices of m
           // mstSet[v] is false for vertices not yet included in MST
           // Update the key only if graph[u][v] is smaller than key[v]
          if (graph[u][v] && mstSet[v] == false && graph[u][v] < key[v]) {
             parent[v]  = u, key[v] = graph[u][v];
             actions.push({type: 'success', u, v, parent: parent.slice() })
          }
        }
     }

    console.log('parent', parent);
    printMST(parent, V, graph);
}

console.log(points);
// let points = d3.range(numPoints).map((d, i) => {
//     return new Point(
//     );
// });



function constructGraph(n) {
    // Create a graph where weights are equal to the euclidean distance between
    // points


    // Initalize graph
    let graph = [];
    for (let i = 0; i < n; i++) {
        graph[i] = [];
    }

    let t = d3.transition().duration(interval)
        .ease(d3.easeCubic);
    // For each point, loop through all other points and set the weight based
    // on euclidean distance
    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < points.length; j++) {
            // Only if the points are not one in the same
            if (points[i] !== points[j]) {
                graph[i][j] = points[i].distance(points[j]);
                // Draw a series of light lines
                // g.append('line')
                //     .style('opacity', 1e-6)
                //     .classed('line-light', true)
                //     .transition(t)
                //     .style('opacity', 1)
                //     // .style('stroke-width', '2px')
                //     .attr('x1', points[i].x)
                //     .attr('y1', points[i].y)
                //     .attr('x2', points[j].x)
                //     .attr('y2', points[j].y);
            } else{
                graph[i][j] = 0;
            }
        }
    }

    // Draw them to the screen
    // g.selectAll('.point')
    //     .data(points, d => d.id).enter()
    //     .append('circle')
    //     .attr('r', 0)
    //     .style('opacity', 1e-6)
    //     .transition(t)
    //     .attr('class', 'point')
    //     .attr('cx', d => d.x)
    //     .attr('cy', d => d.y)
    //     .attr('r', 7)
    //     .style('opacity', 1);
    // g.selectAll('.point-text')
    //     .data(points).enter().append('text')
    //     .text((d, i) => i)
    //     .attr('x', d => d.x)
    //     .attr('y', d => d.y)
    //     .style('stroke', 'blue');
    return graph
}

let path = [];
function printPath(parent, j) {
    if (parent[j] == -1) {
        return;
    }

    printPath(parent, parent[j]);
    path.push(j);
}

function update(action, counter) {
    let ps = g.selectAll('.point')
        .data(points, d => d.id);

    console.log(action);

    ps.transition().duration(interval)
        .attr('fill', d => {
            if (d.x === points[action.u].x) {
                return 'green';
            } else if (d.x === points[action.v].x) {
                return 'red';
            } else {
                return 'darkgray';
            }
        });

    // action.parent.shift();
    let t = d3.transition().duration(interval);
    let parentLines = g.selectAll('.parent-line')
        .data(action.parent.slice(1), (d, i) => points[i].id);

    // Exit
    parentLines.exit().remove();

    // Update
    parentLines.transition(t)
        .attr('class', 'parent-line')
        .attr('x1', (d, i) => points[i + 1].x)
        .attr('y1', (d, i) => points[i + 1].y)
        .attr('x2', (d, i) => points[d].x)
        .attr('y2', (d, i) => points[d].y)
        .style('stroke', 'green');

    parentLines.enter().append('line')
        .transition(t)
        .attr('class', 'parent-line')
        .attr('x1', (d, i) => points[i + 1].x)
        .attr('y1', (d, i) => points[i + 1].y)
        .attr('x2', (d, i) => points[d].x)
        .attr('y2', (d, i) => points[d].y)
        .style('stroke', d => {
            return 'red';
        });
}
function main() {
    // Set
    // let graph = [
    //     [0, 2, 0, 6, 0],
    //     [2, 0, 3, 8, 5],
    //     [0, 3, 0, 0, 7],
    //     [6, 8, 0, 0, 9],
    //     [0, 5, 7, 9, 0]
    // ];

    // function loop() {
    //     let counter = 0;
    //     setTimeout(function() {
    //         let loopId = setInterval(() => {
    //             if (actions[counter]) {
    //                 update(actions[counter++], counter);
    //             } else {
    //                 clearInterval(loopId);
    //                 finish();
    //             }
    //         }, interval);
    //     }, 1500);
    // }

    // Can I draw a path using vertices from polygon?
    setTimeout(() => {
        let graph = constructGraph(points.length);
        primMST(graph);
        setTimeout(() => {
            finish();
        }, 1000);
        // loop();
    }, 1000)
}

main();
