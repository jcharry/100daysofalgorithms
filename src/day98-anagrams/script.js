import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let margin = {top: 100, right: 100, bottom: 0, left: 100},
    width = 1800 - margin.left - margin.right,
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

var input = "monk,konm,bbc,cbb,dell,ledl";
let wordArr = input.split(',');
let sortedWordArr = [];
function constructAnagramDict(wordList) {
    // Sort all the words
    let sortedWords = {};
    wordList.forEach(word => {
        let sortedWord = word.split('').sort().join('');
        sortedWordArr.push(sortedWord);
        if (sortedWords[sortedWord]) {
            sortedWords[sortedWord].push(word);
        } else {
            sortedWords[sortedWord] = [word];
        }
    });

    return sortedWords;
}

function findAnagrams(dict, word) {
    return dict[word.split('').sort().join('')];
}

let anagramDict = constructAnagramDict(wordArr);
let anagrams = findAnagrams(anagramDict, 'nomk');
console.log(anagrams);

actions.push({type: 'duplicate'});
actions.push({type: 'sort'});
actions.push({type: 'merge'});

g.selectAll('.original').data(wordArr).enter()
    .append('text')
    .attr('class', 'original')
    .attr('x', 0)
    .attr('y', (d, i) => i * 100)
    .text(d => d)
    .style('fill', 'black');

function update(counter) {
    let action = actions[counter];
    let t = d3.transition().duration(interval - 10);

    switch (action.type) {
        case 'duplicate':
            wordArr.forEach((word, i) => {
                let data = word.split('');
                let wordElem = g.selectAll(`.word-${word}`).data(data, (d, i) => `${word}-d`);
                wordElem.enter().append('text').attr('class', `word-${word}`).attr('x', (d, i) => i * 12).attr('y', i * 100).text(d => d)
                    .transition(t)
                    .attr('x', (d, i) => i * 12 + 100);
            })
            break;
        case 'sort':
            console.log('sorting');
            wordArr.forEach((word, i) => {
                let data = sortedWordArr[i].split('');
                let wordElem = g.selectAll(`.word-${word}`).data(data);
                wordElem.text(d => d).transition(t)
                    .attr('x', (d, i) => i * 12 + 100);
            })
            break;
        case 'merge':
            let monk = g.selectAll('.word-monk');
            let konm = g.selectAll('.word-konm');
            monk.transition(t)
                .attr('x', (d, i) => i * 12 + 150)
                .attr('y', 150);
            konm.transition(t)
                .attr('x', (d, i) => i * 12 + 150)
                .attr('y', 150);

            let bbc = g.selectAll('.word-bbc');
            let cbb = g.selectAll('.word-cbb');
            bbc.transition(t)
                .attr('x', (d, i) => i * 12 + 150)
                .attr('y', 250);
            cbb.transition(t)
                .attr('x', (d, i) => i * 12 + 150)
                .attr('y', 250);
            let dell = g.selectAll('.word-dell');
            let ledl = g.selectAll('.word-ledl');
            dell.transition(t)
                .attr('x', (d, i) => i * 12 + 150)
                .attr('y', 350);
            ledl.transition(t)
                .attr('x', (d, i) => i * 12 + 150)
                .attr('y', 350);
            break;
    }
}

let interval = 2000;
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

