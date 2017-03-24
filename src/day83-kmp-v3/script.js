import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let margin = {top: 100, right: 100, bottom: 100, left: 100},
    width = 1100 - margin.left - margin.right,
    height = 1300 - margin.top - margin.bottom;

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

// C++ program for implementation of KMP pattern searching
// Prints occurrences of txt[] in pat[]
let patLocs = [];
function KMPSearch(pat, txt) {
    const M = pat.length;
    const N = txt.length;

    // create lps[] that will hold the longest prefix suffix
    // values for pattern
    let lps = new Array(M);

    // Preprocess the pattern (calculate lps[] array)
    computeLPSArray(pat, M, lps);

    let i = 0;  // index for txt[]
    let j  = 0;  // index for pat[]
    while (i < N) {
        if (pat[j] == txt[i]) {
            actions.push({type: 'equal-char', i, j, pat, txt, lps: lps.slice()});
            j++;
            i++;
        }

        // End of pattern reached
        if (j == M) {
            patLocs.push(i - j);
            console.log(`Found pattern at index ${i - j}`);
            actions.push({type: 'pattern-found', i, j, pat, txt, lps: lps.slice()});
            j = lps[j-1];
        }

        // mismatch after j matches
        else if (i < N && pat[j] != txt[i]) {
            // Do not match lps[0..lps[j-1]] characters,
            // they will match anyway
            if (j != 0) {
                actions.push({type: 'mismatch', i, j, pat, txt, lps: lps.slice()});
                j = lps[j-1];
            }
            else {
                actions.push({type: 'iterate', i, j, pat, txt, lps: lps.slice()});
                i = i+1;
            }
        }
    }
}

// Fills lps[] for given patttern pat[0..M-1]
function computeLPSArray(pat, M, lps) {
    // length of the previous longest prefix suffix
    let len = 0;

    lps[0] = 0; // lps[0] is always 0

    // the loop calculates lps[i] for i = 1 to M-1
    let i = 1;
    while (i < M) {
        if (pat[i] == pat[len]) {
            len++;
            lps[i] = len;
            i++;
        }
        else { // (pat[i] != pat[len])
            // This is tricky. Consider the example.
            // AAACAAAA and i = 7. The idea is similar
            // to search step.
            if (len != 0) {
                len = lps[len-1];

                // Also, note that we do not increment
                // i here
            }
            else { // if (len == 0)
                lps[i] = 0;
                i++;
            }
        }
    }
}

// Driver program to test above function
// const txt = "ABABDABACDABABCABAB";
// const pat = "ABABCABAB";
let txt = "AABAACAADAABAAACBAABAA";
let pat = "AABA";
KMPSearch(pat, txt);
actions = actions.slice(0, -1);

let min = Infinity;
let max = -Infinity;
txt.split('').forEach(char => {
    let charCode = char.charCodeAt(0);
    if (charCode < min) min = charCode;
    if (charCode > max) max = charCode;
});

let heightScale = d3.scaleLinear()
    .domain([min, max])
    .range([5, 20]);
    // .range(['#fc8d59', '#99d594']);
let colorScale = d3.scaleLinear()
    .domain([65, 66, 67, 68])
.range(['#e66101','#fdb863','#b2abd2','#5e3c99']);
    // .range(['#7b3294','#c2a5cf','#a6dba0','#008837']);
console.log(min, max);

const cellSize = 30;
function update(counter) {
    let t = d3.transition().duration(interval);
    let action = actions[counter];

    let textSelection = g.selectAll('.txt').data(action.txt.split(''), (d, i) => `txt-${i}`);
    // textSelection.enter().append('rect').attr('class', 'txt').text(d => d)
    //     .attr('x', (d, i) => i * cellSize)
    //     .attr('y', (d, i) => 0)
    //     .attr('width', cellSize)
    //     .attr('height', d => {
    //         return heightScale(d.charCodeAt(0))
    //     })
    //     .style('fill', (d, i) => action.j === i ? 'red' : colorScale(d.charCodeAt(0)))
    textSelection.enter().append('circle').attr('class', 'txt').text(d => d)
        .attr('cx', (d, i) => i * (cellSize + 10))
        .attr('cy', (d, i) => 0)
        .attr('r', d => heightScale(d.charCodeAt(0)))
        // .attr('height', d => {
        //     return heightScale(d.charCodeAt(0))
        // })
        // .style('stroke', (d, i) => action.j === i ? 'red' : colorScale(d.charCodeAt(0)))
        // .style('fill', (d, i) => colorScale(d.charCodeAt(0)))
        .style('fill', d => {
            if (action.type === 'pattern-found') {
                return 'green';
            } else {
              return 'black';
            }
        })
        // .style('opacity', 0.5);

    textSelection.style('fill', (d, i) => {
        if (action.i === i) {
            return 'red';
        }
        for (let idx = 0; idx < patLocs.length; idx++) {
            let loc = patLocs[idx];
            if (action.i >= (loc + action.pat.length) && i >= (loc) && i < (loc + action.pat.length)) {
                return 'green';
            }
        }

        return 'black';
        // return colorScale(d.charCodeAt(0));
    });


    let selection = g.selectAll('.pat').data(action.pat.split(''), (d, i) => i);
    selection.enter().append('circle')
        // .attr('class', 'pat')
        .text(d => d)
        .attr('cy', counter * 35 + 35)
        // .attr('cy', 35)
        // .attr('x', (d, i) => i * cellSize)
        .attr('cx', (d, i) => (i * (cellSize + 10)) + ((action.i - action.j) * (cellSize + 10)))
        .attr('r', d => heightScale(d.charCodeAt(0)))
        // .attr('height', d => heightScale(d.charCodeAt(0)))
        // .style('fill', (d, i) => action.j === i ? 'red' : d.charCodeAt(0))
        .style('fill', (d, i) => {
            if (action.j === i) {
                return 'red';
            }
            if (action.type === 'pattern-found') {
                return 'green';
            } else {
              return 'black';
            }
        })
        // .style('fill', d => colorScale(d.charCodeAt(0)));

    selection
        .attr('cx', (d, i) => (i * (cellSize + 10)) + ((action.i - action.j) * (cellSize + 10)))
        // .style('stroke', (d, i) => action.j === i ? 'red' : 'transparent')
        .style('fill', (d, i) => action.j === i ? 'red' : d.charCodeAt(0))
}

let interval = 10;
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

