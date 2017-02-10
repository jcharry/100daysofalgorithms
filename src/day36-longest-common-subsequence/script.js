import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let actions = [];
window.actions = actions;
let interval = 800;

// Setup SVG
let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let dataColorScale = d3.scaleLinear()
    .domain([0, 11])
    .range(['#99d594', '#3288bd']);

// Clones simple objects of primitives
// may not work on complex hierarchies
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/* Returns length of LCS for X[0..m-1], Y[0..n-1] */
let X = "AGGTAB";
let Y = "GXTXAYB";
let m = X.length;
let n = Y.length;

let L = [];
for (let i = 0; i < m + 1; i++) {
    L[i] = new Array(n + 1);
}

function lcs(X, Y, m, n) {

    /* Following steps build L[m+1][n+1] in bottom up fashion. Note
      that L[i][j] contains length of LCS of X[0..i-1] and Y[0..j-1] */
    for (let i=0; i<=m; i++) {
        for (let j=0; j<=n; j++) {
            if (i == 0 || j == 0)
                L[i][j] = 0;
            else if (X[i-1] == Y[j-1])
                L[i][j] = L[i-1][j-1] + 1;
            else
                L[i][j] = Math.max(L[i-1][j], L[i][j-1]);
        }
    }


    // Following code is used to print LCS
    let index = L[m][n];

    // Create a character array to store the lcs string
    let lcs = [];
    // lcs[index] = '\0'; // Set the terminating character

    // Start from the right-most-bottom-most corner and
    // one by one store characters in lcs[]
    let i = m, j = n;
    actions.push({type: 'decrement', i, j, index});
    while (i > 0 && j > 0)
    {
        // If current character in X[] and Y are same, then
        // current character is part of LCS
        if (X[i-1] == Y[j-1]) {
            lcs[index-1] = X[i-1]; // Put current character in result
            i--; j--; index--;     // reduce values of i, j and index
            actions.push({type: 'lcs', lcs: lcs.slice()});
        }
        // If not same, then find the larger of two and
        // go in the direction of larger value
        else if (L[i-1][j] > L[i][j-1]) {
            i--;
        } else {
            j--;
        }
        actions.push({type: 'decrement', i, j, index});
    }

    // Print the lcs
    console.log(lcs.join(''));
    actions.push({type: 'finish'});
}

actions.push({type: 'initialize'});
lcs(X, Y, m, n);

let XArr = X.split('');
let YArr = Y.split('');

function update(counter) {
    let action = actions[counter];
    console.log(action);

    let xstr = g.selectAll('.x').data(XArr, (d, i) => `x-${i}`);
    let ystr = g.selectAll('.y').data(YArr, (d, i) => `y-${i}`);

    let t = d3.transition().duration(interval);

    switch (action.type) {
        case 'initialize': {
            xstr.enter().append('text')
                .attr('class', 'x')
                .attr('x', (d, i) => (width / 2) + i * 20)
                .attr('y', 100)
                .text(d => d)
                .style('opacity', 1e-6)
                .transition(t)
                .style('opacity', 1);

            ystr.enter().append('text')
                .attr('class', 'y')
                .attr('x', (d, i) => (width / 2) + i * 20)
                .attr('y', 200)
                .text(d => d)
                .style('opacity', 1e-6)
                .transition(t)
                .style('opacity', 1);
            break;
        }
        case 'lcs': {
            let LCS = g.selectAll('.lcs').data(action.lcs, (d, i) => i);

            LCS.enter().append('text')
                .attr('class', 'lcs')
                .attr('x', (d, i) => (width/ 2) + i * 20)
                .attr('y', 300)
                .text(d => d)
                .style('opacity', 1e-6)
                .transition(t)
                .style('opacity', 1);

            LCS.text(d => d);
            break;
        }
        case 'decrement': {
            xstr.transition(t).style('fill', (d, i) => {
                if (i === action.i - 1) {
                    return 'red';
                }
                return 'white';
            });

            ystr.transition(t).style('fill', (d, i) => {
                if (i === action.j - 1) {
                    return 'red';
                }
                return 'white';
            });
            break;
        }
        case 'finish': {
            xstr.transition(t).style('fill', 'white');
            ystr.transition(t).style('fill', 'white');
            break;
        }
        default:
            break;
    }
}

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
