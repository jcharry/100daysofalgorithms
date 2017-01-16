const Collision = {
    init: function(b1, b2, mtv, overlap) {
        this.body1 = b1;
        this.body2 = b2;
        this.mtvaxis = mtv;
        this.overlap = overlap;
    }
};

const collision = function(b1, b2, mtv, overlap) {
    let c = Object.create(Collision);
    c.init(b1, b2, mtv, overlap);
    return c;
};

export default collision;
