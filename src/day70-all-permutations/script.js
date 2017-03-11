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

function swap(str, i, j) {
    let temp;
    let strArr = str.split('');
    temp = strArr[i];
    strArr[i] = strArr[j];
    strArr[j] = temp;
    return strArr.join('');
}

/* Function to print permutations of string
   This function takes three parameters:
   1. String
   2. Starting index of the string
   3. Ending index of the string. */
function permute(str, l, r) {
    let i;
    if (l == r) {
        actions.push({type: 'permutation', str, l, r, i});
        // console.log(`${str}\n`);
    } else {
        for (i = l; i <= r; i++) {
            str = swap(str, l, i);
            actions.push({type: 'post-swap', str, l, r, i});
            permute(str, l+1, r);
            actions.push({type: 'post-permute', str, l, r, i});
            str = swap(str, l, i); //backtrack
            actions.push({type: 'post-swap', str, l, r, i});
        }
    }
}

const charMap = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7,
    h: 8,
    i: 9,
    j: 10,
    k: 11,
    l: 12,
    m: 13,
    n: 14,
    o: 15,
    p: 16,
    q: 17,
    r: 18,
    s: 19,
    t: 20,
    u: 21,
    v: 22,
    w: 23,
    x: 24,
    y: 25,
    z: 26
}

const yScale = d3.scaleLinear()
    .domain([1, 9])
    .range([100, 700]);

function update(action, counter) {
    let t = d3.transition().duration(interval - 1);
    let data = g.selectAll('.char').data(action.str.split(''), (d, i) => `char-${i}`);

    data.enter().append('line')
        .attr('class', 'char')
        .attr('x1', (d, i) => i * 30)
        .attr('x2', (d, i) => i * 30)
        .attr('y1', 0)
        .attr('y2', d => yScale(charMap[d.toLowerCase()]))
        .style('stroke', (d, i) => {
            if (i === action.i) {
                return 'rgba(0, 128, 0, 0.54)';
            } else if (i === action.l) {
                return 'rgba(0, 0, 255, 0.54)';
            } else if (i === action.j) {
                return 'darkgray';
            } else if (i === action.r) {
                return 'rgba(255 , 0, 0, 0.54)';
            }
        });

    // Update
    data
        .style('stroke', (d, i) => {
            if (i === action.i) {
                return 'rgba(0, 128, 0, 0.54)';
            } else if (i === action.l) {
                return 'rgba(0, 0, 255, 0.54)';
            } else if (i === action.j) {
                return 'darkgray';
            } else if (i === action.r) {
                return 'rgba(255 , 0, 0, 0.54)';
            }
        })
    .transition(t)
        .attr('x1', (d, i) => i * 30)
        .attr('x2', (d, i) => i * 30)
        .attr('y1', 0)
        .attr('y2', d => yScale(charMap[d.toLowerCase()]));
}

let interval = 80;
function main() {
    let str = "abcde";
    let n = str.length;
    let start = performance.now();
    permute(str, 0, n-1);
    console.log(performance.now() - start);
    console.log(actions.length);

    let counter = 0;
    setTimeout(() => {
        d3.interval(() => {
            if (actions[counter]) {
                update(actions[counter], counter);
                counter++;
            }
        }, interval);
    }, 1000);
}

main();

