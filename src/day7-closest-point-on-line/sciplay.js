(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("sciplay", [], factory);
	else if(typeof exports === 'object')
		exports["sciplay"] = factory();
	else
		root["sciplay"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(2);
	module.exports = __webpack_require__(3);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	/*globals window __webpack_hash__ */
	if(false) {
		var lastData;
		var upToDate = function upToDate() {
			return lastData.indexOf(__webpack_hash__) >= 0;
		};
		var check = function check() {
			module.hot.check(true, function(err, updatedModules) {
				if(err) {
					if(module.hot.status() in {
							abort: 1,
							fail: 1
						}) {
						console.warn("[HMR] Cannot apply update. Need to do a full reload!");
						console.warn("[HMR] " + err.stack || err.message);
						window.location.reload();
					} else {
						console.warn("[HMR] Update failed: " + err.stack || err.message);
					}
					return;
				}
	
				if(!updatedModules) {
					console.warn("[HMR] Cannot find update. Need to do a full reload!");
					console.warn("[HMR] (Probably because of restarting the webpack-dev-server)");
					window.location.reload();
					return;
				}
	
				if(!upToDate()) {
					check();
				}
	
				require("./log-apply-result")(updatedModules, updatedModules);
	
				if(upToDate()) {
					console.log("[HMR] App is up to date.");
				}
	
			});
		};
		var addEventListener = window.addEventListener ? function(eventName, listener) {
			window.addEventListener(eventName, listener, false);
		} : function(eventName, listener) {
			window.attachEvent("on" + eventName, listener);
		};
		addEventListener("message", function(event) {
			if(typeof event.data === "string" && event.data.indexOf("webpackHotUpdate") === 0) {
				lastData = event.data;
				if(!upToDate() && module.hot.status() === "idle") {
					console.log("[HMR] Checking for updates on the server...");
					check();
				}
			}
		});
		console.log("[HMR] Waiting for update signal from WDS...");
	} else {
		throw new Error("[HMR] Hot Module Replacement is disabled.");
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	/* eslint "max-len": "off" */
	// Request animation frame shim
	(function () {
	    var lastTime = 0;
	    var vendors = ['ms', 'moz', 'webkit', 'o'];
	    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
	        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	    }
	
	    if (!window.requestAnimationFrame) {
	        window.requestAnimationFrame = function (callback, element) {
	            var currTime = new Date().getTime();
	            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	            var id = window.setTimeout(function () {
	                callback(currTime + timeToCall);
	            }, timeToCall);
	            lastTime = currTime + timeToCall;
	            return id;
	        };
	    }
	
	    if (!window.cancelAnimationFrame) {
	        window.cancelAnimationFrame = function (id) {
	            clearTimeout(id);
	        };
	    }
	})();

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Vector = __webpack_require__(4);
	
	var _Vector2 = _interopRequireDefault(_Vector);
	
	var _Ray = __webpack_require__(6);
	
	var _Ray2 = _interopRequireDefault(_Ray);
	
	var _System = __webpack_require__(7);
	
	var _System2 = _interopRequireDefault(_System);
	
	var _Renderer = __webpack_require__(19);
	
	var _Renderer2 = _interopRequireDefault(_Renderer);
	
	var _Rect = __webpack_require__(20);
	
	var _Rect2 = _interopRequireDefault(_Rect);
	
	var _Wave = __webpack_require__(24);
	
	var _Wave2 = _interopRequireDefault(_Wave);
	
	var _Circle = __webpack_require__(25);
	
	var _Circle2 = _interopRequireDefault(_Circle);
	
	var _Polygon = __webpack_require__(26);
	
	var _Polygon2 = _interopRequireDefault(_Polygon);
	
	var _Point = __webpack_require__(27);
	
	var _Point2 = _interopRequireDefault(_Point);
	
	var _CONSTANTS = __webpack_require__(18);
	
	var constants = _interopRequireWildcard(_CONSTANTS);
	
	var _BoundaryConstraint = __webpack_require__(15);
	
	var _BoundaryConstraint2 = _interopRequireDefault(_BoundaryConstraint);
	
	var _LinkConstraint = __webpack_require__(17);
	
	var _LinkConstraint2 = _interopRequireDefault(_LinkConstraint);
	
	var _GJK = __webpack_require__(28);
	
	var _GJK2 = _interopRequireDefault(_GJK);
	
	var _collisionTypes = __webpack_require__(29);
	
	var _collisionTypes2 = _interopRequireDefault(_collisionTypes);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* Constraints */
	
	
	/* BODIES */
	
	
	/* CORE OBJECTS */
	/* MATH OBJECTS */
	var sciplay = function sciplay() {
	    return {
	        Vector: _Vector.Vector, // for operations that return a new vector
	        vector: _Vector2.default, // actual vector constructor
	        renderer: _Renderer2.default,
	        ray: _Ray2.default,
	        system: _System2.default,
	        wave: _Wave2.default,
	        rect: _Rect2.default,
	        point: _Point2.default,
	        polygon: _Polygon2.default,
	        circle: _Circle2.default,
	        collisionTypes: _collisionTypes2.default,
	        constants: constants,
	        boundaryConstraint: _BoundaryConstraint2.default,
	        linkConstraint: _LinkConstraint2.default,
	        dev: {
	            GJK: _GJK2.default
	        }
	    };
	};
	
	/* CONSTANTS */
	exports.default = sciplay;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Vector = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
	                                                                                                                                                                                                                                                                               * Generic Vector class
	                                                                                                                                                                                                                                                                               *
	                                                                                                                                                                                                                                                                               *
	                                                                                                                                                                                                                                                                               * @example
	                                                                                                                                                                                                                                                                               * import vector, {Vector} from 'Vector';
	                                                                                                                                                                                                                                                                               *
	                                                                                                                                                                                                                                                                               * Instantiate new objects in the following ways
	                                                                                                                                                                                                                                                                               *  1. use vector convenience function like so: vector(x, y);
	                                                                                                                                                                                                                                                                               *  2. use Vector object directly like: new Vector(x, y);
	                                                                                                                                                                                                                                                                               *
	                                                                                                                                                                                                                                                                               * Methods on a newly created vector, such as .add or .subtract
	                                                                                                                                                                                                                                                                               * modify the x and y properties on that vector, changing them forever
	                                                                                                                                                                                                                                                                               * i.e.
	                                                                                                                                                                                                                                                                               *      let vec1 = vector(0, 0);
	                                                                                                                                                                                                                                                                               *      let vec2 = vector(10, 20);
	                                                                                                                                                                                                                                                                               *      vec1.add(vec2);
	                                                                                                                                                                                                                                                                               *
	                                                                                                                                                                                                                                                                               * Results in vec1.x = 10 and vec1.y = 20.  vec2 is unmodified
	                                                                                                                                                                                                                                                                               *
	                                                                                                                                                                                                                                                                               * To perform an operation on two vectors and return a new vector,
	                                                                                                                                                                                                                                                                               * without modifying the input vectors, use the methods on {Vector}
	                                                                                                                                                                                                                                                                               * i.e.
	                                                                                                                                                                                                                                                                               *      let vec1 = vector(0, 0);
	                                                                                                                                                                                                                                                                               *      let vec2 = vector(10, 20);
	                                                                                                                                                                                                                                                                               *      let vec3 = Vector.add(vec1, vec2);
	                                                                                                                                                                                                                                                                               *
	                                                                                                                                                                                                                                                                               * Results in vec1 and vec2 remining unmodified,
	                                                                                                                                                                                                                                                                               * and vec3.x = 10 and vec3.y = 20
	                                                                                                                                                                                                                                                                               *
	                                                                                                                                                                                                                                                                               */
	
	var _math = __webpack_require__(5);
	
	/**
	 * Base Vector constructor
	 * @constructor
	 * @param {number} x - x coordinate
	 * @param {number} y - y coordinate
	 */
	var Vector = exports.Vector = function Vector(x, y) {
	    this.x = x || 0;
	    this.y = y || 0;
	};
	
	/**
	 * Prototype object for all Vectors
	 */
	Vector.prototype = {
	    /**
	     * Return a copy of a vector
	     * @method
	     * @return {Vector} a new vector object
	     */
	    clone: function clone() {
	        return new Vector(this.x, this.y);
	    },
	
	    /**
	     * Generic Setter
	     * @method
	     * @param {string} prop - property to set
	     * @param {*} val - value to set
	     * @return {This} for chaining
	     */
	    set: function set(prop, val) {
	        if (prop === 'x') {
	            this.x = val;
	        } else if (prop === 'y') {
	            this.y = val;
	        }
	        return this;
	    },
	
	    /**
	     * Add another vector to this vector, modifying internal
	     * properties
	     * @method
	     * @param {Vector} vec - vector to add
	     * @return {This} for chaining
	     */
	    add: function add() {
	        var x = void 0,
	            y = void 0;
	        if (arguments.length === 1) {
	            var vec = arguments.length <= 0 ? undefined : arguments[0];
	            if ((typeof vec === 'undefined' ? 'undefined' : _typeof(vec)) === 'object') {
	                x = vec.x;
	                y = vec.y;
	            }
	        } else if (arguments.length === 2) {
	            if (typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'number' && typeof (arguments.length <= 1 ? undefined : arguments[1]) === 'number') {
	                x = arguments.length <= 0 ? undefined : arguments[0];
	                y = arguments.length <= 1 ? undefined : arguments[1];
	            }
	        }
	
	        this.x += x;
	        this.y += y;
	
	        return this;
	    },
	
	    /**
	     * Subtract another vector from this vector
	     * @method
	     * @param {Vector} vec - vector to subtract
	     * @return {This} for chaining
	     */
	    subtract: function subtract(vec) {
	        this.x -= vec.x;
	        this.y -= vec.y;
	        return this;
	    },
	
	    /**
	     * Multiply another vector by this vector or scalar
	     * modifies internal properties
	     * @param {Vector|number} vec - either Vector object or single scalar
	     * @return {This} for chaining
	     */
	    multiply: function multiply(vec) {
	        if ((typeof vec === 'undefined' ? 'undefined' : _typeof(vec)) === 'object') {
	            this.x *= vec.x;
	            this.y *= vec.y;
	        } else if (typeof vec === 'number') {
	            this.x *= vec;
	            this.y *= vec;
	        }
	
	        return this;
	    },
	
	    /**
	     * Gives the magnitude (length, essentially) of the vector
	     * @method
	     * @return {number} magnitude of the vector
	     */
	    magnitude: function magnitude() {
	        return Math.sqrt(this.x * this.x + this.y * this.y);
	    },
	
	    /**
	     * Magnitude squared - useful when trying to save on computation
	     * @method
	     * @return {number} mag squared
	     */
	    magnitudeSq: function magnitudeSq() {
	        return this.x * this.x + this.y * this.y;
	    },
	
	    /**
	     * Negate both x and y values (essentially rotate vector 180 degrees)
	     * @method
	     * @return {Vector} for method chaining
	     */
	    negate: function negate() {
	        this.x = -this.x;
	        this.y = -this.y;
	        return this;
	    },
	
	    /**
	     * Translate to specified x and y points
	     * @param {number} x - amount to move in the x
	     * @param {number} y - amount to move in the y
	     * @return {This} for chaining
	     */
	    // translate:
	    // function(x, y) {
	    //     this.x += x;
	    //     this.y += y;
	    //     return this;
	    // },
	
	    /**
	     * Rotate vector around specified point of rotation
	     * Note: Will rotate around origin
	     * @param {number} angle - amount of rotation in radians
	     * @return {This} for chaining
	     */
	    rotate: function rotate(angle) {
	        var sin = Math.sin(angle);
	        var cos = Math.cos(angle);
	        var x = this.x * cos - this.y * sin;
	        var y = this.x * sin + this.y * cos;
	        this.x = x;
	        this.y = y;
	        return this;
	    },
	
	    /**
	     * Dot product between two vectors
	     * Does NOT modify internal state
	     * @param {Vector} vec - the vector to dot with
	     * @return {number} dot product
	     */
	    dot: function dot(vec) {
	        return this.x * vec.x + this.y * vec.y;
	    },
	
	    /**
	     * Cross product between two vectors
	     * Does NOT modify internal state
	     * @method
	     * @param {Vector} vec - the vec to cross with
	     * @return {number} cross product
	     */
	    cross: function cross(vec) {
	        return this.x * vec.y - this.y * vec.x;
	    },
	
	    /**
	     * Return angle between two vectors in radians
	     * @param {Vector} vec - vector to find angle to
	     * @return {number} theta - radians between two vectors
	     */
	    angleTo: function angleTo(vec) {
	        var a = this.magnitude();
	        var b = vec.magnitude();
	        var d = this.dot(vec);
	
	        var theta = Math.acos(d / (a * b));
	        return theta;
	    },
	
	    /**
	     * Return angle from 0 of this vector
	     * @method
	     * @param {string} [mode] - if mode = 'DEGREES', return value will be in
	     * degrees, otherwise radians
	     * @return {number} angle in degrees or radians (depending on mode)
	     *
	     */
	    getAngle: function getAngle(mode) {
	        if (mode === 'DEGREES') {
	            return (0, _math.radToDeg)(Math.atan(this.y / this.x));
	        }
	        var a = Math.atan2(this.y, this.x);
	        //return a;
	        return a < 0 ? Math.PI * 2 + a : a;
	    },
	
	    /**
	     * Convert to a unit vector
	     * i.e. change length of vector to 1
	     * @method
	     * @return {This} for chaining
	     */
	    normalize: function normalize() {
	        var mag = this.magnitude();
	        this.x /= mag;
	        this.y /= mag;
	        return this;
	    },
	
	    /**
	     * Create normal vector based on current vector
	     * Modifies internal state!
	     * @param {string} side - specify 'left' or 'right' normal
	     * @return {This} for chaining
	     */
	    perp: function perp(side) {
	        if (side === 'right') {
	            var tmp = this.x;
	            this.x = this.y;
	            this.y = -tmp;
	        } else {
	            var _tmp = this.x;
	            this.x = -this.y;
	            this.y = _tmp;
	        }
	        return this;
	    },
	
	    /**
	     * Calculate euclidian distance between two vectors
	     * @param {Vector} vec - vector to find distance to
	     * @return {number} euclidean distance
	     */
	    distanceTo: function distanceTo(vec) {
	        return Math.sqrt((vec.x - this.x) * (vec.x - this.x) + (vec.y - this.y) * (vec.y - this.y));
	    },
	
	    /**
	     * Scalar Projection of A onto B assuming B is NOT a unit vector
	     * @param {Vector} vec - the vector to project onto
	     * @return {number} component of A on B
	     */
	    scalarProject: function scalarProject(vec) {
	        return this.dot(vec) / vec.magnitude();
	    },
	
	    /**
	     * Calculate Scalar projection of A onto B assuming that B is a unit vector
	     * This is more efficient assuming we already have a unit vector
	     * @param {Vector} vec - the unit vector to project onto
	     * @return {number} component of A on B
	     */
	    scalarProjectUnit: function scalarProjectUnit(vec) {
	        return this.dot(vec);
	    },
	
	    /**
	     * Vector Projection of A onto B assuming B is NOT a unit vector
	     * @param {Vector} vec - vector to project onto
	     * @return {This} for chaining
	     */
	    vectorProject: function vectorProject(vec) {
	        var scalarComp = this.dot(vec) / vec.magnitudeSq();
	        this.x = vec.x * scalarComp;
	        this.y = vec.y * scalarComp;
	        return this;
	    },
	
	    /**
	     * Vector Projection of A onto B assuming B IS a unit vector
	     * @param {Vector} vec - vector to project onto
	     * @return {This} for chaining
	     */
	    vectorProjectUnit: function vectorProjectUnit(vec) {
	        var scalarComp = this.dot(vec);
	        this.x = vec.x * scalarComp;
	        this.y = vec.y * scalarComp;
	        return this;
	    }
	};
	
	Vector.prototype.translate = Vector.prototype.add;
	
	/**
	 * Convenience function so we can ignore the 'new' keyword
	 * @param {number} x - initial x value
	 * @param {number} y - initial y value
	 * @return {Vector} a new vector object
	 */
	var vector = function vector(x, y) {
	    return new Vector(x, y);
	};
	
	// ---------- Static Methods -----------//
	/**
	 * @static
	 * @param {Vector} v1 - first Vector obj
	 * @param {Vector} v2 - second Vector obj
	 * @return {Vector}
	 *
	 * Adds two vectors, and returns a new one
	 */
	Vector.add = function (v1, v2) {
	    return new Vector(v1.x + v2.x, v1.y + v2.y);
	};
	Vector.subtract = function (v1, v2) {
	    return new Vector(v1.x - v2.x, v1.y - v2.y);
	};
	Vector.multiply = function (v1, v2) {
	    if (typeof v1 === 'number' && typeof v2 === 'number') {
	        return v1 * v2;
	    }
	
	    if ((typeof v1 === 'undefined' ? 'undefined' : _typeof(v1)) === 'object' && typeof v2 === 'number') {
	        return new Vector(v1.x * v2, v1.y * v2);
	    }
	
	    if ((typeof v2 === 'undefined' ? 'undefined' : _typeof(v2)) === 'object' && typeof v1 === 'number') {
	        return new Vector(v1 * v2.x, v1 * v2.y);
	    }
	
	    return new Vector(v1.x * v2.x, v1.y * v2.y);
	};
	Vector.dot = function (v1, v2) {
	    return v1.x * v2.x + v1.y * v2.y;
	};
	Vector.angleBetween = function (v1, v2) {
	    var a = v1.magnitude();
	    var b = v2.magnitude();
	    var d = v1.dot(v2);
	
	    var theta = Math.acos(d / (a * b));
	    return theta;
	};
	Vector.perp = function (v1, side) {
	    switch (side) {
	        case 'right':
	            return new Vector(v1.y, -v1.x);
	        default:
	            return new Vector(-v1.y, v1.x);
	    }
	};
	
	exports.default = vector;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var degToRad = exports.degToRad = function degToRad(angle) {
	    return angle * Math.PI / 180;
	};
	
	var radToDeg = exports.radToDeg = function radToDeg(angle) {
	    return angle * 180 / Math.PI;
	};
	
	var distance = exports.distance = function distance(x1, y1, x2, y2) {
	    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
	};
	
	var map = exports.map = function map(value, low1, high1, low2, high2) {
	    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _math = __webpack_require__(5);
	
	var _Vector = __webpack_require__(4);
	
	var _Vector2 = _interopRequireDefault(_Vector);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* eslint
	    "no-unused-vars": "off",
	 */
	var Ray = {
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
	    init: function init(x, y, dir, degrees) {
	        if (degrees) {
	            dir = (0, _math.degToRad)(dir);
	        }
	
	        this.origin = (0, _Vector2.default)(x, y);
	        this.direction = (0, _Vector2.default)(Math.cos(dir), Math.sin(dir));
	        this.invDirection = (0, _Vector2.default)(1 / this.direction.x, 1 / this.direction.y);
	        this.outerBodies = [];
	        this.t = window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight;
	        var x0 = this.origin.x,
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
	
	    trace: function trace(system) {
	        // Always use radians, regardless of mode
	        // Also angle should be in range 0 <= angle <= 2PI
	        //let angle = this.direction.getAngle();
	        this.intersectionPoint = null;
	        this.intersectingBody = null;
	        this.intersectingSegment = null;
	
	        // Iterate the rayID to ensure no duplicates
	        this.rayID = system.currentRayId++;
	        this.numTests = 0; // debugging param - how many tests are run
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
	    intersectCircle: function intersectCircle(circle) {
	        this.numTests += 1;
	        var radius = circle.radius;
	
	        var d = (0, _Vector2.default)(this.direction.x * this.t, this.direction.y * this.t);
	        var f = _Vector.Vector.subtract(this.origin, circle.position); //this.origin.clone();
	
	        // Solve the quadratic equation
	        var a = d.dot(d);
	        var b = 2 * f.dot(d);
	        var c = f.dot(f) - radius * radius;
	
	        // Descriminant b^2 - 4ac
	        var desc = b * b - 4 * a * c;
	
	        if (desc < 0) {
	            // No intersection
	        } else {
	            // Ray hit circle
	            // Two possible solutions
	            desc = Math.sqrt(desc);
	            var t1 = (-b - desc) / (2 * a);
	            var t2 = (-b + desc) / (2 * a);
	            var ix = void 0,
	                iy = void 0;
	
	            // If t1 intersected the circle...
	            // Note: t1 is always closer than t2
	            if (t1 >= 0 && t1 <= 1) {
	                ix = this.origin.x + d.x * t1;
	                iy = this.origin.y + d.y * t1;
	                this.updateIntersectionPoint({ x: ix, y: iy }, null, circle);
	                return true;
	            }
	
	            // If t1 doesn't intersect, check t2
	            if (t2 >= 0 && t2 <= 1) {
	                ix = this.origin.x + d.x * t2;
	                iy = this.origin.y + d.y * t2;
	                this.updateIntersectionPoint({ x: ix, y: iy }, null, circle);
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
	    intersectPolygon: function intersectPolygon(poly) {
	        var _this = this;
	
	        this.numTests += 1;
	        if (poly.isPointInterior(this.origin)) {
	            this.outerBodies.push(poly);
	        }
	        var vertices = poly.vertices;
	        var vertLength = vertices.length;
	        var intersection = void 0;
	        vertices.forEach(function (vert, index, verts) {
	            var seg2 = void 0;
	            if (index === vertLength - 1) {
	                seg2 = verts[0];
	            } else {
	                seg2 = verts[index + 1];
	            }
	
	            intersection = _this.intersectSegment([vert, seg2]);
	            if (intersection) {
	                _this.updateIntersectionPoint(intersection.intPoint, intersection.segVec, poly);
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
	    intersectSegment: function intersectSegment(seg, dir) {
	        var r = dir ? (0, _Vector2.default)(dir.x * this.t, dir.y * this.t) : // Dir passed to fn
	        (0, _Vector2.default)(this.t * this.direction.x, this.t * this.direction.y); // Use ray dir
	        var p = (0, _Vector2.default)(this.origin.x, this.origin.y); // Ray origin
	        var q = (0, _Vector2.default)(seg[0].x, seg[0].y); // Segment start point
	        var s = (0, _Vector2.default)(seg[1].x - seg[0].x, seg[1].y - seg[0].y); // Segment vector
	
	        // check for intersection
	        // t = (q − p) x s / (r x s)
	        // u = (q − p) x r / (r x s)
	        var rxs = r.cross(s);
	        var tmp = _Vector.Vector.subtract(q, p);
	        var tNum = tmp.cross(s),
	            uNum = tmp.cross(r);
	
	        // t, u are distances traveled along vector
	        var t = void 0,
	            u = void 0;
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
	            var px = p.x,
	                py = p.y,
	                rx = r.x,
	                ry = r.y,
	                ix = px + t * rx,
	                iy = py + t * ry;
	
	            return {
	                intPoint: (0, _Vector2.default)(ix, iy),
	                segVec: s,
	                t: t
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
	    intersectHash: function intersectHash(hash) {
	        var _this2 = this;
	
	        // TODO: Handle case where ray starts outside bounds
	
	        // Initialize variables
	        // Step 1. Initialization - determine starting voxel
	        var bucket = hash.hash(this.origin);
	        var row = bucket.row,
	            col = bucket.col;
	
	        var X = col,
	            Y = row;
	        var tMaxX = void 0,
	            tMaxY = void 0,
	            tDeltaX = void 0,
	            tDeltaY = void 0;
	        var stepX = this.direction.x < 0 ? -1 : 1,
	            stepY = this.direction.y < 0 ? -1 : 1;
	        var cellSize = hash.cellSize;
	
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
	
	        while (Y < hash.numRows && Y > -1 && X < hash.numCols && X > -1) {
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
	                var contents = hash.contents[Y][X];
	                contents.forEach(function (body) {
	                    if (body.intersectionPoints[_this2.rayID]) {
	                        // Already tested this body
	                        // It either hit or missed, if it hit, grab the point
	                        if (body.intersectionPoints[_this2.rayID].status === 'hit') {
	                            _this2.updateIntersectionPoint(body.intersectionPoints[_this2.rayID].intPoint, body.intersectionPoints[_this2.rayID].segVec, body);
	                            return;
	                        }
	
	                        // It missed, so do nothing;
	                        return;
	                    }
	
	                    // If ray and body haven't been tested, then test
	                    // If it hits the AABB, then perform
	                    // actual intersection tests
	                    var hitsAABB = _this2.intersectAABB(body.aabb);
	                    if (hitsAABB) {
	                        switch (body.type) {
	                            case 'polygon':
	                            case 'rectangle':
	                                _this2.intersectPolygon(body);
	                                break;
	                            case 'circle':
	                                _this2.intersectCircle(body);
	                                break;
	                            default:
	                                break;
	                        }
	                    }
	
	                    // Flag body to know we've already tested this ray-body
	                    // combo
	                    if (_this2.intersectionPoint) {
	                        body.intersectionPoints[_this2.rayID] = {
	                            status: 'hit',
	                            intPoint: _this2.intersectionPoint,
	                            segVeg: _this2.intersectingSegment
	                        };
	                    } else {
	                        // If we missed, flag the body without
	                        // intersectionPoint
	                        body.intersectionPoints[_this2.rayID] = { status: 'miss' };
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
	    intersectAABB: function intersectAABB(aabb) {
	        var tx1 = (aabb.min.x - this.origin.x) * this.invDirection.x;
	        var tx2 = (aabb.max.x - this.origin.x) * this.invDirection.x;
	
	        var tmin = Math.min(tx1, tx2);
	        var tmax = Math.max(tx1, tx2);
	
	        var ty1 = (aabb.min.y - this.origin.y) * this.invDirection.y;
	        var ty2 = (aabb.max.y - this.origin.y) * this.invDirection.y;
	
	        tmin = Math.max(tmin, Math.min(ty1, ty2));
	        tmax = Math.min(tmax, Math.max(ty1, ty2));
	        var didHit = tmax >= tmin && tmax >= 0;
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
	    updateIntersectionPoint: function updateIntersectionPoint(intPoint, segVec, body) {
	        var px = this.origin.x;
	        var py = this.origin.y;
	        var ix = intPoint.x;
	        var iy = intPoint.y;
	
	        // If there was a previously stored intersection point,
	        // check if this one is closer,
	        // and if so update it's values
	        if (this.intersectionPoint) {
	            if ((0, _math.distance)(px, py, ix, iy) < (0, _math.distance)(px, py, this.intersectionPoint.x, this.intersectionPoint.y)) {
	                this.intersectionPoint = { x: ix, y: iy };
	                this.intersectingBody = body;
	                this.intersectingSegment = segVec;
	            }
	        } else {
	            // We don't yet have an intersection point, so make a new
	            // one
	            this.intersectionPoint = { x: ix, y: iy };
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
	var ray = function ray(x, y, dir, degrees) {
	    var R = Object.create(Ray);
	    R.init(x, y, dir, degrees);
	    return R;
	};
	
	exports.default = ray;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _SpatialHash = __webpack_require__(8);
	
	var _SpatialHash2 = _interopRequireDefault(_SpatialHash);
	
	var _Broadphase = __webpack_require__(9);
	
	var _Broadphase2 = _interopRequireDefault(_Broadphase);
	
	var _Narrowphase = __webpack_require__(11);
	
	var _Narrowphase2 = _interopRequireDefault(_Narrowphase);
	
	var _Solver = __webpack_require__(14);
	
	var _Solver2 = _interopRequireDefault(_Solver);
	
	var _BoundaryConstraint = __webpack_require__(15);
	
	var _BoundaryConstraint2 = _interopRequireDefault(_BoundaryConstraint);
	
	var _LinkConstraint = __webpack_require__(17);
	
	var _LinkConstraint2 = _interopRequireDefault(_LinkConstraint);
	
	var _CONSTANTS = __webpack_require__(18);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// const System = {};
	// TODO: rename params to options to be consistent with other objects
	var System = {
	    init: function init(loop, params) {
	        // Allow for no loop to be passed
	        if (typeof loop === 'function') {
	            this.loop = loop;
	        } else {
	            params = loop;
	        }
	
	        this.frames = [];
	        this.waves = [];
	        this.childWaves = [];
	        this.bodies = [];
	        this.points = [];
	        this.width = params.width || 600;
	        this.height = params.height || 300;
	        this.collisionPairs = {};
	        this.nextBodyId = 0;
	
	        this.collideBoundary = params.collideBoundary === undefined ? true : params.collideBoundary;
	        console.log('can collide with boundary', this.collideBoundary);
	
	        // Cell size will adjust to fit world precisely
	        // May not be exaclty what user initialized
	        // let divisor = params.cellSize ? params.cellSize : 100;
	        this.cellSize = this.calculateCellSize(params.cellSize || 100);
	        // Initialize spatial hash
	        this.hash = this.initializeHash(this.cellSize, this.width, this.height);
	
	        //
	        this._gravity = params.gravity === undefined ? _CONSTANTS.GRAVITY.LIGHT : params.gravity;
	        // Initialize Collision objects
	        this.broadphase = (0, _Broadphase2.default)();
	        this.narrowphase = (0, _Narrowphase2.default)();
	        this.solver = (0, _Solver2.default)();
	        this.worldForce = {
	            x: 0,
	            y: 0
	        };
	
	        // Ray ID Counter
	        this.currentRayId = 0;
	    },
	
	    calculateCellSize: function calculateCellSize(cellSize) {
	        var divisor = cellSize ? cellSize : 100;
	        return this.width / Math.floor(this.width / divisor);
	    },
	
	    initializeHash: function initializeHash(cellSize, width, height) {
	        return (0, _SpatialHash2.default)(cellSize, width, height);
	    },
	
	    addChildWave: function addChildWave(wave) {
	        this.childWaves.push(wave);
	    },
	
	    addObject: function addObject(obj) {
	        switch (obj.type) {
	            case 'rectangle':
	            case 'circle':
	            case 'polygon':
	                // Initialize new bodies with an ID use for ray intersection
	                // tests
	                obj.id = this.nextBodyId++;
	
	                // Initialize new bodies with world force
	                obj.addForce(this.worldForce.x, this.worldForce.y);
	                this.bodies.push(obj);
	                break;
	            case 'point':
	                this.points.push(obj);
	                break;
	            case 'incident':
	            case 'wave':
	                this.waves.push(obj);
	                break;
	            default:
	                throw new Error('tried to add something that\'s not a body or a wave');
	        }
	    },
	
	    /**
	     * Add objects to the system
	     * Objects not added will not be rendered
	     * or updated
	     *
	     * @param {Sci.Object|Sci.Object[]} b - a body or wave object, or array of body objects
	     */
	    add: function add(b) {
	        var _this = this;
	
	        if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) === 'object' && b.length !== undefined) {
	            b.forEach(function (body) {
	                _this.addObject(body);
	            });
	        } else {
	            this.addObject(b);
	        }
	    },
	
	    /**
	     * Remove an object from the system
	     * @param {Body} b - the body object to remove
	     * @return {This} for chaining
	     */
	    remove: function remove(b) {
	        var _this2 = this;
	
	        if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) === 'object' && b.length !== undefined) {
	            // We have an array of things to remove
	            b.forEach(function (body) {
	                var idx = _this2.bodies.indexOf(body);
	                if (idx !== -1) {
	                    _this2.bodies.splice(idx, 1);
	                }
	            });
	        } else {
	            var idx = this.bodies.indexOf(b);
	            if (idx !== -1) {
	                this.bodies.splice(idx, 1);
	            }
	        }
	
	        return this;
	    },
	
	    /**
	     * Update loop
	     *  For order of operations - see this deck: http://box2d.org/files/GDC2014/ErwinCoumans_ExploringMLCPSolversAndFeatherstone.pdf
	     *  1. Compute collision contacts
	     *  2. Inertia Update
	     *  3. Contact Constraints
	     *  4. Friction Constraints
	     *  5. Constraint Solver
	     *  6. Integrate position and velocity
	     *  7. Perform ray intersection tests
	     *  8. Restart
	     * Update all bodies, waves, run collision tests if necessary, and keep
	     * track of rayID's on potentially colliding bodies
	     * @param {number} dt - time step for system update (defaults to 16.666 ms)
	     * @return {This} for chaining, or getting checking last state of system
	     */
	    update: function update(dt) {
	        var _this3 = this;
	
	        // 1. Reset State for next loop
	        this.hash.clear();
	        this.bodies.forEach(function (body) {
	            // Clear out constraints
	            body.constraints = [];
	
	            // Add each body to the hash
	            _this3.hash.insertBody(body);
	        });
	
	        // Reset point constraints
	        // Reset constriants
	        this.points.forEach(function (point) {
	            point.constraints = [];
	        });
	
	        // Run User Loop
	        if (this.loop) {
	            this.loop();
	        }
	
	        // 1. Compute contacts
	        // Update forces if need be
	        if (this.worldForceNeedsSet) {
	            this.bodies.forEach(function (body) {
	                body.setForce(_this3.worldForce.x, _this3.worldForce.y);
	            });
	            this.worldForceNeedsSet = false;
	        }
	        if (this.worldForceNeedsUpdate) {
	            this.bodies.forEach(function (body) {
	                body.addForce(_this3.worldForce.x, _this3.worldForce.y);
	            });
	            this.worldForceNeedsUpdate = false;
	        }
	
	        // Update each body with Verlet Integration
	        // Put bodies into hash, check for boundary constraint if
	        // necessary
	        this.bodies.forEach(function (body) {
	            // And boundary collision constraint if needed
	            if (_this3.collideBoundary) {
	                var c = (0, _BoundaryConstraint2.default)(body, _this3);
	                body.constraints.push(c);
	            }
	
	            // Update physics for each body
	            body.update(dt);
	        });
	
	        // Get broad collision pairs
	        var pairs = this.broadphase.getCollisionPairs(this.bodies, this.hash);
	        var collisions = void 0;
	
	        // Perform narrowphase detection on potential pairs
	        if (pairs && Object.keys(pairs).length > 0) {
	            collisions = this.narrowphase.checkForCollisions(pairs);
	        }
	
	        // If we found actual collisions
	        if (collisions && collisions.length > 0) {
	            // Solve for collisions!
	            collisions.forEach(function (coll) {
	                _this3.solver.solveCollision(coll);
	                // let {MTVAxis, overlap, body2} = coll;
	                // body2.position.add(MTVAxis.multiply(overlap));
	            });
	        }
	
	        // Solve constraints
	        this.bodies.forEach(function (body) {
	            body.constraints.forEach(function (c) {
	                _this3.solver.solveConstraint(c);
	                // body.velocity.add(v.multiply(dt));
	                // c.solve();
	            });
	        });
	
	        // After all velocities are resolved:
	        this.bodies.forEach(function (body) {
	            body.position.add(body.velocity);
	        });
	
	        // Each ray needs a unique ID for collision checking
	        // Reset currentRayID during each update loop so we can reuse these
	        // ID's
	        this.currentRayId = 0;
	
	        // Remove all child waves
	        this.childWaves = [];
	
	        // Update each wave and loop through it's chilren
	        this.waves.forEach(function (wave) {
	            wave.update(_this3);
	            _this3.traverseWaves(wave);
	        });
	
	        return this;
	    },
	
	    /**
	     * Recursively loop through child waves
	     * and add them to the system
	     * @private
	     * @param {Wave} wave - wave object to traverse
	     */
	    traverseWaves: function traverseWaves(wave) {
	        var _this4 = this;
	
	        // If the wave has children
	        // Add each child to the system,
	        // then repeat for each child
	        // Exit condition -> When children have no children
	        if (wave.children.length !== 0) {
	            wave.children.forEach(function (child) {
	                _this4.addChildWave(child);
	                _this4.traverseWaves(child);
	            });
	        }
	    },
	
	    addWorldForce: function addWorldForce(x, y) {
	        this.worldForce.x += x;
	        this.worldForce.y += y;
	        this.worldForceNeedsUpdate = true;
	    },
	
	    setWorldForce: function setWorldForce(x, y) {
	        this.worldForce.x = x;
	        this.worldForce.y = y;
	        this.worldForceNeedsSet = true;
	    }
	};
	
	Object.defineProperty(System, 'gravityOn', {
	    get: function get() {
	        return this._gravityOn;
	    },
	    set: function set(isOn) {
	        var _this5 = this;
	
	        if (this._gravityOn && !isOn) {
	            // turn gravity off
	            this._gravityOn = false;
	            this.worldForce.y -= this.gravity;
	            this.bodies.forEach(function (body) {
	                body.addForce(0, -_this5.gravity);
	            });
	        } else if (!this._gravityOn && isOn) {
	            // turn gravity on
	            this._gravityOn = true;
	            this.worldForce.y += this.gravity;
	            this.bodies.forEach(function (body) {
	                body.addForce(0, _this5.gravity);
	            });
	        }
	    }
	});
	
	Object.defineProperty(System, 'gravity', {
	    get: function get() {
	        return this._gravity;
	    },
	    set: function set(value) {
	        // Capture current gravity
	        var gravDiff = value - this._gravity;
	        this.worldForce.y += gravDiff;
	        this._gravity += gravDiff;
	        this.bodies.forEach(function (body) {
	            body.addForce(0, gravDiff);
	        });
	    }
	});
	
	// const CONSTANTS = {
	//     GRAVITY: 0.00004
	// };
	
	/**
	 * @public
	 * @param {function} loop - your update loop - used to update body states
	 * @param {object} params - initialization parameters
	 * @return {System}
	 *
	 * params
	 *  - width: int - width of entire system (usually canvas width)
	 *  - height: number - height of entire system
	 *  - cellSize: number - requested cellSize, (system will choose closest value
	 *          that precisely fits into the system width)
	 */
	var system = function system(loop, params) {
	    var s = Object.create(System);
	    s.init(loop, params);
	    return s;
	};
	
	exports.default = system;
	module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var SpatialHash = {
	    init: function init(cellSize, width, height) {
	        this.cellSize = cellSize;
	        this.width = width;
	        this.height = height;
	        this.numRows = Math.ceil(height / cellSize);
	        this.numCols = width / cellSize;
	        this.contents = {};
	    },
	
	    /**
	     * Return location that should store this point
	     * @param {object} point - object with x and y properties
	     * @return {object} - bucket which th epoint falls into
	     */
	    hash: function hash(point) {
	        return { col: Math.floor(point.x / this.cellSize), row: Math.floor(point.y / this.cellSize) };
	    },
	    insertBody: function insertBody(body) {
	        // Hash the vertices of the AABB
	        var min = this.hash(body.aabb.min);
	        var max = this.hash(body.aabb.max);
	
	        // Iterate over rectangular region
	        // And put the object in all buckets that
	        // it hits
	        for (var r = min.row; r < max.row + 1; r++) {
	            for (var c = min.col; c < max.col + 1; c++) {
	                if (this.contents[r]) {
	                    if (this.contents[r][c]) {
	                        this.contents[r][c].push(body);
	                    } else {
	                        this.contents[r][c] = [body];
	                    }
	                } else {
	                    this.contents[r] = {};
	                    this.contents[r][c] = [body];
	                }
	            }
	        }
	    },
	    updateBody: function updateBody(body) {
	        this.removeBody(body);
	        this.insertBody(body);
	    },
	    removeBody: function removeBody(body) {
	        var min = this.hash(body.aabb.min);
	        var max = this.hash(body.aabb.max);
	
	        // Iterate over rectangular region
	        // And remove the object from all found buckets
	        for (var r = min.row; r < max.row + 1; r++) {
	            for (var c = min.col; c < max.col + 1; c++) {
	                var idx = this.contents[r][c].indexOf(body);
	                if (idx !== -1) {
	                    this.contents[r][c].splice(idx, 1);
	                }
	            }
	        }
	    },
	    queryBody: function queryBody(body) {
	        var min = this.hash(body.aabb.min);
	        var max = this.hash(body.aabb.max);
	        var nearby = [];
	
	        // Iterate over rectangular region
	        // And put the object in all buckets that
	        // it hits
	        for (var r = min.row; r < max.row + 1; r++) {
	            for (var c = min.col; c < max.col + 1; c++) {
	                this.contents[r][c].forEach(function (b) {
	                    if (nearby.indexOf(b) === -1 && b !== body) {
	                        nearby.push(b);
	                    }
	                });
	            }
	        }
	        return nearby;
	    },
	    queryPoint: function queryPoint(point) {
	        var hash = this.hash(point);
	        return hash;
	    },
	    clear: function clear() {
	        this.contents = {};
	    }
	};
	
	var hash = function hash(cellSize, width, height) {
	    var h = Object.create(SpatialHash);
	    h.init(cellSize, width, height);
	    return h;
	};
	
	exports.default = hash;
	module.exports = exports["default"];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Pair = __webpack_require__(10);
	
	var _Pair2 = _interopRequireDefault(_Pair);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Broadphase = {
	    // init: function(system) {
	    //     this.system = system;
	    //     this.pairs = [];
	    //     this.collisionCounter = 0;
	    // },
	    aabbOverlap: function aabbOverlap(body1, body2) {
	        return body1.aabb.overlap(body2.aabb);
	    },
	    canCollide: function canCollide(body1, body2) {
	        if (body1.canCollide && body2.canCollide) {
	            return true;
	        }
	        return false;
	    },
	
	    /**
	     * Get all potential collision pairs -
	     *  1. They are within the same spatial bucket
	     *  2. They're AABB's overlap
	     *  @param {Body[]} bodies - all bodies from system
	     *  @param {SpatialHash} hash - from system
	     *  @return {Object} collision pairs - broadphase
	     */
	    getCollisionPairs: function getCollisionPairs(bodies, hash) {
	        this.collisionCounter = 0;
	        var collisionPairs = {};
	        // let collisionPairs = [];
	        for (var i = 0; i < bodies.length; i++) {
	            var body = bodies[i];
	            var nearby = hash.queryBody(body);
	
	            for (var j = 0; j < nearby.length; j++) {
	                var otherBody = nearby[j];
	                if (this.canCollide(body, otherBody)) {
	                    if (this.aabbOverlap(body, otherBody)) {
	                        var id = void 0;
	                        if (body.id < otherBody.id) {
	                            id = body.id + '-' + otherBody.id;
	                        } else {
	                            id = otherBody.id + '-' + body.id;
	                        }
	
	                        var p = (0, _Pair2.default)(body, otherBody, id);
	                        // collisionPairs.push(p);
	                        if (!collisionPairs[id]) {
	                            collisionPairs[id] = p;
	                        }
	                    }
	                }
	            }
	        }
	        return collisionPairs;
	    }
	};
	
	var broadphase = function broadphase(system) {
	    var b = Object.create(Broadphase);
	    // b.init(system);
	    return b;
	};
	
	exports.default = broadphase;
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Pair = {
	    init: function init(b1, b2, index) {
	        this.bodies = [b1, b2];
	        this.index = index;
	    }
	};
	
	var pair = function pair(b1, b2, index) {
	    var p = Object.create(Pair);
	    p.init(b1, b2, index);
	    return p;
	};
	
	exports.default = pair;
	module.exports = exports["default"];

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _SAT = __webpack_require__(12);
	
	var _SAT2 = _interopRequireDefault(_SAT);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Narrowphase = {
	    // init: function(hash) {
	    //     this.hash = hash;
	    // },
	    checkForCollisions: function checkForCollisions(pairs) {
	        // Object
	        var collisions = [];
	        if ((typeof pairs === 'undefined' ? 'undefined' : _typeof(pairs)) === 'object' && pairs.length === undefined) {
	            var keys = Object.keys(pairs);
	            for (var i = 0; i < keys.length; i++) {
	                var pair = pairs[keys[i]];
	                var b1 = pair.bodies[0];
	                var b2 = pair.bodies[1];
	                var collision = _SAT2.default.intersect(b1, b2);
	
	                if (collision) {
	                    b1.colliderList.push(collision);
	                    b2.colliderList.push(collision);
	                    collisions.push(collision);
	                }
	            }
	        } else if ((typeof pairs === 'undefined' ? 'undefined' : _typeof(pairs)) === 'object' && pairs.length > 0) {
	            // Array
	            for (var _i = 0; _i < pairs.length; _i++) {
	                var _pair = pairs[_i];
	                var _b = _pair.bodies[0];
	                var _b2 = _pair.bodies[1];
	                var _collision = _SAT2.default.intersect(_b, _b2);
	
	                if (_collision) {
	                    _b.colliderList.push(_collision);
	                    collisions.push(_collision);
	                }
	            }
	        }
	        return collisions;
	    }
	};
	
	var narrowphase = function narrowphase() {
	    var n = Object.create(Narrowphase);
	    // n.init(hash);
	    return n;
	};
	
	exports.default = narrowphase;
	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Vector = __webpack_require__(4);
	
	var _Collision = __webpack_require__(13);
	
	var _Collision2 = _interopRequireDefault(_Collision);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var SAT = {};
	
	/**
	 * Determine min and max projection components along a
	 * given axis
	 *
	 * @param {Body} b - the body whos vertices to project
	 * @param {Vector} axis - the axis to project onto. Should be a unit vector
	 *
	 * @return {Object} min and max values of projected vertices
	 */
	SAT.projectBody = function (b, axis) {
	    if (b.type === 'rectangle' || b.type === 'polygon') {
	        var min = b.vertices[0].scalarProjectUnit(axis);
	        var max = min;
	
	        for (var i = 0; i < b.vertices.length; i++) {
	            var v = b.vertices[i];
	            var p = v.scalarProjectUnit(axis);
	            if (p < min) {
	                min = p;
	            } else if (p > max) {
	                max = p;
	            }
	        }
	        return { min: min, max: max };
	    } else if (b.type === 'circle') {
	        var _p = b.interpolatedPosition.scalarProjectUnit(axis);
	        return { min: _p - b.scaledRadius, max: _p + b.scaledRadius };
	    }
	};
	
	/**
	 * @param {number} p1min - min point of 1st line
	 * @param {number} p1max - max point of 1st line
	 * @param {number} p2min - min point of 2nd line
	 * @param {number} p2max - max point of 2nd line
	 * @return {number} amount of overlap of these two lines
	 *
	 */
	SAT.lineOverlap = function (p1min, p1max, p2min, p2max) {
	    return Math.max(0, Math.min(p1max, p2max) - Math.max(p1min, p2min));
	};
	
	/**
	 * Rect-Rect intersection test
	 * @param {Sci.Rect} b1 - first body
	 * @param {Sci.Rect} b2 - second body
	 * @return {bool} true or false, if intersection occurred
	 * @todo optimize like crazy, we only need to do four axes, not eight
	 * see here: https://gamedevelopment.tutsplus.com/tutorials/collision-detection-using-the-separating-axis-theorem--gamedev-169
	 *
	 * @todo should return collision data, not just true or false
	 * see here: http://www.dyn4j.org/2010/01/sat/
	 */
	
	SAT.intersect = function (b1, b2) {
	    if (b1.type === 'rectangle' || b1.type === 'polygon') {
	        if (b2.type === 'circle') {
	            return SAT.polycircle(b1, b2);
	        }
	
	        // b2 must then be a Polygon (or a rectangle)
	        return SAT.polypoly(b1, b2);
	    }
	
	    if (b1.type === 'circle') {
	        if (b2.type === 'circle') {
	            return SAT.circlecircle(b1, b2);
	        }
	
	        // b2 Must be a polygon or a rectangle
	        return SAT.polycircle(b1, b2);
	    }
	};
	SAT.circlecircle = function (c1, c2) {
	    var v1 = _Vector.Vector.subtract(c2.interpolatedPosition, c1.interpolatedPosition);
	    var d = v1.magnitude();
	    var rplusr = c1.scaledRadius + c2.scaledRadius;
	
	    if (d < rplusr) {
	        // return {MTVAxis: v1.normalize(), overlap: rplusr - d};
	        return (0, _Collision2.default)(c1, c2, v1.normalize(), rplusr - d);
	    }
	    return;
	};
	
	/**
	 * @param {Polygon} p1 - first poly
	 * @param {Polygon} p2 - second poly
	 * @return {Object} Collision results, or undefined if no collision
	 *
	 * @todo Containment - doesn't appropriately handle containment
	 */
	SAT.polypoly = function (p1, p2) {
	    // Gather all axes to test
	    var axes = [],
	        smallestOverlap = void 0,
	        MTVAxis = void 0,
	        numVerts1 = p1.vertices.length,
	        numVerts2 = p2.vertices.length;
	
	    // Get axes for rect
	    // Only need two sides for testing
	    if (p1.type === 'rectangle') {
	        numVerts1 = 2;
	    }
	    for (var i = 0; i < numVerts1; i++) {
	        var v1 = p1.vertices[i];
	        var v2 = p1.vertices[i + 1 === p1.vertices.length ? 0 : i + 1];
	        var axis = _Vector.Vector.subtract(v2, v1);
	        axis.normalize().perp();
	        axes.push(axis);
	    }
	
	    if (p2.type === 'rectangle') {
	        numVerts2 = 2;
	    }
	    // Get axes for polygon
	    // Need all sides
	    for (var _i = 0; _i < numVerts2; _i++) {
	        var _v = p2.vertices[_i];
	        var _v2 = p2.vertices[_i + 1 === p2.vertices.length ? 0 : _i + 1];
	        var _axis = _Vector.Vector.subtract(_v2, _v);
	        _axis.normalize().perp();
	        axes.push(_axis);
	    }
	
	    // Perform intersection test along all axes
	    for (var _i2 = 0; _i2 < axes.length; _i2++) {
	        var _axis2 = axes[_i2];
	
	        // Get min and max projectsion
	        var p1Projection = this.projectBody(p1, _axis2);
	        var p2Projection = this.projectBody(p2, _axis2);
	
	        // Test for overlap of projections
	        var overlap = this.lineOverlap(p1Projection.min, p1Projection.max, p2Projection.min, p2Projection.max);
	
	        // If at any point the overlap is zero, then we're guarenteed
	        // to have no collision, so exit the test
	        if (overlap === 0) {
	            return;
	        }
	
	        if (smallestOverlap) {
	            if (overlap < smallestOverlap) {
	                smallestOverlap = overlap;
	                MTVAxis = _axis2;
	            }
	        } else {
	            smallestOverlap = overlap;
	            MTVAxis = _axis2;
	        }
	    }
	
	    // Will return true if overlap never equals 0, meaning all
	    // projections overlap to some degree, so a collision is happening
	    // return {MTV: {axis: MTVAxis, magnitude: smallestOverlap}};
	    return (0, _Collision2.default)(p1, p2, MTVAxis, smallestOverlap);
	};
	
	SAT.polycircle = function (b1, b2) {
	    var p = void 0,
	        c = void 0;
	    if (b1.type === 'circle') {
	        c = b1;
	        p = b2;
	    } else {
	        c = b2;
	        p = b1;
	    }
	
	    // Gather all axes to test
	    var axes = [],
	        smallestOverlap = void 0,
	        MTVAxis = void 0,
	        numVerts1 = p.vertices.length;
	
	    // smallest distance vector from polygon vertex to circle center
	    var d = void 0;
	
	    for (var i = 0; i < numVerts1; i++) {
	        var v1 = p.vertices[i];
	        var v2 = p.vertices[i + 1 === p.vertices.length ? 0 : i + 1];
	        var axis = _Vector.Vector.subtract(v2, v1);
	        axis.normalize().perp();
	        axes.push(axis);
	
	        // Get distance of vertex to circle center
	        var vc = _Vector.Vector.subtract(c.interpolatedPosition, v1);
	        if (d) {
	            if (vc.magnitudeSq() < d.magnitudeSq()) {
	                d = vc;
	            }
	        } else {
	            d = vc;
	        }
	    }
	
	    axes.push(d.normalize());
	
	    // Perform intersection test along all axes
	    for (var _i3 = 0; _i3 < axes.length; _i3++) {
	        var _axis3 = axes[_i3];
	
	        // Get min and max projectsion
	        var pProjection = this.projectBody(p, _axis3);
	        var cProjection = this.projectBody(c, _axis3);
	
	        // Test for overlap of projections
	        var overlap = this.lineOverlap(pProjection.min, pProjection.max, cProjection.min, cProjection.max);
	
	        // If at any point the overlap is zero, then we're guarenteed
	        // to have no collision, so exit the test
	        if (overlap === 0) {
	            return;
	        }
	
	        if (smallestOverlap) {
	            if (overlap < smallestOverlap) {
	                smallestOverlap = overlap;
	                MTVAxis = _axis3;
	            }
	        } else {
	            smallestOverlap = overlap;
	            MTVAxis = _axis3;
	        }
	    }
	
	    // Will return true if overlap never equals 0, meaning all
	    // projections overlap to some degree, so a collision is happening
	    return (0, _Collision2.default)(b1, b2, MTVAxis, smallestOverlap);
	};
	
	exports.default = SAT;
	module.exports = exports['default'];

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Collision = {
	    init: function init(b1, b2, mtv, overlap) {
	        this.body1 = b1;
	        this.body2 = b2;
	        this.mtvaxis = mtv;
	        this.overlap = overlap;
	    }
	};
	
	var collision = function collision(b1, b2, mtv, overlap) {
	    var c = Object.create(Collision);
	    c.init(b1, b2, mtv, overlap);
	    return c;
	};
	
	exports.default = collision;
	module.exports = exports["default"];

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Vector = __webpack_require__(4);
	
	var _Vector2 = _interopRequireDefault(_Vector);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Solver = {
	    // Collision Types
	    INELASTIC: 'inelastic',
	    ELASTIC: 'elastic',
	
	    getCollisionType: function getCollisionType(b1, b2) {
	        if (b1.collisionType === 'inelastic' || b2.collisionType === 'inelastic') {
	            return this.INELASTIC;
	        }
	        return this.ELASTIC;
	    },
	
	    /**
	     * Resolve collision
	     * @param {Collision} collision - collision object to resolve
	     *
	     * @todo: right now just directly manipulates position - things are
	     * very jittery, but it works for now.
	     */
	    solveCollision: function solveCollision(collision) {
	        // Solve for body collision
	        var body1 = collision.body1,
	            body2 = collision.body2,
	            mtvaxis = collision.mtvaxis,
	            overlap = collision.overlap;
	
	        var xOverlap = Math.abs(mtvaxis.x * overlap);
	        var yOverlap = Math.abs(mtvaxis.y * overlap);
	        var resolutionVector = (0, _Vector2.default)(xOverlap, yOverlap);
	        var collisionType = this.getCollisionType(body1, body2);
	
	        // SEE HERE:
	        // https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-the-basics-and-impulse-resolution--gamedev-6331
	        // let b1Mass = body1.mass;
	        // let b1InvMass = body1.invMass;
	        // let b2Mass = body2.mass;
	        // let b2InvMass = body2.invMass;
	        // //
	        // // Vec2 rv = B.velocity - A.velocity
	        // let relVel = Vector.subtract(body2.velocity, body1.velocity);
	        //
	        // // Calculate relative velocity in terms of the normal direction
	        // // float velAlongNormal = DotProduct( rv, normal )
	        // let velAlongNormal = Vector.dot(relVel, mtvaxis);
	        //
	        // if (velAlongNormal > 0) {
	        //     return;
	        // }
	        //
	        // // Min restitution
	        // let e = Math.min(body1.restitution, body2.restitution);
	        //
	        // let j = -(1 + e) * velAlongNormal;
	        // j /= body1.invMass + body2.invMass;
	        //
	        // // impulse vector
	        // let impulse = Vector.multiply(mtvaxis, j);
	        //
	        // // Apply impulse
	        // body1.velocity.x -= impulse.x * body1.invMass;
	        // body1.velocity.y -= impulse.y * body1.invMass;
	        // body2.velocity.x += impulse.x * body2.invMass;
	        // body2.velocity.y += impulse.y * body2.invMass;
	
	        // body2.velocity.add()
	
	
	        // // Calculate impulse scalar
	        // float j = -(1 + e) * velAlongNormal
	        // j /= 1 / A.mass + 1 / B.mass
	        //
	        // // Apply impulse
	        // Vec2 impulse = j * normal
	        // A.velocity -= 1 / A.mass * impulse
	        // B.velocity += 1 / B.mass * impulse
	
	
	        // if there is an xOverlap
	        if (xOverlap !== 0) {
	            var xDir = 1;
	            if (body1.aabb.min.x < body2.aabb.min.x) {
	                // Move body1 to the left and body2 to the right
	                xDir = -1;
	            }
	
	            if (!body1.static) {
	                body1.interpolatedPosition.x += resolutionVector.x / 2 * xDir;
	            }
	            if (!body2.static) {
	                body2.interpolatedPosition.x -= resolutionVector.x / 2 * xDir;
	            }
	        }
	
	        // If there's a y overlap
	        if (yOverlap !== 0) {
	            var yDir = 1;
	            // And body1 is lower on screen than body 2
	            if (body1.aabb.min.y < body2.aabb.min.y) {
	                // Move body 1 up and body 2 down
	                yDir = -1;
	            }
	
	            if (!body1.static) {
	                body1.interpolatedPosition.y += resolutionVector.y / 2 * yDir;
	            }
	            if (!body2.static) {
	                body2.interpolatedPosition.y -= resolutionVector.y / 2 * yDir;
	            }
	        }
	
	        // body1.constraints.forEach(constraint => {
	        //     constraint.solve();
	        // });
	        // body2.constraints.forEach(constraint => {
	        //     constraint.solve();
	        // });
	    },
	    solveConstraint: function solveConstraint(constraint) {
	        constraint.solve();
	    }
	};
	
	var solver = function solver() {
	    var s = Object.create(Solver);
	    return s;
	};
	
	exports.default = solver;
	module.exports = exports['default'];

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Constraint = __webpack_require__(16);
	
	var _Constraint2 = _interopRequireDefault(_Constraint);
	
	var _Vector = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var boundaryConstraint = function boundaryConstraint(body, bounds, distance) {
	    var C = (0, _Constraint2.default)('boundary', body, null, bounds, distance);
	
	    C.solve = function () {
	        var minX = body.aabb.min.x;
	        var minY = body.aabb.min.y;
	        var maxX = body.aabb.max.x;
	        var maxY = body.aabb.max.y;
	        switch (body.type) {
	            case 'circle':
	                {
	                    var _minX = body.aabb.min.x;
	                    var _minY = body.aabb.min.y;
	                    var _maxX = body.aabb.max.x;
	                    var _maxY = body.aabb.max.y;
	                    var radius = body.radius;
	                    // Instead of setting position directly, can we apply a force?
	                    // get the normal direction of the velocity...
	                    // let normal = Vector.perp(body.velocity);
	                    // Satisfy condition where
	                    if (_minX < 0) {
	                        body.setX(radius);
	                    }
	                    if (_minY < 0) {
	                        body.setY(radius);
	                    }
	                    if (_maxX > bounds.width) {
	                        body.setX(bounds.width - radius);
	                    }
	                    if (_maxY > bounds.height) {
	                        body.setY(bounds.height - radius);
	                    }
	                    break;
	                }
	            case 'rectangle':
	                {
	                    var width = maxX - minX;
	                    var height = maxY - minY;
	                    if (minX < 0) {
	                        body.setX((width - body.width) / 2);
	                    }
	                    if (minY < 0) {
	                        body.setY(height - body.height) / 2;
	                    }
	                    if (maxX > bounds.width) {
	                        body.setX(bounds.width - body.width - (width - body.width) / 2);
	                    }
	                    if (maxY > bounds.height) {
	                        body.setY(bounds.height - body.height - (height - body.height) / 2);
	                    }
	                    break;
	                }
	            case 'polygon':
	                {
	                    var _width = maxX - minX;
	                    var _height = maxY - minY;
	                    if (minX < 0) {
	                        body.setX(0);
	                    }
	                    if (minY < 0) {
	                        body.setY(0);
	                    }
	                    if (maxX > bounds.width) {
	                        body.setX(bounds.width - body.width - (_width - body.width) / 2);
	                    }
	                    if (maxY > bounds.height) {
	                        body.setY(bounds.height - body.height - (_height - body.height) / 2);
	                    }
	                    break;
	                }
	            default:
	                break;
	        }
	    };
	    return C;
	};
	
	exports.default = boundaryConstraint;
	module.exports = exports['default'];

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	// import {Vector} from '../math/Vector';
	
	var Constraint = {
	    init: function init(body1, body2, bounds, distance, forces) {
	        this.body1 = body1;
	        this.body2 = body2;
	        this.bounds = bounds;
	        this.distance = distance;
	        this.forces = forces;
	    },
	    enable: function enable() {
	        if (this.body1) {
	            this.body1.constraints.push(this);
	        }
	        if (this.body2) {
	            this.body2.constraints.push(this);
	        }
	    }
	};
	
	var constraint = function constraint() {
	    var type = arguments.length <= 0 ? undefined : arguments[0];
	    var c = Object.create(Constraint);
	    c.type = arguments.length <= 0 ? undefined : arguments[0];
	
	    switch (type) {
	        case 'boundary':
	            c.init(arguments.length <= 1 ? undefined : arguments[1], null, arguments.length <= 3 ? undefined : arguments[3], null, null);
	            break;
	        case 'link':
	            c.init(arguments.length <= 1 ? undefined : arguments[1], arguments.length <= 2 ? undefined : arguments[2], null, arguments.length <= 3 ? undefined : arguments[3], null);
	            break;
	        default:
	            throw new Error('I don\'t know how to handle that kind of constraint!');
	    }
	
	    return c;
	};
	
	exports.default = constraint;
	module.exports = exports['default'];

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Constraint = __webpack_require__(16);
	
	var _Constraint2 = _interopRequireDefault(_Constraint);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var linkConstraint = function linkConstraint(body1, body2, dist) {
	    var C = (0, _Constraint2.default)('link', body1, body2, dist);
	    C.type = 'link';
	
	    C.solve = function () {
	        // Just try and solve this one constraint
	        if (body2.type === 'point') {
	            // let fc = {x: 0, y: 0};
	            var p = body2.position.clone();
	            p.subtract(body1.interpolatedPosition);
	            var v = body1.velocity;
	            var fext = body1.force;
	            var mass = body1.mass;
	
	            var lambda = (p.dot(fext) - v.dot(v) * mass) / p.dot(p);
	            // let lambda = -(p.x * v.x + p.y * v.y + 1)*mass / (2 * (p.x * p.x + p.y * p.y));
	
	            var pc = {
	                x: p.x * lambda,
	                y: p.y * lambda
	            };
	
	            // let la
	            body1.velocity.add(pc);
	            console.log(p.magnitude());
	        }
	    };
	
	    return C;
	};
	
	exports.default = linkConstraint;
	module.exports = exports['default'];

/***/ },
/* 18 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	// Physical Constants
	var GRAVITY = {
	    LIGHT: 0.00004,
	    MEDIUM: 0.0001,
	    HEAVY: 0.0004
	};
	var MATERIALS = {
	    Rock: { density: 0.6, restitution: 0.1 },
	    Wood: { density: 0.3, restitution: 0.2 },
	    Metal: { density: 1.2, restitution: 0.05 },
	    BouncyBall: { density: 0.3, restitution: 0.8 },
	    SuperBall: { density: 0.3, restitution: 0.95 },
	    Pillow: { density: 0.1, restitution: 0.2 },
	    Static: { density: 0.0, restitution: 0.4 }
	};
	
	exports.MATERIALS = MATERIALS;
	exports.GRAVITY = GRAVITY;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _math = __webpack_require__(5);
	
	var math = _interopRequireWildcard(_math);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	// TODO: rename params to options to be consistent with other objects
	var Renderer = {
	    init: function init(system, params) {
	        this.clearBackground = params.clearBackground === undefined ? true : params.clearBackground;
	        console.log(this.clearBackground);
	        this.background = params.background || 'black';
	        this.borderColor = params.borderColor;
	        this.system = system;
	        // this.loop = loop;
	
	        // Initialize Canvas element
	        // Pardon the ugly ternary...
	        this.canvas = typeof params.canvas === 'undefined' ? function () {
	            var c = document.createElement('canvas');
	            c.id = 'canvas';
	            // Set default size
	            document.body.appendChild(c);
	            return c;
	        }() : function () {
	            // Default values for canvas size
	            var c = document.getElementById(params.canvas);
	            return c;
	        }();
	
	        // Set canvas based on system size
	        this.canvas.width = this.system.width;
	        this.canvas.height = this.system.height;
	        this.ctx = this.canvas.getContext('2d');
	
	        // Draw background
	        this.ctx.beginPath();
	        this.ctx.globalAlpha = 1;
	        this.ctx.fillStyle = this.background;
	        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	        // Timing for render loop
	        this.frameTimestep = 0;
	        this.fps = 60;
	        this.dt = 1000 / this.fps;
	
	        // Debug Params
	        this.debug = params.debug === undefined ? false : params.debug;
	        if (this.debug) {
	            window.renderer = this;
	            window.ctx = this.canvas.getContext('2d');
	        }
	    },
	
	    /**
	     * Resize the canvas
	     * @param {number} width - new width of canvas
	     * @param {number} height - new height of canvas
	     * @param {number} [cellSize] - optional. set a new cell size for the
	     * spatial hash
	     */
	    resize: function resize(width, height, cellSize) {
	        this.canvas.width = width;
	        this.canvas.height = height;
	        this.system.width = width;
	        this.system.height = height;
	        this.system.cellSize = this.system.calculateCellSize(cellSize || this.system.cellSize);
	        this.system.hash = this.system.initializeHash(this.system.cellSize, width, height);
	    },
	
	    drawPoint: function drawPoint(point) {
	        this.ctx.beginPath();
	        this.ctx.ellipse(point.position.x, point.position.y, 3, 3, 0, 0, Math.PI * 2);
	        this.ctx.strokeStyle = 'red';
	        this.ctx.lineWidth = 1;
	        this.ctx.stroke();
	    },
	    /**
	     * Draw a body object
	     * @private
	     * @param {Body} body - phys.system object containing all objects
	     */
	    drawBody: function drawBody(body, pct) {
	        var _this = this;
	
	        if (body.debug) {
	            if (body.type === 'circle') {
	                this.ctx.beginPath();
	                var cx = body.position.x;
	                var cy = body.position.y;
	                var rx = Math.cos(body.rotation) * body.radius;
	                var ry = Math.sin(body.rotation) * body.radius;
	                this.ctx.moveTo(cx, cy);
	                this.ctx.lineTo(cx + rx, cy + ry);
	                this.ctx.strokeStyle = 'red';
	                this.ctx.stroke();
	            }
	            this.ctx.beginPath();
	            var aabb = body.aabb;
	            var x = aabb.min.x;
	            var y = aabb.min.y;
	            var w = aabb.max.x - x;
	            var h = aabb.max.y - y;
	            this.ctx.rect(x, y, w, h);
	            this.ctx.strokeStyle = 'red';
	            this.ctx.lineWidth = .5;
	            this.ctx.stroke();
	        }
	        if (this.debug) {
	            this.ctx.beginPath();
	            this.ctx.globalAlpha = 1;
	            this.ctx.strokeStyle = 'red';
	            this.ctx.lineWidth = 1;
	
	            var _aabb = body.aabb;
	            var _x = _aabb.min.x;
	            var _y = _aabb.min.y;
	            var _w = _aabb.max.x - _x;
	            var _h = _aabb.max.y - _y;
	            this.ctx.rect(_x, _y, _w, _h);
	            this.ctx.stroke();
	
	            if (body.vertices) {
	                body.vertices.forEach(function (vert) {
	                    _this.ctx.beginPath();
	                    _this.ctx.strokeStyle = 'magenta';
	                    _this.ctx.lineWidth = 2;
	                    _this.ctx.ellipse(vert.x, vert.y, 4, 4, 0, 0, Math.PI * 2);
	                    _this.ctx.stroke();
	                });
	            }
	            if (body.centroid) {
	                this.ctx.beginPath();
	                this.ctx.strokeStyle = 'red';
	                this.ctx.lineWidth = 3;
	                this.ctx.ellipse(body.centroid.x, body.centroid.y, 3, 3, 0, 0, Math.PI * 2);
	                this.ctx.stroke();
	            }
	        }
	
	        // Start a new path for each body
	        this.ctx.beginPath();
	        this.ctx.globalAlpha = 1;
	        switch (body.type) {
	            case 'rectangle':
	                {
	                    this.ctx.fillStyle = body.style.fillStyle;
	                    this.ctx.lineWidth = body.style.lineWidth;
	                    this.ctx.strokeStyle = body.style.strokeStyle;
	                    this.ctx.lineJoin = 'miter';
	                    if (body.debug) {
	                        if (body.colliderList.length > 0) {
	                            this.ctx.strokeStyle = 'green';
	                        } else {
	                            this.ctx.strokeStyle = 'white';
	                        }
	                    }
	                    this.ctx.moveTo(body.vertices[0].x, body.vertices[0].y);
	                    for (var i = 1; i < body.vertices.length; i++) {
	                        var v = body.vertices[i];
	                        this.ctx.lineTo(v.x, v.y);
	                    }
	                    this.ctx.closePath();
	                    this.ctx.fill();
	                    this.ctx.stroke();
	                    break;
	                }
	            case 'circle':
	                {
	                    this.ctx.fillStyle = body.style.fillStyle;
	                    this.ctx.lineWidth = body.style.lineWidth;
	                    this.ctx.strokeStyle = body.style.strokeStyle;
	
	                    if (body.debug) {
	                        if (body.colliderList.length > 0) {
	                            this.ctx.strokeStyle = 'green';
	                        } else {
	                            this.ctx.strokeStyle = 'white';
	                        }
	                    }
	
	                    this.ctx.ellipse(body.position.x, body.position.y, body.scaledRadius, body.scaledRadius, 0, 0, Math.PI * 2);
	                    // this.ctx.closePath();
	                    this.ctx.stroke();
	                    // this.ctx.fill();
	                    break;
	                }
	            case 'polygon':
	                {
	                    this.ctx.fillStyle = body.style.fillStyle;
	                    this.ctx.lineWidth = body.style.lineWidth;
	                    this.ctx.strokeStyle = body.style.strokeStyle;
	                    this.ctx.lineJoin = 'miter';
	                    this.ctx.moveTo(body.vertices[0].x, body.vertices[0].y);
	                    for (var _i = 1; _i < body.vertices.length; _i++) {
	                        var _v = body.vertices[_i];
	                        this.ctx.lineTo(_v.x, _v.y);
	                    }
	                    this.ctx.closePath();
	                    this.ctx.fill();
	                    this.ctx.stroke();
	                    break;
	                }
	            default:
	                break;
	        }
	    },
	    drawWave: function drawWave(wave) {
	        // No matter what the angle mode, always use radians
	        var angle = wave.mode === 'DEGREES' ? math.degToRad(wave.direction) : wave.direction;
	
	        // Set wave style properties
	        this.ctx.fillStyle = wave.style.fillStyle;
	        this.ctx.lineWidth = wave.style.lineWidth;
	        this.ctx.strokeStyle = wave.style.strokeStyle;
	        this.ctx.globalAlpha = math.map(wave.intensity, 0, 1, 0.1, 1);
	
	        // If debug == true, draw waves in certain colors
	        if (this.debug) {
	            if (wave.type === 'incident') {
	                // Draw starting circle
	                this.ctx.beginPath();
	                this.ctx.fillStyle = 'yellow';
	                this.ctx.ellipse(wave.position.x, wave.y, 3, 3, 0, 0, Math.PI * 2);
	                this.ctx.fill();
	                this.ctx.stroke();
	                this.ctx.strokeStyle = 'green';
	            } else if (wave.type === 'refracted') {
	                this.ctx.strokeStyle = 'blue';
	            } else if (wave.type === 'reflected') {
	                this.ctx.strokeStyle = 'orange';
	            }
	        }
	
	        this.ctx.beginPath();
	        this.ctx.moveTo(wave.position.x, wave.position.y);
	
	        // If the wave intersects an object ahead, then
	        // only draw to that object. Otherwise draw an arbitrary length
	        if (wave.ray.intersectionPoint) {
	            this.ctx.lineTo(wave.ray.intersectionPoint.x, wave.ray.intersectionPoint.y);
	            this.ctx.stroke();
	
	            // Draw intersection points as circles
	            // when in debug mode
	            if (this.debug) {
	                this.ctx.beginPath();
	                this.ctx.strokeStyle = 'red';
	                this.ctx.lineWidth = 0.5;
	                this.ctx.ellipse(wave.ray.intersectionPoint.x, wave.ray.intersectionPoint.y, 3, 3, 0, 0, Math.PI * 2);
	                this.ctx.stroke();
	            }
	        } else {
	            this.ctx.lineTo(2000 * Math.cos(angle) + wave.position.x, 2000 * Math.sin(angle) + wave.position.y);
	            this.ctx.stroke();
	        }
	    },
	
	    // Combined Patterns from Matter.js
	    // - https://github.com/liabru/matter-js/blob/master/src/core/Runner.js
	    // and this tutorial:
	    // https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-the-core-engine--gamedev-7493#timestepping
	    run: function run() {
	        var _this2 = this;
	
	        var self = this;
	        this.lastTick = 0;
	        var animate = function animate(time) {
	            _this2._requestID = window.requestAnimationFrame(animate);
	
	            if (time) {
	                _this2.tick(time);
	            }
	        };
	        animate();
	    },
	
	    // Clamping frameTimestep make a gigantic difference
	    tick: function tick(time) {
	        // Get time between this and the previous ticks
	        var elapsedTime = time - this.lastTick;
	
	        // Add the time to a counter
	        this.frameTimestep += elapsedTime;
	
	        // Update previous tick time
	        this.lastTick = time;
	
	        // Magic happens here
	        // if the elapsed time between this tick and the last tick is large
	        // (because the update or render code took a long time), then the
	        // engine would stall out.  Nothing would update while we're waiting
	        // for the long running code to finish.  So we clamp down the frame
	        // timestep to a small value.
	        if (this.frameTimestep > 50) {
	            this.frameTimestep = 50;
	        }
	
	        // If there's a large difference between the time of this frame and the
	        // previous frame, then this code will run a bunch of times,
	        // essentially stalling the renderer.  The engine can't render while
	        // the physics is updating, after all.  To combat this, we clamp down
	        // the frameTimestep above so that only a few updates run before
	        // everything renders.
	        while (this.frameTimestep > this.dt) {
	            this.system.update(this.dt);
	            this.frameTimestep -= this.dt;
	        }
	
	        // In the case where the frameTimestep is some in between value between
	        // 0 and dt, we can linearly interpolate rendered values of the bodies
	        // this won't actually effect the physics, but it'll make things look
	        // smoother
	        // pct is the fraction between 0 and dt, thus we should interpolate
	        // the position by that percentage
	        var pct = this.frameTimestep / this.dt;
	        // Render the system
	        this.render(pct);
	    },
	
	    render: function render(pct) {
	        var _this3 = this;
	
	        // Clear background
	        if (this.clearBackground) {
	            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
	            // Draw background
	            this.ctx.beginPath();
	            this.ctx.globalAlpha = 1;
	            this.ctx.lineWidth = 1;
	            this.ctx.fillStyle = this.background;
	            this.ctx.strokeStyle = this.borderColor;
	            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
	            this.ctx.fill();
	            this.ctx.stroke();
	        }
	
	        // Update the system
	        // FIXME: this.laststate isn't doing anything right now
	        // this.lastState = this.system.update(this.timing);
	
	        // Draw all objects + waves
	        this.system.bodies.forEach(function (body) {
	
	            _this3.drawBody(body, pct);
	        });
	
	        if (this.debug) {
	            this.system.points.forEach(function (point) {
	                _this3.drawPoint(point);
	            });
	        }
	
	        // Update all waves
	        this.system.waves.forEach(function (wave) {
	            _this3.drawWave(wave, pct);
	        });
	
	        // Update all child waves
	        this.system.childWaves.forEach(function (wave) {
	            _this3.drawWave(wave, pct);
	        });
	
	        // If in debug mode, draw spatial hash
	        // and highlight nodes that contain items in red
	        if (this.debug === true) {
	            (function () {
	                var cellSize = _this3.system.hash.cellSize;
	                _this3.ctx.globalAlpha = 1;
	                _this3.ctx.lineWidth = 1;
	                for (var i = 0; i < _this3.system.hash.width; i += cellSize) {
	                    for (var j = 0; j < _this3.system.hash.height; j += cellSize) {
	                        _this3.ctx.beginPath();
	                        _this3.ctx.strokeStyle = 'green';
	                        _this3.ctx.rect(i, j, cellSize, cellSize);
	                        _this3.ctx.stroke();
	                    }
	                }
	                Object.keys(_this3.system.hash.contents).forEach(function (row) {
	                    Object.keys(_this3.system.hash.contents[row]).forEach(function (col) {
	                        // Draw all squares
	                        // this.ctx.strokeStyle = 'green';
	                        if (_this3.system.hash.contents[row][col].length !== 0) {
	                            _this3.ctx.beginPath();
	                            _this3.ctx.strokeStyle = 'red';
	                            _this3.ctx.lineWidth = 1;
	                            _this3.ctx.rect(col * cellSize, row * cellSize, cellSize, cellSize);
	                            _this3.ctx.stroke();
	                        }
	                    });
	                });
	            })();
	        }
	    },
	
	    /**
	     * Set's size of renderers canvas
	     * @param {number} width - width of canvas
	     * @param {number} height - height of canvas
	     */
	    setSize: function setSize(width, height) {
	        this.canvas.width = width;
	        this.canvas.height = height;
	    },
	    /**
	     * Stop animation cycle
	     */
	    stop: function stop() {
	        cancelAnimationFrame(this._requestID);
	    },
	
	    /**
	     * Restart animation cycle
	     */
	    start: function start() {
	        this.render(this.system);
	    }
	};
	
	var renderer = function renderer(system, params) {
	    var R = Object.create(Renderer);
	    R.init(system, params);
	    return R;
	};
	
	exports.default = renderer;
	module.exports = exports['default'];

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Body = __webpack_require__(21);
	
	var _Body2 = _interopRequireDefault(_Body);
	
	var _AABB = __webpack_require__(23);
	
	var _AABB2 = _interopRequireDefault(_AABB);
	
	var _Vector = __webpack_require__(4);
	
	var _Vector2 = _interopRequireDefault(_Vector);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var rect = function rect(options) {
	    options = options || {};
	
	    var B = Object.create(_Body2.default);
	    B.init(options);
	    B.type = 'rectangle';
	    B._mode = options.mode || 'LEFT';
	
	    B.inertia = B.mass / 12 * (B.height * B.height + B.width * B.width);
	    B.invInertia = 1 / B.inertia;
	
	    // Define getters and setters for mode
	    Object.defineProperty(B, 'mode', {
	        get: function get() {
	            return this._mode;
	        },
	        set: function set(m) {
	            if (this._mode !== m && this.type === 'rectangle') {
	                switch (m) {
	                    case 'LEFT':
	                    case 'CENTER':
	                    case 'RIGHT':
	                        this._mode = m;
	                        this.updateVertices();
	                        break;
	                    default:
	                        console.warn('Cannot set mode to ' + m);
	                        break;
	                }
	            } else {
	                console.warn('\'mode\' is only available on rectangles');
	            }
	        }
	    });
	
	    /**
	     * Update location of vertices - used in update loop
	     * @todo Move this onto the Body
	     */
	    // B.updateVertices = function() {
	    //     let w = this.width,
	    //         h = this.height,
	    //         x = this.position.x,
	    //         y = this.position.y;
	    //     switch (this._mode) {
	    //         case 'CENTER':
	    //             x -= (w / 2);
	    //             y -= (h / 2);
	    //             break;
	    //         case 'RIGHT':
	    //             x -= w;
	    //             break;
	    //         default:
	    //             break;
	    //     }
	    //
	    //     //Get centroid
	    //     let centroid = vector(
	    //         (x + (x + w)) / 2,      // <-- x value
	    //         (y + (y + h)) / 2       // <-- y value
	    //     );
	    //     B.centroid = centroid;
	    //
	    //     B.vertices = [
	    //         vector(x, y),
	    //         vector(x + w, y),
	    //         vector(x + w, y + h),
	    //         vector(x, y + h)
	    //     ];
	    //
	    //     // To perform a rotation, we have to first translate to the origin,
	    //     // then rotate, then translate back to the centroid
	    //     if (B.angularVelocity !== 0 || B._rotation !== 0 || B._scale !== 0) {
	    //         B.vertices.forEach(vertex => {
	    //             vertex.translate(-centroid.x, -centroid.y)
	    //                 .rotate(this._rotation)
	    //                 .multiply(this._scale)
	    //                 .translate(centroid.x, centroid.y);
	    //         });
	    //     }
	    // };
	
	    B.isPointInterior = function (x, y) {
	        var bx = B.position.x,
	            by = B.position.y;
	
	        if (x >= bx && x <= bx + B.width && y >= by && y <= by + B.height) {
	            return true;
	        }
	        return false;
	    };
	
	    B.updateVertices();
	    B.aabb = (0, _AABB2.default)(B);
	    return B;
	}; /* eslint
	       "no-multi-spaces": "off"
	    */
	exports.default = rect;
	module.exports = exports['default'];

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /* eslint "no-unused-vars": "off" */
	// What should a body be able to do?
	// 1. Attach to other bodies or surfaces
	// 2. Respond to forces (spring, friction)
	// 3. Move according to velocity and acceleration
	
	var _materials = __webpack_require__(22);
	
	var _materials2 = _interopRequireDefault(_materials);
	
	var _Vector = __webpack_require__(4);
	
	var _Vector2 = _interopRequireDefault(_Vector);
	
	var _math = __webpack_require__(5);
	
	var math = _interopRequireWildcard(_math);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Convenience Function so user doesn't have use 'new' keyword
	 * @param {object} options - initialization options
	 * @return {Body} instance of Body
	 */
	
	var Body = {
	    init: function init(options) {
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
	        this.position = (0, _Vector2.default)(options.x || 0, options.y || 0);
	        this.positionPrev = this.position.clone();
	        this.interpolatedPosition = this.position.clone();
	        this.velocity = (0, _Vector2.default)(options.velocity && options.velocity.x || 0, options.velocity && options.velocity.y || 0);
	        // this.acceleration = vector(
	        //     (options.acceleration && options.acceleration.x) || 0,
	        //     (options.acceleration && options.acceleration.y) || 0,
	        // );
	        this.force = (0, _Vector2.default)(options.force && options.force.x || 0, options.force && options.force.y || 0);
	        this.torque = options.torque === undefined ? 0 : options.torque;
	        this._scale = 1;
	        this._rotation = options.rotation === undefined ? 0 : options.rotation; // <-- Private prop - DO NOT SET THIS DIRECTLY, use getter and setter for
	        this.rotationPrev = this._rotation;
	        this.angularVelocity = options.angularVelocity === undefined ? 0 : options.angularVelocity;
	
	        // COLLISION Properties //
	        this.static = options.static === true;
	        this.canCollide = options.canCollide !== false;
	        this.collisionType = options.collisionType || 'elastic';
	        this.colliderList = [];
	        this.restitution = 0.1;
	
	        // OPTICAL Properties //
	        this.refractiveIndex = options.refractiveIndex || 1;
	        this.material = options.material || 'GLASS';
	        this.materialColor = options.fillStyle || 'black';
	        this.mirror = options.mirror || false;
	        this.intersectionPoints = {};
	
	        // If debug = true, bounding box will be drawn
	        this.debug = options.debug === undefined ? false : options.debug;
	
	        // If the material is provided, set refractive index based on materials
	        // database
	        // TODO: Make setting either refractive index or material possible!!!
	        if (options.material && options.refractiveIndex) {
	            this.refractiveIndex = options.refractiveIndex;
	            this.material = options.material;
	            console.warn('Setting both the material and the refractive index at the same time may cause some unexpected behavior'); //eslint-disable-line
	        } else if (options.material) {
	            // Check to make sure the material exists in the database
	            if (_materials2.default[this.material]) {
	                this.refractiveIndex = _materials2.default[this.material].refractiveIndex;
	            } else if (this.material === undefined || this.material === null) {
	                this.material = 'default';
	                this.refractiveIndex = 1;
	            } else {
	                console.error('the material ' + this.material + ' is not recognized. See the docs for supported default materials'); //eslint-disable-line
	            }
	        } else if (options.refractiveIndex) {
	            this.refractiveIndex = options.refractiveIndex;
	        } else {
	            this.refractiveIndex = 1.33;
	        }
	        return this;
	    },
	
	    freeze: function freeze() {
	        this.setPosition(this.position.x, this.position.y);
	        // this.static = true;
	        // this._cachedVelocity = this.velocity.clone();
	        // this.velocity.x = 0;
	        // this.velocity.y = 0;
	        return this;
	    },
	
	    unfreeze: function unfreeze() {
	        this.static = false;
	        // if (this._cachedVelocity) {
	        //     this.velocity.x = this._cachedVelocity.x;
	        //     this.velocity.y = this._cachedVelocity.y;
	        // } else {
	        //     console.warn('cannot unfreeze a non-frozen object');
	        // }
	        return this;
	    },
	
	    translate: function translate() {
	        if (arguments.length === 1) {
	            if (_typeof(arguments.length <= 0 ? undefined : arguments[0]) === 'object') {
	                // Assume we have a vector object
	                this.position.add(arguments.length <= 0 ? undefined : arguments[0]);
	            }
	        } else if (arguments.length === 2) {
	            if (typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'number' && typeof (arguments.length <= 1 ? undefined : arguments[1]) === 'number') {
	                this.position.x += arguments.length <= 0 ? undefined : arguments[0];
	                this.position.y += arguments.length <= 1 ? undefined : arguments[1];
	            }
	        }
	
	        if (this.updateVertices) {
	            this.updateVertices();
	        }
	        return this;
	    },
	
	    rotate: function rotate(angle) {
	        this.rotation += angle;
	        return this;
	    },
	
	    updateVertices: function updateVertices() {
	        var _this = this;
	
	        switch (this.type) {
	            case 'rectangle':
	                {
	                    var w = this.width,
	                        h = this.height,
	                        x = this.interpolatedPosition.x,
	                        y = this.interpolatedPosition.y;
	                    switch (this._mode) {
	                        case 'CENTER':
	                            x -= w / 2;
	                            y -= h / 2;
	                            break;
	                        case 'RIGHT':
	                            x -= w;
	                            break;
	                        default:
	                            break;
	                    }
	
	                    //Get centroid
	                    this.centroid = (0, _Vector2.default)((x + (x + w)) / 2, // <-- x value
	                    (y + (y + h)) / 2 // <-- y value
	                    );
	
	                    this.vertices = [(0, _Vector2.default)(x, y), (0, _Vector2.default)(x + w, y), (0, _Vector2.default)(x + w, y + h), (0, _Vector2.default)(x, y + h)];
	
	                    // To perform a rotation, we have to first translate to the origin,
	                    // then rotate, then translate back to the centroid
	                    if (this.angularVelocity !== 0 || this._rotation !== 0 || this._scale !== 0) {
	                        this.vertices.forEach(function (vertex) {
	                            vertex.translate(-_this.centroid.x, -_this.centroid.y).rotate(_this._rotation).multiply(_this._scale).translate(_this.centroid.x, _this.centroid.y);
	                        });
	                    }
	                    break;
	                }
	            case 'polygon':
	                {
	                    this.updateVertices = function () {
	                        var _this2 = this;
	
	                        this.centroid = { x: 0, y: 0 };
	                        this.vertices.forEach(function (vert, index) {
	                            var relVert = _this2._relativeVertices[index];
	                            vert.x = relVert.x + _this2.interpolatedPosition.x;
	                            vert.y = relVert.y + _this2.interpolatedPosition.y;
	
	                            _this2.centroid.x += vert.x;
	                            _this2.centroid.y += vert.y;
	                        });
	
	                        this.centroid.x /= this.vertices.length;
	                        this.centroid.y /= this.vertices.length;
	
	                        // Update rotate vertices if necessary
	                        if (this.angularVelocity !== 0 || this._rotation !== 0 || this._scale !== 0) {
	                            this.vertices.forEach(function (vert) {
	                                vert.translate(-_this2.centroid.x, -_this2.centroid.y).rotate(_this2._rotation).multiply(_this2._scale).translate(_this2.centroid.x, _this2.centroid.y);
	                            });
	                        }
	                    };
	                    break;
	                }
	            default:
	                return;
	        }
	    },
	
	    addForce: function addForce(x, y) {
	        this.force.x += x;
	        this.force.y += y;
	    },
	
	    setForce: function setForce(x, y) {
	        this.force.x = x;
	        this.force.y = y;
	    },
	
	    // Instantaneously set position without verlet integration
	    setPosition: function setPosition(x, y) {
	        this.position.x = x;
	        this.position.y = y;
	        this.positionPrev.x = x;
	        this.positionPrev.y = y;
	    },
	
	    // Instantaneously set x position without verlet integration
	    setX: function setX(x) {
	        this.position.x = x;
	        this.positionPrev.x = x;
	    },
	    setY: function setY(y) {
	        this.position.y = y;
	        this.positionPrev.y = y;
	    },
	    setRotation: function setRotation(angle) {
	        this.rotation = angle;
	        this.rotationPrev = angle;
	    },
	
	    // TODO: 1/4 Fix the update loop -> body is accelerating WAY too fast.
	    update: function update(dt) {
	        // if (!this.static) {
	        //     this.velocity.add(this.acceleration);
	        //     this.position.add(this.velocity);
	        //     this.rotation += this.angularVelocity;
	        // var frictionAir = 1 - body.frictionAir * timeScale * body.timeScale,
	        var deltaTimeSquared = dt * dt;
	
	        // Calculate previous velocity using change in position during one step
	        var velocityPrevX = this.position.x - this.positionPrev.x,
	            velocityPrevY = this.position.y - this.positionPrev.y;
	
	        // update velocity with Verlet integration
	        this.velocity.x = velocityPrevX + this.force.x * this.invMass * deltaTimeSquared;
	        this.velocity.y = velocityPrevY + this.force.y * this.invMass * deltaTimeSquared;
	
	        this.positionPrev.x = this.position.x;
	        this.positionPrev.y = this.position.y;
	
	        // Don't apply velocity just yet, we need to change it using collisions
	        // and constraints before we actually apply it to the body
	        this.interpolatedPosition = this.position.clone();
	        this.interpolatedPosition.add(this.velocity);
	        // this.position.add(this.velocity);
	
	        // Verlet integration
	        this.angularVelocity = this.rotation - this.rotationPrev + this.torque * this.invInertia * deltaTimeSquared;
	        this.rotationPrev = this.rotation;
	        this.rotation += this.angularVelocity;
	
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
	    get: function get() {
	        return this._rotation;
	    },
	    set: function set(angle) {
	        this._rotation = angle;
	        if (this.updateVertices) {
	            this.updateVertices();
	        }
	    }
	});
	
	Object.defineProperty(Body, 'scale', {
	    get: function get() {
	        return this._scale;
	    },
	    set: function set(scaleFactor) {
	        this._scale = scaleFactor;
	        if (this.updateVertices) {
	            this.updateVertices();
	        } else if (this.type === 'circle') {
	            this.scaledRadius = this.radius * scaleFactor;
	        }
	    }
	});
	
	Object.defineProperty(Body, 'mass', {
	    get: function get() {
	        return this._mass;
	    },
	    set: function set(m) {
	        this._mass = m;
	        this.invMass = 1 / m;
	    }
	});
	
	exports.default = Body;
	module.exports = exports['default'];

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = {
		"GLASS": {
			"refractiveIndex": 1.5
		},
		"AIR": {
			"refractiveIndex": 1.000277
		}
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/* eslint
	    "no-else-return": "off"
	 */
	var AABB = {
	    init: function init(body) {
	        this.body = body;
	
	        var _findMinMax = this.findMinMax(body),
	            min = _findMinMax.min,
	            max = _findMinMax.max;
	
	        this.max = max;
	        this.min = min;
	    },
	    /**
	     * Finds bounds of AABB
	     * Does not set any properties
	     * If you want to find and set, call AABB.update()
	     * @return {object} bounds
	     */
	    findMinMax: function findMinMax() {
	        var _this = this;
	
	        // Only deal with two types of bodies...Those with vertices, and
	        // circles
	        if (this.body.vertices) {
	            var _ret = function () {
	                var minx = void 0,
	                    miny = void 0,
	                    maxx = void 0,
	                    maxy = void 0;
	                _this.body.vertices.forEach(function (v) {
	                    var x = v.x,
	                        y = v.y;
	
	                    // If nothing has been set, then set it
	                    if (typeof minx === 'undefined') {
	                        minx = x;
	                    } else if (typeof minx !== 'undefined' && x < minx) {
	                        // Something's already there, only update if x < minx
	                        minx = x;
	                    }
	
	                    if (typeof miny === 'undefined') {
	                        miny = y;
	                    } else if (typeof miny !== 'undefined' && y < miny) {
	                        miny = y;
	                    }
	
	                    if (typeof maxx === 'undefined') {
	                        maxx = x;
	                    } else if (typeof maxx !== 'undefined' && x > maxx) {
	                        maxx = x;
	                    }
	
	                    if (typeof maxy === 'undefined') {
	                        maxy = y;
	                    } else if (typeof maxy !== 'undefined' && y > maxy) {
	                        maxy = y;
	                    }
	                });
	
	                return {
	                    v: {
	                        max: {
	                            x: maxx,
	                            y: maxy
	                        },
	                        min: {
	                            x: minx,
	                            y: miny
	                        }
	                    }
	                };
	            }();
	
	            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	        } else {
	            // Assume it's a circle
	            var cx = this.body.interpolatedPosition.x,
	                cy = this.body.interpolatedPosition.y,
	                r = this.body.scaledRadius;
	            return {
	                max: {
	                    x: cx + r,
	                    y: cy + r
	                },
	                min: {
	                    x: cx - r,
	                    y: cy - r
	                }
	            };
	        }
	    },
	
	    /**
	     * Returns true of point is inside AABB
	     * @param {Point} point - must contain x and y props
	     * @return {bool} true if point is inside AABB
	     */
	    contains: function contains(point) {
	        var x = point.x,
	            y = point.y;
	        if (x >= this.min.x && x <= this.max.x && y >= this.min.y && y <= this.max.y) {
	            return true;
	        }
	
	        return false;
	    },
	
	    /**
	     * Check if two AABB's intersect
	     * @param {AABB} aabb - other bounding box
	     * @return {bool} true for overlap, false otherwise
	     */
	    overlap: function overlap(aabb) {
	        if (this.max.x < aabb.min.x) {
	            return false;
	        } // a is left of b
	        if (this.min.x > aabb.max.x) {
	            return false;
	        } // a is right of b
	        if (this.max.y < aabb.min.y) {
	            return false;
	        } // a is above b
	        if (this.min.y > aabb.max.y) {
	            return false;
	        } // a is below b
	        return true; // boxes overlap
	    },
	
	    /**
	     * Updates the AABB
	     */
	    update: function update() {
	        var _findMinMax2 = this.findMinMax(),
	            max = _findMinMax2.max,
	            min = _findMinMax2.min;
	
	        this.max = max;
	        this.min = min;
	    }
	};
	
	var aabb = function aabb(body) {
	    var ab = Object.create(AABB);
	    ab.init(body);
	    return ab;
	};
	
	exports.default = aabb;
	module.exports = exports['default'];

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _math = __webpack_require__(5);
	
	var _Vector = __webpack_require__(4);
	
	var _Vector2 = _interopRequireDefault(_Vector);
	
	var _Ray = __webpack_require__(6);
	
	var _Ray2 = _interopRequireDefault(_Ray);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Wave = {
	    init: function init(options) {
	        options = options || {};
	        var speedOfLight = 299792458;
	        this.children = [];
	        //this.outerBodies = [];
	        this.style = {
	            lineWidth: options.lineWidth || 1,
	            strokeStyle: options.strokeStyle || '#456abc',
	            opacity: options.opacity || 1.0
	        };
	
	        this.x = options.x || 10;
	        this.y = options.y || 10;
	        this.position = (0, _Vector2.default)(options.x, options.y);
	        this.waveSpeed = options.waveSpeed || speedOfLight;
	        this.frequency = options.frequency || 1000;
	        this.wavelength = this.waveSpeed / this.frequency; // Computed Property
	        this.velocity = options.velocity || (0, _Vector2.default)(0, 0);
	        this.direction = options.direction || 0;
	        this.mode = options.mode || 'RADIAN';
	        this.intensity = options.intensity || 1;
	        this.type = options.type || 'incident';
	        this.parent = options.parent || null;
	        this.n1 = options.n1 || 1;
	        this.n2 = options.n2 || 1;
	        this.lastIntersection = {};
	
	        // create ray for detecting body intersections
	        this.ray = (0, _Ray2.default)(this.position.x, this.y, this.direction, this.mode === 'DEGREES' || null);
	    },
	
	    update: function update(system) {
	        this.ray.trace(system);
	
	        // Remove children on every update
	        this.children = [];
	        // If the ray intersected a point...
	        if (this.ray.intersectionPoint) {
	            this.lastIntersection = this.ray.intersectionPoint;
	            this.children = this.createChildren();
	
	            this.children.forEach(function (child) {
	                child.update(system);
	            });
	        }
	    },
	    createChildren: function createChildren() {
	        var _this = this;
	
	        //Vector implementation of reflected and refracted waves here:
	        //http://graphics.stanford.edu/courses/cs148-10-summer/docs/2006--degreve--reflection_refraction.pdf
	        //Normalize ray vector = this.ray.direction
	
	        // Find the normal vector (method of which depends on type of body)
	        // There are two possible normal vectors, but
	        // which one do we want?
	        // one which dot product with ray vector < 0 is what we want
	        // http://gamedev.stackexchange.com/questions/85850/collision-intersection-of-2d-ray-to-line-segment
	        var normal = void 0;
	
	        //selectNormal();
	        // TODO: Wrap this in it's own function (i.e. findNormal function)
	        var bType = this.ray.intersectingBody.type;
	        if (bType === 'rectangle' || bType === 'polygon') {
	            (function () {
	                var intSeg = _this.ray.intersectingSegment;
	
	                intSeg.normalize();
	                var dot = intSeg.dot(_this.ray.direction);
	                var normals = [(0, _Vector2.default)(-intSeg.y, intSeg.x), (0, _Vector2.default)(intSeg.y, -intSeg.x)];
	
	                var that = _this;
	                normals.forEach(function (n) {
	                    if (n.dot(that.ray.direction) < 0) {
	                        normal = n;
	                    }
	                });
	            })();
	        } else if (bType === 'circle') {
	            (function () {
	                var cx = _this.ray.intersectingBody.position.x;
	                var cy = _this.ray.intersectingBody.position.y;
	                var ix = _this.ray.intersectionPoint.x;
	                var iy = _this.ray.intersectionPoint.y;
	                var v1 = (0, _Vector2.default)(ix - cx, iy - cy),
	                    v2 = (0, _Vector2.default)(cx - ix, cy - iy);
	                v1.normalize();
	                v2.normalize();
	                var normals = [v1, v2];
	                var that = _this;
	                normals.forEach(function (n) {
	                    //n.normalize();
	                    if (n.dot(that.ray.direction) < 0) {
	                        normal = n;
	                    }
	                });
	                if (normal === undefined) {
	                    // We intersect at a tangent on a circle???
	                    // TODO: Fix this!!!
	                    normal = normals[0];
	                }
	            })();
	        }
	
	        // child waves - reflected and refracted
	        // Calculate reflected vector
	        // https://en.wikipedia.org/wiki/Snell%27s_law#Vector_form
	        // http://stackoverflow.com/questions/5454661/reflection-how-do-i-do-it
	        // Reflected vector looks like this:
	        // r = a - 2(a dot n) * n
	        var tmpTerm = 2 * this.ray.direction.dot(normal);
	        var tmpVec = normal.clone();
	        tmpVec.multiply(2 * this.ray.direction.dot(normal));
	        var rVec = this.ray.direction.clone();
	        rVec.subtract(tmpVec);
	
	        // Refracted vector
	        // Are we inside a body?
	        // get origin points of wave, check if they are interior to the
	        // intersecting body, if so, n1 = body.refractiveIndex, if not, n1
	        // takes on refractive index of outer context,
	        // which we can find from it's parent wave
	        // If we have a body to intersect with...
	        if (this.type === 'incident' && this.ray.outerBodies.length > 0) {
	            //Grab the last one (the body on top)
	            this.n1 = this.ray.outerBodies[this.ray.outerBodies.length - 1].refractiveIndex;
	        }
	
	        // TODO: Figure out how to handle picking proper refractive index
	        // values
	        // for child rays
	        if (this.ray.intersectingBody) {
	            switch (this.type) {
	                case 'refracted':
	                    if (this.parent && this.parent.ray.intersectingBody && this.parent.ray.intersectingBody === this.ray.intersectingBody) {
	                        this.n1 = this.parent.n2;
	                        this.n2 = this.parent.n1;
	                    } else {
	                        this.n1 = this.parent.n2;
	                        this.n2 = this.ray.intersectingBody.refractiveIndex;
	                    }
	                    break;
	                case 'reflected':
	                    if (this.parent && this.parent.ray.intersectingBody && this.parent.ray.intersectingBody === this.intersectingBody) {
	                        this.n1 = this.parent.n1;
	                        this.n2 = this.parent.n2;
	                    } else {
	                        this.n1 = this.parent.n1;
	                        this.n2 = this.ray.intersectingBody.refractiveIndex;
	                    }
	                    break;
	                case 'incident':
	                    this.n2 = this.ray.intersectingBody.refractiveIndex;
	                    break;
	                default:
	                    break;
	            }
	        } else {
	            // There's no intersection point ahead of this ray, so it's
	            // refractive indices are irrelevant
	            this.n1 = 1;
	            this.n2 = 1;
	            // If the ray won't intersect another body,
	            // then it must be outside of a body
	            //n2 = 1;
	
	            // n1 must take on the index of where the parent ray currently
	            // exists
	            //n1 = props.parent.intersectingBody.refractiveIndex;
	        }
	
	        var theta1 = Math.PI - this.ray.direction.angleTo(normal);
	        var theta2 = Math.asin(this.n1 * Math.sin(theta1) / this.n2);
	
	        // Vector formulation for refracted wave
	        // t = n1/n2 * rayVector + (n1/n2 * cos(theta1) - sqrt(1
	        // - sin2(theta2))) * normal
	        var sin2theta2 = this.n1 / this.n2 * (this.n1 / this.n2) * (1 - Math.cos(theta1) * Math.cos(theta1));
	        var tVec = _Vector.Vector.multiply(this.n1 / this.n2, this.ray.direction);
	        var normCopy = _Vector.Vector.multiply(normal, this.n1 / this.n2 * Math.cos(theta1) - Math.sqrt(1 - sin2theta2));
	        tVec.add(normCopy);
	
	        // Reflection Coefficient
	        // R = R0 + (1 - R0) * (1 - cos(theta1))^5 where R0 = (n1 - n2 / n1
	        // + n2)^2
	        var _r0 = (this.n1 - this.n2) / (this.n1 + this.n2);
	        var R0 = _r0 * _r0;
	        var _r0tmp = void 0;
	
	        // Angles must be positive, so if we get a negative value for an
	        // angle, just flip it
	        if (this.n1 <= this.n2) {
	            _r0tmp = 1 - (Math.cos(theta1) < 0 ? -Math.cos(theta1) : Math.cos(theta1));
	        } else if (this.n1 > this.n2) {
	            _r0tmp = 1 - (Math.cos(theta2) < 0 ? -Math.cos(theta2) : Math.cos(theta2));
	        }
	
	        // TODO: Refactor this to eliminate some checks if body is a mirror
	        var R = R0 + (1 - R0) * Math.pow(_r0tmp, 5);
	        var T = 1 - R; // Refracion Coefficient
	        // Total Internal Reflection
	        if (Math.sin(theta1) > this.n2 / this.n1) {
	            R = 0.95;
	            T = 0;
	        }
	
	        // If the material should be treated as a mirror
	        if (this.ray.intersectingBody.mirror === true) {
	            R = 0.9;
	            T = 0;
	        }
	
	        var RI = this.intensity * R;
	        var TI = this.intensity * T;
	
	        // Add 2 child waves - reflected and refracted
	        // Trace reflected wave
	        // Have to offset the waves by at least a pixel,
	        // otherwise we'll end up in a never ending
	        // call stack when each child wave always produces
	        // 2 new child waves, forever...
	        var rVecAngle = rVec.getAngle();
	        var tVecAngle = tVec.getAngle();
	        var children = [];
	        if (RI > 0.01) {
	            var reflectedWave = wave({ // eslint-disable-line
	                x: this.ray.intersectionPoint.x + Math.cos(rVecAngle),
	                y: this.ray.intersectionPoint.y + Math.sin(rVecAngle),
	                direction: rVecAngle,
	                intensity: RI,
	                type: 'reflected',
	                parent: this,
	                n1: this.n1,
	                n2: this.n2,
	                lineWidth: this.style.lineWidth,
	                strokeStyle: this.style.strokeStyle
	            });
	            children.push(reflectedWave);
	        }
	
	        if (TI > 0.01) {
	            var refractedWave = wave({ // eslint-disable-line
	                x: this.ray.intersectionPoint.x - normal.x,
	                y: this.ray.intersectionPoint.y - normal.y,
	                direction: tVecAngle,
	                intensity: TI,
	                type: 'refracted',
	                parent: this,
	                n1: this.n1,
	                n2: this.n2,
	                lineWidth: this.style.lineWidth,
	                strokeStyle: this.style.strokeStyle
	            });
	            children.push(refractedWave);
	        }
	        return children;
	    }
	}; /* eslint "no-unused-vars": "off" */
	
	
	var wave = function wave(options) {
	    var W = Object.create(Wave);
	    W.init(options);
	    return W;
	};
	
	exports.default = wave;
	module.exports = exports['default'];

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Body = __webpack_require__(21);
	
	var _Body2 = _interopRequireDefault(_Body);
	
	var _AABB = __webpack_require__(23);
	
	var _AABB2 = _interopRequireDefault(_AABB);
	
	var _math = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var circle = function circle(options) {
	    options = options || {};
	    var B = Object.create(_Body2.default);
	    B.init(options);
	
	    B.radius = options.radius || 10;
	    B.scaledRadius = B.radius;
	    B.type = 'circle';
	    B.aabb = (0, _AABB2.default)(B);
	
	    B.inertia = B.mass * B.radius * B.radius / 2;
	    B.invInertia = 1 / B.inertia;
	
	    B.isPointInterior = function (x, y) {
	        var bx = B.position.x,
	            by = B.position.y;
	        if ((0, _math.distance)(x, y, bx, by) <= B.scaledRadius) {
	            return true;
	        }
	        return false;
	    };
	
	    return B;
	};
	
	exports.default = circle;
	module.exports = exports['default'];

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Body = __webpack_require__(21);
	
	var _Body2 = _interopRequireDefault(_Body);
	
	var _AABB = __webpack_require__(23);
	
	var _AABB2 = _interopRequireDefault(_AABB);
	
	var _Vector = __webpack_require__(4);
	
	var _Vector2 = _interopRequireDefault(_Vector);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var polygon = function polygon(options) {
	    options = options || {};
	
	    var B = Object.create(_Body2.default);
	    if (!options.vertices) {
	        throw new Error('Polygons MUST be initialized with vertices. See docs.');
	    }
	    B.init(options);
	
	    // Set type
	    B.type = 'polygon';
	    // TODO: Find one of the (many) algorithms for subdividing a convex polygon
	    // into triangles (graphics needs to do this a lot). Calculate the moment
	    // of each triangle. Add them all up.
	    B.inertia = 1;
	    B.invInertia = 1 / B.inertia;
	
	    //Initialize vetices as vectors
	    // private vertices, relative to x and y
	    B._relativeVertices = [];
	
	    // public vertices, (contain world coords);
	    B.vertices = [];
	
	    options.vertices.forEach(function (vert) {
	        B._relativeVertices.push((0, _Vector2.default)(vert.x, vert.y));
	        B.vertices.push((0, _Vector2.default)(options.x + vert.x, options.y + vert.y));
	    });
	
	    B.isPointInterior = function (x, y) {
	        var inside = false;
	        for (var i = 0, j = B.vertices.length - 1; i < B.vertices.length; j = i++) {
	            var vi = B.vertices[i];
	            var vj = B.vertices[j];
	            var xi = vi.x,
	                yi = vi.y;
	            var xj = vj.x,
	                yj = vj.y;
	
	            var intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
	            if (intersect) {
	                inside = !inside;
	            }
	        }
	        return inside;
	    };
	
	    // Initialize...
	    B.updateVertices();
	    B.aabb = (0, _AABB2.default)(B);
	    return B;
	};
	
	exports.default = polygon;
	module.exports = exports['default'];

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Vector = __webpack_require__(4);
	
	var _Vector2 = _interopRequireDefault(_Vector);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Point = {
	    init: function init(x, y) {
	        this.position = (0, _Vector2.default)(x, y);
	        this.type = 'point';
	        this.constraints = [];
	    }
	};
	
	var point = function point(x, y) {
	    var p = Object.create(Point);
	    p.init(x, y);
	    return p;
	};
	
	exports.default = point;
	module.exports = exports['default'];

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Vector = __webpack_require__(4);
	
	var _Vector2 = _interopRequireDefault(_Vector);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var GJK = {
	    intersect: function intersect(body1, body2) {
	        if (body1.type === 'rectangle') {
	            if (body2.type === 'rectangle' || body2.type === 'polygon') {
	                return this.polypoly(body1, body2);
	            }
	            if (body2.type === 'circle') {
	                return this.polycircle(body1, body2);
	            }
	        }
	
	        if (body1.type === 'circle') {
	            if (body2.type === 'rectangle' || body2.type === 'polygon') {
	                return this.polycircle(body2, body1);
	            }
	            if (body2.type === 'circle') {
	                return this.circlecircle(body1, body2);
	            }
	        }
	
	        if (body1.type === 'polygon') {
	            if (body2.type === 'rect' || body2.type === 'polygon') {
	                return polypoly(body1, body2);
	            }
	            if (body2.type === 'circle') {
	                return this.polycircle(body1, body2);
	            }
	        }
	    },
	
	    polypoly: function polypoly(b1, b2) {},
	
	    polycircle: function polycircle(b1, b2) {},
	
	    circlecircle: function circlecircle(b1, b2) {},
	
	    pointPoly: function pointPoly(body, x, y) {
	        debugger;
	        // Steps
	
	        // Create a simplex and query point
	        var simplex = Object.create(Simplex);
	        var q = (0, _Vector2.default)(x, y);
	        var vertices = body.vertices;
	
	        // 1. Pick a random vertex on the body
	        var randVertex = Math.floor(Math.random() * vertices.length);
	        simplex.vertexA = vertices[randVertex].clone();
	
	        // 2. Build a search vector from vertex to point
	        var searchVector = _Vector.Vector.subtract(q, simplex.vertexA);
	
	        // 3. Determine support point by taking dot product with each vertex
	        //    and search vector, and take the largest one
	        var support = this.calculateSupportPoint(searchVector, vertices);
	
	        // 4. Evolve the simplex
	        simplex.vertexB = support.clone();
	
	        // 5. Find the closest point on the 1-simplex (i.e. straight line
	        //    between 0-simplex and support point
	        var p = simplex.line(x, y);
	
	        // 6. Build a line from p to q
	        searchVector = _Vector.Vector.subtract(q, p);
	
	        // 7. Get new support point and evolve the simplex to a 2-simplex
	        support = this.calculateSupportPoint(searchVector, vertices);
	        simplex.vertexC = support.clone();
	
	        debugger;
	    },
	
	    calculateSupportPoint: function calculateSupportPoint(d, vertices) {
	        var index = 0;
	        var maxValue = vertices[index].dot(d);
	        for (var i = 1; i < vertices.length; i++) {
	            var value = vertices[i].dot(d);
	            if (value > maxValue) {
	                index = i;
	                maxValue = value;
	            }
	        }
	        return vertices[index];
	    },
	
	    getVoronoiRegions: function getVoronoiRegions(b) {
	        // Implementation
	    }
	};
	
	var Simplex = {
	    init: function init(vertexA, vertexB, vertexC) {
	        this.vertexA = vertexA;
	        this.vertexB = vertexB;
	        this.vertexC = vertexC;
	    },
	
	    point: function point(x, y) {
	        if (this.vertexA) {
	            return this.vertexA;
	        }
	    },
	
	    line: function line(x, y) {
	        if (this.vertexA && this.vertexB) {
	            // Return the closest point on the line
	            //             First, we compute the barycentric coordinates.
	            // From those we determine the Voronoi region and the closest point P.
	
	            // v = (q - a) dot n / (B - A).mag
	            // u = (b - q) dot n / (B - A).mag
	            var q = (0, _Vector2.default)(x, y);
	            var diff = _Vector.Vector.subtract(this.vertexB, this.vertexA);
	            var diffMag = diff.magnitude();
	            var n = diff.clone();
	            n.normalize();
	            var v = _Vector.Vector.subtract(q, this.vertexA).dot(n) / diffMag;
	            var u = _Vector.Vector.subtract(this.vertexB, q).dot(n) / diffMag;
	
	            if (u <= 0) {
	                return this.vertexB;
	            } else if (v <= 0) {
	                return this.vertexA;
	            } else {
	                var g1 = _Vector.Vector.multiply(this.vertexA, u);
	                var g2 = _Vector.Vector.multiply(this.vertexB, v);
	
	                return _Vector.Vector.add(g1, g2);
	            }
	
	            debugger;
	        }
	    },
	
	    // Voronoi regions A, B, C, AB, BC, CA, ABC
	    triangle: function triangle(x, y) {
	        var q = (0, _Vector2.default)(x, y);
	
	        var A = this.vertexA,
	            B = this.vertexB,
	            C = this.vertexC;
	
	        var qb = _Vector.Vector.subtract(q, B),
	            qa = _Vector.Vector.subtract(q, A),
	            qc = _Vector.Vector.subtract(q, C),
	            ab = _Vector.Vector.subtract(A, B),
	            ba = _Vector.Vector.subtract(B, A),
	            bc = _Vector.Vector.subtract(B, C),
	            cb = _Vector.Vector.subtract(C, B),
	            ca = _Vector.Vector.subtract(C, A),
	            ac = _Vector.Vector.subtract(A, C);
	
	        // Compute edge barycentric coordinates (pre-division)
	        // float uAB = Dot(Q - B, A - B);
	        // float vAB = Dot(Q - A, B - A);
	        //
	        // float uBC = Dot(Q - C, B - C);
	        // float vBC = Dot(Q - B, C - B);
	        //
	        // float uCA = Dot(Q - A, C - A);
	        // float vCA = Dot(Q - C, A - C);
	        var uAB = _Vector.Vector.dot(qb, ab),
	            vAB = _Vector.Vector.dot(qa, ba);
	
	        var uBC = _Vector.Vector.dot(qc, bc),
	            vBC = _Vector.Vector.dot(qb, cb);
	
	        var uCA = _Vector.Vector.dot(qa, ca),
	            vCA = _Vector.Vector.dot(qc, ac);
	    }
	};
	
	exports.default = GJK;
	module.exports = exports['default'];

/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    ELASTIC: 'elastic',
	    INELASTIC: 'inelastic',
	    STATIC: 'static'
	};
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=sciplay.js.map