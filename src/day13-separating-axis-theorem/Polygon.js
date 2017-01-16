import Body from './Body';
import aabb from './AABB';
import vector from './Vector';

var polygon = function(options) {
    options = options || {};

    var B = Object.create(Body);
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

    options.vertices.forEach(vert => {
        B._relativeVertices.push(vector(vert.x, vert.y));
        B.vertices.push(vector(options.x + vert.x, options.y + vert.y));
    });

    B.isPointInterior = function(x, y) {
        var inside = false;
        for (var i = 0, j = B.vertices.length - 1; i < B.vertices.length; j = i++) {
            let vi = B.vertices[i];
            let vj = B.vertices[j];
            var xi = vi.x,
                yi = vi.y;
            var xj = vj.x,
                yj = vj.y;

            var intersect = ((yi > y) !== (yj > y)) &&
                (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) {
                inside = !inside;
            }
        }
        return inside;
    };

    // Initialize...
    B.updateVertices();
    B.aabb = aabb(B);
    return B;
};

export default polygon;
