
// GET DATA 
d3.csv('assets/data/data.csv').then(data => {
    csvData = data;
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
    margin = .15 * width;
    pad = .065 * width;
    radius = .02 * width;

    // CREATE SVG
    svg = d3
        .select('#scatter')
        .append('svg')
        .style('background', 'white')
        .style('border-radius', '12px')
        .attr('width', width)
        .attr('height', height);

    // X TEXT
    xText = svg
        .append('g')
        .attr('transform', `translate(${width / 2 + pad},${height - pad})`);

    xText
        .append('text')
        .text('In Poverty (%)')
        .attr('dataId','poverty')
        .attr('class', 'x active')
        .attr('y', -20);
        
        xText
        .append('text')
        .text('Age (Medium)')
        .attr('dataId','age')
        .attr('class', 'x inactive');
        
        xText
        .append('text')
        .text('Household Income (Medium)')
        .attr('dataId','income')
        .attr('class', 'x inactive')
        .attr('y', 20);
        console.log(data[10]);
        // Y TEXT
        yText = svg
        .append('g')
        .attr('transform', `translate(${pad},${height / 2 - pad})rotate(-90)`);
        
        yText
        .append('text')
        .text('Smokers (%)')
        .attr('dataId','smokes')
        .attr('class', 'y inactive');
        
        yText
        .append('text')
        .text('Lacks Healthcare (%)')
        .attr('dataId','healthcare')
        .attr('class', 'y inactive')
        .attr('y', 20)
        
        yText
        .append('text')
        .text('Obese (%)')
        .attr('dataId','obesity')
        .attr('class', 'y active')
        .attr('y', -20)

    // X AND Y INITIAL VALUE
    yValue = 'obesity';
    xValue = 'poverty';

    // MIN/MAX FUNCTION
    minMaxFx = value => {
        min = d3.min(data, d => d[value]) * 0.90;
        max = d3.max(data, d => d[value]) * 1.10;
        return [min, max]
    };

    // MIN AND MAX VALUES
    xMinMax = minMaxFx(xValue);
    yMinMax = minMaxFx(yValue);

    // SCALES
    xScale = d3
        .scaleLinear()
        .domain(xMinMax)
        .range([margin, width - margin]);

    svg
        .append('g')
        .call(d3.axisBottom(xScale))
        .attr('transform', `translate(0,${height - margin})`);

    yScale = d3
        .scaleLinear()
        .domain(yMinMax)
        .range([height - 2 * margin, 0])

    svg
        .append('g')
        .call(d3.axisLeft(yScale))
        .attr('transform', `translate(${margin},${margin})`)

    // CREATE CIRCLES
    circles = svg
        .selectAll('circle')
        .data(data)
        .enter();

    // ADD CIRCLES 
    circles
        .append('circle')
        .attr('class', 'stateCircle')
        .attr('r', radius)
        .attr('cx', d => xScale(d[xValue]))
        .attr('cy', d => yScale(d[yValue]) + margin)
        .transition()
        .duration(1000)

    // ADD TEXT TO CIRCLES
    circles
        .append('text')
        .attr('class', 'stateText')
        .text(d => d.abbr)
        .attr('dx', d => xScale(d[xValue]))
        .attr('dy', d => yScale(d[yValue]) + margin + radius / 3)
        .transition()
        .duration(1000)

    // EVENT LISTENER
    d3.selectAll('text').on('click', function () {
        let key = d3.select(this).attr('dataId');
        
    // ACTIVATE CLICKED TEXT
        if(d3.select(this).classed('x')){

            xMinMax = minMaxFx(key);
            xScale = d3
            .scaleLinear()
            .domain(xMinMax)
            .range([margin, width - margin]);
    
            d3.selectAll('.x').classed('active',false).classed('inactive',true);
            d3.select(this).classed('active',true).classed('inactive',false);
            
            d3.selectAll('.stateCircle').each(function () {
                d3.select(this).transition().duration(1000).attr('cx',d=>xScale(d[key]));
            });
            
            d3.selectAll('.stateText').each(function () {
                d3.select(this).transition().duration(1000).attr('dx',d=>xScale(d[key]));
            })
        } else {
            yMinMax = minMaxFx(key);
            yScale = d3
            .scaleLinear()
            .domain(yMinMax)
            .range([height - 2 * margin, 0])
        
            d3.selectAll('.y').classed('active',false).classed('inactive',true);
            d3.select(this).classed('active',true).classed('inactive',false);

            d3.selectAll('.stateCircle, .stateText').each(function () {
                d3.select(this).transition().duration(1000).attr('cy',d=>yScale(d[key])+margin)
            });
            d3.selectAll('.stateText').each(function () {
                d3.select(this).transition().duration(1000).attr('dy',d=>yScale(d[key]) + margin + radius / 3)
            });
        };
    });
});



















