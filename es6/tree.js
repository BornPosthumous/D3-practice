import * as d3 from 'd3';
import Rx from 'rxjs';
import * as _ from 'lodash';

export class d3BST {
  constructor(id, bst, height, tInterval) {
    this.bst = bst;
    this._logScale = this.getLogScale;
    this.chart = this.setupChart();
    this.displayNodes();
    this.displayLinks();
  }
  displayLinks() {
    var link = this.chart.selectAll('path.link')
      .data(this.links)
      .enter()
      .insert('path', "g")
      .attr('class', 'link')
      .attr('d', d => (d.parent !== null)
        ? this.diagonal(d, {
          x: d.parent.x,
          y: d.parent.y
        }) :
        null
      );

  }
  diagonal(s, d) {
    let path = `M ${s.x} ${s.y}
            C ${(s.x + d.x) / 2} ${s.y},
              ${(s.x + d.x) / 2} ${d.y},
              ${d.x} ${d.y}`

    return path;
  }
  displayNodes() {
    var nodeEnter =
      this.chart.selectAll('g.node')
        .data(this.nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr("transform", d => "translate(" + this.root.x0 + "," + this.root.y0 + ")")
        .attr("transform", d => "translate(" + d.x + "," + d.y + ")")

    nodeEnter.append('circle')
      .attr('r', d => Math.sqrt(d.data.value))
      .style("fill", d => d._children ? "lightsteelblue" : "#fff")

    nodeEnter.append('text')
      .attr("dy", ".35em")
      .attr("x", d => d.children || d._children ? -Math.sqrt(d.data.value) - 3 : Math.sqrt(d.data.value) + 3)
      .attr("text-anchor", d => d.children || d._children ? "end" : "start")
      .text(d => d.data.value);

  }
  getLogScale() {
    return d3.scaleLog()
      .domain([1, 100])
      .range([10, 100])
  }
  setupChart() {
    this.offsetWidth = document.getElementById('wrapper')
      .offsetWidth;
    this.margin = {
      top: 40,
      bottom: 80
    }
    this.width = 400;
    this.height = 400 - this.margin.top - this.margin.bottom;

    this.root = this.getRoot(this.bst);
    this.treemap = d3.tree()
      .size([this.width, this.height]);

    this.root.x0 = this.width / 2;
    this.root.y0 = 0;
    this.getNodesAndLinks()
    // Normalize for fixed-depth
    this.setNodeDepth(this.nodes, 35)

    return d3.select(".chart3")
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .attr("viewBox", "0 0 400 400")
      .append("g")
      .attr("transform", "translate(0," + this.margin.top + ")");;

  }
  getRoot(bst) {
    return d3.hierarchy(bst.root, c => {
      let children = [];
      if (c.left !== null) children.push(c.left)
      if (c.right !== null) children.push(c.right);
      return children;
    })
  }
  setNodeDepth(nodes, depth) {
    nodes.forEach(function (d) {
      d.y = d.depth * depth
    });
  }
  getNodesAndLinks() {
    var treeData = this.treemap(this.root);
    this.nodes = treeData.descendants();
    this.links = treeData.descendants();
  }
  setupRootAndTree() {
    this.root = this.getRoot(bst);
    this.treemap = d3.tree()
      .size([this.width, this.height]);

    this.root.x0 = this.width / 2;
    this.root.y0 = 0;
    this.getNodesAndLinks()
    // Normalize for fixed-depth
    this.setNodeDepth(this.nodes, 35)

  }
}
