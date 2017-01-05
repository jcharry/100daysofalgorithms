import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

// Insertion Sort
let steps = [];

// Swaps two items in an array, changing the original array
let swap = function(array, firstIndex, secondIndex) {
    let temp = array[firstIndex];
    array[firstIndex] = array[secondIndex];
    array[secondIndex] = temp;
};

let sorts = [];
// Takes in an array and recursively merge sorts it
let quickSort = function(array, p, r) {
    // p and r are the current slices of the array to look at.
    // Only perform sort on slices that are larger than 1 element
    if (r - p >= 1) {
        // rearrange array around pivot and get index of pivot
        let {q, partitions} = partition(array, p, r);
        sorts.push(partitions);

        // Run quick sort on two halves surrounding pivot
        quickSort(array, p, q-1);
        quickSort(array, q+1, r);
    }
};

let allPartitions = [];
let partition = function(array, p, r) {
    let partitions = [];
    let j = p;
    let q = p;
    // Capture first state
    partitions.push({arr: array.slice(), currentIdx: j, right: r, left: p, pivotIdx: q});
    allPartitions.push({arr: array.slice(), currentIdx: j, right: r, left: p, pivotIdx: q});

    for (j; j < r; j++) {
        if (array[j] <= array[r]) {
            swap(array, j, q);
            q++;
            partitions.push({arr: array.slice(), currentIdx: j, right: r, left: p, pivotIdx: q});
            allPartitions.push({arr: array.slice(), currentIdx: j, right: r, left: p, pivotIdx: q});
        } else {
            partitions.push({arr: array.slice(), currentIdx: j, right: r, left: p, pivotIdx: q});
            allPartitions.push({arr: array.slice(), currentIdx: j, right: r, left: p, pivotIdx: q});
        }
    }
    swap(array, q, r);
    partitions.push({arr: array.slice(), currentIdx: j, right: r, left: p, pivotIdx: q});
    allPartitions.push({arr: array.slice(), currentIdx: j, right: r, left: p, pivotIdx: q});
    return {q, partitions};
};

// let arr = d3.shuffle(d3.range(10));
// console.log(`starting with array ${arr}`);
// quickSort(arr, 0, arr.length - 1);
// partition(arr, 0, arr.length - 1);
// console.log(partitions);

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
    .range([height - 50, 50]);

let finalStepCalled = false;

function update(data, currentStep, cb) {
    // Data join
    let sortable = g.selectAll('.sortable')
        .data(data.arr, d => d);

    // Transition
    let t = d3.transition()
        .duration(200);
    // .delay((d, i) => i * 100);

    let step = allPartitions[currentStep];

    // Exit
    sortable.exit()
        .classed('sortable', true)
        .transition(t)
        .style('opacity', 1e-6)
        .remove();

    // Update
    sortable
        .style('stroke-width', 3)
        .style('fill', (d, i) => {
            // if (i < step.low || i > step.high) {
            //     return 'rgba(120, 120, 120, 0.5)';
            // }
        })
        .transition(t)
        .style('stroke', (d, i, arr) => {
            if (i < step.left || i > step.right) {
                return 'rgba(100, 100, 100, 0.5)';
            }
            if (i === step.left || i === step.right) {
                return 'red';
            }
            if (i === step.currentIdx) {
                return 'green';
            }
            if (i === step.pivotIdx) {
                return 'magenta';
            }

            return 'darkgrey';
        })
        .attr('x1', (d, i) => i * (width / arrLen))
        .attr('x2', (d, i) => i * (width / arrLen))
        .on('end', (d, i) => {
            if (i === arrLen - 1) {
                if (cb) cb();
            }
            if (currentStep === steps.length - 1) {
                if (!finalStepCalled) {
                    console.log('done!');
                    finish();
                    finalStepCalled = true;
                }
            }
        });

    // Enter
    // sortable.enter()
    //     .append('rect')
    //     .classed('sortable', true)
    //     .attr('x', (d, i) => i * (width / arrLen))
    //     .attr('y', d => {
    //         return height / 2 - heightScale(d) / 2;
    //     })
    //     .attr('height', d => heightScale(d))
    //     .attr('width', width / arrLen - 5)
    //     .style('fill', d => {
    //         return colorScale(d);
    //         // return 'white';
    //     })
    //     .transition(t)
    //     .on('end', (d, i) => {
    //         if (i === arrLen - 1) {
    //             if (cb) cb();
    //         }
    //     });
    sortable.enter()
        .append('line')
        .classed('sortable', true)
        .attr('x1', (d, i) => i * (width / arrLen))
        .attr('y1', d => {
            return height / 2;
        })
        .attr('x2', (d, i) => i * (width / arrLen))
        .attr('y2', d => heightScale(d))
        .style('fill', d => {
            return colorScale(d);
            // return 'white';
        })
        .style('stroke-width', 3)
        .style('stroke', d => 'darkgrey')
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

function finish() {
    d3.selectAll('.sortable')
        .transition(1000)
        .delay((d, i) => i * 20)
        .style('fill', d => {
            return colorScale(d);
        })
        .style('stroke', '');
}

function main() {
    quickSort(a, 0, a.length - 1);
    console.log(allPartitions);
    update(allPartitions[0], 0, null);
    console.log(allPartitions.length);
    // console.log(steps);

    let currentStep = 0;
    let cb = function() {
        currentStep++;
        if (allPartitions[currentStep]) {
            update(allPartitions[currentStep], currentStep, cb);
        }
    };
    // let cb = function() {
    //     // If we still have steps in this level
    //     if (currentStep < sorts[currentLevel].length - 1) {
    //         updateStep(sorts[currentLevel], currentStep);
    //         currentStep++;
    //     } else {
    //         // We're done with the previous level, so move onto the next level
    //         currentLevel++;
    //         // If there actually is a next level
    //         if (sorts[currentLevel]) {
    //             updateLevel(sorts[currentLevel]
    //         }
    //     }
    //     debugger;
    //     currentLevel++;
    //     if (steps[currentStep]) {
    //         update(sorts[currentLevel], currentStep, cb);
    //     }
    // };

    setTimeout(() => {
        update(allPartitions[0], 0, cb);
    }, 2000);
}

main();

