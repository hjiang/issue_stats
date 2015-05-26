/* global $ */
/* global Chart */
$(function() {
	$.getJSON('/issue_data.json', function(data) {
		var ctx = document.getElementById("issues-activity-chart").getContext("2d");
		var chartData = {
			name: 'Issues',
			labels: data.dates,
			datasets: [
				{
					label: 'Opens',
					data: data.opens,
					strokeColor: "rgba(250, 105, 0, 1)",
					pointColor: "rgba(250, 105, 0, 1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(250, 105, 0, 1)",
				},
				{
					label: 'Closes',
					data: data.closes,
					strokeColor: "rgba(167, 219, 216, 1)",
					pointColor: "rgba(167, 219, 216, 1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(167, 219, 216, 1)",
				}
			]
		};
		var issuesChart = new Chart(ctx).Line(chartData, {
			datasetFill: false,
			responsive: false,
			multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>",
			legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
		});
		return issuesChart;
	});
});