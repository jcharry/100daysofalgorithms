import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let margin = {top: 100, right: 100, bottom: 100, left: 100},
    width = 1200 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g').attr('class', 'svg-group')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let actions = [];
window.actions = actions;

function rnd(min, max) {
    return Math.random() * (max - min) + min;
}
function rndInt(min, max) {
    return Math.floor(rnd(min, max));
}
// Create a bunch of random points
function point(x, y) {
    return { x, y };
}

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
            j = lps[j-1];
            actions.push({type: 'pattern-found', i, j, pat, txt, lps: lps.slice()});
        }

        // mismatch after j matches
        else if (i < N && pat[j] != txt[i]) {
            // Do not match lps[0..lps[j-1]] characters,
            // they will match anyway
            if (j != 0) {
                j = lps[j-1];
                actions.push({type: 'mismatch', i, j, pat, txt, lps: lps.slice()});
            }
            else {
                i = i+1;
                actions.push({type: 'iterate', i, j, pat, txt, lps: lps.slice()});
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
    .range([50, 200]);
    // .range(['#fc8d59', '#99d594']);
let colorScale = d3.scaleLinear()
    .domain([min, max])
    .range(['#fc8d59', '#99d594']);

const cellSize = 30;
function update(counter) {
    let t = d3.transition().duration(interval);
    let action = actions[counter];

    let textSelection = g.selectAll('.txt').data(action.txt.split(''), (d, i) => `txt-${i}`);
    textSelection.enter().append('rect').attr('class', 'txt').text(d => d)
        .attr('x', (d, i) => i * cellSize)
        .attr('y', (d, i) => 0)
        .attr('width', cellSize)
        .attr('height', d => {
            return heightScale(d.charCodeAt(0))
        })
        .style('fill', (d, i) => action.j === i ? 'red' : colorScale(d.charCodeAt(0)))
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

        return colorScale(d.charCodeAt(0));
    });


    let selection = g.selectAll('.pat').data(action.pat.split(''), (d, i) => i);
    selection.enter().append('rect')
        .attr('class', 'pat')
        .text(d => d)
        .attr('y', 0)
        .attr('x', (d, i) => i * cellSize)
        .attr('width', cellSize)
        .attr('height', d => heightScale(d.charCodeAt(0)))
        .style('stroke', (d, i) => action.j === i ? 'red' : 'black')
        .style('fill', 'transparent');

    selection
        .attr('x', (d, i) => (i * cellSize) + ((action.i - action.j) * cellSize))
        .style('stroke', (d, i) => action.j === i ? 'red' : 'black')
}

let interval = 400;
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

