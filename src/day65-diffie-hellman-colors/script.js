import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

let margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

let svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg.append('g').attr('class', 'svg-group')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
window.g = g;

let interval = 1200;
let actions = [];
window.actions = actions;

let sharedColor = 'orange';
let aliceSecret = 'blue';
let bobSecret = 'green';
let aliceMixed = d3.interpolateLab(sharedColor, aliceSecret);
let bobMixed = d3.interpolateLab(sharedColor, bobSecret);
let secretMixAlice = d3.interpolateLab(aliceMixed(0.5), aliceSecret);
let secretMixBob = secretMixAlice;

let alice = g.append('g').attr('id', 'alice')
    .attr('transform', 'translate(70, 30)');
let bob = g.append('g').attr('id', 'bob')
    .attr('transform', `translate(${width - 80}, 30)`);
let aliceCircle = alice.append('circle').attr('id', 'alice-circle')
    .attr('r', 50)
    .style('fill', aliceSecret);
let aliceText = alice.append('text').text('alice').attr('y', 5);
let bobCircle = bob.append('circle').attr('id', 'bob-circle')
    .attr('r', 50)
    .style('fill', bobSecret);
let bobText = bob.append('text').text('bob').attr('y', 5);

let pub = g.append('g').attr('id', 'pub')
    .attr('transform', `translate(${width / 2}, 60)`);
pub.append('circle').attr('r', 50).style('fill', sharedColor);
pub.append('text').text('public').attr('y', 5);

let am = g.append('g').attr('transform', 'translate(70, 150)')
    .style('opacity', 1e-6);
am.append('circle').attr('r', 50)
    .style('fill', aliceMixed(0.5));
am.append('text').text('public').attr('y', 5);

let bm = g.append('g').attr('transform', `translate(${width - 70}, 150)`)
    .style('opacity', 1e-6);
bm.append('circle').attr('r', 50)
    .style('fill', bobMixed(0.5));
bm.append('text').text('public').attr('y', 5);

let as = g.append('g').attr('transform', 'translate(70, 250)')
    .style('opacity', 1e-6);
as.append('circle').attr('r', 0)
    .style('fill', secretMixAlice(0.5));
as.append('text').text('shared').attr('y', 5);
let bs = g.append('g').attr('transform', `translate(${width - 70}, 250)`)
    .style('opacity', 1e-6);
bs.append('circle').attr('r', 0)
    .style('fill', secretMixBob(0.5));
bs.append('text').text('shared').attr('y', 5);


actions.push({type: 'pub-left'});
actions.push({type: 'spawn-left'});
actions.push({type: 'pub-right'});
actions.push({type: 'spawn-right'});
actions.push({type: 'swap'});
actions.push({type: 'secret-left'});
actions.push({type: 'spawn-secret-left'});
actions.push({type: 'secret-right'});
actions.push({type: 'spawn-secret-right'});

function update(action, counter) {
    let t = d3.transition().duration(interval);
    switch(action.type) {
        case 'pub-left':
            pub.transition(t).attr('transform', `translate(90, 90)`);
            break;
        case 'pub-right':
            pub.transition(t).attr('transform', `translate(${width - 90}, 90)`);
            break;
        case 'spawn-left':
            am.transition(t).style('opacity', 1);
            am.select('circle').transition(t).attr('r', 50)
            pub.transition(t).attr('transform', `translate(${width / 2}, 90)`);
            break;
        case 'spawn-right':
            bm.transition(t).style('opacity', 1);
            bm.select('circle').transition(t).attr('r', 50)
                .style('opacity', 1);
            pub.transition(t).attr('transform', `translate(${width / 2}, 90)`);
            break;
        case 'swap':
            am.transition(t)
                .attr('transform', `translate(${width - 70}, 250)`);
            bm.transition(t)
                .attr('transform', 'translate(70, 250)');
            break;
        case 'secret-left':
            alice.transition(t).attr('transform', 'translate(70, 190)');
            break;
        case 'secret-right':
            bob.transition(t).attr('transform', `translate(${width - 70}, 190)`);
            break;
        case 'spawn-secret-left':
            alice.transition(t).attr('transform', 'translate(70, 30)');
            as.transition(t).attr('transform', `translate(${70}, 450)`)
                .style('opacity', 1);
            as.selectAll('circle').transition(t).attr('r', 50);
            break;
        case 'spawn-secret-right':
            bob.transition(t).attr('transform', `translate(${width - 70}, 30)`);
            bs.transition(t).attr('transform', `translate(${width - 70}, 450)`)
                .style('opacity', 1);
            bs.selectAll('circle').transition(t).attr('r', 50);
            break;
    }
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

