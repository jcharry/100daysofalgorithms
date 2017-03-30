import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let margin = {top: 100, right: 100, bottom: 100, left: 100},
    width = 800 - margin.left - margin.right,
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

let data = d3.range(100);

function Person(name) {

    let candidateIndex = 0;

    this.name = name;
    this.fiance = null;
    this.candidates = [];

    this.rank = function(p) {
        for (let i = 0; i < this.candidates.length; i++)
            if (this.candidates[i] === p) return i;
        return this.candidates.length + 1;
    }

    this.prefers = function(p) {
        let r = this.rank(p);
        let f = this.rank(this.fiance);
        let doesPrefer = r < f;
        actions.push({type: 'prefers', person: this, fiance: this.fiance, prefers: doesPrefer, rank: r, fianceRank: f});
        return doesPrefer;
    }

    this.nextCandidate = function() {
        if (candidateIndex >= this.candidates.length) {
            return null
        }
        let candidate = this.candidates[candidateIndex++];
        actions.push({type: 'next', candidateIndex, candidate: candidate.name, person: this, name: this.name, fiance: this.fiance});
        return candidate;
    }

    this.engageTo = function(p) {
        if (p.fiance) {
            p.fiance.fiance = null;
        }
        p.fiance = this;
        if (this.fiance) {
            this.fiance.fiance = null;
        }
        this.fiance = p;
        actions.push({type: 'engage', person: this, fiance: this.fiance.name});
    }

    this.swapWith = function(p) {
        console.log("%s & %s swap partners", this.name, p.name);
        let thisFiance = this.fiance;
        let pFiance = p.fiance;
        this.engageTo(pFiance);
        p.engageTo(thisFiance);
    }
}

function isStable(guys, gals) {
    for (let i = 0; i < guys.length; i++)
        for (let j = 0; j < gals.length; j++)
            if (guys[i].prefers(gals[j]) && gals[j].prefers(guys[i]))
                return false;
    return true;
}

function engageEveryone(guys) {
    let done;
    do {
        done = true;
        for (let i = 0; i < guys.length; i++) {
            let guy = guys[i];
            if (!guy.fiance) {
                done = false;
                let gal = guy.nextCandidate();
                if (!gal.fiance || gal.prefers(guy))
                    guy.engageTo(gal);
            }
        }
    } while (!done);
}

let abe  = new Person("Abe");
let bob  = new Person("Bob");
let col  = new Person("Col");
let dan  = new Person("Dan");
let ed   = new Person("Ed");
let fred = new Person("Fred");
let gav  = new Person("Gav");
let hal  = new Person("Hal");
let ian  = new Person("Ian");
let jon  = new Person("Jon");
let abi  = new Person("Abi");
let bea  = new Person("Bea");
let cath = new Person("Cath");
let dee  = new Person("Dee");
let eve  = new Person("Eve");
let fay  = new Person("Fay");
let gay  = new Person("Gay");
let hope = new Person("Hope");
let ivy  = new Person("Ivy");
let jan  = new Person("Jan");

abe.candidates  = [abi, eve, cath, ivy, jan, dee, fay, bea, hope, gay];
bob.candidates  = [cath, hope, abi, dee, eve, fay, bea, jan, ivy, gay];
col.candidates  = [hope, eve, abi, dee, bea, fay, ivy, gay, cath, jan];
dan.candidates  = [ivy, fay, dee, gay, hope, eve, jan, bea, cath, abi];
ed.candidates   = [jan, dee, bea, cath, fay, eve, abi, ivy, hope, gay];
fred.candidates = [bea, abi, dee, gay, eve, ivy, cath, jan, hope, fay];
gav.candidates  = [gay, eve, ivy, bea, cath, abi, dee, hope, jan, fay];
hal.candidates  = [abi, eve, hope, fay, ivy, cath, jan, bea, gay, dee];
ian.candidates  = [hope, cath, dee, gay, bea, abi, fay, ivy, jan, eve];
jon.candidates  = [abi, fay, jan, gay, eve, bea, dee, cath, ivy, hope];
abi.candidates  = [bob, fred, jon, gav, ian, abe, dan, ed, col, hal];
bea.candidates  = [bob, abe, col, fred, gav, dan, ian, ed, jon, hal];
cath.candidates = [fred, bob, ed, gav, hal, col, ian, abe, dan, jon];
dee.candidates  = [fred, jon, col, abe, ian, hal, gav, dan, bob, ed];
eve.candidates  = [jon, hal, fred, dan, abe, gav, col, ed, ian, bob];
fay.candidates  = [bob, abe, ed, ian, jon, dan, fred, gav, col, hal];
gay.candidates  = [jon, gav, hal, fred, bob, abe, col, ed, dan, ian];
hope.candidates = [gav, jon, bob, abe, ian, dan, hal, ed, col, fred];
ivy.candidates  = [ian, col, hal, gav, fred, bob, abe, ed, jon, dan];
jan.candidates  = [ed, hal, gav, abe, bob, jon, col, ian, fred, dan];

