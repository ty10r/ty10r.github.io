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
		var inactive = $('#pos-' + currentPos).attr("class").replace(" active", "");
		$('#pos-' + currentPos).attr("class", inactive);
		$('#pos-' + pos).attr("class", inactive + " active");
		currentPos = pos;
	}
};