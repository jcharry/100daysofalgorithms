import * as d3 from 'd3';
require('./styles.css');

function update(data, cb) {
    let container = d3.select('#number-container');

    let t = d3.transition()
        .duration(1000)
        .delay((d, i) => i * 100);

    // Join data
    let numbers = container.selectAll('.numbers')
        .data(data, (d, i) => d);

    // Exiting elements
    numbers.exit()
        .classed('numbers', true)
        .transition(t)
        .style('opacity', 1e-6).remove();
        // .on('end', (d, i) => {
        //     console.log(i);
        // })
        // .remove();

    // Update
    numbers
        .transition(t)
        .style('background-color', (d, i) => {
            if (d === initialAnswer) {
                return 'green';
            }
        })
        .on('end', (d, i) => {
            if (i === data.length - 1) {
                if (cb) {
                    cb();
                }
            }
        });

    // Entering elements
    numbers.enter().append('p')
        .classed('numbers', true)
        .text(d => d)
        .style('opacity', 1e-6)
        .style('background-color', (d, i) => {
            if (d === initialAnswer) {
                return 'green';
            }
        })
        .transition(t)
        .style('opacity', 1)
        .on('end', (d, i) => {
            if (i === data.length - 1) {
                if (cb) {
                    cb();
                }
            }
        });
}

function highlight(avg, cb) {
    let numbers = d3.selectAll('.numbers');
    let t = d3.transition()
        .duration(500)
        .delay((d, i) => i * 100);

    numbers.transition(t)
        .style('background-color', (d, i) => {
            if (i === avg) {
                return 'yellow';
            }
            if (d === initialAnswer) {
                return 'green';
            }
        })
        .style('color', (d, i) => {
            if (i === avg) {
                return 'black';
            }
        });

    setTimeout(() => {
        numbers.transition(t)
            .style('background-color', (d, i) => {
                if (avg === answer) {
                } else if (avg < answer) {
                    // Answer is in latter half -> this is the tricky one
                    if (i > avg) {
                        return 'none';
                    } else {
                        return 'red';
                    }
                } else {
                    // Answer is in lower hafl
                    if (i < avg) {
                        return 'none';
                    } else {
                        return 'red';
                    }
                }
            })
            .on('end', (d, i) => {
                if (i === data.length - 1) {
                    if (cb) {
                        cb();
                    }
                }
            });
    }, 1000);

}


// Pattern is
// 1. Enter data
// 2. Perform half search
// 3. highlight data
// 4. remove data
// 5. re-update
// 6. repeat

let answer;
let initialAnswer;
// let data = d3.range(Math.floor(d3.randomUniform(100, 1000)()));
let data = d3.range(500);
console.log(data);
let counter = 0;

function main() {
    // Setup

    // Step 1
    // answer = Math.floor(Math.random() * data.length);
    answer = 54;
    initialAnswer = answer;
    document.getElementById('actual-answer').innerHTML = `What we're looking for: ${initialAnswer}`;

    // Start the whole thing
    update(data);
    let avg = Math.floor((data.length - 1) / 2);

    let started = false;
    document.addEventListener('keydown', (e) => {
        if (e.key === 's' && started === false) {
            started = true;
            loop();
        }
    });

    function loop () {
        counter++;
        document.getElementById('counter').innerHTML = `Number of attempts: ${counter}`;
        let min = 0, max = data.length - 1;
        avg = Math.floor((min + max) / 2);

        console.log('avg', avg, 'answer', answer);
        if (avg !== answer) {
            // Step 2 - Perform half search
            highlight(avg, () => {
                // Step 3 -> Update
                let diff;
                if (avg < answer) {
                    if (data.length % 2 === 0) {
                        diff = data.length - (avg + 1);
                    } else {
                        diff = data.length - avg;
                    }
                    data = data.slice(avg + 1, data.length);
                } else {
                    diff = 0;
                    data = data.slice(0, avg);
                }

                answer = answer - diff;
                update(data, loop);
            });
        } else {
            let numbers = d3.selectAll('.numbers')
                .transition()
                .duration(1000)
                .style('background-color', d => {
                    console.log(d);
                    if (d === initialAnswer) {
                        return 'green';
                    }
                });
        }
    }

}

(function() {
    main();
}());
