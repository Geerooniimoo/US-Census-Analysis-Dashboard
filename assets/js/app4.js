
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

var circles = svg.append('g').attr('class','circles');

var xScaleLoc = svg
    .append('g')
    .attr('transform',`translate(${.10*width},${.85*height})`);

var yScaleLoc = svg
    .append('g')
    .attr('transform',`translate(${.10*width},${.85*height})`);

d3.csv('assets/data/data.csv').then(data => {

    data.forEach(obj => {
        circles.append('g').attr('class','circle');
    });
} );

showData();

function showData() {
    
    var xSel = d3.selectAll('.x').filter('.active').attr('data-id');
    var ySel = d3.selectAll('.y').filter('.active').attr('data-id');

    d3.csv('assets/data/data.csv').then(data => {
        csvData = data;
        
        var abbr = data.map(obj => obj.abbr)
        var xVal = data.map(obj => +obj[xSel])
        var yVal = data.map(obj => +obj[ySel])

        // console.log(xVal.min());
        var xScaler = d3.axisBottom(d3.scaleLinear()
        .domain([d3.min(xVal),d3.max(xVal)])
        .range([0,.80*width]));

        xScaleLoc.transition().duration(1000).call(xScaler);

        var yScaler = d3.axisLeft(d3.scaleLinear()
        .domain([d3.min(yVal),d3.max(yVal)])
        .range([0,-.75*height]));

        yScaleLoc.transition().duration(1000).call(yScaler);

        d3.selectAll('.circle').each(function(obj, i){
            d3
                .select(this)
                .append('circle')
                .attr('r',10)
                .attr('class','stateCircle')

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