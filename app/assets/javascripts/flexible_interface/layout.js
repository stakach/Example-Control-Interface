//
// Change content parameters.
//
var footerH = 57;
var activePage = null;

function setHeight() {
	var headerH = $('section.ui-page-active header').height(),
		contentH = $(window).height() - headerH - footerH - 5;
		
	$('.wrapper').height(contentH + 'px');

	if (activePage.hasClass('dual-selection')) {
		if (window.innerHeight < window.innerWidth) {	// landscape
			//
			// Inputs take up 100% of the height however boxes are 80%
			//	of that height. So 10% above leaves 10% below hence
			//	centering.
			//
			headerH = activePage.find('.inputs').height() / 10;
			activePage.find('.inputs .section-box').css('margin-top', headerH + 'px');
		} else {
			activePage.find('.inputs .section-box').css('margin-top', '0px');
		}
	} else if (activePage.attr('id') == 'audio') {
		//
		// Inputs take up 100% of the height however boxes are 80%
		//	of that height. So 10% above leaves 10% below hence
		//	centering.
		//
		headerH = (contentH - $('#audio-selection').height() - $('#volume-wrapper').height()) / 2;
		$('#audio-selection').css('margin-top', headerH + 'px');
		
	} else if (activePage.hasClass('single-selection')) {
		if (window.innerHeight < window.innerWidth) {	// landscape
			//
			// Divided by 2 as lights are 50% of the height
			//	So 25% padding top leaves 25% padding bottom
			//
			headerH = (contentH - activePage.find('div.selections').height() - activePage.find('div.labels').height()) / 2;
			activePage.find('div.selections').css('margin-top', headerH + 'px');
		} else {
			activePage.find('div.selections').css('margin-top', '0px');
		}
	}
}

//
// Detect screen size and orientation changes
//
$(function () {
	$.mobile.fixedToolbars.setTouchToggleEnabled(false);
	activePage = $('section.ui-page-active');
	setHeight();
	
	$(window).bind('resize orientationchange', function (event) {
		setHeight();
	});
	
	$('body').bind('pagechange', function (event, data) {
		$.mobile.fixedToolbars.setTouchToggleEnabled(false);
		activePage = data.toPage;
		setHeight();
	});
	
	$('#cancelbtn').bind('tap', function(){
		
		history.back();
		return false;
		
	});
});

$(document).bind("mobileinit", function(){
	$.support.touchOverflow = true;
	$.mobile.touchOverflowEnabled = true;
});
