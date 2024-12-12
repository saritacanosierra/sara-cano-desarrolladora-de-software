(function($) {
    "use strict";
	
	/* ..............................................
    Slider Inicio
    ................................................. */
	
	$('#slides').superslides({
		inherit_width_from: '.cover-slides',
		inherit_height_from: '.cover-slides',
		play: 5000,
		animation: 'fade',
	});

	/* ..............................................
    Slider Galería
    ................................................. */
	
	
	$( ".cover-slides ul li" ).append( "<div class='fondo-background'></div>" );
		
	baguetteBox.run('.tz-gallery', {
		animation: 'fadeIn',
		noScrollbars: true
	});
		
}(jQuery));

