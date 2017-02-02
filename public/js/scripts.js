$(document).ready(function() {
	var cty = $('html').data().country;
	if (cty === 'home') {
		$('.site-title').remove();
		$('#datepicker-counter').remove();
		$('#sidebar-navigation').attr('style','padding-top: 3em;')
	// configure accordion
	var accord = $(".accordion"), i;
	for (i = 0; i<accord.length; i++) {
		acc[i].onclick = function() {
			this.classList.toggle("active");
			this.nextElementSibling.classList.toggle("hidden");
		}
	}
	};

	// animate on mobile screen devices
	$('#lsbMobileMenu').on('click', function() {
		$('#sidebar-navigation').toggleClass('col-xs-offset-12');
		$('#lsbMobileMenu i').toggleClass('fa-chevron-left').toggleClass('fa-chevron-right');
	});
  $('li.dropdown:last').attr('style','margin-right:50px');
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
	$(".publication-date")
		.toArray()
		.forEach((dte,i)=>{
			// console.log(dte.text);
			var nd = new Date(dte.text)
			$(".publication-date:nth-child("+i+")")
				.text(() => {
					return nd.getMonth()+", "+nd.getFullYear()+", "+nd.getDate();
					// console.log(nd)
				})
			})
	// var nd = $(".publication-date")
	// 				.toArray()
	// 				.forEach(function(dte,i) {
	// 					$(".publication-date:nth-child("+i+")").text(new Date(dte.text))
	// 				})
});