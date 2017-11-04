import d3 from 'd3';
import Rx from 'rxjs';

export default class d3Graph {
    constructor(id, samples, height) {
        this.container = d3.select(id).append('svg').append('g');
        this.height = height
        this.samples = samples;
        this.data = [];
        this.windowWidth = //                          Minus wrapping padding / per sample
            document.getElementById('wrapper').offsetWidth - 20 - samples * 2;

        var moves = Rx.Observable.fromEvent(document, 'mousemove')
            .map(x => ({x: x.clientX , y : x.clientY}))
            .take(this.samples)
            .scan((acc, cur) => [...acc ,cur],[])
            .subscribe( posData => {
                this.data = posData;
                let barWidth = document.getElementById('wrapper').offsetWidth / this.samples,
                    incScale = 255/this.height ;

                let _x = d3.scale.linear()
                    .domain([0, document.getElementById('wrapper').offsetWidth])
                    .range([0, this.height ]);

                let chart = d3.select(".chart")
                    .attr("height", this.height)
                    .attr("width", barWidth * this.data.length);

                var bar = chart.selectAll("g")
                    .data(this.data)
                    .enter().append("g")
                    .attr("transform", (d, i) => {
                        let xTransform = i * barWidth;
                        let yTransform = this.height - _x(d.x);
                        return `translate(${xTransform},${yTransform})`; });

                bar.append("rect")
                    .attr("height", x => _x(x.x) )
                    .attr("width", barWidth - 1)
                    .attr("fill", (d,i) => {
                        let diff
                            = Math.abs(( posData.length > 1) ? posData[i].x - posData[i-1].x : 0);
                        return `rgb(${ (Math.floor(diff * incScale) ) }, 0, 0 )`;
                    });
            });
    }
}
