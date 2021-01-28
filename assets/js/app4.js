
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
    .attr('class','aText x inactive')
    
xText
    .append('text')
    .attr('y',-25)
    .attr('data-id','age')
    .text('Age (median)')
    .attr('class','aText x inactive')
    
xText
    .append('text')
    .attr('y',-50)
    .attr('data-id','poverty')
    .text('In Poverty (%)')
    .attr('class','aText x active')

var yText = svg.append('g').attr('transform',`translate(20,${height/2})rotate(-90)`);

yText
    .append('text')
    .attr('data-id','obesity')
    .text('Obese (%)')
    .attr('class','aText y active')
    
yText
    .append('text')
    .attr('y',25)
    .attr('data-id','smokes')
    .text('Smokes (%)')
    .attr('class','aText y inactive')
    
yText
    .append('text')
    .attr('y',50)
    .attr('data-id','poverty')
    .text('Lacks Healthcare (%)')
    .attr('class','aText y inactive')

showData();

function showData() {
    
    var xSel = d3.selectAll('.x').filter('.active').attr('data-id');
    var ySel = d3.selectAll('.y').filter('.active').attr('data-id');

    console.log(ySel);
    
    d3.csv('assets/data/data.csv').then(data => {
        var abbr = data.map(obj => obj.abbr)
        var xVal = data.map(obj => +obj[xSel])
        var yVal = data.map(obj => +obj[ySel])
        console.log(abbr);
    });
};