import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');
import vector, {Vector} from './Vector';

let line = {x1: 200, y1: 200, x2: 400, y2: 400};
let lineVec = vector(200, 200);
let leftNorm = vector(-200, 200);
let rightNorm = vector(200, -200);
leftNorm.normalize();
rightNorm.normalize();
let lineNormal = lineVec.clone();
lineNormal.normalize();

const Simplex = {
    init: function() {
        this.vertexA = {x: line.x1, y: line.y1};
        this.vertexB = {x: line.x2, y: line.y2};
    },
    line: function(x, y) {
        if (this.vertexA && this.vertexB) {
            // First, we compute the barycentric coordinates.
            // From those we determine the Voronoi region and the closest point P.
            // v = (q - a) dot n / (B - A).mag
            // u = (b - q) dot n / (B - A).mag
            let q = vector(x, y);
            let diff = Vector.subtract(this.vertexB, this.vertexA);
            let diffMag = diff.magnitude();
            let n = diff.clone();
            n.normalize();
            let v = (Vector.subtract(q, this.vertexA)).dot(n) / diffMag;
            let u = (Vector.subtract(this.vertexB, q)).dot(n) / diffMag;

            let result;
            let region;
            if (u <= 0) {
                result = this.vertexB;
                region = 'ab';
            } else if (v <= 0) {
                result = this.vertexA;
                region = 'ba';
            } else {
                let g1 = Vector.multiply(this.vertexA, u);
                let g2 = Vector.multiply(this.vertexB, v);
                region = 'point';

                result = Vector.add(g1, g2);
            }

            return {
                point: result,
                region: region
            };
        }
    }
};


Simplex.init();

let r = 250,
    angle = -.5,
    x = Math.cos(angle) * r + 300,
    y = Math.sin(angle) * r + 300;

let closestPoint = Simplex.line(x, y);
let solution = closestPoint.point;

let svg = d3.select('body').append('svg');
// Draw voronoi paths
let ra, rb, rab, rba;
function voronoiPaths() {
    let na= Vector.perp(lineVec, 'right');
    let nb = Vector.perp(lineVec);

    // arbitrary scale factor
    let s = 2;
    // nA.normalize();
    // nB.normalize();
    // construct A region
    ra = svg.append('path')
        .classed('region-line', true)
        .classed('region-a', true)
        .attr('d', `M${line.x1} ${line.y1}
            L${na.x * s + line.x1} ${na.y * s + line.y1}
            L${na.x * s + line.x2} ${na.y * s + line.y2}
            L${line.x2} ${line.y2}`);

    // Construct B region
    rb = svg.append('path')
        .classed('region-line', true)
        .classed('region-b', true)
        .attr('d', `M${line.x1} ${line.y1}
            L${nb.x * s + line.x1} ${nb.y * s + line.y1}
            L${nb.x * s + line.x2} ${nb.y * s + line.y2}
            L${line.x2} ${line.y2}`);

    // Construct AB region
    rab = svg.append('path')
        .classed('region-line', true)
        .classed('region-ab', true)
        .attr('d', `M${line.x2} ${line.y2}
            L${na.x * s + line.x2} ${na.y * s + line.y2}
            L${na.x * s + line.x2} ${na.y * s + line.y2 + 800}
            L${nb.x * s + line.x2} ${na.y * s + line.y2 + 800}
            L${line.x2} ${line.y2}`);

    // Construct BA region
    rba = svg.append('path')
        .classed('region-line', true)
        .classed('region-ba', true)
        .attr('d', `M${line.x1} ${line.y1}
            L${na.x * s + line.x1} ${na.y * s + line.y1}
            L${0} ${na.y * s + line.y1}
            L${0} ${400}
            L${line.x1} ${line.y1}`);

}

voronoiPaths();

svg.append('line')
    .classed('main-line', true)
    .attr('x1', 300)
    .attr('y1', 300)
    .attr('x2', 300)
    .attr('y2', 300)
.transition()
    .duration(1000)
    .delay(1000)
    .ease(d3.easeElastic)
    .attr('x1', line.x1)
    .attr('y1', line.y1)
    .attr('x2', line.x2)
    .attr('y2', line.y2)
    .attr('line-width', 3)
    .on('end', step1);

function step1() {
    svg.append('circle')
        .classed('point', true)
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 2)
        .style('opacity', 1e-6)
    .transition()
        .duration(500)
        .delay(1000)
        .ease(d3.easeElastic)
        .style('opacity', 1)
        .attr('r', 8)
        .on('end', step2);
}

function step2() {
    svg.append('line')
        .classed('pointa', true)
        .attr('x1', line.x1)
        .attr('y1', line.y1)
        .attr('x2', line.x1)
        .attr('y2', line.y1)
    .transition()
        .duration(1000)
        .delay(1000)
        .ease(d3.easeCubic)
        .attr('x1', line.x1)
        .attr('y1', line.y1)
        .attr('x2', x)
        .attr('y2', y)
        .attr('line-width', 3)
        .on('end', step3);
}

function step3() {
    svg.append('line')
        .classed('pointb', true)
        .attr('x1', line.x2)
        .attr('y1', line.y2)
        .attr('x2', line.x2)
        .attr('y2', line.y2)
    .transition()
        .duration(1000)
        .delay(1000)
        .ease(d3.easeCubic)
        .attr('x1', line.x2)
        .attr('y1', line.y2)
        .attr('x2', x)
        .attr('y2', y)
        .attr('line-width', 3)
        .on('end', step4);
}

