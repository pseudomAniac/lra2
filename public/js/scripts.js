$(document).ready(function() {
	var cty = $('html').data().country;
	if (cty === 'home') {
		$('.site-title').remove();
		$('#datepicker-counter').remove();
		$('#sidebar-navigation').attr('style','padding-top: 3em;')
	};
	
// animate on mobile screen devices
$('#lsbMobileMenu').on('click', function() {
	$('aside').removeClass('col-xs-offset-12');
	$('#lsbMobileMenu').toggleClass('btn-info');
	$('#lsbMobileMenu i').removeClass('glyphicon-chevron-left');
	$('#lsbMobileMenu i').addClass('glyphicon-chevron-right');
});

$('#lsbMobileMenu i.glyphicon-chevron-right').on('click', function() {
	$('aside').addClass('col-xs-offset-12');
	$('#lsbMobileMenu').toggleClass('btn-info');
	$('#lsbMobileMenu i').removeClass('glyphicon-chevron-right');
	$('#lsbMobileMenu i').addClass('glyphicon-chevron-left');
})
	
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