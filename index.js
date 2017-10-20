const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
var JSONdata = [],
		chartPoints,
		dates = [], // dates array
		amount = []; // money array

const margin = 50,
		height = 600 - margin - margin,
		width = 1000 - margin - margin,
		barWidth = 3;

// get data from url, run getPoints()
var getData = () => {
	d3.json(url, (d) => {
		JSONdata.push(d.data);
		getPoints();
	});
};

/* wait for async to complete
// map dates and amounts to arrays
// run makePoints() to make points/bars for graph
*/
const getPoints = () => {

	setTimeout( () => {
		chartPoints = JSONdata[0];

		chartPoints.map( (each) => {
			var formatYear = each[0].slice(0,4);
			var formatDayMonth = each[0].slice(5);
			var formatDate = `${formatDayMonth}-${formatYear}`;
			var parseDate = d3.timeParse('%m-%d-%Y');

			dates.push(parseDate(formatDate));
			amount.push(each[1]);
		})

		makePoints();
	}, 200);
};

//
const makePoints = () => {
	// set y scale
	var y = d3.scaleLinear()
						.domain([0, d3.max(amount)])
						.range([height - margin, 0]);

	// set x scale
	var x = d3.scaleTime()
						.domain(d3.extent(dates))
						.range([0, width - margin]);

	var yAxis = d3.axisLeft(y).scale(y);
	var xAxis = d3.axisBottom(x).scale(x);

	// append tooltip div
	var div = d3.select('#chart')
			.append('div')
			.attr('class', 'tooltip')
			.style('opacity', 0);
	// append svg to body
	var svg = d3.select('#chart')
			.append('svg')
			.attr('height', height + margin)
			.attr('width', width + margin)
			.attr('transform', `translate(-${margin},-${margin})`)
			.style('background', '#c9d7d6')
			.append('g')
				.attr('transform', `translate(${margin},${margin})`);

	// append bars/rects to svg and set attributes
	svg.selectAll('rect')
			.data(amount)
			.enter()
			.append('rect')
			.attr('width', ((width - margin) / amount.length))
			.attr('height', function(d,i) {
				return y(0) - y(d);
			})
			.attr('x', function(d,i) {
				return i * ((width - margin) / amount.length);
			})
			.attr('y', function(d,i) {
				return y(d);
			})
			.attr('class', 'bar')
			.style('fill', 'rgb(61, 132, 136)')
			.on('mouseover', function(d, i) {

				var date = JSON.stringify(dates[i]);
				var year = date.substr(1,4);
				var month = date.substr(6,2);
				var quarter;
				switch(month) {
					case "01":
						quarter = "Q1"
						break;
					case "04":
						quarter = "Q2"
						break;
					case "07":
						quarter = "Q3"
						break;
					case "10":
						quarter = "Q4"
						break;
				}

				var tooltipDate = `${quarter} ${year}`;
				this.style.fill = 'rgba(61,132,136,0.5)';
				div.transition()
					.duration(200)
					.style('opacity', 0.9);
				div.html(tooltipDate + "<br/>" + amount[i])
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 30) + "px");
			})
			.on('mouseout', function() {
				this.style.fill = 'rgba(61,132,136,1)';
				div.transition()
					.duration(200)
					.style('opacity', 0);
			});

	svg.append('g').call(yAxis);
	svg.append('g')
		.attr('transform', `translate(0,${height - margin})`)
		.call(xAxis);
}

getData();
