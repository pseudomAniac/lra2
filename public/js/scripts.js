$(document).ready(function() {
	// animate on mobile screen devices
	$('#lsbMobileMenu').on('click', function() {
		$('#sidebar-navigation').toggleClass('col-xs-offset-12');
		$('#lsbMobileMenu i').toggleClass('fa-chevron-left').toggleClass('fa-chevron-right');
	});

  // $('li.dropdown:last').attr('style','margin-right:50px');
	$('.datepicker').datepicker({
		dateFormat: 'MM dd yy',
		showAnim: 'fade'
	});
	// $('[data-toggle="popover"]').popover(); 
	$('[data-toggle="tooltip"]').tooltip(); 
	$('circle.tooltip').tooltip();
	$("#table-export-btn").click(function(){
	  $("#datatable").tableToCSV();
	});
	$('#shareTop5').on('click',function(){
		FB.ui({
	    method: 'share',
	    display: 'popup',
	    href: document.URL,
	  }, function(response){});
	})
});