let guys = [abe, bob, col, dan, ed, fred, gav, hal, ian, jon];
let gals = [abi, bea, cath, dee, eve, fay, gay, hope, ivy, jan];

engageEveryone(guys);

for (let i = 0; i < guys.length; i++) {
    console.log("%s is engaged to %s", guys[i].name, guys[i].fiance.name);
}
// console.log("Stable = %s", isStable(guys, gals) ? "Yes" : "No");
// jon.swapWith(fred);
// console.log("Stable = %s", isStable(guys, gals) ? "Yes" : "No");

console.log(actions.length);

// let heightScale = d3.scaleLinear()
//     .domain([min, max])
//     .range([50, 200]);
//     // .range(['#fc8d59', '#99d594']);
// let colorScale = d3.scaleLinear()
//     .domain([min, max])
//     .range(['#fc8d59', '#99d594']);

let men = g.selectAll('.men').data(guys, d => d.name);
men.enter().append('circle').attr('id', d => `${d.name}`)
    .attr('cx', 200)
    .attr('cy', (d, i) => i * 50)
    .attr('r', 15)
    .style('fill', 'lightgreen');
let women = g.selectAll('.women').data(gals, d => d.name);
women.enter().append('circle').attr('id', d => `${d.name}`)
    .attr('cx', 400)
    .attr('cy', (d, i) => i * 50)
    .attr('r', 15)
    .style('fill', 'darkorange');
let galText = g.selectAll('.women-text').data(gals, d => `${d.name}-text`).enter()
    .append('text').text(d => d.name)
    .attr('x', 450)
    .attr('y', (d, i) => i * 50 + 8)
    .style('text-anchor', 'left');
let guyText = g.selectAll('.men-text').data(guys, d => `${d.name}-text`).enter()
    .append('text').text(d => d.name)
    .attr('x', 150)
    .attr('y', (d, i) => i * 50 + 8)
    .style('text-anchor', 'end');

let lines = {};
function update(counter) {
    let t = d3.transition().duration(interval);
    let action = actions[counter];

    switch (action.type) {
        case 'next':
            lines[action.person.name] = action.candidate;
            break;
        case 'engage':
            lines[action.person.name] = action.fiance;
            break;
        case 'prefers':
            break;
    }


    let engagements = g.selectAll('.engagement').data(Object.keys(lines), d => `${d}-engagement`);

    engagements.enter().append('line')
        .attr('class', 'engagement')
        .attr('x1', d => g.select(`#${d}`).attr('cx'))
        .attr('y1', d => g.select(`#${d}`).attr('cy'))
        .attr('x2', d => g.select(`#${d}`).attr('cx'))
        .attr('y2', d => g.select(`#${d}`).attr('cy'))
    .transition(t)
        .attr('x2', d => g.select(`#${lines[d]}`).attr('cx'))
        .attr('y2', d => g.select(`#${lines[d]}`).attr('cy'))
        .attr('stroke-dasharray', '5,10,5')
        .attr('stroke', 'darkgray');

    // Update
    engagements.transition(t)
        .attr('x1', d => g.select(`#${d}`).attr('cx'))
        .attr('x2', d => g.select(`#${lines[d]}`).attr('cx'))
        .attr('y1', d => g.select(`#${d}`).attr('cy'))
        .attr('y2', d => g.select(`#${lines[d]}`).attr('cy'));

    console.log(action);
}

let interval = 500;
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

