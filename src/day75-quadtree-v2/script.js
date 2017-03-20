import * as d3 from 'd3';
window.d3 = d3;
require('./styles.scss');

/****************** QuadTree ****************/

/**
* QuadTree data structure.
* @class QuadTree
* @constructor
* @param {Object} An object representing the bounds of the top level of the QuadTree. The object
* should contain the following properties : x, y, width, height
* @param {Boolean} pointQuad Whether the QuadTree will contain points (true), or items with bounds
* (width / height)(false). Default value is false.
* @param {Number} maxDepth The maximum number of levels that the quadtree will create. Default is 4.
* @param {Number} maxChildren The maximum number of children that a node can contain before it is split into sub-nodes.
**/
function QuadTree(bounds, pointQuad, maxDepth, maxChildren) {
    var node;
    if (pointQuad) {

        node = new Node(bounds, 0, maxDepth, maxChildren);
    } else {
        node = new BoundsNode(bounds, 0, maxDepth, maxChildren);
    }

    this.root = node;
}

/**
* The root node of the QuadTree which covers the entire area being segmented.
* @property root
* @type Node
**/
QuadTree.prototype.root = null;


/**
* Inserts an item into the QuadTree.
* @method insert
* @param {Object|Array} item The item or Array of items to be inserted into the QuadTree. The item should expose x, y
* properties that represents its position in 2D space.
**/
QuadTree.prototype.insert = function (item) {
    if (item instanceof Array) {
        var len = item.length;

        var i;
        for (i = 0; i < len; i++) {
            this.root.insert(item[i]);
        }
    } else {
        this.root.insert(item);
    }
};

/**
* Clears all nodes and children from the QuadTree
* @method clear
**/
QuadTree.prototype.clear = function () {
    this.root.clear();
};

/**
* Retrieves all items / points in the same node as the specified item / point. If the specified item
* overlaps the bounds of a node, then all children in both nodes will be returned.
* @method retrieve
* @param {Object} item An object representing a 2D coordinate point (with x, y properties), or a shape
* with dimensions (x, y, width, height) properties.
**/
QuadTree.prototype.retrieve = function (item) {
    //get a copy of the array of items
    var out = this.root.retrieve(item).slice(0);
    return out;
};

/************** Node ********************/


function Node(bounds, depth, maxDepth, maxChildren) {
    this._bounds = bounds;
    this.children = [];
    this.nodes = [];

    if (maxChildren) {
        this._maxChildren = maxChildren;
    }

    if (maxDepth) {
        this._maxDepth = maxDepth;
    }

    if (depth) {
        this._depth = depth;
    }
}

//subnodes
Node.prototype.nodes = null;
Node.prototype._classConstructor = Node;

//children contained directly in the node
Node.prototype.children = null;
Node.prototype._bounds = null;

//read only
Node.prototype._depth = 0;

Node.prototype._maxChildren = 4;
Node.prototype._maxDepth = 4;

Node.TOP_LEFT = 0;
Node.TOP_RIGHT = 1;
Node.BOTTOM_LEFT = 2;
Node.BOTTOM_RIGHT = 3;


Node.prototype.insert = function (item) {
    if (this.nodes.length) {
        var index = this._findIndex(item);

        this.nodes[index].insert(item);

        return;
    }

    this.children.push(item);

    var len = this.children.length;
    if (!(this._depth >= this._maxDepth) &&
            len > this._maxChildren) {

        this.subdivide();

        var i;
        for (i = 0; i < len; i++) {
            this.insert(this.children[i]);
        }

        this.children.length = 0;
    }
};

Node.prototype.retrieve = function (item) {
    if (this.nodes.length) {
        var index = this._findIndex(item);

        return this.nodes[index].retrieve(item);
    }

    return this.children;
};

Node.prototype._findIndex = function (item) {
    var b = this._bounds;
    var left = (item.x > b.x + b.width / 2) ? false : true;
    var top = (item.y > b.y + b.height / 2) ? false : true;

    //top left
    var index = Node.TOP_LEFT;
    if (left) {
        //left side
        if (!top) {
            //bottom left
            index = Node.BOTTOM_LEFT;
        }
    } else {
        //right side
        if (top) {
            //top right
            index = Node.TOP_RIGHT;
        } else {
            //bottom right
            index = Node.BOTTOM_RIGHT;
        }
    }

    return index;
};


