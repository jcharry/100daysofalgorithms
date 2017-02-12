import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let actions = [];
window.actions = actions;
let interval = 500;

// Setup SVG
let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// let dataColorScale = d3.scaleLinear()
//     .domain([0, 200])
20//     .range(['#fff7f3', '#7a0177']);


let txt = "AABAACAADAABAAACBAABAA";
let pat = "AABA";
let foundPatterns = [];
function search(pat, txt) {
    let M = pat.length;
    let N = txt.length;

    /* A loop to slide pat[] one by one */
    for (let i = 0; i <= N - M; i++) {
        let j;
        actions.push({type: 'slide', i, pat, txt, found: foundPatterns.slice()});

        /* For current index i, check for pattern match */
        for (j = 0; j < M; j++) {
            actions.push({type: 'check', i, j, pat, txt, found: foundPatterns.slice()});
            if (txt[i+j] != pat[j]) {
                break;
            }
        }

        // By breaking out of the above loop early, j can't equal M
        // unless it all characters matched and the loop didn't break
        if (j == M) {  // if pat[0...M-1] = txt[i, i+1, ...i+M-1]
            foundPatterns.push(i);
            actions.push({type: 'pattern-found', j, i, pat, txt, found: foundPatterns.slice()});
            console.log(`Pattern found at index ${i} \n`);
        }
    }

    actions.push({type: 'finish'});
}

/* Driver program to test above function */
search(pat, txt);
console.log(actions);

function update(action) {
    console.log(action);
    // Data join
    let pattern = g.selectAll('.pat').data(action.pat.split(''), (d, i) => `pat-${i}`);
    let text = g.selectAll('.txt').data(action.txt.split(''), (d, i) => `txt-${i}`);

    // Enter
    pattern.enter().append('text')
        .classed('pat', true)
        .attr('x', (d, i) => 100 + i * 20 + (action.i * 20))
        .attr('y', 240)
        .text(d => d);

    text.enter().append('text')
        .classed('txt', true)
        .attr('x', (d, i) => 100 + i * 20)
        .attr('y', 200)
        .text(d => d);

    // Update
    pattern.attr('x', (d, i) => 100+ i * 20 + (action.i * 20))
        .style('fill', (d, i) => {
            if (i === action.j) {
                return 'red';
            }
        });
    text.style('fill', (d, i) => {
        if (i === action.i + action.j) {
            return 'red';
        }
        for (let p = 0; p < action.found.length; p++) {
            if (i >= action.found[p] && i < action.found[p] + action.pat.length) {
                return 'green';
            }
        }
    });
}

function main() {
    let counter = 0;
    setTimeout(() => {
        d3.interval(() => {
            if (actions[counter]) {
                update(actions[counter]);
                counter++;
            }
        }, interval);
    }, 1000);
}

main();
