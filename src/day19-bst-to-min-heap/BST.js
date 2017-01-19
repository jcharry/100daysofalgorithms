import linkedList from './LinkedList';
import queue from './Queue';

let Node = {
    data: null,
    value: null,
    leftChild: null,
    rightChild: null
};
let Tree = {
    root: null,
    height: function(node) {
        if (node === undefined || node === null) return 0;

        let leftHeight = this.height(node.leftChild);
        let rightHeight = this.height(node.rightChild);

        let max = Math.max(leftHeight, rightHeight);
        return max + 1;
    },
    insert: function(obj) {
        let node = Object.create(Node);
        let root = this.root;
        let current;
        let value = obj.value;

        node.value = obj.value;
        node.data = obj;

        // If the root doesn't exist yet, this node must be the root;
        if (root === undefined || root === null) {
            obj.level = 0;
            this.root = node;
            return;
        }

        // Set the current node to the root
        current = root;

        // Move down through the tree, and check to ensure there's
        // still a node to look at
        let level = 0;
        while(current) {
            level++;
            // Data is less than parent value -> so it should go to the left
            if (value < current.value) {
                // If the left child doesnt' exist, then that's where we put
                // the data, otherwise we have to check (i.e set current to the
                // left child and loop again
                if (current.leftChild) {
                    current = current.leftChild;
                } else {
                    node.level = level;
                    obj.level = level;
                    obj.parent = current.data.id;
                    node.parent = current;
                    current.leftChild = node;
                    return;
                }
            } else {
                // We're on the right side of the tree
                if (current.rightChild) {
                    current = current.rightChild;
                } else {
                    node.parent = current;
                    node.level = level;
                    obj.level = level;
                    obj.parent = current.data.id;
                    current.rightChild = node;
                    return;
                }
            }
        }
    },
    bfs: function(root) {
        if (root === undefined) return;

        // Create new queue
        let q = queue();

        // Enqueue root and initialize height
        q.enqueue(root);
        actions.push({type: 'enqueue', id: root.data.id, q: q.copy()});

        while (!q.isEmpty()) {
            // Get the node from the queue and remove it
            let node = q.dequeue();
            actions.push({type: 'dequeue', id: node.data.id, q: q.copy()});
            console.log(node.data.value);

            if (node.leftChild) {
                q.enqueue(node.leftChild);
                actions.push({type: 'enqueue-left', id: node.data.id, q: q.copy()});
            }

            if (node.rightChild) {
                q.enqueue(node.rightChild);
                actions.push({type: 'enqueue-right', id: node.data.id, q: q.copy()});
            }
        }
    },
    dfs: function(root, type) {
        switch (type) {
            case 'postorder':
                return this.dfsPostorder(root);
            case 'preorder':
                return this.dfsPreorder(root);
            case 'inorder':
                return this.dfsInorder(root);
            default:
                return this.dfsInorder(root);
        }
    },
    dfsPostorder: function(root) {
        if (root === undefined || root === null) {
            return;
        }

        this.dfsPostorder(root.leftChild);
        this.dfsPostorder(root.rightChild);
        actions.push({type: 'traverse', id: root.data.id});
    },
    dfsPreorder: function(root) {
        if (root === undefined || root === null) {
            return;
        }

        actions.push({type: 'traverse', id: root.data.id});
        this.dfsPreorder(root.leftChild);
        this.dfsPreorder(root.rightChild);
    },
    dfsInorder: function(root) {
        if (root === undefined || root === null) {
            return;
        }

        this.dfsInorder(root.leftChild);
        actions.push({type: 'traverse', id: root.data.id});
        this.dfsInorder(root.rightChild);
    },
    copy: function() {

    },
    convertToSortedArray: function(root) {
        let count = 0;
        let arr = [];


        function recurse(root) {
            if (root === undefined || root === null) {
                return;
            }

            recurse(root.leftChild);

            let node = Object.create(Node);
            node.data = clone(root.data);
            node.value = root.value;
            arr.push(node);

            recurse(root.rightChild);
        }

        // Start the whole thing
        recurse(root);
        console.log(arr);
        return arr;
    },
};

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export default Tree;
