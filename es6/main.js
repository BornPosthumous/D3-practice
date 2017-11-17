import d3Graph from './d3Graph.js';
import d3BarGraph from './bar.js';
import {
  d3BST
} from './tree.js'
import {
  getBST
} from './util.js'

let graph = new d3Graph( '.chart', 300, 500, 10 );
let barGraph = new d3BarGraph( '.chart2', 300, 500, 10 );
let treeGraph = new d3BST( '.chart3', getBST( 30 ), 500, 10 );