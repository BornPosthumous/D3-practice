import d3Graph from './d3Graph.js';
import d3BarGraph from './bar.js';
import d3BST from './tree.js';

let graph = new d3Graph( '.chart', 300, 500, 10 );
let barGraph = new d3BarGraph( '.chart2', 300, 500, 10 );
// let bst = new d3BST( '.chart3', 300, 500, 10 );