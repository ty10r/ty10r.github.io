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

	// Give pages scroll states
	var pages = [new PageTab, new PageTab, new PageTab];
	$(window).on("custSwipe", function( event, oldPage, newPage) {
		pages[oldPage].SavePos();
		pages[newPage].RecallState();
	});

	// Slide down to show a post's contents
	$('.content').hide();
	$('.loading').css('opacity', 0);
	$('.expand').click(function( event ) {
		var button = $(this);
		var loading = new LoadAnimation( button.next() );
		var url = button.data('url');
		var container = button.data('container');
		loading.RunAnimation();
		$.pjax({url: url, container: '#'+container});
		$(document).on('pjax:complete', function() {
			var content = button.prev();
			loading.Stop();
			if ( content.is( ':hidden' ) ) {
				content.css('opacity', 0)
				   		.slideToggle('slow')
				   		.animate(
				   			{ opacity: 1 },
				    		{ queue: false, duration: 'slow' });
				button.html('∧')
			}
			else {
				content.css('opacity', 1)
				   		.slideToggle('slow')
				   		.animate(
				   			{ opacity: 0 },
				    		{ queue: false, duration: 'slow' });
				button.html('∨');
			}
		});
	});

});

var LoadAnimation = function( elem ) {
	var self = this;
	var stopped = false;
	var loader = elem;
	loader.css('opacity', 0);
	loader.css('z-index', 100);

	self.Stop = function() {
		loader.stop( true );
		loader.css('opacity', 0);
		loader.css('z-index', 0);
	};

	self.RunAnimation = function() {
		stopped = false;
		if ( loader.css('opacity') == 1 ) {
			loader.animate({ opacity: 0 }, { duration: 700, complete: function() {
				if ( stopped ) return;
				return self.RunAnimation();
			}});
		}
		else {
			loader.css('opacity', 0).animate({ opacity: 1 }, { duration: 700, complete: function() {
				if ( stopped ) return;
				return self.RunAnimation();
			}});		
		}
	};
};

var Nav = function() {
	var self = this;
	var currentPos = 0;

	self.SetPos = function( pos ) {
		$('#pos-' + currentPos).removeClass( "active" );
		$('#pos-' + pos).addClass( "active" );
		currentPos = pos;
	}
};

var PageTab = function() {
	var self = this;
	var savedPosition = $(window).scrollTop();

	self.SavePos = function() {
		savedPosition = $(window).scrollTop();
	}

	self.RecallState = function() {
		if ( $(window).scrollTop() != savedPosition ) {
			$('body,html').animate({scrollTop: savedPosition}, 200);
		}
	}
}