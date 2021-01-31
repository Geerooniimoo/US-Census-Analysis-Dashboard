
var width = parseFloat(d3.select('#scatter').style('width'));
var height = .66 * width;

var svg = d3
    .select('#scatter')
    .append('svg')
    .style('width', width)
    .style('height', height)
    .style('border', '2px solid black')
    .style('border-radius', '12px');

var xText = svg.append('g').attr('transform', `translate(${width / 2},${.98 * height})`);

xText
    .append('text')
    .attr('data-id', 'income')
    .text('Household Income (median)')
    .attr('class', 'aText x inactive');

xText
    .append('text')
    .attr('y', -25)
    .attr('data-id', 'age')
    .text('Age (median)')
    .attr('class', 'aText x inactive');

xText
    .append('text')
    .attr('y', -50)
    .attr('data-id', 'poverty')
    .text('In Poverty (%)')
    .attr('class', 'aText x active');

var yText = svg.append('g').attr('transform', `translate(20,${height / 2})rotate(-90)`);

yText
    .append('text')
    .attr('data-id', 'obesity')
    .text('Obese (%)')
    .attr('class', 'aText y active');

yText
    .append('text')
    .attr('y', 25)
    .attr('data-id', 'smokes')
    .text('Smokes (%)')
    .attr('class', 'aText y inactive');

yText
    .append('text')
    .attr('y', 50)
    .attr('data-id', 'poverty')
    .text('Lacks Healthcare (%)')
    .attr('class', 'aText y inactive');

var chart = svg.append('g').attr('transform', `translate(${.10 * width},${.85 * height})`);
var xScaleLoc = chart.append('g').transition().duration(2000);
var yScaleLoc = chart.append('g').transition().duration(2000);


function showData() {
    
    d3.csv('assets/data/data.csv').then(data => {
        var xSel = d3.selectAll('.x').filter('.active').attr('data-id');
        var ySel = d3.selectAll('.y').filter('.active').attr('data-id');

        d3.csv('assets/data/data.csv').then(data => {
            var abbr = data.map(obj => obj.abbr)
            xVal = data.map(obj => +obj[xSel])
            yVal = data.map(obj => +obj[ySel])

            xScaler = d3.scaleLinear().range([0, .8 * width])
                .domain([d3.min(xVal), d3.max(xVal)].map(x => x * 1.05));
            xScaleLoc.call(d3.axisBottom(xScaler));

            yScaler = d3.scaleLinear().range([0, -.75 * height])
                .domain([d3.min(yVal), d3.max(yVal)].map(x => x * .97));
            yScaleLoc.call(d3.axisLeft(yScaler));

            chart.selectAll('g').data(data).enter();
            var circle = chart.append('g')
                circle
                    .append('circle')
                    .attr('r', .02 * width)
                    .attr('class', 'stateCircle')
                    .attr('cx',d => -xScaler(d[xVal]))
                    .attr('cy', yScaler(d[yVal]))
        });
    });

    d3.selectAll('.aText').on('click', function () {
        let sel = d3.select(this);
        console.log(sel.classed('x'));
        if (sel.classed('x')) {
            d3.selectAll('.x').filter('.active').classed('active', false).classed('inactive', true);
        } else {
            d3.selectAll('.y').filter('.active').classed('active', false).classed('inactive', true);
        };

        sel.classed('inactive', false).classed('active', true);
        showData();
    });
};