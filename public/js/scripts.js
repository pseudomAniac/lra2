$(document).ready(function() {
	var cty = $('html').data().country;
	if (cty === 'home') {
		$('.site-title').remove();
		$('#datepicker-counter').remove();
		$('#sidebar-navigation').attr('style','padding-top: 3em;')
	}
  $('li.dropdown:last').attr('style','margin-right:50px');
	$('.datepicker').datepicker(
	{
		dateFormat: 'MM d yy',
		showAnim: 'fade'
	});
	// $('[data-toggle="popover"]').popover(); 
	$('[data-toggle="tooltip"]').tooltip(); 
	$('circle.tooltip').tooltip();
	$("#export-btn").click(function(){
	  $("table").tableToCSV();
	});
});