function step4() {
    // project vector
    // let u = (Vector.subtract(this.vertexB, q)).dot(n) / diffMag;

    svg.append('line')
        .classed('pointa1', true)
        .attr('x1', line.x1)
        .attr('y1', line.y1)
        .attr('x2', x)
        .attr('y2', y)
        .style('stroke-width', 5)
    .transition()
        .duration(1000)
        .delay(1000)
        .ease(d3.easeCubic)
        .attr('x1', line.x1)
        .attr('y1', line.y1)
        .attr('x2', solution.x)
        .attr('y2', solution.y)
        .style('stroke-width', 10)
        .on('end', step5);
}

function step5() {
    svg.append('line')
        .classed('pointb1', true)
        .attr('x1', x)
        .attr('y1', y)
        .attr('x2', line.x2)
        .attr('y2', line.y2)
        .style('stroke-width', 5)
    .transition()
        .duration(1000)
        .delay(1000)
        .ease(d3.easeCubic)
        .attr('x1', solution.x)
        .attr('y1', solution.y)
        .attr('x2', line.x2)
        .attr('y2', line.y2)
        .style('stroke-width', 10)
        .on('end', step6);
}

function step6() {
    svg.append('line')
        .classed('solution', true)
        .attr('x1', x)
        .attr('y1', y)
        .attr('x2', x)
        .attr('y2', y)
        .style('stroke-width', 1)
    .transition()
        .duration(1000)
        .delay(1000)
        .ease(d3.easeCubic)
        .attr('x1', x)
        .attr('y1', y)
        .attr('x2', solution.x)
        .attr('y2', solution.y)
        .on('end', () => {
            setTimeout(() => {
                window.requestAnimationFrame(loop);
            }, 900);
        });
        // .style('stroke-width', 10)
        // .on('end', step6);
}


let lastRegion = 'ba';
function loop() {
    angle += 0.01;
    x = Math.cos(angle) * r + 300;
    y = Math.sin(angle) * r + 300;
    let {point, region} = Simplex.line(x, y);

    let p = d3.select('.point')
        .attr('cx', x)
        .attr('cy', y);

    let la = d3.select('.pointa')
        .attr('x1', line.x1)
        .attr('x2', x)
        .attr('y1', line.y1)
        .attr('y2', y);
    let lb = d3.select('.pointb')
        .attr('x1', x)
        .attr('x2', line.x2)
        .attr('y1', y)
        .attr('y2', line.y2);

    let la1 = d3.select('.pointa1')
        .attr('x1', line.x1)
        .attr('x2', point.x)
        .attr('y1', line.y1)
        .attr('y2', point.y);
    let lb1 = d3.select('.pointb1')
        .attr('x1', point.x)
        .attr('x2', line.x2)
        .attr('y1', point.y)
        .attr('y2', line.y2);

    let solution = d3.select('.solution')
        .attr('x1', x)
        .attr('y1', y)
        .attr('x2', point.x)
        .attr('y2', point.y);

    // Determine what section we're in
    if (region === 'ab') {
        rab.classed('active', true);
        rba.classed('active', false);
        ra.classed('active', false);
        rb.classed('active', false);
        lastRegion = 'ab';
    } else if (region === 'ba') {
        rab.classed('active', false);
        rba.classed('active', true);
        ra.classed('active', false);
        rb.classed('active', false);
        lastRegion = 'ba';
    } else if (region === 'point') {
        if (lastRegion === 'ba') {
            rab.classed('active', false);
            rba.classed('active', false);
            ra.classed('active', true);
            rb.classed('active', false);
        } else {
            rab.classed('active', false);
            rba.classed('active', false);
            ra.classed('active', false);
            rb.classed('active', true);
        }
    }



    window.requestAnimationFrame(loop);
}


// step1();
// function drawLoop() {
//     angle += 0.01;
//     x = r * Math.cos(angle) + 300;
//     y = r * Math.sin(angle) + 300;
//     ctx.clearRect(0, 0, 600, 600);
//     ctx.rect(0, 0, 600, 600);
//     ctx.fillStyle = 'lightgrey';
//     ctx.fill();
//
//     ctx.beginPath();
//     ctx.moveTo(Simplex.vertexA.x, Simplex.vertexA.y);
//     ctx.lineTo(Simplex.vertexB.x, Simplex.vertexB.y);
//     ctx.stroke();
//
//     let closestPoint = Simplex.line(x, y);
//
//     ctx.beginPath();
//     ctx.ellipse(x, y, 3, 3, 0, 0, Math.PI * 2);
//     ctx.stroke();
//
//     ctx.beginPath();
//     ctx.moveTo(x, y);
//     ctx.lineTo(closestPoint.x, closestPoint.y);
//     ctx.stroke();
//
//     // Step 1 - draw lines
//
//     // setTimeout(() => {
//     window.requestAnimationFrame(drawLoop);
//     // }, 3000)
//
// }

// function step1() {
//     // Draw subtraction vectors from point to end points of line
//
// }

// window.requestAnimationFrame(drawLoop);


