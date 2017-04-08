import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let margin = {top: 100, right: 100, bottom: 100, left: 100},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let canvas = d3.select('body').append('canvas')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);
    // .attr('transform', `translate(${margin.left}, ${margin.top})`);
let ctx = canvas.node().getContext('2d');

let g = svg.append('g').attr('class', 'svg-group')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let actions = [];
window.actions = actions;

// let str = '{}[]{[[]{[[[()[()][{}([[{[]}]{([])}])]()]{[]}([])]]({{}()})}]}({(())})[{{}}[][]{[[[()]{}]]}()]{[{[[]({{[]}{}[[[[{{}()}[()()]]][]()[]]]}{}[([][()()()[][]()[](())])(){}])({}){[]}]}([])]{}([]{{}[]})}(())({[][{{[{()[]()}]}}[]]}[]((()[()[][][[[][]][]]({})]{[]({}({{[]}()[{}]{}}{()((([]))){}()}[[([])]]()){}[()][(())[]])}{}[])()[([[]])]))({})[][](){}{}{{{}}}[]{{}[]()}(())()[[]()](){(){}[]{}{[[]]}[(){}[([[[]()]{}{({({[{[[]]}]}){()[]}}[])}])]]}[][]({}){{}[][{}(({})(([[()[{[()](((())([{[]()[]}[]])((()))(()[({[{}]})]){[]}{})[][[]](()[]))}]]{[]}])([[]]){}))]({}{}[])[]}(){({([[[]()]]{})()[]{[]()}})()(()){}()}{[(())[]]([{}{()[{({}((){})({})()){}}()()]{{()}}}()]{}{}(){}{})}()[[]([]){}]()[[{}]]{}[]{[]{{{([()[][()()]{{[{}[][]()()]}}[[]]]{{}})[()]}}[]()()}}{}({}){}{}[][](){{}}[](){()()}[]{()}[{}]({}){}(){{}{{{}({}())}}}[]()[()]({[][[]{[][[{}{}[{}[({})][]()[]]{}]]}][()()[]{}{}]()()})()[{}[]{[]{[()]{()}}}]';
let str = '{}[]{[[]{[[[()[()][{}([[{[]}]{([])}])]()]{[]}([])]]({{}()})}]}({(())})[{{}}[][]{[[[()]{}]]}()]{[{[[]({{[]}{}[[[[{{}()}[()()]]][]()[]]]}{}[([][()()()[][]()[](())])(){}])({}){[]}]}([])]{}([]{{}[]})}(())({[][{{[{()[]()}]}}[]]}[]((()[()[][][[[][]][]]({})]{[]({}({{[]}()[{}]{}}{()((([]))){}()}[[([])]]()){}[()][(())[]])}{}[])()[([[]])]))({})[][](){}{}{{{}}}[]{{}[]()}(())()[[]()](){(){}[]{}{[[]]}[(){}[([[[]()]{}{({({[{[[]]}]}){()[]}}[])}])]]}'

function matchedBrackets(expr) {
    let chars = expr.split('');
    let openBrackets = [];

    for (let i = 0; i < chars.length; i++) {
        let char = chars[i];
        actions.push({type: 'next', index: i, chars: chars.slice(), stack: openBrackets.slice()});

        if (char === '{' || char === '[' || char === '(') {
            // Push onto the stack
            openBrackets.push(char);
            actions.push({type: 'push', index: i, chars: chars.slice(), stack: openBrackets.slice()});
        } else {
            let lastChar = openBrackets[openBrackets.length - 1];
            switch (char) {
                case ']':
                    if (lastChar === '[') {
                        openBrackets.pop();
                        actions.push({type: 'pop', index: i, chars: chars.slice(), stack: openBrackets.slice()});
                    } else {
                        return 'NO';
                    }
                    break;
                case '}':
                    if (lastChar === '{') {
                        openBrackets.pop();
                        actions.push({type: 'pop', index: i, chars: chars.slice(), stack: openBrackets.slice()});
                    } else {
                        return 'NO';
                    }
                    break;
                case ')':
                    if (lastChar === '(') {
                        openBrackets.pop();
                        actions.push({type: 'pop', index: i, chars: chars.slice(), stack: openBrackets.slice()});
                    } else {
                        return 'NO';
                    }
                    break;
            }
        }
    }
    return openBrackets.length === 0 ? 'YES' : 'NO';
}

console.log(matchedBrackets(str));

g.append('text').text('stack:')
    .attr('x', 0)
    .attr('y', 200)
    .style('fill', 'white');

let spacing = 8;
let numCols = width / spacing;
function update(counter) {
    let action = actions[counter];
    console.log(action);

    let brackets = g.selectAll('.char').data(action.chars, (d, i) => i);
    brackets.enter().append('text')
        .attr('class', 'char')
        .text(d => d)
        .attr('x', (d, i) => (i % numCols) * 8)
        .attr('y', (d, i) =>  30 + 20 * Math.floor(i / numCols))
        .style('fill', 'darkgray');

    brackets.style('fill', (d, i) => {
        if (i === action.index) {
            if (d === '{' ||  d === '[' || d === '(') {
                return 'green';
            } else {
                return 'red';
            }
        }
        return 'darkgray';
    });

    let stack = g.selectAll('.stack').data(action.stack, (d, i) => `stack-${i}`);
    stack.enter().append('text')
        .attr('class', 'stack')
        .text(d => d)
        .attr('x', (d, i) => (i % numCols) * 8)
        .attr('y', (d, i) =>  220 + 20 * Math.floor(i / numCols))
        .style('fill', 'darkgray');

    stack.exit().remove();
}

let interval = 100;
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

