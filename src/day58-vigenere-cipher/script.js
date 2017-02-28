import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 2000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
window.g = g;

let interval = 1500;
let actions = [];
window.actions = actions;

let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

let vTable = [alphabet.slice()];
// vTable[0] = vTable[0].map((letter, i) => ({
//     letter,
//     row: 0,
//     col: i
// }));
for (let i = 1; i < 26; i++) {
    vTable.push(rot1(vTable[i - 1].join('')).split(''));
}
vTable = vTable.map((row, i) => {
    return row.map((item, j) => {
        return {
            letter: item,
            row: i,
            col: j
        }
    });
});

let table = g.append('g').attr('transform', 'translate(600, 0)');
let row = table.selectAll('.row').data(vTable).enter().append('g').attr('class', 'row')
    .attr('transform', (d, i) => `translate(0, ${i * 30})`);
let bgCell = row.selectAll('.bgcell').data(d => d).enter().append('rect')
    .attr('x', (d, i) => i * 30 - 10)
    .attr('y', -15)
    .attr('height', 30)
    .attr('width', 30)
    .attr('fill', 'white');
let cell = row.selectAll('.cell').data(d => d).enter().append('text').text(d => d.letter)
    .attr('x', (d, i) => i * 30);

let topRow = alphabet.slice();
let leftCol = alphabet.slice();
table.append('g').attr('transform', 'translate(0, -30)')
    .selectAll('.topcell').data(topRow).enter().append('text')
    .attr('class', 'topcell')
    .text(d => d)
    .attr('x', (d, i) => i * 30);
table.append('g').attr('transform', 'translate(-30, 0)')
    .selectAll('.topcell').data(leftCol).enter().append('text')
    .attr('class', 'leftcell')
    .text(d => d)
    .attr('y', (d, i) => i * 30);


function replaceAt(str, idx, char) {
    return str.substr(0, idx) + char + str.substr(idx + char.length);
}

function rot1(str) {
    for (let i = 0; i < str.length; i++) {
        let char = str[i].toLowerCase();
        if (char !== ' ') {
            let idx = alphabet.indexOf(char);
            let newIdx = (idx + 1) % alphabet.length;
            str = replaceAt(str, i, alphabet[newIdx]);
        }
    }
    return str;
}

let s = 'and guppies dont smile';

function createKey(secretText, key) {
    let numChars = 0;
    let spaces = [];
    let s = secretText.replace(/ /g, '');
    // find all indices of spaces
    for (let i = 0; i < secretText.length; i++) {
        if (secretText[i] === ' ') {
            spaces.push(i);
        }
    }
    let remainder = s.length % key.length;
    let retVal = key.repeat(Math.floor(s.length / key.length)) + key.slice(0, remainder);
    retVal = retVal.split('');
    spaces.forEach(idx => {
        retVal.splice(idx, 0, ' ');
    });
    return retVal.join('');
}


let k = createKey(s, 'key');
console.log(s);
console.log(k);

let cipherBg = g.selectAll('.cipher-bg').data(s.split('')).enter()
    .append('rect').attr('class', 'cipher-bg')
    .attr('x', (d, i) => i * 18)
    .attr('y', 170)
    .attr('height', 75)
    .attr('width', 18)
    .attr('fill', 'white');
let sElt = g.append('text').attr('class', 'secret').text(s)
    .attr('y', 200);
let keyElt = g.append('text').attr('class', 'key').text(k)
    .attr('y', 230);
let cipherElt = g.append('text').attr('class', 'cipher').text('')
    .attr('y', 280);

function cipher(secretText, keyText) {
    let c = '';
    for (let i = 0; i < secretText.length; i++) {
        let secretChar = secretText[i];
        let keyChar = keyText[i];
        if (secretChar === ' ') {
            c += ' ';
            continue;
        }

        // Lookup in table
        // Index of top row
        let topIdx = alphabet.indexOf(secretChar);
        let leftIdx = alphabet.indexOf(keyChar);

        let retChar = vTable[leftIdx][topIdx].letter;
        c += retChar;
        actions.push({cipher: c, row: leftIdx, col: topIdx, charIdx: i});
    }

    return c;

}

let cipherText = cipher(s, k);
console.log(cipherText);

function update(action, counter) {
    console.log(action);

    cipherBg.attr('fill', (d, i) => {
        if (i === action.charIdx) {
            return 'green';
        }
        return 'white';
    });
    cipherElt.text(action.cipher);
    bgCell.attr('fill', d => {
        if (d.col === action.col && d.row === action.row) {
            return 'green';
        } if (d.col === action.col || d.row === action.row) {
            return 'magenta';
        }
        return 'beige';
    });
}

function main() {
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

