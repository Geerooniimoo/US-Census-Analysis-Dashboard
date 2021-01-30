
var width = parseFloat(d3.select('#scatter').style('width'));
var height = .66*width;

var svg = d3
    .select('#scatter')
    .append('svg')
    .style('width',width)
    .style('height',height)
    .style('border','2px solid black')
    .style('border-radius','12px');

var xText = svg.append('g').attr('transform',`translate(${width/2},${.98*height})`);

xText
    .append('text')
    .attr('data-id','income')
    .text('Household Income (median)')
    .attr('class','aText x inactive');
    
xText
    .append('text')
    .attr('y',-25)
    .attr('data-id','age')
    .text('Age (median)')
    .attr('class','aText x inactive');
    
xText
    .append('text')
    .attr('y',-50)
    .attr('data-id','poverty')
    .text('In Poverty (%)')
    .attr('class','aText x active');

var yText = svg.append('g').attr('transform',`translate(20,${height/2})rotate(-90)`);

yText
    .append('text')
    .attr('data-id','obesity')
    .text('Obese (%)')
    .attr('class','aText y active');
    
yText
    .append('text')
    .attr('y',25)
    .attr('data-id','smokes')
    .text('Smokes (%)')
    .attr('class','aText y inactive');
    
yText
    .append('text')
    .attr('y',50)
    .attr('data-id','poverty')
    .text('Lacks Healthcare (%)')
    .attr('class','aText y inactive');

var chart = svg.append('g').attr('transform',`translate(${.10*width},${.85*height})`);
var xScaleLoc = chart.append('g').transition().duration(2000);
var yScaleLoc = chart.append('g').transition().duration(2000);
// var xScaleLoc = svg
//     .append('g');

// var yScaleLoc = svg
//     .append('g');

d3.csv('assets/data/data.csv').then(data => {
    // xScale = xScaleLoc.call(d3.axisBottom(xScaler))
    
    // yScale = yScaleLoc.call(d3.axisLeft(yScaler))
    
    data.forEach(obj => {
        chart.append('g').attr('class','circles');
    });
} ).then(showData);

// showData();

function showData() {
    
    var xSel = d3.selectAll('.x').filter('.active').attr('data-id');
    var ySel = d3.selectAll('.y').filter('.active').attr('data-id');

    d3.csv('assets/data/data.csv').then(data => {
        csvData = data;
        
        var abbr = data.map(obj => obj.abbr)
        xVal = data.map(obj => +obj[xSel])
        yVal = data.map(obj => +obj[ySel])

        // console.log(xVal.min());
        xScaler = d3.scaleLinear().range([.8*width,0])
        xScaleLoc.call(d3.axisBottom(xScaler));

        yScaler = d3.scaleLinear().range([0,-.75*height])
        yScaleLoc.call(yScaler.domain([d3.min(yVal),d3.max(yVal)]));

        yScaleLoc.transition().duration(1000).call(d3.axisLeft(yScaler));

        d3.selectAll('.circle').each(function(obj, i){
            d3
                .select(this)
                .append('circle')
                .attr('r',10)
                .attr('class','stateCircle')
                .attr('cx',xScaler(xVal[i]))
                .attr('cy',yScaler(yVal[i]))
        });        
    });
};

d3.selectAll('.aText').on('click', function () {
    let sel = d3.select(this);
    console.log(sel.classed('x'));
    if(sel.classed('x')){
        d3.selectAll('.x').filter('.active').classed('active',false).classed('inactive',true);
    } else {
        d3.selectAll('.y').filter('.active').classed('active',false).classed('inactive',true);
    };
    
    sel.classed('inactive',false).classed('active',true);
    showData();
});