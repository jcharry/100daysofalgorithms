import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let actions = [];
window.actions = actions;
let interval = 50;

// Setup SVG
let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let dataColorScale = d3.scaleLinear()
    .domain([0, 200])
    .range(['#fff7f3', '#7a0177']);

// Clones simple objects of primitives
// may not work on complex hierarchies
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}


// A utility function to print the solution
// int printSolution (int p[], int n);

// l represents lengths of different words in input sequence. For example,
// l = [3, 2, 2, 5] is for a sentence like "aaa bb cc ddddd".  n is size of
// l and M is line width (maximum no. of characters that can fit in a line)
// let s = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?";
let s = "Lorem ipsum dolor sit amet, ut ultricies mattis placerat sit cursus maecenas. Urna cras fusce, ultrices quam, in fringilla magna ut eros velit. Lorem arcu donec, rutrum dapibus libero sed. Morbi elit aliquet elit nibh congue eros, sapien turpis eleifend lorem porttitor nunc per, gravida sem eos a felis, in per lacinia aenean, et quis maecenas turpis eros platea. Erat eu ex elementum ligula et amet, amet lorem egestas, nunc eros a, bibendum lorem amet orci ac consectetuer. Nunc in nunc magna suscipit. Pretium semper habitant pulvinar proin, eu aenean etiam orci, urna vel, volutpat ut vel eu accumsan, id in elementum sed. Odio convallis, vitae at dui aenean consequuntur, magnis rhoncus turpis accumsan amet in, turpis dapibus justo purus fringilla dignissim.  Malesuada dolor in ac anim felis nam, sed tellus magnis vivamus lorem vulputate, nec integer ac integer semper feugiat, dolore ultricies ipsum sagittis amet ornare urna, amet ut nec mus leo. In mi. Sed at vestibulum natoque, quis tempus condimentum, rutrum maecenas lacus vel vitae, cursus adipiscing neque platea id, lobortis eu cras urna. Neque arcu vehicula urna. Nascetur justo volutpat vitae aliquam imperdiet, morbi per dolor metus. Facere natoque.  Natoque nam nibh metus at nec vulputate, vitae lorem ac sapien suspendisse scelerisque, nibh maecenas sit euismod. Aliquam vitae lobortis nec in, sociis odio sodales pretium urna nec, felis hac lacus dui erat volutpat. A wisi elementum pellentesque, volutpat ipsum magna amet. Malesuada a modi. A quisque vel. Semper gravida mattis non vitae, neque dapibus elit. Feugiat tristique sed ut urna ipsum. Nunc morbi. Pellentesque in libero tellus nisl turpis. Neque aliquet aliquam, massa non, quisque turpis eros erat sociis pharetra, vestibulum eros necessitatibus habitant neque, habitant ut eget vivamus. Sapien sapien id leo turpis elit luctus. Id laoreet nec, mauris aliquam purus ligula."
let sArr = s.split(' ');
let l = sArr.map(s => s.length);
// let l = [3, 2, 2, 5];
let n = l.length;
let M = 100;

// lc[i][j] will have cost of a line which has words from
// i to j
let lc = [];

// extras[i][j] will have number of extra spaces if words from i
// to j are put in a single line
let extras = [];

for (let i = 0; i < n + 1; i++) {
    extras[i] = new Array(n + 1);
    lc[i] = new Array(n + 1);
}

// c[i] will have total cost of optimal arrangement of words
let c = [];

// p[] is used to print the solution.
let p = [];

function solveWordWrap (l, n, M) {
    let i, j;

    // calculate extra spaces in a single line.  The value extra[i][j]
    // indicates extra spaces if words from word number i to j are
    // placed in a single line
    for (i = 1; i <= n; i++) {
        extras[i][i] = M - l[i-1];
        for (j = i+1; j <= n; j++)
            extras[i][j] = extras[i][j-1] - l[j-1] - 1;
    }

    // Calculate line cost corresponding to the above calculated extra
    // spaces. The value lc[i][j] indicates cost of putting words from
    // word number i to j in a single line
    for (i = 1; i <= n; i++) {
        for (j = i; j <= n; j++) {
            if (extras[i][j] < 0)
                lc[i][j] = Infinity;
            else if (j == n && extras[i][j] >= 0)
                lc[i][j] = 0;
            else
                lc[i][j] = extras[i][j] * extras[i][j];
        }
    }

    // Calculate minimum cost and find minimum cost arrangement.
    // The value c[j] indicates optimized cost to arrange words
    // from word number 1 to j.
    c[0] = 0;
    for (j = 1; j <= n; j++) {
        c[j] = Infinity;
        for (i = 1; i <= j; i++) {
            if (c[i-1] != Infinity && lc[i][j] != Infinity && (c[i-1] + lc[i][j] < c[j])) {
                c[j] = c[i-1] + lc[i][j];
                p[j] = i;
            }
        }
    }

    printSolution(p, n);
}
function printSolution(p, n) {
    let k;
    if (p[n] == 1) {
        k = 1;
    } else {
        k = printSolution(p, p[n]-1) + 1;
    }

    // console.log(`Line number ${k}: From word no. ${p[n]} to ${n} \n`);
    wrapData.push({lineNumber: k, start: p[n], end: n});
    return k;
}

let wrapData = [];
function updateData(m) {

    // Clear out old data
    lc = [];
    extras = [];
    c = [];
    p = [];
    for (let i = 0; i < n + 1; i++) {
        extras[i] = new Array(n + 1);
        lc[i] = new Array(n + 1);
    }

    // Clear out old wrap data
    wrapData = [];
    // Set global M
    M = m;
    solveWordWrap(l, n, m)
    wrapData = wrapData.map((wrap, i) => {
        return {...wrap, id: i, text: sArr.slice(wrap.start - 1, wrap.end)}
    });

    updateDisplay();
}

let breakLine = g.append('line').attr('class', 'break-line');

function updateBreakLine(m) {
    let t = d3.transition().duration(interval);
    g.select('.break-line')
        .attr('y1', 200)
        .attr('y2', height - 200)
        .transition(t)
        .attr('x1', m * 5.7)
        .attr('x2', m * 5.7);
}

function updateDisplay() {
    let wrappedText = g.selectAll('.text-wrap').data(wrapData, d => d.id);

    // wrappedText.exit().transition(t).style('opacity', 1e-6).remove();

    wrappedText.text(d => d.text.join(' '))
        .attr('y', d => d.lineNumber * 15 + 200)
        // .transition(t)
        .style('opacity', 1);

    wrappedText.enter().append('text')
        .attr('class', 'text-wrap')
        .text(d => d.text.join(' '))
        .attr('y', d => d.lineNumber * 15)
        .style('opacity', 1e-6)
        // .transition(t)
        .style('opacity', 1);

}

// updateData(100);
//
// // updateDisplay();
// setTimeout(() => {
//     updateData(150);
// }, 2000);
//


// console.log(wrapData);
// console.log(p);
// console.log(actions);

// g.selectAll('.words')
let startM = 150;
d3.range(100).forEach((d, i) => {
    if (i % 2 === 0) {
        startM -= 1;
        actions.push({type: 'move-line', m: startM});
    } else {
        actions.push({type: 'move-text', m: startM});
    }
});



function update(counter) {
    let action = actions[counter];
    switch (action.type) {
        case 'move-line':
            updateBreakLine(action.m);
            break;
        case 'move-text':
            updateData(action.m);
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
