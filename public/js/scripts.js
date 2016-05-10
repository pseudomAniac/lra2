$(document).ready(function() {
  $('li.dropdown:last').attr('style','margin-right:50px');
	$('.datepicker').datepicker(
	{
		dateFormat: 'MM d yy',
		showAnim: 'fade'
	});
	// $('[data-toggle="popover"]').popover(); 
	$('[data-toggle="tooltip"]').tooltip(); 
	$('circle.tooltip').tooltip();
});