d3.csv("assets/data/data.csv").then(function (data) {
    visualize(data);
});

var width = parseInt(d3.select("#scatter").style("width"));
var height = width - width / 3.9;
var margin = 20;
var labelArea = 110;
var tPadLeft = 40;
var tPadBot = 40;
var cirRadius;

var leftTextX=margin+tPadLeft;
var leftTextY=(height+labelArea)/2-labelArea;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "chart");

svg.append("g").attr("class", "xText");
svg.append("g").attr("class", "yText");

var xText = d3.select(".xText");
var yText = d3.select(".yText");

xText.append("text").attr("y", -26).attr("data-name", "poverty")
    .attr("data-axis","x").attr("class", "aText active x")
    .text("In Poverty (%)");
xText.append("text").attr("y", 0).attr("data-name", "age")
    .attr("data-axis","x").attr("class", "aText inactive x")
    .text("Age (Median)");
xText.append("text").attr("y", 26).attr("data-name", "income")
    .attr("data-axis","x").attr("class", "aText inactive x")
    .text("Household (Median)");

yText.append("text").attr("y",-26).attr("data-name","obesity")
    .attr("data-axis","y").attr("class","aText aciive y")
    .text("Obese (%)");
yText.append("text").attr("y",0).attr("data-name","smokes")
    .attr("data-axis","y").attr("class","aText inaciive y")
    .text("Smokes (%)");
yText.append("text").attr("y",26).attr("data-name","healthcare")
    .attr("data-axis","y").attr("class","aText inaciive y")
    .text("Lacks Healthcare (%)");

var circRadius;
crGet = () => width <= 530 ? circRadius = 5 : circRadius = 10; 
crGet();

xTextRefresh = () => {
    xText.attr(
        "transform",
        `translate(${((width - labelArea) / 2 + labelArea)},${(height - margin - tPadBot)})`
    )
};
xTextRefresh();

yTextRefresh = () => {
    yText.attr(
        "transfom",
        `translate(${leftTextX},${leftTextY})rotate(-90)`
    );
};
yTextRefresh();

visualize = theData => {
    var xMin;
    var xMax;
    var yMin;
    var yMax;
    var curX="poverty";
    var curY="obesity";

    xMinMax = () => {
        xMin=d3.min(theData,  d => parseFloat(d[curX])*0.90);
        xMax=d3.max(theData, d => parseFloat(d[curX])*1.10);
    };
    xMinMax();

    yMinMax = () => {
        yMin=d3.min(theData, d => parseFloat(d[curY])*0.90);
        yMax=d3.max(theData, d => parseFloat(d[curY])*1.10);
    };
    yMinMax();

    var xScale=d3
        .scaleLinear()
        .domain([xMin, xMax])
        .range([margin+labelArea,width-margin]);
    
    var yScale=d3
        .scaleLinear()
        .domain([yMin,yMax])
        .range([height-margin-labelArea,margin]);

    var toolTip=d3
        .tip()
        .attr("class","d3-tip") 
        .offset([40,-60])
        .html(function (d) {
            var theX;
            var theState=`<div>${d.state}</div>`;
            var theY=`<div>${curY}:${d[curY]}%</div>`;
            if (curX==="poverty") {
                theX=`<div>${curX}:${d[curX]}%</div>`;
            } else {
                theX=`<div>${curX}:${parseFloat(d[curX]).toLocaleString("en")}</div>`;
            }
            return theState+theX+theY;
        });
    svg.call(toolTip);

    var theCircles=svg.selectAll("g theCircles").data(theData).enter();

    theCircles.append("circle")
        .attr("cx",d => xScale(d[curX]))
        .attr("cy",d => yScale(d[curY]))
        .attr("r",circRadius)
        .attr("class",d => `stateCircle ${d.abbr}`)
        .on("mouseover",d => {
            toolTip.show(d, this);
            d3.select(this).style("stroke","#323232");
        });

    var xAxis=d3.axisBottom(xScale);
    var yAxis=d3.axisLeft(yScale);

    svg.append("g")
        .call(xAxis)
        .attr("class","xAxis")
        .attr("transform",`translate(0,${height-margin-labelArea})`);

    svg.append("g")
        .call(yAxis)
        .attr("class","yAxis")
        .attr("transform",`translate(${margin+labelArea},0)`);

    function tickCount() {
        if (width<=500) {
            xAxis.ticks(5);
            yAxis.ticks(5);
        }
    };
    tickCount();

    labelChange = (axis,clickedText) => {
        d3.select(".aText")
            .filter("."+axis)
            .filter(".active")
            .classed("active",false)
            .classed("inactive",true);
        
        clickedText.classed("inactive",false).classed("active",true);
    }
}



