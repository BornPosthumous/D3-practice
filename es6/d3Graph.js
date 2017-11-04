import d3 from 'd3';
import Rx from 'rxjs';

export default class d3Graph {
    constructor(id, samples) {
        this.container = d3.select(id).append('svg').append('g');
        this.samples = samples;
        this.data = [];
        this.windowWidth = //                          Minus Padding
            document.getElementById('wrapper').offsetWidth - 20 - samples * 2;

        var keyups = Rx.Observable.fromEvent(document, 'mousemove')
            .map(x => ({x: x.clientX , y : x.clientY}))
            .take(this.samples)
            .scan((acc, cur) => [...acc ,cur],[])
            .subscribe(x => {
                this.data = x;
                console.log("X", x);
                let inc  = (255/this.data.length);
                d3.select(".chart2")
                    .selectAll("div")
                    .data(this.data)
                    .enter()
                    .append("div")
                    .style("height", function(d,i) { return d.y + "px"; })
                    .style('background-color' , function(d,i){
                        let indexInc = Math.floor(i * inc);
                        return `rgb(0, 0, ${indexInc})`;
                    })
                    .style('width', (d,i) => {
                        console.log(this.windowWidth / this.data.length);
                        return this.windowWidth / this.samples + 'px';
                    })

                    .text(function(d) { return d.y; });
            });

    }

}
