

createResponsiveDimensions();
createSVG();
createYtextOnSVG();
createXtextOnSVG();

d3.csv('assets/data/data.csv').then(csvData => {
yValue = 'obesity';
xValue = 'poverty';
    
    data = strToNumber(csvData);
    xMinMax = minMaxFx(xValue);
    createXaxis(xMinMax);
    yMinMax = minMaxFx(yValue);
    createYaxis(yMinMax)
});

// CREATE RESPONSIVE DIMENSIONS
function createResponsiveDimensions() {
    width = parseInt(d3.select('#scatter').style('width'));
    height = width - width / 3.9;
    margin = .15 * width;
    pad = .065 * width;
    radius = .02 * width;
};

// CREATE SVG
function createSVG() {
    svg = d3
        .select('#scatter')
        .append('svg')
        .style('background', 'white')
        .style('border-radius', '12px')
        .attr('width', width)
        .attr('height', height);
};

//CREATE X TEXT ON SVG
function createXtextOnSVG() {
xText = svg.append('g').attr('transform', `translate(${width / 2},${height})`);

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
};

// CREATE Y TEXT ON SVG
function createYtextOnSVG() {
    yText = svg.append('g').attr('transform', `translate(0,${height / 2})rotate(-90)`);

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
        .attr('y', 75)
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
};
  
// MIN/MAX FUNCTION
function minMaxFx(data, value){
    min = d3.min(data, d => d[value]) * 0.90;
    max = d3.max(data, d => d[value]) * 1.10;
    return [min, max]
};

// CREATE X SCALES
function createXaxis(xMinMax) {
    xAxis = svg.append('g').attr('transform', `translate(0,${height - margin})`);
    xScale = d3.scaleLinear().domain(xMinMax).range([margin, width - margin]);
    xAxis.call(d3.axisBottom(xScale));
};

function createYaxis(yMinMax) {
    yAxis = svg.append('g').attr('transform', `translate(${margin},${margin})`);
    yScale = d3.scaleLinear().domain(yMinMax).range([height - 2 * margin, 0])
};


// GET DATA 
// d3.csv('assets/data/data.csv').then(data => {
//     csvData = data;
//     // CHANGE STRINGS VALUES INTO NUMERIC VALUE
//     data.forEach(data => {
//         data.healthcare = +data.healthcare;
//         data.obesity = +data.obesity;
//         data.poverty = +data.poverty;
//         data.income = +data.income;
//         data.smokes = +data.smokes;
//         data.age = +data.age;
//     });
        
//     // MIN/MAX FUNCTION
//     minMaxFx = value => {
//         min = d3.min(data, d => d[value]) * 0.90;
//         max = d3.max(data, d => d[value]) * 1.10;
//         return [min, max]
//     };

//     // MIN AND MAX VALUES
//     xMinMax = minMaxFx(xValue);
//     yMinMax = minMaxFx(yValue);

//     // SCALES
//     xAxis = svg.append('g').attr('transform', `translate(0,${height - margin})`);
//     xScale = d3.scaleLinear().domain(xMinMax).range([margin, width - margin]);
//     xAxis.call(d3.axisBottom(xScale));
    
//     yAxis = svg.append('g').attr('transform', `translate(${margin},${margin})`);
//     yScale = d3.scaleLinear().domain(yMinMax).range([height - 2 * margin, 0]);
//     yAxis.call(d3.axisLeft(yScale));

//     // CREATE CIRCLES
//     circles = svg.selectAll('circle').data(data).enter();

//     // ADD CIRCLES 
//     circles
//         .append('circle')
//         .attr('class', 'stateCircle')
//         .attr('r', radius)
//         .attr('cx', d => xScale(d[xValue]))
//         .attr('cy', d => yScale(d[yValue]) + margin)
//         .transition()
//         .duration(1000)

//     // ADD TEXT TO CIRCLES
//     circles
//         .append('text')
//         .attr('class', 'stateText')
//         .text(d => d.abbr)
//         .attr('dx', d => xScale(d[xValue]))
//         .attr('dy', d => yScale(d[yValue]) + margin + radius / 3)
//         .transition()
//         .duration(1000)

//     // EVENT LISTENER
//     d3.selectAll('.x, .y').on('click', function () {
//         let key = d3.select(this).attr('dataId');

//         // ACTIVATE CLICKED TEXT
//         if (d3.select(this).classed('x')) {

//             xMinMax = minMaxFx(key);
//             xScale = d3
//                 .scaleLinear()
//                 .domain(xMinMax)
//                 .range([margin, width - margin]);

//             d3.selectAll('.x').classed('active', false).classed('inactive', true);
//             d3.select(this).classed('active', true).classed('inactive', false);

//             d3.selectAll('.stateCircle').each(function () {
//                 d3.select(this).transition().duration(1000).attr('cx', d => xScale(d[key]));
//             });

//             d3.selectAll('.stateText').each(function () {
//                 d3.select(this).transition().duration(1000).attr('dx', d => xScale(d[key]));
//             })
//         } else {
//             yMinMax = minMaxFx(key);
//             yScale = d3
//                 .scaleLinear()
//                 .domain(yMinMax)
//                 .range([height - 2 * margin, 0])

//             d3.selectAll('.y').classed('active', false).classed('inactive', true);
//             d3.select(this).classed('active', true).classed('inactive', false);

//             d3.selectAll('.stateCircle, .stateText').each(function () {
//                 d3.select(this).transition().duration(1000).attr('cy', d => yScale(d[key]) + margin)
//             });
//             d3.selectAll('.stateText').each(function () {
//                 d3.select(this).transition().duration(1000).attr('dy', d => yScale(d[key]) + margin + radius / 3)
//             });
//         };
//     });
// });



















