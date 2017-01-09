export const degToRad = function(angle) {
    return angle * Math.PI / 180;
};

export const radToDeg = function(angle) {
    return angle * 180 / Math.PI;
};

export const distance = function(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
};

export const map = function(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
};
