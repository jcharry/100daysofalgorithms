let LinkedList = {
    head: null,
    push: function(obj) {
        let node = Object.create(Node);
        node.data = obj;
        debugger;

        // If the head doesn't exist
        if (!this.head) {
            this.head = node;
            return;
        }

        // Otherwise, move through the nodes and add it to the end
        let current = this.head;
        // While the current node has a next node
        // Loop ends when we reach a node that has no 'next' property
        while (current.next) {
            // Set current to the next node and repeat
            current = current.next;
        }

        current.next = node;
        return;
    }
};

let Node = {
    next: null,
    data: null
};

let linkedList = function(head) {
    let ll = Object.create(LinkedList);
    ll.head = head;
    return ll;
};

export default linkedList;

