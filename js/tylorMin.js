$(document).ready(function() {
	var win = $(window);
	// Configure pjax
	$.pjax.defaults.scrollTo = false;

	// Give pages scroll states
	var pages = [new Page(win), new Page(win), new Page(win)];

	var URL = document.URL.split('tylor.im')[1];
	if ( URL && URL[0] === '/' ) URL = null;

	// Setup Swipe Object
	var elem = document.getElementById('pageSwipe');
	window.pageSwipe = Swipe(elem, {
		startSlide: 0,
		speed: 400,
		stopPropagation: false,
	  callback: function(index, elem) {},
	  transitionEnd: function(index, elem) {}
	});

	if ( URL ) {
		var post = $( '.post[data-url=' + url +']' );
		togglePost( post, false );
		win.scrollTop($(".post[data-url="+URL+"]").offset().top);
		pageSwipe.slide( post.parent().parent().data( 'index' ), 0 );
	}

	// Stick Navbar on Scroll
	// Navbar State
	var nav = new Nav( pageSwipe.getPos() );

	var navFilter = $('nav'), baseLine = undefined;
	var filterSpacer = $('<div />', {
      "class": "filter-drop-spacer",
      "height": navFilter.outerHeight()
    });
	win.scroll(function(){ 
		var scrollTop = win.scrollTop();    
		if(!navFilter.hasClass('fix') && scrollTop > navFilter.offset().top){
			navFilter.before(filterSpacer);
			navFilter.addClass("fix");
			baseLine = scrollTop;
		} else if (navFilter.hasClass('fix')  && scrollTop < filterSpacer.offset().top){
			navFilter.removeClass("fix");
			filterSpacer.remove();
			baseLine = undefined;
		}
	});

	$(window).on("custSwipe", function( event, oldPage, newPage) {
		pages[oldPage].SavePos();
		pages[newPage].RecallState(baseLine);
		nav.SetPos( newPage );
	});

	// Bind Key Navigation
	$(document).keydown(function(key) {
		switch(key.which) {
			case 37: // Left
				pageSwipe.prev();
				break;
			case 39: // Right
				pageSwipe.next();
				break;
		}
		key.preventDefault();
	});

	// If no data loaded, pjax request, else toggle post view
	$('.expand').click(function( event ) {
		var button = $(this);
		var content = button.prev();
		var url = button.data( 'url' );
		var container = button.data( 'container' );

		if ( !content.hasClass( 'loadedPost' ) ) {
			console.log('sending pjax');
			$.pjax( {url: url, container: '#'+container} );
		}
		else {
			togglePost( button.parent(), true );
		}
	});

	$(document).on('pjax:complete', function() {
		console.log('pjax complete')
		console.log(document.URL);
		PjaxStateByUrl( document.URL.split('tylor.im')[1] );
	});
});

function togglePost( post, animate ) {
	var button = post.children( '.expand' );
	var loader = post.children( '.loader' );
	var isExpanded = button.hasClass( '.expanded' );
	var content = post.children( '.content' );

	if ( isExpanded ) {
		loader.removeClass( 'glowing' );
		button.removeClass( 'expanded' );
	}
	else {
		loader.addClass( 'glowing' );
		button.addClass( 'expanded' );
		button.html( 'v' );
	}
	if ( animate ) {
		content.css('opacity', 0)
		.slideToggle('slow')
			.animate(
	   			{ opacity: isExpanded ? 1 : 0 },
	    		{ queue: false, duration: 'slow', 
	    		complete: function(){
	    			if (isExpanded) content.show();
	    			else content.hide();
	    		}}
		);
	}
	else {
		if (isExpanded) content.show();
		else content.hide();
	}
}
function PjaxStateByUrl( url ) { 
	console.log(url)
	if ( url ) {
		var post = $( '.post[data-url=' + url +']' );
		togglePost( post, true );
		post.children( '.content' ).addClass( 'loadedPost' );
	}
}



var Nav = function( initPos ) {
	var self = this;
	var currentPos = 0;

	self.SetPos = function( pos ) {
		$('#pos-' + currentPos).removeClass( "active" );
		$('#pos-' + pos).addClass( "active" );
		currentPos = pos;
	}
	self.SetPos( initPos );
	return self;
};

var Page = function( thisWin ) {
	var self = this;
	var savedPosition = thisWin.scrollTop();

	self.SavePos = function() {
		savedPosition = thisWin.scrollTop();
	}
	self.RecallState = function( baseLine ) {
		$('body,html').animate({scrollTop: (savedPosition > baseLine) ? savedPosition : baseLine}, 200);
	}
	return self;
}