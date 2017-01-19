let queue = function(items) {
    let _items;
    if (typeof items === 'object' && items.length !== 0) _items = items;
    else _items = [];

    let enqueue = function(obj) {
        _items.push(obj);
    };
    let dequeue = function() {
        return _items.shift();
    };
    let isEmpty = function() {
        return _items.length === 0;
    };

    let copy = function() {
        return queue(_items.slice());
    };

    let getCount = function() {
        return _items.length;
    };
    let peek = function() {
        return _items[0];
    };

    return {
        _items,
        enqueue,
        dequeue,
        isEmpty,
        copy,
        peek,
        getCount
    };
};

export default queue;
