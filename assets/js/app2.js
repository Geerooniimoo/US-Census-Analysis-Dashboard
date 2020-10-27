

var { width, height, margin, radius } = createResponsiveDimensions();
var svg = createSVG(width, height);
var text = createTextOnSVG(svg, width, height);
var gxScale, gyScale, gxAxis, gyAxis;

d3.csv('assets/data/data.csv').then(csvData => {
    data = strToNumber(csvData);

    var xValue = 'poverty';
    var { xScale, xAxis } = xScaleFx(data, xValue);

    var yValue = 'healthcare';
    var { yScale, yAxis } = yScaleFx(data, yValue)

    var circles = svg.selectAll('circle').data(data).enter();
    createCircles(circles, xScale, xValue, yScale, yValue);
    createStateText(circles, xScale, xValue, yScale, yValue);

    d3.selectAll('.x, .y').on('click', function () {

        let key = d3.select(this).attr('dataId');
        if (d3.select(this).classed('x')) {
            xScale = xScaleFx(data, key);
            d3.selectAll('.x').classed('active', false).classed('inactive', 'true');
            xAxis.transition().duration(1000).call(d3.axisBottom(xScale));
            d3.selectAll('.stateCircle').transition().duration(1000).attr('cx', d => xScale(d[key]));
            d3.selectAll('.stateText').transition().duration(1000).attr('dx', d => xScale(d[key]));
        } else {
            yScale = yScaleFx(data, key)
            d3.selectAll('.y').classed('active', false).classed('inactive', 'true');
            yAxis.transition().duration(1000).call(d3.axisLeft(yScale));
            d3.selectAll('.stateCircle').transition().duration(1000).attr('cy', d => yScale(d[key]));
            d3.selectAll('.stateText').transition().duration(1000).attr('dy', d => yScale(d[key]));
        };

        d3.select(this).classed('active', true).classed('inactive', false);
    });
});

// CREATE RESPONSIVE DIMENSIONS
function createResponsiveDimensions() {
    var width = parseInt(d3.select('#scatter').style('width'));
    var height = width * 0.66;
    var margin = width * 0.10;
    var radius = .02 * width;
    return { width, height, margin, radius };
};

// CREATE SVG
function createSVG(width, height) {
    var svg = d3
        .select('#scatter')
        .append('svg')
        .style('background', 'white')
        .style('border-radius', '12px')
        .attr('width', width)
        .attr('height', height);
    return svg;
};

//CREATE TEXT ON SVG
function createTextOnSVG(svg, width, height) {
    var text = svg.append('g');
    
    var xText = text.append('g').attr('transform', `translate(${width / 2},${height})`);

    xText
        .append('text')
        .text('In Poverty (%)')
        .attr('dataId', 'poverty')
        .attr('class', 'x active')
        .attr('y', -75);

    xText
        .append('text')
        .text('Age (Medium)')
        .attr('dataId', 'age')
        .attr('class', 'x inactive')
        .attr('y', -50);

    xText
        .append('text')
        .text('Household Income (Medium)')
        .attr('dataId', 'income')
        .attr('class', 'x inactive')
        .attr('y', -25);

    var yText = text.append('g').attr('transform', `translate(0,${height / 2})rotate(-90)`);

    yText
        .append('text')
        .text('Obese (%)')
        .attr('dataId', 'obesity')
        .attr('class', 'y active')
        .attr('y', 25);

    yText
        .append('text')
        .text('Smokers (%)')
        .attr('dataId', 'smokes')
        .attr('class', 'y inactive')
        .attr('y', 50);

    yText
        .append('text')
        .text('Lacks Healthcare (%)')
        .attr('dataId', 'healthcare')
        .attr('class', 'y inactive')
        .attr('y', 75);

    return text;
};


function strToNumber(data) {
    data.forEach(data => {
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.poverty = +data.poverty;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.age = +data.age;
    });
    return data;
};

// X MIN/MAX FUNCTION
function xMinMaxFx(data, value) {
    xMin = d3.min(data, d => d[value])*0.94;
    xMax = d3.max(data, d => d[value])*1.042;
    return [xMin, xMax]
};
// Y MIN/MAX FUNCTION
function yMinMaxFx(data, value) {
    yMin = d3.min(data, d => d[value]);
    yMax = d3.max(data, d => d[value])*1.40;
    return [yMin, yMax]
};

// CREATE X SCALES
function xScaleFx(data, xValue) {

    var xScale = d3.scaleLinear().domain(xMinMaxFx(data, xValue)).range([margin, width - margin]);

    var xAxis = createXaxis(xScale);

    return {xScale, xAxis};
};

function createXaxis(xScale) {
    var xAxis = svg.append('g').attr('transform', `translate(0,${height - margin})`);
    xAxis.call(d3.axisBottom(xScale));
    return xAxis;
};

function yScaleFx(data, yValue) {
    var yScale = d3.scaleLinear().domain(yMinMaxFx(data, yValue)).range([height - margin * 2, 0]);

    var yAxis = createYaxis(yScale);

    return { yScale, yAxis };
};

function createYaxis(yScale) {
    var yAxis = svg.append('g').attr('transform', `translate(${margin},${margin})`);
    yAxis.call(d3.axisLeft(yScale));
    return yAxis;
};

// CREATE CIRCLES
function createCircles(circles, xScale, xValue, yScale, yValue) {
    circles
        .append('circle')
        .attr('class', 'stateCircle')
        .attr('r', radius)
        .attr('cx', data => xScale(data[xValue]))
        .attr('cy', data => yScale(data[yValue]));
};

function createStateText(circles, xScale, xValue, yScale, yValue) {
    circles
        .append('text')
        .attr('class', 'stateText')
        .text(data => data.abbr)
        .attr('dx', data => xScale(data[xValue]))
        .attr('dy', data => yScale(data[yValue]) + radius / 3)

};