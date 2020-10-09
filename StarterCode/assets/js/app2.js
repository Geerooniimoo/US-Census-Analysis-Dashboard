
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
    margin = .1*width;
    pad = .05*width;
    radius = .02*width;
     
// X AND Y INITIAL VALUE
    yValue = 'obesity';
    xValue = 'poverty';

// MIN/MAX FUNCTION
    minMaxFx = value => {
        min = d3.min(data.map(data => data[value]))*0.90;
        max = d3.max(data.map(data => data[value]))*1.10;
        return [min, max]
    };

// MIN AND MAX VALUES
    xMinMax = minMaxFx(xValue);
    yMinMax = minMaxFx(yValue);
    
// CREATE SVG
    svg = d3
        .select('#scatter')
        .append('svg')
        // .style('border','2px solid black')
        // .style('margin-left',margin)
        .attr('width',width)
        .attr('height',height);

// X TEXT
    xText = svg
        .append('g')
        .attr('transform',  `translate(${width/2+pad},${height-pad})`);
    
    xText
        .append('text')
        .text('In Poverty (%)')
        .attr('class','x active')
        .attr('y',-20);
    
    xText
        .append('text')
        .text('Age (Medium)')
        .attr('class','x inactive');

    xText
        .append('text')
        .text('Household Income (Medium)')
        .attr('class','x inactive')
        .attr('y',20);
    
// Y TEXT
    yText = svg
        .append('g')
        .attr('transform',`translate(${pad},${height/2-pad})rotate(-90)`);

    yText
        .append('text')
        .text('Smokers (%)')
        .attr('class','y inactive');

    yText
        .append('text')
        .text('Lacks Healthcare (%)')
        .attr('class','y inactive')
        .attr('y',20)

    yText
        .append('text')
        .text('Obese (%)')
        .attr('class','y active')
        .attr('y',-20)

// SCALES
    xScale = d3
        .scaleLinear()
        .domain(xMinMax)
        .range([2*margin, width-pad]);

    svg
        .append('g')
        .call(d3.axisBottom(xScale))
        .attr('transform',`translate(0,${height - margin - pad})`);

    yScale = d3
        .scaleLinear()
        .domain(yMinMax)
        .range([0, height - 2*margin])

    svg
        .append('g')
        .call(d3.axisLeft(yScale))
        .attr('transform',`translate(${margin+pad})`)
            
// CIRCLES
    circles = svg
        .append('g')
        .selectAll('circle')
        .data(data)
        .enter();
        
        
    circles
        .append('circle')
        .attr('class','stateCircle')
        .attr('r',radius)
        .attr('cx', d => xScale(d[xValue]))
        .attr('cy', d => yScale(d[yValue]))
        .transition()
        .duration(1000)
        
    circles
        .append('text')
        .attr('class','stateText')
        .text(d=>d.abbr)
        .attr('dx',d=>xScale(d[xValue]))
        .attr('dy',d=>yScale(d[yValue]) + radius/2.5)
        .transition()
        .duration(1000)


});

