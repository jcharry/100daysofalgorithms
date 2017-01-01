import * as d3 from 'd3';
// BINARY SEARCH

// Import styles
require('./style.css');
let data = d3.range(30);
let answer = Math.floor(Math.random() * data[data.length - 1]);

// Step 1
// data.forEach(d => {
//     let p = document.createElement('p');
//     document.getElementById('number-container').appendChild(p);
//     p.innerHTML = d;
//     p.setAttribute('data-index', d);
//     p.setAttribute('class', 'numbers');
//
//     p.style.opacity = 1;
//
//     setTimeout(() => { search(d3.min(data), d3.max(data)) }, 1000);
// });
//
// // Step 2
// let search = function(min, max) {
//     let avg = Math.floor((min + max) / 2);
//
//     if (avg < answer ) {
//         let numbers = document.query
//     }
//     return avg;
//     // Flash guess
// }
let numberOfGuesses = 0;
console.log('actual answer', answer);

let container = d3.select('#number-container');
let enter = function() {
    let numbers = container.selectAll('.numbers')
        .data(data, d => d);

    numbers.enter().append('p')
        .classed('numbers', true)
        .text(d => d)
        .attr('data-index', d => `index-${d}`)
        .transition()
            .duration(500)
            .delay((d, i) => i * 40)
            .style('font-size', '14pt')
            .style('opacity', 1)
                .on('end', (d, i) => { if (i === data.length - 1) next(2); });
}
let update = function() {
    console.log('update called');

    numbers.classed('numbers', true);

    // Update
    numbers.transition()
        .duration(500)
        .attr('data-index', d => `index-${d}`)
        .on('end', (d, i) => { if (i === data.length - 1) next(2); });


    // Enter
};

let highlight = function(index) {
    debugger;
    let numbers = container.selectAll('.numbers')
        .attr('class', (d, i) => {
            if (answer === index) {
                return 'numbers';
            } else if (answer < index) {
                if (i < index) {
                    return 'numbers';
                } else if (i === index) {
                    return 'numbers highlighted';
                } else {
                    return 'numbers crossed';
                }
            } else if (answer > index) {
                if (i > index) {
                    return 'numbers';
                } else if (i === index) {
                    return 'numbers highlighted';
                } else {
                    return 'numbers crossed';
                }
            }
        });

    // if (index === answer ) {
    //     return;
    // } else if (index < answer) {
    //     data = data.slice(index + 1, data.length - 1);
    // } else if (index > answer) {
    //     data = data.slice(0, index - 1);
    // }
    setTimeout(step1, 2000);
};


// Step 1
// Transition all numbers in
let step1 = () => {
    update();
};

// Show answer in corner
let step2 = function() {
    console.log('step 2 called');
    document.getElementById('answer-value').innerHTML = answer;
    document.getElementById('answer-container').style.opacity = 1;
    setTimeout(step3, 500);
};

// Select the halfway number
let step3 = function() {
    console.log('step 3')
    debugger;
    let min = d3.min(data);
    let max = d3.max(data);
    let avg = Math.floor((min + max) / 2);

    let p = document.querySelectorAll(`[data-index=index-${avg}]`)[0];

    highlight(avg);
};

let next = function(stepNumber) {
    switch(stepNumber) {
        case 1:
            step1();
            break;
        case 2:
            step2();
            break;
        case 3:
            step3();
    }
};


let main = function() {
    enter();
    // step1();
};

let binarySearch = function(min, max) {
    // Step 2 -> Calculate the average and select the nearest value in the
    // dataset
    let avg;

    while (avg !== answer) {
        numberOfGuesses += 1;
        avg = Math.floor((min + max) / 2);
        console.log('guess', avg);
        if (avg < answer) {
            min = avg + 1;
        } else {
            max = avg - 1;
        }
    }

    return avg;
};

// Step 1 - > set min and max of data range
let ba = binarySearch(d3.min(data), d3.max(data));
console.log(`found answer ${ba} in ${numberOfGuesses} guesses`);
document.addEventListener('keydown', (e) => {
    const key = e.key;
    console.log(key);

    main();
});
