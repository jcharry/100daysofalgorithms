import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

function cloneArray(array) {
    return JSON.parse(JSON.stringify(array));
}

// Insertion Sort
let steps = [];
let step2 = [];
// Swaps two items in an array, changing the original array

function pigeonhole(array) {
    // Create an empty array to hold buckets
    let cp = [];
    console.log('origional array', array);

    steps.push({arr: cloneArray(array)});

    for (var i = 0; i < array.length; i++) {
        // Get value of data point
        let val = array[i].val;
        array[i].inBucket = true;
        if (cp[val]) {
            cp[val].push(cloneArray(array[i]));
        } else {
            cp[val] = [cloneArray(array[i])];
        }
        steps.push({arr: cloneArray(array)});

        // in the original array, clear out the spot we just copied
    }

    // step2.push({arr: cloneArray(cp)});

    // Loop over copied array, and put things back into original array
    let arrIndex = 0;
    for (var i = 0; i < cp.length; i++) {
        // If there are items in the bucket
        if (cp[i] !== undefined) {
            cp[i].forEach((d, j) => {
                // Put copied item back into original array
                let clone = cloneArray(d);
                clone.inBucket = false;
                array[arrIndex++] = clone;

                // if (arr[d.idx] === d) {
                //     let clone = cloneArray(d);
                //     console.log('does clone === d', clone === d);
                //     clone.inBucket = true;
                //     array[d.idx] = clone;
                // }
                // d.inBucket = false;
                steps.push({arr: cloneArray(array)});
            });
        }
    }

    console.log(array);
};

let arr = [];
for (var i = 0; i < 100; i++) {
    let rn = Math.floor(Math.random() * 50);
    arr[i] = {val: rn, inBucket: false, idx: i};
}
pigeonhole(arr);

// let tmp = d3.range(10);
// tmp = tmp.concat(d3.range(20, 40));
// tmp = tmp.concat(d3.range(5, 15));
//
// let arr = tmp.concat(d3.range());
// arr = d3.shuffle(arr);
// console.log(`starting with array ${arr}`);
// qnuickSort(arr, 0, arr.length - 1);
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
    .range([10, 100]);

let finalStepCalled = false;

function update(data, currentStep, cb) {
    // Data join
    let arrLen = data.arr.length;
    let sortable = g.selectAll('.sortable')
        .data(data.arr, d => d.idx);

    // Transition
    let t = d3.transition()
        .duration(200);
    // .delay((d, i) => i * 100);

    // let step = allPartitions[currentStep];

    // Exit
    sortable.exit()
        .classed('sortable', true)
        .transition(t)
        .style('opacity', 1e-6)
        .remove();

    // Update
    sortable
        .transition(t)
        .attr('x', (d, i) => {
            if (d.inBucket) {
                return d.val * (width / arrLen);
            } else {
                return i * (width / arrLen);
            }
        })
        .attr('y', (d, i) => {
            if (d.inBucket) {
                return height - (height / 3) - heightScale(d.val);
            } else {
                return height / 3 - heightScale(d.val);
            }
        })
        // .attr('y', (d, i) => i * (width / arrLen))
        .on('end', (d, i) => {
            if (i === arrLen - 1) {
                if (cb) cb();
            }
            if (currentStep === steps.length - 1) {
                if (!finalStepCalled) {
                    console.log('done!');
                    // finish();
                    finalStepCalled = true;
                }
            }
        });

    // Enter
    sortable.enter()
        .append('rect')
        .classed('sortable', true)
        .attr('x', (d, i) => i * (width / arrLen))
        .attr('y', d => {
            return height / 3 - heightScale(d.val);
        })
        .attr('height', d => heightScale(d.val))
        .attr('width', width / arrLen - 5)
        .style('fill', d => {
            return colorScale(d.val);
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
    console.log('steps', steps);
    // quickSort(a, 0, a.length - 1);
    // console.log(allPartitions);
    update(steps[0], 0, null);
    // console.log(allPartitions.length);
    // console.log(steps);

    let currentStep = 0;
    let middle = 100;
    let cb = function() {
        currentStep++;
        // console.log('current step ', currentStep);
        // if (currentStep > middle * 2) {
        //     return;
        // }

        // if (currentStep < middle) {
        if (steps[currentStep]) {
            update(steps[currentStep], currentStep, cb);
        }
        // } else {
        //     debugger;
        //     step2.forEach((cp, i) => {
        //         cp.arr.forEach(b => {
        //             if (b) {
        //                 if (b.length > 0) {
        //                     b.forEach()
        //                     debugger;
        //                 }
        //             }
        //         });
        //     });
        // }
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
    //     currentLevel++;
    //     if (steps[currentStep]) {
    //         update(sorts[currentLevel], currentStep, cb);
    //     }
    // };

    setTimeout(() => {
        update(steps[0], 0, cb);
    }, 2000);
}

main();

