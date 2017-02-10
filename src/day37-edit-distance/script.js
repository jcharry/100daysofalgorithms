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
    .domain([0, 8])
    .range(['#fff7f3', '#7a0177']);

// Clones simple objects of primitives
// may not work on complex hierarchies
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// A Dynamic Programming based C++ program to find minimum
// number operations to convert str1 to str2

// Create a table to store results of subproblems
let str1 = "saturday";
let str2 = "sunday";
let m = str1.length;
let n = str2.length;
let dp = [];
for (let i = 0; i < m + 1; i++) {
    dp[i] = new Array(n + 1);
}

function editDistDP(str1, str2, m, n) {

    // Fill d[][] in bottom up manner
    for (let i = 0; i <= m; i++) {
        for (let j = 0; j <= n; j++) {
            actions.push({type: 'iterate', i, j});
            // If first string is empty, only option is to
            // isnert all characters of second string
            if (i === 0) {
                dp[i][j] = j;  // Min. operations = j
            }

            // If second string is empty, only option is to
            // remove all characters of second string
            else if (j === 0) {
                dp[i][j] = i; // Min. operations = i
            }

            // If last characters are same, ignore last char
            // and recur for remaining string
            else if (str1[i-1] === str2[j-1]) {
                dp[i][j] = dp[i-1][j-1];
            }

            // If last character are different, consider all
            // possibilities and find minimum
            else {
                dp[i][j] = 1 + Math.min(dp[i][j-1],  // Insert
                                   dp[i-1][j],  // Remove
                                   dp[i-1][j-1]); // Replace
            }
        }
    }

    return dp[m][n];
}

let cellSize = 50;

console.log(editDistDP(str1, str2, str1.length, str2.length));
console.log(dp);

g.selectAll('.str1').data(str1.split('')).enter()
    .append('text').text(d => d)
    .attr('x', 0)
    .attr('y', (d, i) => (i + 2) * cellSize);

g.selectAll('.str2').data(str2.split('')).enter()
    .append('text').text(d => d)
    .attr('x', (d, i) => (i + 2) * cellSize)
    .attr('y', 0);

// Draw the dp grid
let grid = g.append('g').attr('transform', 'translate(25, 20)');
let row = grid.selectAll('.row').data(dp).enter().append('g')
    .attr('transform', (d, i) => `translate(0, ${i * cellSize})`);
row.selectAll('.cell').data(d => d).enter().append('rect')
    .style('fill', d => dataColorScale(d))
    .attr('x', (d, i) => i * cellSize)
    .attr('width', cellSize)
    .attr('height', cellSize);


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
