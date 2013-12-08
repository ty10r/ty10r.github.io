$(document).ready(function() {
	// Setup Swipe Object
	var elem = document.getElementById('pageSwipe');
	window.pageSwipe = Swipe(elem, {
		startSlide: 0,
		speed: 400,
		stopPropagation: false,
	  callback: function(index, elem) {},
	  transitionEnd: function(index, elem) {}
	});

	// Stick Navbar on Scroll
	var win = $(window);
	var filter = $('nav');
	var filterSpacer = $('<div />', {
      "class": "filter-drop-spacer",
      "height": filter.outerHeight()
    });
	win.scroll(function(){     
		if(!filter.hasClass('fix') && win.scrollTop() > filter.offset().top){
			filter.before(filterSpacer);
			filter.addClass("fix");
		} else if (filter.hasClass('fix')  && win.scrollTop() < filterSpacer.offset().top){
			filter.removeClass("fix");
			filterSpacer.remove();
		}
	});

	// Navbar State
	var nav = new Nav();
	nav.SetPos( pageSwipe.getPos() );


	// Bind Key Navigation
	$(document).keydown(function(key) {
		switch(key.which) {
			case 37: // Left
				pageSwipe.prev();
				nav.SetPos( pageSwipe.getPos() );
				break;
			case 39: // Right
				pageSwipe.next();
				nav.SetPos( pageSwipe.getPos() );
				break;
		}
		key.preventDefault();
	});

});


var Nav = function() {
	var self = this;
	var currentPos = 0;

	self.SetPos = function( pos ) {
		$('#pos-' + currentPos).removeClass( "active" );
		$('#pos-' + pos).addClass( "active" );
		currentPos = pos;
	}
};