import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

// Insertion Sort
let steps = [];

// Takes in an array and recursively merge sorts it
function mergeSort(array, p, r) {
    // p is beginning of array
    // r is end
    // p - r - length of sub array to sort
    // if we have more than 0 elements to sort, then sort!
    if (r - p >= 1) {
        // Divide array in half
        let q = Math.floor((p + r) / 2);

        // steps.push({arr: array.slice(), left: p, middle: q, right: r});

        // Send sub indices back into mergeSort
        mergeSort(array, p, q);
        mergeSort(array, q + 1, r);

        // Merge sub indices
        // This is where the sorting happens
        merge(array, p, q, r);
    }
}

// Takes in an array that has two sorted subarrays,
//  from [p..q] and [q+1..r], and merges the array
let merge = function(array, p, q, r) {
    let lowHalf = [];
    let highHalf = [];

    let k = p;
    let i;
    let j;
    // Copy the array into sub arrays
    for (i = 0; k <= q; i++, k++) {
        lowHalf[i] = array[k];
    }
    for (j = 0; k <= r; j++, k++) {
        highHalf[j] = array[k];
    }

    k = p;
    i = 0;
    j = 0;

    // Repeatedly compare the lowest untaken element in
    //  lowHalf with the lowest untaken element in highHalf
    //  and copy the lower of the two back into array
    while(i < lowHalf.length && j < highHalf.length) {
        if (lowHalf[i] < highHalf[j]) {
            array[k++] = lowHalf[i++];
            steps.push({arr: array.slice(), low: k, high: q});
        } else {
            array[k++] = highHalf[j++];
            steps.push({arr: array.slice(), low: k, high: r});
        }
    }

    // Once one of lowHalf and highHalf has been fully copied
    //  back into array, copy the remaining elements from the
    //  other temporary array back into the array
    while (i < lowHalf.length) {
        array[k++] = lowHalf[i++];
        steps.push({arr: array.slice(), low: k, high: q});
    }
    while (j < highHalf.length) {
        array[k++] = highHalf[j++];
        steps.push({arr: array.slice(), low: k, high: r});
    }
};

// let arr = d3.shuffle(d3.range(10));
// mergeSort(arr, 0, arr.length - 1);
//
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

let finalStepCalled = false;

function update(data, currentStep, cb) {
    // Data join
    let sortable = g.selectAll('.sortable')
        .data(data.arr, d => d);

    // Transition
    let t = d3.transition()
        .duration(200);
        // .delay((d, i) => i * 100);

    let step = steps[currentStep];

    // Exit
    sortable.exit()
        .classed('sortable', true)
        .transition(t)
        .style('opacity', 1e-6)
        .remove();

    // Update
    sortable
        .style('stroke-width', 2)
        .style('stroke', (d, i, arr) => {
            if (i === step.low) {
                return 'white';
            }
            if (i === step.high) {
                return 'white';
            }
            // return 'lightgrey';
        })
        .style('fill', (d, i) => {
            if (i < step.low || i > step.high) {
                return 'rgba(120, 120, 120, 0.5)';
            }

            return colorScale(d);
        })
        .transition(t)
        .attr('cx', (d, i) => i * (width / arrLen))
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
        .append('circle')
        .classed('sortable', true)
        .attr('cx', (d, i) => i * (width / arrLen))
        .attr('cy', d => {
            return height - heightScale(d);
        })
        .attr('r', d => d)
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
    mergeSort(a, 0, a.length - 1);
    update(steps[0], 0, null);
    console.log(steps);

    let currentStep = 0;
    let cb = function() {
        currentStep++;
        if (steps[currentStep]) {
            update(steps[currentStep], currentStep, cb);
        }
    };

    setTimeout(() => {
        update(steps[0], 0, cb);
    }, 2000);
}

main();

