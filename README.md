#100 Days of Algorithms#
See everything in one place on [this here tumblr blog](https://100daysofalgorithms.tumblr.com/).

- Day 1 - Binary Search
- Day 2 - Selection Sort
- Day 3 - Insertion Sort
- Day 4 - Merge Sort

##Downloading##
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
