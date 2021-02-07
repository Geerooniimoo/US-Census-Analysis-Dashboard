var width = parseFloat(d3.select('#scatter').style('width'));
var height = .66 * width;

var svg = d3.select('#scatter').append('svg').style('width', width).style('height', height).style('border', '2px solid black').style('border-radius', '12px');
var xText = svg.append('g').attr('transform', `translate(${width / 2},${.98 * height})`);
var yText = svg.append('g').attr('transform', `translate(20,${height / 2})rotate(-90)`);
var chart = svg.append('g').attr('transform', `translate(${.15 * width},${.8 * height})`);
var xScaleLoc = chart.append('g').transition().duration(2000);
var yScaleLoc = chart.append('g').transition().duration(2000);

var aText = { 'xText': [{ 'y': 0, 'data-id': 'income', 'text': 'Household Income (median)', 'class': 'x inactive aText' }, { 'y': -25, 'data-id': 'age', 'text': 'Age (median)', 'class': 'x inactive aText' }, { 'y': -50, 'data-id': 'poverty', 'text': 'In Poverty (%)', 'class': 'x active aText' }], 'yText': [{ 'y': 0, 'data-id': 'obesity', 'text': 'Obese (%)', 'class': 'y active aText' }, { 'y': 25, 'data-id': 'smokes', 'text': 'Smokes (%)', 'class': 'y inactive aText' }, { 'y': 50, 'data-id': 'poverty', 'text': 'Lacks Healthcare (%)', 'class': 'y inactive aText' }] };

Object.entries(aText).forEach(([key, val]) => {
    key == 'xText'
        ? val.forEach(obj => {
            var text = xText.append('text')
            Object.entries(obj).forEach(([k, v]) => {
                k == 'text' ? text.text(v) : text.attr(k, v)
            });
        })
        : val.forEach(obj => {
            var text = yText.append('text')
            Object.entries(obj).forEach(([k, v]) => {
                k == 'text' ? text.text(v) : text.attr(k, v)
            });
        });
});

d3.csv('assets/data/data.csv').then(data => {
    var toolTip = d3.tip().attr("class", "d3-tip")
        .html(d => `<div>${d.state}</div><div>${xSel}: ${d[xSel]}${xSel=='poverty'?'%':''}</div><div>${ySel}: ${d[ySel]} %</div>`);

    var circles = chart.selectAll('g').data(data).enter().append('g').on("mouseover", function (d) {
        toolTip.show(d, this);
        d3.select(this).style("stroke", "#e3e3e3");
    })
    .on("mouseout", function (d) {
        toolTip.hide(d);
        d3.select(this).style("stroke", "#323232");
    });
    circles.append('circle').attr('r', .02 * width).attr('class', 'stateCircle');
    circles.append('text').attr('class', 'stateText');

    showCircles();

    function showCircles() {
        xSel = d3.selectAll('.x').filter('.active').attr('data-id');
        ySel = d3.selectAll('.y').filter('.active').attr('data-id');

        var xVal = data.map(obj => +obj[xSel])
        var yVal = data.map(obj => +obj[ySel])

        var xScaler = d3.scaleLinear().range([0, .8 * width]).domain([.95 * d3.min(xVal), 1.02 * d3.max(xVal)]);
        xScaleLoc.call(d3.axisBottom(xScaler));

        var yScaler = d3.scaleLinear().range([0, -.75 * height]).domain([.9 * d3.min(yVal), 1.05 * d3.max(yVal)]);
        yScaleLoc.call(d3.axisLeft(yScaler));

        d3.selectAll('.stateCircle').transition().duration(1000).attr('cx', d => xScaler(d[xSel])).attr('cy', d => yScaler(d[ySel]))
        d3.selectAll('.stateText').transition().duration(1000).attr('dx', d => xScaler(d[xSel])).attr('dy', d => yScaler(d[ySel]) + 5).text(d => d.abbr)
    
        circles.call(toolTip);
    };

    d3.selectAll('.aText').on('click', function () {
        if (d3.select(this).classed('x')) {
            d3.selectAll('.x').filter('.active').classed('active', false).classed('inactive', true);
        } else {
            d3.selectAll('.y').filter('.active').classed('active', false).classed('inactive', true);
        };
        d3.select(this).classed('inactive', false).classed('active', true);
        showCircles();
    });
});
