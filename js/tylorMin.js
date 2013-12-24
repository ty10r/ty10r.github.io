$(document).ready(function() {
	var win = $(window);
	// Configure pjax
	$.pjax.defaults.scrollTo = false;

	// Give pages scroll states
	var pages = [new Page(win), new Page(win), new Page(win)];

	var URL = window.location.pathname;
	if ( URL && URL[0] === '/' ) URL = null;

	// Setup Swipe Object
	var lastPage = 0;
	var nav = new Nav( lastPage );
	var elem = document.getElementById('pageSwipe');
	window.pageSwipe = Swipe(elem, {
		startSlide: lastPage,
		speed: 400,
		stopPropagation: false,
	  callback: function(index, elem) { 
		pages[lastPage].SavePos();
		pages[index].RecallState(baseLine);
		nav.SetPos( index );
		lastPage = index;
	  },
	  transitionEnd: function(index, elem) {}
	});

	if ( URL ) {
		var post = $( ".post[data-url=\"" + url +"\"]" );
		togglePost( post, false );
		win.scrollTop($(".post[data-url=\""+URL+"\"]").offset().top);
		pageSwipe.slide( post.parent().parent().data( 'index' ), 0 );
	}

	// Stick Navbar on Scroll
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
		var loader = button.next();
		var url = button.parent().data( 'url' );
		var container = button.data( 'container' );

		if ( !content.hasClass( 'loadedPost' ) ) {
			loader.addClass( 'glowing' );
			$.pjax( {url: url, container: '#'+container} );
		}
		else {
			togglePost( button.parent(), true );
		}
	});

	$(document).on('pjax:complete', function() {
		PjaxStateByUrl( window.location.pathname );
	});

	$(window).unload( function() {
		PageStateByUrl( window.location.pathname, nav );
	});
});

function togglePost( post, animate ) {
	var button = post.children( '.expand' );
	var loader = post.children( '.loader' );
	var wasExpanded = button.hasClass( 'expanded' );
	var content = post.children( '.content' );

	if ( wasExpanded ) {
		button.html( '∨' );
		button.removeClass( 'expanded' );
	}
	else {
		button.html( '∧' );
		button.addClass( 'expanded' );
	}
	if ( animate ) {
		content.css('opacity', wasExpanded ? 1 : 0 )
		.slideToggle('slow')
			.animate(
	   			{ opacity: wasExpanded ? 0 : 1 },
	    		{ queue: false, duration: 'slow' }
		);
	}
	else {
		if ( !wasExpanded ) content.show();
		else content.hide();
	}
}

function PjaxStateByUrl( url ) { 
	var post = $( ".post[data-url=\"" + url +"\"]" );
	post.children( '.loader' ).removeClass( 'glowing' );
	togglePost( post, true );
	post.children( '.content' ).addClass( 'loadedPost' );
}

function PageStateByUrl( url, nav ) {
	if ( url ) {
		var post = $( ".post[data-url=\"" + url +"\"]" );
		togglePost( post, false );
		nav.SetPos( post.closest( 'section' ).data( 'index' ));
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