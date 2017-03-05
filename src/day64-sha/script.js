import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
window.g = g;

let interval = 800;
let actions = [];
window.actions = actions;

// SHA
//
let sha256 = function sha256(ascii) {
    function rightRotate(value, amount) {
        return (value>>>amount) | (value<<(32 - amount));
    };

    let mathPow = Math.pow;
    let maxWord = mathPow(2, 32);
    let lengthProperty = 'length';
    let i, j; // Used as a counter across the whole file
    let result = '';

    let words = [];
    let asciiBitLength = ascii[lengthProperty]*8;

    //* caching results is optional - remove/add slash from front of this line to toggle
    // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
    // (we actually calculate the first 64, but extra values are just ignored)
    let hash = sha256.h = sha256.h || [];
    // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
    let k = sha256.k = sha256.k || [];
    let primeCounter = k[lengthProperty];
    /*/
    let hash = [], k = [];
    let primeCounter = 0;
    //*/

    let isComposite = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
            k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
        }
    }

    ascii += '\x80'; // Append '1' bit (plus zero padding)
    while (ascii[lengthProperty]%64 - 56) ascii += '\x00'; // More zero padding
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j>>8) return; // ASCII check: only accept characters in range 0-255
        words[i>>2] |= j << ((3 - i)%4)*8;
    }
    words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
    words[words[lengthProperty]] = (asciiBitLength);

    // process each chunk
    for (j = 0; j < words[lengthProperty];) {
        let w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
        let oldHash = hash;
        // This is now the "working hash", often labelled as variables a...g
        // (we have to truncate as well, otherwise extra entries at the end accumulate
        hash = hash.slice(0, 8);

        for (i = 0; i < 64; i++) {
            let i2 = i + j;
            // Expand the message into 64 words
            // Used below if
            let w15 = w[i - 15], w2 = w[i - 2];

            // Iterate
            let a = hash[0], e = hash[4];
            let temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
                + ((e&hash[5])^((~e)&hash[6])) // ch
                + k[i]
            // Expand the message schedule if needed
                + (w[i] = (i < 16) ? w[i] : (
                    w[i - 16]
                    + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
                    + w[i - 7]
                    + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
                )|0
                );
            // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
            let temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
                + ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj

            // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
            hash = [(temp1 + temp2)|0].concat(hash);
            hash[4] = (hash[4] + temp1)|0;
        }

        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i])|0;
        }
    }

    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            let b = (hash[i]>>(j*8))&255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return result;
};

console.log(sha256('hello world'));

// END

let inputData = '';
let box = document.getElementById('pass');
let line1 = g.append('text')
    .attr('x', 100)
    .attr('y', 400)
    .style('font-size', '30px');
let line2 = g.append('text')
    .attr('x', 100)
    .attr('y', 430)
    .style('font-size', '30px');

box.addEventListener('input', (e) => {
    inputData = e.target.value;
    let hash = sha256(inputData);
    let l1 = hash.substr(0, Math.floor(hash.length / 2));
    let l2 = hash.substr(Math.floor(hash.length / 2), hash.length);

    line1.text(l1);
    line2.text(l2)
    // let dataJoin = hashedText.data(inputData, (d, i) => `${d}-${i}`);
    //
    // dataJoin.enter().
});




function update(action, counter) {
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

