import * as d3 from 'd3';
import Rx from 'rxjs';

let data = [ {
    name: "Gregory Russ",
    monthly: 13998,
    currentRent: 0,
    rentLura: 0,
    increase: 0
  },
  {
    name: "Very Low-Income Household",
    monthly: 2637,
    currentRent: 1130,
    rentLura: 1130,
    increase: 0
  },
  {
    name: "Very Low Income Household",
    monthly: 3797,
    currentRent: 791,
    rentLura: 791,
    increase: 0
  },
  {
    name: "Average POC Household",
    monthly: 2525,
    currentRent: 758,
    rentLura: 1130,
    increase: 49
  },
  {
    name: "Extremely Low Income Household (~30% AMI)",
    monthly: 2258,
    currentRent: 677,
    rentLura: 1130,
    increase: 67
  },

  {
    name: "Average MPHA Working Household",
    monthly: 1708,
    currentRent: 512,
    rentLura: 1130,
    increase: 121
  },
  {
    name: "Extremely Low Income Individual (~30% AMI)",
    monthly: 475,
    currentRent: 475,
    rentLura: 791,
    increase: 67
  },
  {
    name: "Average Public Housing Household",
    monthly: 1183,
    currentRent: 355,
    rentLura: 1130,
    increase: 218
  },
  {
    name: "Senior on Social Security",
    monthly: 900,
    currentRent: 255,
    rentLura: 791,
    increase: 252
  },
  {
    name: "Individual With No Income",
    monthly: 0,
    currentRent: 75,
    rentLura: 791,
    increase: 955
  },
  {
    name: "Household With No Income",
    monthly: 0,
    currentRent: 75,
    rentLura: 1130,
    increase: 1407
  }

]

data = data.map( x => {
  x.annual = 12 * x.monthly;
  return x;
} )

function getOffset( el ) {
  el = el.getBoundingClientRect();
  return {
    left: el.left + window.scrollX,
    top: el.top + window.scrollY
  }
}
export default class d3BarGraph {
  constructor( id, samples, height, tInterval ) {
    this.height = height;
    let index = -1;
    this.offsetWidth = document.getElementById( 'wrapper' )
      .offsetWidth;

    this.barWidth = 50 //  his.offsetWidth ) / this.samples;

    this._y =
      d3.scaleLinear()
      .domain( [ 0, d3.max( data, d => d.increase ) ] )
      .range( [ this.height, 0 ] );

    this._x =
      d3.scaleLinear()
      .domain( [ 0, 0 ] )
      .range( [ 0, this.offsetWidth ] );

    this.yAxis =
      d3.axisLeft( this._y )
      .ticks( 20 );

    this.xAxis =
      d3.axisBottom( this._x )
      .ticks( 20 );

    this.chart = d3.select( ".chart2" );

    this.chart.append( "g" )
      .attr( "class", "y axis" )
      .call( this.yAxis );

    this.chart.append( "g" )
      .attr( "class", "x axis" )
      .attr( "transform", `translate(0, ${this.height})` )
      .call( this.xAxis );

    var div = d3.select( "body" )
      .append( "div" )
      .attr( "class", "tooltip" )
      .style( "opacity", 0 );

    var bar = this.chart.selectAll( "rect.x" )
      .data( data )
      .enter()
      .append( "g" )
      .attr( "transform", ( d, i ) => `translate(${(i * this.barWidth * 1.75) },0)` );

    bar.append( "rect" )
      .attr( 'class', 'x' )
      .attr( "height", x => this.height - this._y( x.increase ) )
      .attr( "y", d => this._y( d.increase ) )
      .attr( "width", this.barWidth )
      .attr( "fill", "palevioletred" )
      .on( "mouseover", function( d, i ) {
        let chartRect = getOffset( document.getElementById( 'chart2' ) )
        index = i;
        // Define the div for the tooltip
        div.transition()
          .duration( 200 )
          .style( "opacity", .9 );

        bar.filter( ( x, i ) => i !== index )
          .transition()
          .style( "opacity", .5 );

        div.html(
            `<h2>${d.name}</h2><br><h4>Current Rent: ${d.currentRent}</h4> <br><h4> After LURA: ${d.rentLura}</h4><p> The rent for a ${d.name} will increase ${d.increase} percent!` )
          .style( "left", chartRect.left + 50 + "px" )
          .style( "top", chartRect.top + 50 + "px" );

        d3.select( this )
          .transition()
          .duration( 500 )
          .style( "fill", "#FF4136" )
          .style( "stroke-width", "5" )
          .style( "font-size", "28px" )
          .style( "opacity", 1 );
      } )
      .on( "mouseout", function( d ) {
        index = -1;
        bar.transition()
          .duration( 200 )
          .style( "opacity", 1 );

        d3.select( this )
          .transition()
          .duration( 200 )
          .style( "fill", "palevioletred" )
          .style( "border", "none" )
          .style( "font-size", "18px" )
        div.transition()
          .duration( 500 )
          .style( "opacity", 0 );

      } );
    bar.append( "g" )
      .append( "text" )
      .attr( "dy", 0 )
      .attr( "transform", ( d, i ) => `translate(${ this.barWidth /2  },${this.height + 20}) rotate(45)` )
      .attr( "fill", "black" )
      .attr( "font-family", "sans-serif" )
      .text( d => `$${d.annual} - ${d.name}` )

    bar.append( "g" )
      .append( "text" )
      .attr( "dy", 0 )
      .attr( "font-family", "sans-serif" )
      .attr( "transform", ( d, i ) => `translate(${ 0 },${this.height - 100})` )
      .attr( "fill", "white" )
      .text( d => `${ d.increase}%` )
  }
}