Node.prototype.subdivide = function () {
    var depth = this._depth + 1;

    var bx = this._bounds.x;
    var by = this._bounds.y;

    //floor the values
    var b_w_h = (this._bounds.width / 2); //todo: Math.floor?
    var b_h_h = (this._bounds.height / 2);
    var bx_b_w_h = bx + b_w_h;
    var by_b_h_h = by + b_h_h;

    //top left
    this.nodes[Node.TOP_LEFT] = new this._classConstructor({
        x: bx,
        y: by,
        width: b_w_h,
        height: b_h_h
    },
        depth, this._maxDepth, this._maxChildren);

    //top right
    this.nodes[Node.TOP_RIGHT] = new this._classConstructor({
        x: bx_b_w_h,
        y: by,
        width: b_w_h,
        height: b_h_h
    },
        depth, this._maxDepth, this._maxChildren);

    //bottom left
    this.nodes[Node.BOTTOM_LEFT] = new this._classConstructor({
        x: bx,
        y: by_b_h_h,
        width: b_w_h,
        height: b_h_h
    },
        depth, this._maxDepth, this._maxChildren);


    //bottom right
    this.nodes[Node.BOTTOM_RIGHT] = new this._classConstructor({
        x: bx_b_w_h,
        y: by_b_h_h,
        width: b_w_h,
        height: b_h_h
    },
        depth, this._maxDepth, this._maxChildren);
};

Node.prototype.clear = function () {
    this.children.length = 0;

    var len = this.nodes.length;

    var i;
    for (i = 0; i < len; i++) {
        this.nodes[i].clear();
    }

    this.nodes.length = 0;
};


/******************** BoundsQuadTree ****************/

function BoundsNode(bounds, depth, maxChildren, maxDepth) {
    Node.call(this, bounds, depth, maxChildren, maxDepth);
    this._stuckChildren = [];
}

BoundsNode.prototype = new Node();
BoundsNode.prototype._classConstructor = BoundsNode;
BoundsNode.prototype._stuckChildren = null;

//we use this to collect and conctenate items being retrieved. This way
//we dont have to continuously create new Array instances.
//Note, when returned from QuadTree.retrieve, we then copy the array
BoundsNode.prototype._out = [];

BoundsNode.prototype.insert = function (item) {
    if (this.nodes.length) {
        var index = this._findIndex(item);
        var node = this.nodes[index];

        //todo: make _bounds bounds
        if (item.x >= node._bounds.x &&
                item.x + item.width <= node._bounds.x + node._bounds.width &&
                item.y >= node._bounds.y &&
                item.y + item.height <= node._bounds.y + node._bounds.height) {

            this.nodes[index].insert(item);

        } else {
            this._stuckChildren.push(item);
        }

        return;
    }

    this.children.push(item);

    var len = this.children.length;

    if (!(this._depth >= this._maxDepth) &&
            len > this._maxChildren) {

        this.subdivide();

        var i;
        for (i = 0; i < len; i++) {
            this.insert(this.children[i]);
        }

        this.children.length = 0;
    }
};

BoundsNode.prototype.getChildren = function () {
    return this.children.concat(this._stuckChildren);
};

BoundsNode.prototype.retrieve = function (item) {
    var out = this._out;
    out.length = 0;
    if (this.nodes.length) {
        var index = this._findIndex(item);
        var node = this.nodes[index];

        if (item.x >= node._bounds.x &&
                item.x + item.width <= node._bounds.x + node._bounds.width &&
                item.y >= node._bounds.y &&
                item.y + item.height <= node._bounds.y + node._bounds.height) {

            out.push.apply(out, this.nodes[index].retrieve(item));
        } else {
            //Part of the item are overlapping multiple child nodes. For each of the overlapping nodes, return all containing objects.

            if (item.x <= this.nodes[Node.TOP_RIGHT]._bounds.x) {
                if (item.y <= this.nodes[Node.BOTTOM_LEFT]._bounds.y) {
                    out.push.apply(out, this.nodes[Node.TOP_LEFT].getAllContent());
                }

                if (item.y + item.height > this.nodes[Node.BOTTOM_LEFT]._bounds.y) {
                    out.push.apply(out, this.nodes[Node.BOTTOM_LEFT].getAllContent());
                }
            }

            if (item.x + item.width > this.nodes[Node.TOP_RIGHT]._bounds.x) {//position+width bigger than middle x
                if (item.y <= this.nodes[Node.BOTTOM_RIGHT]._bounds.y) {
                    out.push.apply(out, this.nodes[Node.TOP_RIGHT].getAllContent());
                }

                if (item.y + item.height > this.nodes[Node.BOTTOM_RIGHT]._bounds.y) {
                    out.push.apply(out, this.nodes[Node.BOTTOM_RIGHT].getAllContent());
                }
            }
        }
    }

    out.push.apply(out, this._stuckChildren);
    out.push.apply(out, this.children);

    return out;
};

//Returns all contents of node.
BoundsNode.prototype.getAllContent = function () {
    var out = this._out;
    if (this.nodes.length) {

        var i;
        for (i = 0; i < this.nodes.length; i++) {
            this.nodes[i].getAllContent();
        }
    }
    out.push.apply(out, this._stuckChildren);
    out.push.apply(out, this.children);
    return out;
};

BoundsNode.prototype.clear = function () {

    this._stuckChildren.length = 0;

    //array
    this.children.length = 0;

    var len = this.nodes.length;

    if (!len) {
        return;
    }

    var i;
    for (i = 0; i < len; i++) {
        this.nodes[i].clear();
    }

    //array
    this.nodes.length = 0;

    //we could call the super clear function but for now, im just going to inline it
    //call the hidden super.clear, and make sure its called with this = this instance
    //Object.getPrototypeOf(BoundsNode.prototype).clear.call(this);
};
/****************END QUADTREE****************/


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

