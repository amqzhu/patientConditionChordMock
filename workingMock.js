var diseaseNames = ["Coronary heart disease", "Stroke", "Lung Cancer", "Skin Cancer", "Injury", "Influenza", "Diabetes", "Depression", "High Blood Pressure", "Overweight"];
var colors20 = ["#ff1a1a", "#cc2900", "#0099ff", "#0066ff", "#c68c53", "#808080", "#00e600", "#b300b3", "#ff8533", "#ffd11a"];
//var diseaseNames = ["Coronary heart disease", "Peripheral arterial disease", "Stroke", "Lung", "Skin", "Breast", "Prostate", "Concussion", "Torn ACL", "Torn Achilles tendon", "Influenza", "Diabetes", "Hyperthyroidism", "Depression", "Anxiety", "Epilepsy", "Amnesia", "High Cholesterol", "High Blood Pressure", "Overweight"];
//var colors20 = ["#ff5c33", "#ff3300", "#cc2900", "#0099ff", "#0066ff", "#3366ff", "#3333cc", "#c68c53", "#996633", "#604020", "#808080", "#00e600", "#009900", "#b300b3", "#990099", "#ac39ac", "#732673", "#ffa64d", "#ff8533", "#e65c00"];

var matrix = [[0,2,0,0,0,0,2,0,3,2],
[2,0,0,0,0,0,2,1,2,3],
[0,0,1,0,0,1,0,1,0,1],
[0,0,0,1,0,0,0,1,1,1],
[0,0,0,0,1,0,0,0,0,0],
[0,0,1,0,0,2,0,0,1,0],
[2,2,0,0,0,0,0,0,2,3],
[0,1,1,1,0,0,0,1,0,2],
[3,2,0,1,0,1,2,0,1,4],
[2,3,1,1,0,0,3,2,4,0]];

/*var matrix = [[0,1,1,1,1,0,1,0,0,0,1,4,0,2,2,0,0,5,4,2],
[1,0,1,0,0,0,0,0,0,0,1,2,0,0,1,0,0,0,2,0],
[1,1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,1,1],
[1,0,0,0,0,0,0,0,0,0,2,0,1,0,0,0,0,0,1,0],
[1,0,0,0,0,1,0,0,0,0,1,1,0,1,1,0,0,0,1,0],
[0,0,0,0,1,0,0,0,0,0,0,0,0,2,0,0,0,0,1,0],
[1,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
[0,0,0,0,0,0,0,2,1,1,0,0,0,0,0,0,1,0,0,0],
[0,0,0,0,0,0,0,1,2,0,0,0,0,1,0,0,0,0,0,0],
[0,0,0,0,0,0,0,1,0,4,0,0,0,0,0,0,0,0,0,0],
[1,1,0,2,1,0,1,0,0,0,3,2,1,0,0,1,0,0,1,2],
[4,2,0,0,1,0,0,0,0,0,2,0,0,1,2,0,0,4,2,5],
[0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1],
[2,0,1,0,1,2,1,0,1,0,0,1,0,0,0,0,0,1,0,1],
[2,1,0,0,1,0,0,0,0,0,0,2,0,0,0,0,0,1,2,0],
[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],
[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
[5,0,1,0,0,0,0,0,0,0,0,4,0,1,1,0,0,0,1,2],
[4,2,1,1,1,1,1,0,0,0,1,2,1,0,2,1,0,1,0,2],
[2,0,1,0,0,0,0,0,0,0,2,5,1,1,0,0,0,2,2,0]];*/

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    outerRadius = Math.min(width, height) * 0.5 - 40,
    innerRadius = outerRadius - 30;

var formatValue = d3.formatPrefix(",.0", 1e3);

var chord = d3.chord()
    .padAngle(0.05)
    .sortSubgroups(d3.descending);

var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

var ribbon = d3.ribbon()
    .radius(innerRadius);

var color = d3.scaleOrdinal()
    .domain(diseaseNames)
    .range(colors20);

var g = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .datum(chord(matrix));

var group = g.append("g")
    .attr("class", "groups")
  .selectAll("g")
  .data(function(chords) { return chords.groups; })
  .enter().append("g");

var groupPath = group.append("path")
    .style("fill", function(d) { return color(d.index); })
    .attr("id", function(d, i) { return "group" + i; })
    .style("stroke", function(d) { return d3.rgb(color(d.index)).darker(); })
    .attr("d", arc);
groupPath.append("title")
    .text(function(d,i) {return diseaseNames[i];});
    
var groupText = group.append("text")
    .attr("x", 6)
    .attr("dy", 15)
    .append("textPath")
    .attr("xlink:href", function(d,i) { return "#group" + i; })
    .text(function(d,i) {return diseaseNames[i];});

groupText.filter(function(d, i) { return groupPath._groups[0][i].getTotalLength() / 2 - 20 < this.getComputedTextLength(); }).remove();

g.append("g")
    .attr("class", "ribbons")
    .selectAll("path")
    .data(function(chords) { return chords; })
    .enter().append("path")
    .attr("d", ribbon)
    .style("fill", function(d) { return "#B0B0B0"; })
    .style("stroke", function(d) { return "#686868"; });
    //.style("fill", function(d) { return color(d.target.index); })
    //.style("stroke", function(d) { return d3.rgb(color(d.target.index)).darker(); });