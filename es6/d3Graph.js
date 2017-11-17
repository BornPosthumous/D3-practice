import * as d3 from 'd3';
console.log( d3 )
import Rx from 'rxjs';
export default class d3Graph {
  constructor( id, samples, height, tInterval ) {
    this.height = height;
    this.samples = samples;
    this.tInterval = tInterval;
    this.colorIntensity = 75;
    this.incScale = 255 / this.height;
    this.container = d3.select( id )
      .append( 'svg' )
      .append( 'g' );
    this.offsetWidth = document.getElementById( 'wrapper' )
      .offsetWidth - 75;
    this.barWidth = ( this.offsetWidth ) / this.samples;

    this._y =
      d3.scaleLinear()
      .domain( [ 0, this.offsetWidth ] )
      .range( [ this.height, 0 ] );

    this._x =
      d3.scaleLinear()
      .domain( [ this.samples, 0 ] )
      .range( [ this.offsetWidth, 0 ] );

    this.yAxis =
      d3.axisLeft( this._y )
      .ticks( 20 );

    this.xAxis =
      d3.axisBottom( this._x )
      .ticks( 20 );

    this.chart = d3.select( ".chart" );

    this.chart.append( "g" )
      .attr( "class", "y axis" )
      .call( this.yAxis );

    this.chart.append( "g" )
      .attr( "class", "x axis" )
      .attr( "transform", `translate(0, ${this.height})` )
      .call( this.xAxis );

    var moves = Rx.Observable.fromEvent( document, 'mousemove' )
      .debounce( () => Rx.Observable.timer( this.timerInterval ) )
      .distinctUntilChanged()
      .map( x => ( {
        x: x.clientX,
        y: x.clientY
      } ) )
      .take( this.samples )
      .scan( ( acc, cur ) => [ ...acc, cur ], [] )
      .subscribe( posData => {

        var bar = this.chart.selectAll( "rect.x" )
          .data( posData )
          .enter()
          .append( "g" )
          .attr( "transform", ( d, i ) => `translate(${(i * this.barWidth) },0)` );

        bar.append( "rect" )
          .attr( 'class', 'x' )
          .attr( "height", x => this.height - this._y( x.x ) )
          .attr( "y", d => this._y( d.x ) )
          .attr( "width", this.barWidth )
          .attr( "fill", ( d, i ) => {
            let diff = Math.abs( ( posData.length > 1 ) ? posData[ i ].x - posData[ i - 1 ].x : 0 );
            return `rgb(${ (Math.floor(diff * this.incScale) + this.colorIntensity ) }, 0, 0 )`;
          } )
          .attr( 'opacity', 0.5 );;
        var ybar = this.chart.selectAll( "rect.y" )
          .data( posData )
          .enter()
          .append( "g" )
          .attr( "transform", ( d, i ) => `translate(${(i * this.barWidth) },0)` );

        ybar.append( "rect" )
          .attr( 'class', 'y' )
          .attr( "height", x => this.height - this._y( x.y ) )
          .attr( "y", d => this._y( d.y ) )
          .attr( "width", this.barWidth )
          .attr( "fill", ( d, i ) => {
            let diff = Math.abs( ( posData.length > 1 ) ? posData[ i ].y - posData[ i - 1 ].y : 0 );
            return `rgb(${0, (Math.floor(diff * this.incScale) + this.colorIntensity ) }, 0 )`;
          } )
          .attr( 'opacity', 0.5 );


        this.chart.selectAll( 'line.x' )
          .data( posData )
          .enter()
          .append( "g" )
          .append( 'line' )
          .attr( 'class', 'x' )
          .attr( 'x1', ( d, i ) => ( posData.length > 1 ) ? ( i - 1 ) * this.barWidth : 0 )
          .attr( 'y1', ( d, i ) => ( posData.length > 1 ) ? this._y( posData[ i - 1 ].x ) : 0 )
          .attr( 'x2', ( d, i ) => ( posData.length > 1 ) ? i * this.barWidth : 0 )
          .attr( 'y2', ( d, i ) => ( posData.length > 1 ) ? this._y( posData[ i ].x ) : 0 )
          .attr( 'stroke', "black" )
          .attr( 'stroke-width', "2" );

        this.chart.selectAll( 'line.y' )
          .data( posData )
          .enter()
          .append( "g" )
          .append( 'line' )
          .attr( 'class', 'y' )
          .attr( 'x1', ( d, i ) => ( posData.length > 1 ) ? ( i - 1 ) * this.barWidth : 0 )
          .attr( 'y1', ( d, i ) => ( posData.length > 1 ) ? this._y( posData[ i - 1 ].y ) : 0 )
          .attr( 'x2', ( d, i ) => ( posData.length > 1 ) ? i * this.barWidth : 0 )
          .attr( 'y2', ( d, i ) => ( posData.length > 1 ) ? this._y( posData[ i ].y ) : 0 )
          .attr( 'stroke', "white" )
          .attr( 'stroke-width', "2" );
      } );
  }
}