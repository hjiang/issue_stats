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
					strokeColor: "rgba(220,220,220,1)",
					pointColor: "rgba(220,220,220,1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
				},
				{
					label: 'Closes',
					data: data.closes,
					strokeColor: "rgba(151,187,205,1)",
					pointColor: "rgba(151,187,205,1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(151,187,205,1)",
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