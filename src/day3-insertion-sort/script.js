import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

// Insertion Sort
let steps = [];
function insert(array, rightIndex, value) {
    let j;
    for (j = rightIndex; j >= 0 && array[j] > value; j--) {
        array[j + 1] = array[j];
        steps.push({arrState: array.slice(0), currentIdx: j});
    }
    array[j + 1] = value;
};

function insertionSort(array) {
    for (let i = 1; i < array.length; i++) {
        insert(array, i - 1, array[i]);
    }
}

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
let arrLen = 50;
let a = d3.shuffle(d3.range(arrLen));

let colorScale = d3.scaleLinear()
    .domain([0, arrLen])
    .range(['#fff200', '#044700']);

let heightScale = d3.scaleLinear()
    .domain([0, arrLen])
    .range([30, 600]);

function update(data, cb) {
    // Data join
    let sortable = g.selectAll('.sortable')
        .data(data.arrState, d => d);

    // Transition
    let t = d3.transition()
        .duration(100);
        // .delay((d, i) => i * 100);

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
            }
            // return 'lightgrey';
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
        .attr('y', d => {
            return height / 2 - heightScale(d) / 2;
        })
        .attr('height', d => heightScale(d))
        .attr('width', width / arrLen)
        .style('fill', d => {
            return colorScale(d);
            // return 'white';
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
    console.log(a);
    insertionSort(a);
    console.log(a);
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