function search(nodes, node) {
    // Recursively search through nodes
    if (node.children.length > 0) {
        nodes.push(node);
        return nodes;
    } else {
        node.nodes.forEach(n => {
            search(nodes, n);
        });
    }
    return nodes;
}

// returns a gaussian random function with the given mean and stdev.
function gaussian(mean, stdev) {
    var y2;
    var use_last = false;
    return function() {
        var y1;
        if(use_last) {
           y1 = y2;
           use_last = false;
        }
        else {
            var x1, x2, w;
            do {
                 x1 = 2.0 * Math.random() - 1.0;
                 x2 = 2.0 * Math.random() - 1.0;
                 w  = x1 * x1 + x2 * x2;
            } while( w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w))/w);
            y1 = x1 * w;
            y2 = x2 * w;
            use_last = true;
       }

       var retval = mean + stdev * y1;
       if(retval > 0)
           return retval;
       return -retval;
   }
}

// make a standard gaussian variable.
var standard = gaussian(width / 2, 100);

let numPoints = 300;
let points = [];
let r = 200;
while (points.length < numPoints - 1) {
    // let x = rnd(0, width);
    // let y = rnd(0, height);
    let x = standard();
    let y = standard();
    points.push(point(x, y));
    // if (((x - width / 2) * (x - width / 2)) + ((y - height / 2) * (y - height / 2)) < (r * r)) {
    //     points.push(point(x, y));
    // }
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

for (let i = 0; i < points.length; i++) {
    let qtree = new QuadTree({x: 0, y: 0, width, height}, true, 10, 5);
    for (let j = 0; j < i; j++) {
        qtree.insert(points[j]);
    }
    let p = points.slice(0, i);
    let nodes = [];
    nodes = search(nodes, qtree.root);
    actions.push({type: 'insert', points: p, qtree, nodes });
}
// console.log(actions);
// let s = 0;
// let nodes = [];
// search(qtree.root);
// console.log(s);
//
let min = Infinity;
let max = -Infinity;
actions[actions.length - 1].nodes.forEach(node => {
    if (node._bounds.width < min) min = node._bounds.width;
    if (node._bounds.width > max) max = node._bounds.width;
});
// console.log(min, max);
//
let colorScale = d3.scaleLinear()
    .domain([min, max])
    .range(['#fc8d59', '#99d594']);
let pointColorScale = d3.scaleLinear()
    .domain([0, numPoints])
    .range(['#f768a1', '#7a0177']);
//
// g.append('rect')
//     .attr('x', 0)
//     .attr('y', 0)
//     .attr('width', width)
//     .attr('height', height)
//     .style('fill', '#e9fff1');
// g.selectAll('.node').data(nodes).enter().append('rect')
//         .attr('x', d => d._bounds.x)
//         .attr('y', d => d._bounds.y)
//         .attr('width', d => d._bounds.width)
//         .attr('height', d => d._bounds.height)
//         .style('fill', d => colorScale(d._bounds.width))
//         // .each(function(d, i) {
//         //     this.style.fill = `rgba(0, ${rndInt(50, 180)}, 0, 1)`;
//         // })
//         .style('stroke', 'white');
//
// g.selectAll('.point').data(points).enter().append('circle')
//     .attr('cx', d => d.x)
//     .attr('cy', d => d.y)
//     .attr('r', 3)
//     .style('fill', (d, i) => pointColorScale(i));
// points.forEach(p => drawPoint(p));



// console.log(Quadtree);


// draw qtree
// function drawTree

function update(counter) {
    let action = actions[counter];
    console.log(action);

    let nodesData = g.selectAll('.node').data(action.nodes, (d, i) => `node-${i}`);
    let pointsData = g.selectAll('.point').data(action.points, (d, i) => `point-${i}`);

    nodesData.enter().append('rect')
        .attr('class', 'node')
        .attr('x', d => d._bounds.x)
        .attr('y', d => d._bounds.y)
        .attr('width', d => d._bounds.width)
        .attr('height', d => d._bounds.height)
        .style('stroke', d => colorScale(d._bounds.width))
        .style('fill', 'transparent')
        .style('stroke-width', '2px');
    pointsData.enter().append('circle')
        .attr('class', 'point')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 3)
        // .style('fill', (d, i) => pointColorScale(i))
        .style('opacity', 0.7);

    nodesData.exit().remove();
    pointsData.exit().remove();

    nodesData
        .attr('x', d => d._bounds.x)
        .attr('y', d => d._bounds.y)
        .attr('width', d => d._bounds.width)
        .attr('height', d => d._bounds.height)
        .style('stroke', d => colorScale(d._bounds.width))
        .style('fill', 'transparent')
        .style('stroke-width', '2px');
    pointsData
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 3)
        // .style('fill', (d, i) => pointColorScale(i))
        .style('opacity', 0.7);

}

let interval = 80;
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

