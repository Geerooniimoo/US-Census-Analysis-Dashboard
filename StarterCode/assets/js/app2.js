
// GET DATA 
d3.csv('assets/data/data.csv').then(data => {
    
// CHANGE STRINGS VALUES INTO NUMERIC VALUE
    data.forEach(data => {
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.poverty = +data.poverty;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.age = +data.age;
    });
    
// CREATE RESPONSIVE DIMENSIONS
    width = parseInt(d3.select('#scatter').style('width'));
    height = width - width / 3.9
    margin = 0.10*width;
    pad = 0.05*width;
    labelArea = 110;
    
// X AND Y INITIAL VALUE
    yValue = 'obese';
    xValue = 'poverty';

// MIN/MAX FUNCTIONS
    minFx = value => d3.min(data.map(data => data[value]))*0.90;
    maxFx = value => d3.max(data.map(data => data[value]))*1.10;

// MIN AND MAX VALUES
    xMin = minFx(xValue);
    xMax = maxFx(xValue);
    yMin = minFx(yValue);
    yMax = maxFx(yValue);
    
// CREATE SVG
    svg = d3
        .select('#scatter')
        .append('svg')
        .style('border','2px solid black')
        .style('margin-left',margin)
        .attr('width',width)
        .attr('height',height)

// X TEXT
    xText = svg
    .append('g')
    .attr('transform',  `translate(${width/2},${height-margin})`);
    
    xText
    .append('text')
    .text('In Poverty (%)')
    .attr('class','x active')
    .attr('y',-26);
    
    xText
    .append('text')
    .text('Age (Medium)')
    .attr('class','x inactive');

    xText
    .append('text')
    .text('Household Income (Medium)')
    .attr('class','x inactive')
    .attr('y',26);
    
// Y TEXT
    yText = svg
    .append('g')
    .attr('transform',`translate(${margin},${height/2})rotate(-90)`);

    yText
        .append('text')
        .text('Smokers (%)')
        .attr('class','y inactive');

    yText
        .append('text')
        .text('Lacks Healthcare (%)')
        .attr('class','y inactive')
        .attr('y',26)

    yText
        .append('text')
        .text('Obese (%)')
        .attr('class','y active')
        .attr('y',-26)
});