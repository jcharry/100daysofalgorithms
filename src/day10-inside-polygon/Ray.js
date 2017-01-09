/* eslint
    "no-unused-vars": "off",
 */
import {distance, degToRad} from './math';
import vector, {Vector} from './Vector.js';

let Ray = {
    /**
     * Ray object for tracing
     * @constructs
     * @param {number} x - origin x
     * @param {number} y - origin y
     * @param {number} dir - direction in radians (or degrees if 'degrees' param
     * = true)
     * @param {bool} degrees - optional flag, if true, then read direction as
     * degrees
     */
    init: function(x, y, dir, degrees) {
        if (degrees) {
            dir = degToRad(dir);
        }

        this.origin = vector(x, y);
        this.direction = vector(Math.cos(dir), Math.sin(dir));
        this.invDirection = vector(1 / this.direction.x, 1 / this.direction.y);
        this.outerBodies = [];
        this.t = window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight;
        let x0 = this.origin.x,
            y0 = this.origin.y,
            x1 = this.origin.x + this.direction.x * this.t,
            y1 = this.origin.y + this.direction.y * this.t;
        this.slope = (y1 - y0) / (x1 - x0);
        // TODO: Figure out a way to give each ray a unique ID
        this.numTests = 0;
    },

    /**
     * Return the objects from spatial hash to perform collision detection on
     * @param {SpatialHash} hash - hash from the System
     */

    trace: function(system) {
        // Always use radians, regardless of mode
        // Also angle should be in range 0 <= angle <= 2PI
        //let angle = this.direction.getAngle();
        this.intersectionPoint = null;
        this.intersectingBody = null;
        this.intersectingSegment = null;

        // Iterate the rayID to ensure no duplicates
        this.rayID = system.currentRayId++;
        this.numTests = 0;      // debugging param - how many tests are run
        this.intersectHash(system.hash);

        // After going through all bodies and segments,
        // if an intersection point was found...
        if (this.intersectionPoint) {
            return true;
        }
    },

    /**
     * Detect if ray intersects circle
     * http://stackoverflow.com/questions/1073336/circle-line-segment-collision-detection-algorithm
     *
     * Using the following formula
     * t^2 * (r DOT r) + 2t*( f DOT r ) + ( f DOT f - radius^2 ) = 0
     * at^2 + bt + c where a = d.dot(d), b = 2*f.dot(d), c = f.dot(f)
     * - radius^2
     *      where:
     *          d = end point of ray - start point of ray
     *          t = scalar value - what we're solving for
     *          r = ray vector
     *          f = vector from center of sphere to origin of ray
     *          radius = radius of circle
     *
     * 3x HIT cases:
     *  -o->                    --|-->  |            |  --|->
     * Impale(t1 hit,t2 hit), Poke(t1 hit,t2>1), ExitWound(t1<0, t2 hit),
     *
     * 3x MISS cases:
     *     ->  o                     o ->              | -> |
     * FallShort (t1>1,t2>1), Past (t1<0,t2<0), CompletelyInside(t1<0, t2>1)
     *
     * @param {Body} circle - circle body object
     * @param {Vector} p - point of origin
     * @param {Vector} r - ray vector
     * @return {boolean} true if intersection was found, false otherwise
     */
    intersectCircle: function(circle) {
        this.numTests += 1;
        let radius = circle.radius;

        let d = vector(this.direction.x * this.t, this.direction.y * this.t);
        let f = Vector.subtract(this.origin, circle.position);//this.origin.clone();

        // Solve the quadratic equation
        let a = d.dot(d);
        let b = 2 * f.dot(d);
        let c = f.dot(f) - radius * radius;

        // Descriminant b^2 - 4ac
        let desc = (b * b) - (4 * a * c);

        if (desc < 0) {
            // No intersection
        } else {
            // Ray hit circle
            // Two possible solutions
            desc = Math.sqrt(desc);
            let t1 = (-b - desc) / (2 * a);
            let t2 = (-b + desc) / (2 * a);
            let ix, iy;

            // If t1 intersected the circle...
            // Note: t1 is always closer than t2
            if (t1 >= 0 && t1 <= 1) {
                ix = this.origin.x + d.x * t1;
                iy = this.origin.y + d.y * t1;
                this.updateIntersectionPoint({x: ix, y: iy}, null, circle);
                return true;
            }

            // If t1 doesn't intersect, check t2
            if (t2 >= 0 && t2 <= 1) {
                ix = this.origin.x + d.x * t2;
                iy = this.origin.y + d.y * t2;
                this.updateIntersectionPoint({x: ix, y: iy}, null, circle);
                return true;
            }
        }

        return false;
    },

    /**
     * Handles case of ray-polygon intersection
     * If an intersecting segment is found,
     * set the props accordingly
     * @private
     * @param {Polygon} poly - rect body object
     * @return {bool} true if intersected, otherwise false
     */
    intersectPolygon: function(poly) {
        this.numTests += 1;
        if (poly.isPointInterior(this.origin)) {
            this.outerBodies.push(poly);
        }
        let vertices = poly.vertices;
        let vertLength = vertices.length;
        let intersection;
        vertices.forEach((vert, index, verts) => {
            let seg2;
            if (index === vertLength - 1) {
                seg2 = verts[0];
            } else {
                seg2 = verts[index + 1];
            }

            intersection = this.intersectSegment([vert, seg2]);
            if (intersection) {
                this.updateIntersectionPoint(intersection.intPoint, intersection.segVec, poly);
            }
        });

        return typeof intersection !== 'undefined';
    },
    /**
     * Detects Ray-Segment intersection - Returns intersection coords
     * @param {Array} seg - segment vertices
     * @param {Vector} dir - optional direction to use, otherwise use
     * this.direction
     * @return {Object} returns intersection point with body, or false
     */
    intersectSegment: function(seg, dir) {
        let r = dir ?
            vector(dir.x * this.t, dir.y * this.t) :  // Dir passed to fn
            vector(this.t * this.direction.x, this.t * this.direction.y);   // Use ray dir
        let p = vector(this.origin.x, this.origin.y);                           // Ray origin
        let q = vector(seg[0].x, seg[0].y);                                     // Segment start point
        let s = vector(seg[1].x - seg[0].x, seg[1].y - seg[0].y);               // Segment vector

        // check for intersection
        // t = (q − p) x s / (r x s)
        // u = (q − p) x r / (r x s)
        let rxs = r.cross(s);
        let tmp = Vector.subtract(q, p);
        let tNum = tmp.cross(s),
            uNum = tmp.cross(r);

        // t, u are distances traveled along vector
        let t, u;
        if (rxs !== 0) {
            t = tNum / rxs;
            u = uNum / rxs;
        }

        // TODO: handle collinear case
        if (rxs === 0 && uNum === 0) {
            // lines are collinear
            return;
        } else if (rxs === 0 && uNum !== 0) {
            // lines are parallel and non-intersecting
            return false;
        } else if (rxs !== 0 && t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            // Two lines intersect,
            // and meet at the point
            // p + tr = q + us
            let px = p.x,
                py = p.y,
                rx = r.x,
                ry = r.y,
                ix = px + t * rx,
                iy = py + t * ry;

            return {
                intPoint: vector(ix, iy),
                segVec: s,
                t
            };
        }

        // Line segments do not intersect
        // if we've gone through all the segments of the body,
        //intersectionPoint = null;
        return false;
    },

    /**
     * Test for Ray-Hash bucket intersections
     * @param {SpatialHash} hash - system.hash object
     * @return {array} list of intersected buckets
     *
     * See here: http://www.cse.chalmers.se/edu/year/2011/course/TDA361_Computer_Graphics/grid.pdf
     * THIS WORKED -> http://www.playchilla.com/ray-casting-spatial-hash-dda
     */
    intersectHash: function(hash) {
        // TODO: Handle case where ray starts outside bounds

        // Initialize variables
        // Step 1. Initialization - determine starting voxel
        let bucket = hash.hash(this.origin);
        let {row, col} = bucket;
        let X = col,
            Y = row;
        let tMaxX, tMaxY, tDeltaX, tDeltaY;
        let stepX = this.direction.x < 0 ? -1 : 1,
            stepY = this.direction.y < 0 ? -1 : 1;
        let cellSize = hash.cellSize;

        // Row and Col offset for picking which horizontal or veritcal segments
        // to use for intersection tests
        // let rowOffset = stepY < 1 ? 0 : 1,
        //     colOffset = stepX < 1 ? 0 : 1;

        tDeltaX = cellSize / Math.abs(this.direction.x);
        tDeltaY = cellSize / Math.abs(this.direction.y);

        tMaxX = X * cellSize - this.origin.x;
        tMaxY = Y * cellSize - this.origin.y;
        if (this.direction.x >= 0) {
            tMaxX += cellSize;
        }
        if (this.direction.y >= 0) {
            tMaxY += cellSize;
        }

        tMaxX /= this.direction.x;
        tMaxY /= this.direction.y;

        while (Y < hash.numRows &&
                Y > -1 &&
                X < hash.numCols &&
                X > -1) {
            // In debug mode - Draw buckets that ray overlaps
            if (window.renderer.debug) {
                window.ctx.beginPath();
                window.ctx.globalAlpha = 1;
                window.ctx.strokeStyle = 'orange';
                window.ctx.lineWidth = 3;
                window.ctx.strokeRect(X * cellSize, Y * cellSize, cellSize, cellSize);
            }

            // If we've found some contents in that hash bucket...
            if (hash.contents[Y] && hash.contents[Y][X] && hash.contents[Y][X].length !== 0) {
                // TODO: Here's where we need to check if the object is
                // actually intersecting the ray
                // Intersect all objects in this voxel only
                let contents = hash.contents[Y][X];
                contents.forEach(body => {
                    if (body.intersectionPoints[this.rayID]) {
                        // Already tested this body
                        // It either hit or missed, if it hit, grab the point
                        if (body.intersectionPoints[this.rayID].status === 'hit') {
                            this.updateIntersectionPoint(
                                body.intersectionPoints[this.rayID].intPoint,
                                body.intersectionPoints[this.rayID].segVec,
                                body
                            );
                            return;
                        }

                        // It missed, so do nothing;
                        return;
                    }

                    // If ray and body haven't been tested, then test
                    // If it hits the AABB, then perform
                    // actual intersection tests
                    let hitsAABB = this.intersectAABB(body.aabb);
                    if (hitsAABB) {
                        switch (body.type) {
                            case 'polygon':
                            case 'rectangle':
                                this.intersectPolygon(body);
                                break;
                            case 'circle':
                                this.intersectCircle(body);
                                break;
                            default:
                                break;
                        }
                    }

                    // Flag body to know we've already tested this ray-body
                    // combo
                    if (this.intersectionPoint) {
                        body.intersectionPoints[this.rayID] = {
                            status: 'hit',
                            intPoint: this.intersectionPoint,
                            segVeg: this.intersectingSegment
                        };
                    } else {
                        // If we missed, flag the body without
                        // intersectionPoint
                        body.intersectionPoints[this.rayID] = {status: 'miss'};
                    }
                });
            }

            // Increment X or Y step
            if (tMaxX === undefined && tMaxY === undefined) {
                break;
            } else if (tMaxX === undefined) {
                tMaxY += tDeltaY;
                Y += stepY;
            } else if (tMaxY === undefined) {
                tMaxX += tDeltaX;
                X += stepX;
            } else if (tMaxX < tMaxY) {
                tMaxX += tDeltaX;
                X += stepX;
            } else if (tMaxX >= tMaxY) {
                tMaxY += tDeltaY;
                Y += stepY;
            }
        }

        return {
            hashCoordinates: {
                x: X,
                y: Y
            },
            intPoint: this.intersectionPoint
        };
    },

    /**
     * Axis-Aligned Bounding Box Intersection test
     * @param {AABB} aabb - the box to test
     * @return {boolean} true for hit, false for miss
     */
    intersectAABB: function(aabb) {
        let tx1 = (aabb.min.x - this.origin.x) * this.invDirection.x;
        let tx2 = (aabb.max.x - this.origin.x) * this.invDirection.x;

        let tmin = Math.min(tx1, tx2);
        let tmax = Math.max(tx1, tx2);

        let ty1 = (aabb.min.y - this.origin.y) * this.invDirection.y;
        let ty2 = (aabb.max.y - this.origin.y) * this.invDirection.y;

        tmin = Math.max(tmin, Math.min(ty1, ty2));
        tmax = Math.min(tmax, Math.max(ty1, ty2));
        let didHit = tmax >= tmin && tmax >= 0;
        return didHit;
    },

    /**
     * Internally used to update point of intersection property
     * @private
     * @param {Point} intPoint - object with x and y properties representing
     * intersection point
     * @param {Vector} segVec - vector object that was intersected
     * @param {Body} body - body that was intersected
     */
    updateIntersectionPoint: function(intPoint, segVec, body) {
        let px = this.origin.x;
        let py = this.origin.y;
        let ix = intPoint.x;
        let iy = intPoint.y;

        // If there was a previously stored intersection point,
        // check if this one is closer,
        // and if so update it's values
        if (this.intersectionPoint) {
            if (distance(px, py, ix, iy) <
                distance(px, py, this.intersectionPoint.x, this.intersectionPoint.y)) {
                this.intersectionPoint = {x: ix, y: iy};
                this.intersectingBody = body;
                this.intersectingSegment = segVec;
            }
        } else {
            // We don't yet have an intersection point, so make a new
            // one
            this.intersectionPoint = {x: ix, y: iy};
            this.intersectingBody = body;
            this.intersectingSegment = segVec;
        }
    }
};

/**
 * 'Constructor' function
 * @public
 * @param {number} x - origin x
 * @param {number} y - origin y
 * @param {number} dir - direction in radians (or degrees if 'degrees' param
 * = true)
 * @param {bool} degrees - optional flag, if true, then read direction as
 * degrees
 *
 * @return {object} ray object
 */
var ray = function(x, y, dir, degrees) {
    let R = Object.create(Ray);
    R.init(x, y, dir, degrees);
    return R;
};

export default ray;
