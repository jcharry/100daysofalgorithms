import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

// Selection Sort!
function swap(arr, i, j) {
    let tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
    return arr;
}

function minInSubArray(arr, start) {
    let min = {val: arr[start], idx: start};
    for (let i = start + 1; i < arr.length; i++) {
        let val = arr[i];
        if (val < min.val) {
            min.val = val;
            min.idx = i;
        }
    }
    return min;
}

function selectionSort(arr) {
    // Start by finding minimum value in the array
    let min;
    for (let i = 0; i < arr.length; i++) {
        min = minInSubArray(arr, i);
        swap(arr, i, min.idx);
        steps.push({
            arrState: arr.slice(0),
            currentIdx: i,
            swapIdx: min.idx
        });
    }
}

let steps = [];

let margin = {top: 50, right: 50, bottom: 50, left: 50},
// let margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// let interp = d3.interpolateHsl('#ff8400', '#05ffc1');
let arrLen = 100;
let a = d3.shuffle(d3.range(arrLen));

let colorScale = d3.scaleLinear()
    .domain([0, arrLen])
    .range(['#ff8400', '#0544ff']);

function update(data, cb) {
    // Data join
    let sortable = g.selectAll('.sortable')
        .data(data.arrState, d => d);

    // Transition
    let t = d3.transition()
        .duration(500)
        .delay((d, i) => i * 100);

    // Exit
    sortable.exit()
        .classed('sortable', true)
        .transition(t)
        .style('opacity', 1e-6)
        .remove();

    // Update
    sortable
        .style('stroke-width', 2)
        .style('stroke', (d, i) => {
            if (i === data.currentIdx) {
                return 'red';
            } else if (i === data.swapIdx) {
                return 'white';
            }
        })
        .transition(t)
        .attr('x', (d, i) => i * (width / arrLen))
        .on('end', (d, i) => {
            if (i === arrLen - 1) {
                if (cb) cb();
            }
        });

    // Enter
    sortable.enter()
        .append('rect')
        .classed('sortable', true)
        .attr('x', (d, i) => i * (width / arrLen))
        .attr('y', 0)
        .attr('height', height)
        .attr('width', width / arrLen)
        .style('fill', d => {
            return colorScale(d);
        })
        .transition(t)
        .on('end', (d, i) => {
            if (i === arrLen - 1) {
                if (cb) cb();
            }
        });
        // .style('fill', (d, i, a) => {
        //     console.log(d);
        //     return c;
        // });
}


function main() {
    selectionSort(a);
    console.log(steps);
    update(steps[0]);

    let currentStep = 0;
    let cb = function() {
        currentStep++;
        if (steps[currentStep]) {
            update(steps[currentStep], cb);
        }
    };

    setTimeout(() => {
        update(steps[0], cb);
    }, 2000);

    // steps.forEach((step, i) => {
    //     setTimeout(() => {
    //         update(step.arrState.slice(0));
    //     }, i * 500);
    // });
}

main();

