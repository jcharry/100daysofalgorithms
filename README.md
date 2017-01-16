#100 Days of Algorithms#
See everything in one place on [this here tumblr blog](https://100daysofalgorithms.tumblr.com/).

- Day 1 - Binary Search
- Day 2 - Selection Sort
- Day 3 - Insertion Sort
- Day 4 - Merge Sort
- Day 5 - Quick Sort
- Day 6 - Pigeonhole Sort
- Day 7 - Closest Point on Line
- Day 8 - Closest Pair of Points
- Day 9 - Convex Hull (Jarvis March)
- Day 10 - Point Inside a Polygon
- Day 11 - Line Intersections
- Day 12 - Sweepline Line Intersections
- Day 13 - Separating Axis Theorem
- Day 14 - Binary Search Tree Construction
- Day 15 - Level Order Traversal
- Day 16 - Depth First Traversal (Pre-order)
- Day 17 - Depth First Traversal (Post-order)
- Day 18 - Depth First Traversal (In-order)

##Downloading##
**Please Note:** *This project was not about clean code, it was about producing new
work everyday.  As a result, little time was spent on code cleanup and
optimization.*

If you'd like to run these examples yourself, run the following to clone the
repo, install dependencies, and build the output files
```
$ git clone https://github.com/jcharry/100daysofalgorithms.git
$ npm install
$ npm run build
```
Once everything is built, start a local server with
directory
```
$ http-server -p 1234
```

If you get an error, install `http-server` with
```$ npm install -g http-server```

Navigate to `localhost:1234` in a browser, and navigate to the build folder.

##To Edit##
Instead of running ```$ npm run build``` above, run
```$ npm run dev```, start the server in a new terminal window, and navigate to
localhost:1234.

Any changes made to src files will trigger a re-build of generated files.  Just
refresh your browser and you should see any changes.
