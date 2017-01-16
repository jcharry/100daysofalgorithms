/* eslint "no-unused-vars": "off" */
// What should a body be able to do?
// 1. Attach to other bodies or surfaces
// 2. Respond to forces (spring, friction)
// 3. Move according to velocity and acceleration

// import materials from '../extras/materials.json';
import vector, {Vector} from './Vector';
// import * as math from '../math/math';

/**
 * Convenience Function so user doesn't have use 'new' keyword
 * @param {object} options - initialization options
 * @return {Body} instance of Body
 */

let Body = {
    init: function(options) {
        options = options || {};

        // Warn user if a body object is initialized with nothing or an empty
        // object
        if (Object.keys(options).length === 0 && options.constructor === Object) {
            console.warn('You probably should initialize body objects with some values...just sayin');
        }

        // STYLE //
        this.style = {
            fillStyle: options.fillStyle || 'rgba(0,0,0,0)',
            lineWidth: options.lineWidth || 2,
            strokeStyle: options.strokeStyle || '#abcabc'
        };
        this.height = options.height || 10;
        this.width = options.width || 10;

        // PHYSICAL Properties //
        // Mass = density * volume;
        this._mass = options.mass || 1;
        this.invMass = 1 / this._mass;
        // Inertial is calculated on a shape by shape basis, check specific
        // shape files

        // MOTION Properties //
        this.position = vector(options.x || 0, options.y || 0);
        this.positionPrev = this.position.clone();
        this.interpolatedPosition = this.position.clone();
        this.velocity = vector(
            (options.velocity && options.velocity.x) || 0,
            (options.velocity && options.velocity.y) || 0
        );
        // this.acceleration = vector(
        //     (options.acceleration && options.acceleration.x) || 0,
        //     (options.acceleration && options.acceleration.y) || 0,
        // );
        this.force = vector(
            (options.force && options.force.x) || 0,
            (options.force && options.force.y) || 0
        );
        this.torque = options.torque === undefined ? 0 : options.torque;
        this._scale = 1;
        this._rotation = options.rotation === undefined ? 0 : options.rotation; // <-- Private prop - DO NOT SET THIS DIRECTLY, use getter and setter for
        this.interpolatedRotation = this.rotation;
        this.rotationPrev = this._rotation;
        this.angularVelocity = options.angularVelocity === undefined ? 0 : options.angularVelocity;

        // COLLISION Properties //
        this.static = options.static === true;
        this.canCollide = options.canCollide !== false;
        this.colliderList = [];

        // OPTICAL Properties //
        this.refractiveIndex = options.refractiveIndex || 1;
        this.material = options.material || 'GLASS';
        this.materialColor = options.fillStyle || 'black';
        this.mirror = options.mirror || false;
        this.intersectionPoints = {};

        // If debug = true, bounding box will be drawn
        this.debug = options.debug === undefined ? false : options.debug;

        return this;
    },

    freeze: function() {
        this.setPosition(this.position.x, this.position.y);
        // this.static = true;
        // this._cachedVelocity = this.velocity.clone();
        // this.velocity.x = 0;
        // this.velocity.y = 0;
        return this;
    },

    unfreeze: function() {
        this.static = false;
        // if (this._cachedVelocity) {
        //     this.velocity.x = this._cachedVelocity.x;
        //     this.velocity.y = this._cachedVelocity.y;
        // } else {
        //     console.warn('cannot unfreeze a non-frozen object');
        // }
        return this;
    },

    translate: function(...args) {
        if (args.length === 1) {
            if (typeof args[0] === 'object') {
                // Assume we have a vector object
                this.position.add(args[0]);
            }
        } else if (args.length === 2) {
            if (typeof args[0] === 'number' && typeof args[1] === 'number') {
                this.position.x += args[0];
                this.position.y += args[1];
            }
        }

        if (this.updateVertices) {
            this.updateVertices();
        }
        return this;
    },

    rotate: function(angle) {
        this.rotation += angle;
        return this;
    },

    updateVertices: function() {
        switch (this.type) {
            case 'rectangle': {
                let w = this.width,
                    h = this.height,
                    x = this.position.x,
                    y = this.position.y;
                switch (this._mode) {
                    case 'CENTER':
                        x -= (w / 2);
                        y -= (h / 2);
                        break;
                    case 'RIGHT':
                        x -= w;
                        break;
                    default:
                        break;
                }

                //Get centroid
                this.centroid = vector(
                    (x + (x + w)) / 2,      // <-- x value
                    (y + (y + h)) / 2       // <-- y value
                );

                this.vertices = [
                    vector(x, y),
                    vector(x + w, y),
                    vector(x + w, y + h),
                    vector(x, y + h)
                ];

                // To perform a rotation, we have to first translate to the origin,
                // then rotate, then translate back to the centroid
                if (this.angularVelocity !== 0 || this._rotation !== 0 || this._scale !== 0) {
                    this.vertices.forEach(vertex => {
                        vertex.translate(-this.centroid.x, -this.centroid.y)
                            .rotate(this._rotation)
                            .multiply(this._scale)
                            .translate(this.centroid.x, this.centroid.y);
                    });
                }
                break;
            }
            case 'polygon': {
                this.centroid = {x: 0, y: 0};
                this.vertices.forEach((vert, index) => {
                    let relVert = this._relativeVertices[index];
                    vert.x = relVert.x + this.position.x;
                    vert.y = relVert.y + this.position.y;

                    this.centroid.x += vert.x;
                    this.centroid.y += vert.y;
                });

                this.centroid.x /= this.vertices.length;
                this.centroid.y /= this.vertices.length;

                // Update rotate vertices if necessary
                if (this.angularVelocity !== 0 || this._rotation !== 0 || this._scale !== 0) {
                    this.vertices.forEach(vert => {
                        vert.translate(-this.centroid.x, -this.centroid.y)
                            .rotate(this._rotation)
                            .multiply(this._scale)
                            .translate(this.centroid.x, this.centroid.y);
                    });
                }
                break;
            }
            case 'circle':
                this.centroid = {x: this.position.x, y: this.position.y};
                break;
            default:
                return;
        }
    },

    addForce: function(x, y) {
        this.force.x += x;
        this.force.y += y;
    },

    setForce: function(x, y) {
        this.force.x = x;
        this.force.y = y;
    },

    // Instantaneously set position without verlet integration
    setPosition: function(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.positionPrev.x = x;
        this.positionPrev.y = y;
    },

    // Instantaneously set x position without verlet integration
    setX: function(x) {
        this.position.x = x;
        this.positionPrev.x = x;
    },
    setY: function(y) {
        this.position.y = y;
        this.positionPrev.y = y;
    },
    setRotation: function(angle) {
        this.rotation = angle;
        this.rotationPrev = angle;
    },

    // TODO: 1/4 Fix the update loop -> body is accelerating WAY too fast.
    update: function(dt) {
        // if (!this.static) {
        //     this.velocity.add(this.acceleration);
        //     this.position.add(this.velocity);
        //     this.rotation += this.angularVelocity;
        // var frictionAir = 1 - body.frictionAir * timeScale * body.timeScale,
        let deltaTimeSquared = dt * dt;

        // Calculate previous velocity using change in position during one step
        let velocityPrevX = this.position.x - this.positionPrev.x,
            velocityPrevY = this.position.y - this.positionPrev.y;

        // update velocity with Verlet integration
        this.velocity.x = velocityPrevX + (this.force.x * this.invMass) * deltaTimeSquared;
        this.velocity.y = velocityPrevY + (this.force.y * this.invMass) * deltaTimeSquared;
        this.angularVelocity = (this.rotation - this.rotationPrev) + (this.torque * this.invInertia) * deltaTimeSquared;

        // Save previous position
        this.positionPrev.x = this.position.x;
        this.positionPrev.y = this.position.y;

        // Update position with calculated velocity
        this.position.add(this.velocity);
        this.rotationPrev = this.rotation;
        this.rotation += this.angularVelocity * deltaTimeSquared;

        if (this.updateVertices) {
            this.updateVertices();
        }

        // For each update loop, reset intersection points to zero
        // These are used for wave intersections, not collisions
        this.intersectionPoints = {};

        this.colliderList = [];
        this.aabb.update();
        return this;
    }
};

Object.defineProperty(Body, 'rotation', {
    get: function() {
        return this._rotation;
    },
    set: function(angle) {
        this._rotation = angle;
        if (this.updateVertices) {
            this.updateVertices();
        }
    }
});

Object.defineProperty(Body, 'scale', {
    get: function() {
        return this._scale;
    },
    set: function(scaleFactor) {
        this._scale = scaleFactor;
        if (this.updateVertices) {
            this.updateVertices();
        } else if (this.type === 'circle') {
            this.scaledRadius = this.radius * scaleFactor;
        }
    }
});

Object.defineProperty(Body, 'mass', {
    get: function() {
        return this._mass;
    },
    set: function(m) {
        this._mass = m;
        this.invMass = 1 / m;
    }
});

export default Body;
