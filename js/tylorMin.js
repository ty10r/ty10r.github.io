$(document).ready(function() {
	var win = $(window);
	$.pjax.defaults.scrollTo = false;


	//*******************************************
	//* INIT CLASSES
	//*******************************************
	// Post views
	var allPosts = {};
	$( '.post' ).each( function( ind, element ) {
		var $this = $( this );
		allPosts[ $this.data( 'url' ) ] = new Post( $this.data( 'url' ) );
	});
	// Give pages scroll states
	var pages = [new Page(win), new Page(win), new Page(win)];
	// Setup Navigation
	var lastPage = 0;
	var nav = new Nav( lastPage );
	window.pageSwipe = Swipe(document.getElementById('pageSwipe') , {
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


	//*******************************************
	//* EVENT HANDLERS
	//*******************************************
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
	$('.post').click(function( event ) {
		var postObj = allPosts[ $(this).data( 'url' ) ];
		if ( !postObj.isExpanded ) {
			postObj.Load();
		}
		else {
			postObj.Close();
		}
	});

	$(document).on('pjax:complete', function() {
		var loadedPost = allPosts[ window.location.pathname ];
		loadedPost.DoneLoading();
	});

});

function PjaxStateByUrl( url ) { 
	var post = $( ".post[data-url=\"" + url +"\"]" );
	post.children( '.loader' ).removeClass( 'glowing' );
	togglePost( post, true );
	post.children( '.content' ).addClass( 'loadedPost' );
}

var Post = function( urlId ) {
	var self = this;
	var $element = $( '.post[data-url="' + urlId + '"]' );
	var $content = $( '#' + $element.data( 'container' ) );
	var $expander = $element.children( '.expand' );
	var $loader = $element.children( '.loader' );
	var isExpanded = false;
	var isLoaded = false;

	self.Loading = function() {
		$loader.addClass( 'glowing' );
	}

	self.StopLoader = function() {
		$loader.removeClass( 'glowing' );
	}

	self.ToggleContent = function( withAnimation ) {
		isExpanded = isExpanded ? false : true;
		if ( isExpanded ) {
			$expander.html( '∧' );
			$expander.removeClass( 'expanded' );
		}
		else {
			$expander.html( '∨' );
			$expander.addClass( 'expanded' );
		}
		if ( withAnimation ) {
			$content.css('opacity', isExpanded ? 0 : 1 )
			.slideToggle('slow')
				.animate(
		   			{ opacity: isExpanded ? 1 : 0 },
		    		{ queue: false, duration: 'slow' }
			);
		}
		else {
			if ( isExpanded ) content.show();
			else content.hide();
		}
	}

	self.Load = function() {
		if ( !isLoaded ) {
			self.Loading();
			$.pjax({
				url: $element.data( 'url' ),
				container: '#'+$content.attr( 'id' )
			});
		}
	}

	self.DoneLoading = function() {
		self.isLoaded = true;
		self.StopLoader();
		self.ToggleContent( true );
	}

	return self;
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