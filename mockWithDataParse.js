d3.queue()
	.defer(d3.csv, "patientInfo.csv")
	.defer(d3.csv, "codes.csv")
	.defer(d3.csv, "colorCodes.csv")
	.await(drawChord);
	
function drawChord(error, patientInfo, codes, colorCodes) {
	if (error) throw error;

	var diseaseNames=[], colors=[], length=0;
	length=codes.length;
	for (var i=0; i<length; i++) {
		diseaseNames.push(codes[i].Name);
		colors.push(colorCodes[i].Color);
	}
	
	var matrix=new Array(length);
	for (var row=0; row<length; row++) {
	    matrix[row] = new Array(length);
		matrix[row].fill(0);
	}
	
	for (var p=0; p<patientInfo.length; p++) {
		var symptoms=[];
		if (patientInfo[p].Symptom1 != "") symptoms.push(parseInt(patientInfo[p].Symptom1));
		if (patientInfo[p].Symptom2 != "") symptoms.push(parseInt(patientInfo[p].Symptom2));
		if (patientInfo[p].Symptom3 != "") symptoms.push(parseInt(patientInfo[p].Symptom3));
		if (patientInfo[p].Symptom4 != "") symptoms.push(parseInt(patientInfo[p].Symptom4));
		
		if (symptoms.length == 0) {
			continue;
		} else if (symptoms.length == 1) {
			matrix[symptoms[0]][symptoms[0]]++;
		} else if (symptoms.length == 2) {
			matrix[symptoms[0]][symptoms[1]]++;
			matrix[symptoms[1]][symptoms[0]]++;
		} else {
			for (var s1=0; s1<symptoms.length; s1++) {
				for (var s2=s1+1; s2<symptoms.length; s2++) {
					matrix[symptoms[s1]][symptoms[s2]]++;
					matrix[symptoms[s2]][symptoms[s1]]++;
				}
			}
		}
	}

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
		.range(colors);

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
}