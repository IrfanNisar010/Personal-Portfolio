AOS.init({
 	duration: 800,
 	easing: 'ease',
 	once: true,
 	offset: -100
});

jQuery(function($) {
	
	'use strict';
	loader();
	siteMenuClone();
	mobileToggleClick();
	onePageNavigation();
	siteIstotope();
	portfolioItemClick();
	owlCarouselPlugin();
	floatingLabel();
	scrollWindow();
	counter();
	jarallaxPlugin();
	stickyFillPlugin();
	animateReveal();
	blurTextReveal();
	blurStaggerReveal();
	liquidRippleEffect();
	blurStaggerReveal();
	luxuryButtonReveal();
	liquidRippleEffect();
	// portfolioHoverEffect(); // Moved to siteIstotope done callback
	mobileImageReveal();

});

var siteIstotope = function() {
	var $container = $('#posts').isotope({
    itemSelector : '.item',
    isFitWidth: true
  });

  $(window).resize(function(){
    $container.isotope({
      columnWidth: '.col-sm-3'
    });
  });
  
  $container.isotope({ filter: '*' });

  $('#filters').on( 'click', 'a', function(e) {
  	e.preventDefault();
    var filterValue = $(this).attr('data-filter');
    $container.isotope({ filter: filterValue });
    $('#filters a').removeClass('active');
    $(this).addClass('active');
  });

  $container.imagesLoaded()
  .progress( function() {
    $container.isotope('layout');
  })
  .done(function() {
		// Mobile Optimization: Skip ScrollMagic for images, use lightweight Observer
		// IMPORTANT: Check BEFORE wrapping images, otherwise they get hidden by .reveal-content CSS
		var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 992;
		if (isMobile) {
			mobileImageReveal();
			return; 
		}

  	$('.gsap-reveal-img').each(function() {
			var html = $(this).html();
			$(this).html('<div class="reveal-wrap"><span class="cover"></span><div class="reveal-content">'+html+'</div></div>');
		});

		// Call hover effect HERE, after DOM rewrite
		portfolioHoverEffect();

  	var controller = new ScrollMagic.Controller();

  	var revealImg = $('.gsap-reveal-img');

  	if ( revealImg.length ) {
  		var i = 0;
			revealImg.each(function() {

				var cover = $(this).find('.cover'),
					revealContent = $(this).find('.reveal-content'),
					img = $(this).find('.reveal-content img');


				var tl2 = new TimelineMax();


				setTimeout(function() {

					// Luxury Blur Reveal (No Zoom, No Wipe)
					tl2.set(cover, { display: 'none' }); // Hide the wipe cover
					tl2.set(img, { scale: 1 }); // Ensure no zoom
					tl2.set(revealContent, { autoAlpha: 0, filter: 'blur(15px)', webkitFilter: 'blur(15px)', y: 20 });

					tl2.to(revealContent, 0.8, { 
						autoAlpha: 1, 
						filter: 'blur(0px)', 
						webkitFilter: 'blur(0px)', 
						y: 0,
						ease: Power3.easeOut 
					});

				}, i * 150);

				

				var scene = new ScrollMagic.Scene({
					triggerElement: this,
					duration: "0%",
					reverse: false,
					offset: "-300%",
				})
				.setTween(tl2)
				.addTo(controller);

				i++;

			});
		}
  })

  $('.js-filter').on('click', function(e) {
  	e.preventDefault();
  	$('#filters').toggleClass('active');
  });

}

var loader = function() {
	setTimeout(function() {
		TweenMax.to('.site-loader-wrap', 1, { marginTop: 50, autoAlpha: 0, ease: Power4.easeInOut });
  }, 10);
  $(".site-loader-wrap").delay(200).fadeOut("slow");
	$("#unslate_co--overlayer").delay(200).fadeOut("slow");	
}

var siteMenuClone = function() {

	setTimeout(function() {

		$('.js-clone-nav').each(function() {
			var $this = $(this);
			$this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-inner');
		});
		
		var counter = 0;
    $('.unslate_co--site-mobile-menu .has-children').each(function(){
      var $this = $(this);
      
      $this.prepend('<span class="arrow-collapse collapsed">');

      $this.find('.arrow-collapse').attr({
        'data-toggle' : 'collapse',
        'data-target' : '#collapseItem' + counter,
      });

      $this.find('> ul').attr({
        'class' : 'collapse',
        'id' : 'collapseItem' + counter,
      });

      counter++;

    });

  }, 1000);

  // Inject Icon for Journal in Mobile Menu
  setTimeout(function() {
    $('.unslate_co--site-mobile-menu .site-nav-wrap a:contains("Journal")').prepend('<span class="icon-book" style="margin-right: 10px;"></span>');
  }, 1200);

	$('body').on('click', '.arrow-collapse', function(e) {
    var $this = $(this);
    if ( $this.closest('li').find('.collapse').hasClass('show') ) {
      $this.removeClass('active');
    } else {
      $this.addClass('active');
    }
    e.preventDefault();  
    
  });

	$(window).resize(function() {
		var $this = $(this),
			w = $this.width();

		if ( w > 768 ) {
			if ( $('body').hasClass('offcanvas') ) {
				$('body').removeClass('offcanvas');
			}
		}
	});

	$('.js-burger-toggle-menu').click(function(e){
		e.preventDefault();
		if ( $('body').hasClass('offcanvas') ) {
  		$('body').removeClass('offcanvas');
  		$('.js-burger-toggle-menu').removeClass('open');
  	} else {
  		$('body').addClass('offcanvas');	
  		$('.js-burger-toggle-menu').addClass('open');
  	}
  });

}; 




// var siteIstotope = function() {


	  
	
// }

var owlCarouselPlugin = function() {

	$('.testimonial-slider').owlCarousel({
    center: false,
    items: 1,
    loop: true,
    stagePadding: 20,
  	margin: 10,
    smartSpeed: 2000,
    autoplay: true,
    autoplayHoverPause: true,
    dots: true,
    nav: true,
    navText: ['<span class="icon-keyboard_arrow_left">', '<span class="icon-keyboard_arrow_right">'],

    responsive:{
        400:{
          stagePadding: 20,
  				margin: 10,
        },
        600:{
          stagePadding: 100,
  				margin: 50,
        }
    }
	});
	owlSingleSlider();

	if ( $('.logo-slider').length ) {

		$('.logo-slider').owlCarousel({
			center: false,
	    loop: true,
	    stagePadding: 0,
	    margin: 0,
	    smartSpeed: 800,
	    autoplay: true,
	    autoplayTimeout: 2000,
	    autoplayHoverPause: true,
	    dots: false,
	    nav: false,
	    responsive:{
		    400:{
		      items: 2
		    },
		    768:{
		    	items: 3
		    },
		    1000:{
		    	items: 5
		    }
	    }
	   });
	}

};

var owlSingleSlider = function () {
	if ( $( '.single-slider' ).length ) {
		$('.single-slider').owlCarousel({
	    center: false,
	    items: 1,
	    loop: true,
	    stagePadding: 0,
	    margin: 0,
	    smartSpeed: 1500,
	    autoplay: true,
	    autoplayHoverPause: true,
	    dots: true,
	    nav: true,
	    navText: ['<span class="icon-keyboard_arrow_left">', '<span class="icon-keyboard_arrow_right">'],

	    responsive:{
	      400:{
	        stagePadding: 0,
					margin: 0,
	      },
	      600:{
	        stagePadding: 0,
					margin: 0,
	      }
	    }
		});
	}
}

var floatingLabel = function () {
	$('.form-control').on('input', function() {
	  var $field = $(this).closest('.form-group');
	  if (this.value) {
	    $field.addClass('field--not-empty');
	  } else {
	    $field.removeClass('field--not-empty');
	  }
	});
};



// scroll
var scrollWindow = function() {
	var lastScrollTop = 0;
	var navbar = $('.unslate_co--site-nav');
	var body = $('body');
	var ticking = false;

	$(window).scroll(function(event){
		var st = $(this).scrollTop();

		if (!ticking) {
			window.requestAnimationFrame(function() {
				if (st > 150) {
					if ( !navbar.hasClass('scrolled') ) {
						navbar.addClass('scrolled');	
					}
				} 
				if (st < 150) {
					if ( navbar.hasClass('scrolled') ) {
						navbar.removeClass('scrolled sleep');
					}
				} 
				if ( st > 350 ) {
					if ( !navbar.hasClass('awake') ) {
						navbar.addClass('awake');	
					} 

					// hide / show on scroll
					if (st > lastScrollTop){
						// downscroll code
						navbar.removeClass('awake');	
						navbar.addClass('sleep');	
					} else {
						// upscroll code
						navbar.addClass('awake');	
					}
					lastScrollTop = st;
				}
				if ( st < 350 ) {
					if ( navbar.hasClass('awake') ) {
						navbar.removeClass('awake');
						navbar.addClass('sleep');
					}
				}
				ticking = false;
			});
			ticking = true;
		}
	});
};


var counter = function() {
	
	$('.section-counter').waypoint( function( direction ) {

		if( direction === 'down' && !$(this.element).hasClass('ftco-animated') ) {

			var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',')
			$(this.element).find('.number-counter').each(function(){
				var $this = $(this),
					num = $this.data('number');
				$this.animateNumber(
				  {
				    number: num,
				    numberStep: comma_separator_number_step
				  }, 
				  {
				  	easing: 'swing',
    				duration: 3000
				  }
				);
			});
			
		}

	} , { offset: '95%' } );

};


var mobileToggleClick = function() {
  var menu = $(".unslate_co--site-mobile-menu");
  var menuItems = menu.find('.site-nav-wrap li');

  // Force Initial Hidden State (Fix for menu showing on load)
  TweenMax.set(menu, { 
      transformOrigin: "100% 0%",
      scale: 0.1, 
      x: 20, 
      y: -20, 
      autoAlpha: 0, /* Ensures opacity:0 and visibility:hidden */
      borderRadius: "100px",
      filter: "blur(30px)",
      webkitFilter: "blur(30px)"
  });

  var openMenu = function() {
    $('body').addClass('offcanvas');
    $('.js-menu-toggle').addClass('active');
    if ( $('.js-burger-toggle-menu').length ) {
      $('.js-burger-toggle-menu').addClass('open');
    }
    
    // GSAP Open Animation - True Genie Effect
    // Set initial state (tiny circle near button)
    TweenMax.set(menu, { 
        transformOrigin: "100% 0%", /* Top Right Corner */
        scale: 0.1, 
        x: 20, /* Offset to match button center */
        y: -20, 
        autoAlpha: 0, 
        borderRadius: "100px", /* Start as circle */
        filter: "blur(30px)",
        webkitFilter: "blur(30px)"
    });

    // Animate to full rect
    TweenMax.to(menu, 0.8, { 
      scale: 1, 
      x: 0, 
      y: 0, 
      autoAlpha: 1, 
      borderRadius: "30px", /* Morph to rounded rect */
      filter: "blur(0px)", 
      webkitFilter: "blur(0px)",
      ease: Elastic.easeOut.config(1, 0.75), /* Organic bounce */
      force3D: true
    });
    
    // Stagger items in with Blur Typewriter effect (Fast)
    TweenMax.staggerFromTo(menuItems, 0.3, 
      { 
        opacity: 0, 
        y: 15, 
        scale: 1.05,
        filter: "blur(10px)", 
        webkitFilter: "blur(10px)" 
      },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        filter: "blur(0px)", 
        webkitFilter: "blur(0px)", 
        ease: Power2.easeOut, 
        delay: 0.1 
      }, 
      0.04
    );
  };

  var closeMenu = function() {
    $('body').removeClass('offcanvas');
    $('.js-menu-toggle').removeClass('active');
    if ( $('.js-burger-toggle-menu').length ) {
      $('.js-burger-toggle-menu').removeClass('open');
    }
    
    // GSAP Close Animation - Reverse Typewriter & Suction
    
    // 1. Stagger items out (Reverse Typewriter - Explicit)
    // We use staggerFromTo to ensure the starting state is what we expect (visible) 
    // and animate to the hidden state with a distinct motion.
    TweenMax.staggerFromTo(menuItems, 0.3, 
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        filter: "blur(0px)", 
        webkitFilter: "blur(0px)" 
      },
      { 
        opacity: 0, 
        y: -20, /* Move up more noticeably */
        scale: 0.9, /* Shrink slightly */
        filter: "blur(15px)", /* Stronger blur */
        webkitFilter: "blur(15px)",
        ease: Back.easeIn.config(1.7), /* Pull back effect */
      }, 
      0.05 /* Slower stagger for visibility */
    );

    // 2. Suck menu into button (Delayed slightly to let items vanish)
    TweenMax.to(menu, 0.5, { 
      delay: 0.15, /* Wait for items to start disappearing */
      scale: 0.05, /* Shrink to a droplet */
      x: 20, /* Move to button center */
      y: -20, 
      autoAlpha: 0, 
      borderRadius: "50%", /* Turn into a circle */
      filter: "blur(40px)", /* Blur out */
      webkitFilter: "blur(40px)",
      ease: Expo.easeIn, /* Accelerate into the button (Vacuum effect) */
      force3D: true
    });
  };

  $('.js-menu-toggle').click(function(e) {
    e.preventDefault();
    if ( $('body').hasClass('offcanvas') ) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // click outisde offcanvas
  $(document).mouseup(function(e) {
    var container = $(".unslate_co--site-mobile-menu");
    var toggle = $(".js-menu-toggle");
    var burger = $(".js-burger-toggle-menu");

    if (!container.is(e.target) && container.has(e.target).length === 0 && !toggle.is(e.target) && toggle.has(e.target).length === 0 && !burger.is(e.target) && burger.has(e.target).length === 0) {
      if ( $('body').hasClass('offcanvas') ) {
        closeMenu();
      }
    }
  }); 

  // Close menu when a link is clicked (Event Delegation)
  $('body').on('click', '.unslate_co--site-mobile-menu a', function() {
    closeMenu();
  });
};



// navigation
var onePageNavigation = function() {
  var navToggler = $('.site-menu-toggle');
 	$("body").on("click", ".unslate_co--site-nav .site-nav-ul li a[href^='#'], .smoothscroll[href^='#'], .unslate_co--site-mobile-menu .site-nav-wrap li a[href^='#']", function(e) {
    
    e.preventDefault();

    var $body = $('body');
    if ( $body.hasClass('offcanvas')  ) {
    	$body.removeClass('offcanvas');
    	$('body').find('.js-burger-toggle-menu').removeClass('open');
    }

    var hash = this.hash;
    
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 1000, 'easeInOutExpo');

  });

};


// load ajax page
var portfolioItemClick = function() {
	$('.ajax-load-page').on('click', function(e) {
		
		var id = $(this).data('id'),
			href = $(this).attr('href');

		if ( $('#portfolio-single-holder > div').length ) {
			$('#portfolio-single-holder > div').remove();
		} 

		TweenMax.to('.loader-portfolio-wrap', 1, { top: '-50px', autoAlpha: 1, display: 'block', ease: Power4.easeOut });

		$('html, body').animate({
    	scrollTop: $('#portfolio-section').offset().top - 50
		}, 700, 'easeInOutExpo', function() {
		});
		
		setTimeout(function(){
			loadPortfolioSinglePage(id, href);
		}, 100);

		e.preventDefault();

	});

	// Close
	// Close
	$('body').on('click', '.js-close-portfolio', function() {

		setTimeout(function(){
			$('html, body').animate({
	    	scrollTop: $('#portfolio-section').offset().top - 50
			}, 500, 'easeInOutExpo');
		}, 200);

		TweenMax.set('.portfolio-wrapper', { visibility: 'visible', height: 'auto' });
		TweenMax.to('.portfolio-single-inner', 0.5, { 
			marginTop: '50px', 
			opacity: 0, 
			display: 'none',
			filter: 'blur(20px)',
			webkitFilter: 'blur(20px)',
			onComplete() {
				TweenMax.to('.portfolio-wrapper', 0.5, { marginTop: '0px', autoAlpha: 1, position: 'relative' });
			} 
		});
	});
};

$(document).ajaxStop(function(){
	setTimeout(function(){
		TweenMax.to('.loader-portfolio-wrap', 1, { top: '0px', autoAlpha: 0, ease: Power4.easeOut });	
	}, 400);
});

var loadPortfolioSinglePage = function(id, href) {
	$.ajax({
		url: href,
		type: 'GET',
		success: function(html) {

			TweenMax.to('.portfolio-wrapper', 1, { marginTop: '50px', autoAlpha: 0, visibility: 'hidden', onComplete() {
				TweenMax.set('.portfolio-wrapper', { height: 0 });
			} })

			var pSingleHolder = $('#portfolio-single-holder');
	    	
			var getHTMLContent = $(html).find('.portfolio-single-wrap').html();

			// Append with inline styles to prevent FOUC (Flash of Unstyled Content)
			pSingleHolder.append(
				'<div id="portfolio-single-'+id+
				'" class="portfolio-single-inner" style="opacity: 0; display: none;"><span class="unslate_co--close-portfolio js-close-portfolio d-flex align-items-center"><span class="close-portfolio-label">Back to Portfolio</span><span class="icon-close2 wrap-icon-close"></span></span>' + getHTMLContent + '</div>'
			);

			// Prepare text/elements immediately (Split text, hide children)
			preparePortfolioDetails();

			setTimeout(function() {
				owlSingleSlider();
			}, 10);

			setTimeout(function() {
				// Entrance Animation: Fade Parent In
				TweenMax.to('.portfolio-single-inner', 0.6, { 
					marginTop: '0px', 
					autoAlpha: 1, 
					display: 'block', 
					ease: Power3.easeOut,
					onComplete() {
						TweenMax.to('.loader-portfolio-wrap', 1, { top: '0px', autoAlpha: 0, ease: Power4.easeOut });
						// Trigger content animations
						revealPortfolioDetails(); 
					} 
				});
			}, 400 ); // Reduced delay for quicker feel
		}
	});

	return false;

};

var preparePortfolioDetails = function() {
	// 1. Prepare Heading (Split & Hide)
	var $heading = $('.portfolio-single-inner h2');
	if ($heading.length) {
		var text = $heading.text();
		var chars = text.split('');
		$heading.empty();
		$.each(chars, function(i, char) {
			$heading.append('<span style="display:inline-block; opacity:0; filter:blur(10px); transform:translateY(10px);">' + (char === ' ' ? '&nbsp;' : char) + '</span>');
		});
	}

	// 2. Prepare Content (Hide & Blur)
	var $content = $('.portfolio-single-inner p, .portfolio-single-inner .detail-v1, .portfolio-single-inner figure, .portfolio-single-inner .owl-carousel');
	TweenMax.set($content, { opacity: 0, y: 20, filter: 'blur(10px)' });
};

var revealPortfolioDetails = function() {
	// 1. Animate Heading Characters
	var $headingSpans = $('.portfolio-single-inner h2 span');
	if ($headingSpans.length) {
		TweenMax.staggerTo($headingSpans, 0.4, {
			opacity: 1,
			filter: 'blur(0px)',
			y: 0,
			ease: Back.easeOut.config(1.7)
		}, 0.02);
	}

	// 2. Animate Content Elements
	var $content = $('.portfolio-single-inner p, .portfolio-single-inner .detail-v1, .portfolio-single-inner figure, .portfolio-single-inner .owl-carousel');
	TweenMax.staggerTo($content, 0.6, {
		opacity: 1,
		y: 0,
		filter: 'blur(0px)',
		ease: Power2.easeOut
	}, 0.1);
};

var jarallaxPlugin = function() {
	// Disable Jarallax on mobile for performance
	var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 992;
	if (isMobile) return;

	$('.jarallax').jarallax({
    speed: 0.2
	});
	jarallax(document.querySelectorAll('.jarallax-video'), {
    speed: 0.2,
    videoSrc: 'https://www.youtube.com/watch?v=mwtbEGNABWU',
    videoStartTime: 8,
    videoEndTime: 70,
	});
};



var stickyFillPlugin = function() {
	var elements = document.querySelectorAll('.unslate_co--sticky');
	Stickyfill.add(elements);
};

var animateReveal = function() {


	var controller = new ScrollMagic.Controller();
	
	var greveal = $('.gsap-reveal');

	// gsap reveal
	$('.gsap-reveal').each(function() {
		$(this).append('<span class="cover"></span>');
	});
	if ( greveal.length ) {
		var revealNum = 0;
		greveal.each(function() {
			var cover = $(this).find('.cover');

			var tl = new TimelineMax();

			setTimeout(function() {
				tl
					.fromTo(cover, 2, { skewX: 0 }, { xPercent: 101, transformOrigin: "0% 100%", ease:Expo.easeInOut })
			}, revealNum * 0);
			
			var scene = new ScrollMagic.Scene({
				triggerElement: this,
				duration: "0%",
				reverse: false,
				offset: "-300%",
			})
			.setTween(tl)
			.addTo(controller);

			revealNum++;

		});
	}

	// gsap reveal hero
	$('.gsap-reveal-hero').each(function() {
		var html = $(this).html();
		$(this).html('<span class="reveal-wrap"><span class="cover"></span><span class="reveal-content">'+html+'</span></span>');
	});
	var grevealhero = $('.gsap-reveal-hero');

	if ( grevealhero.length ) {
		var heroNum = 0;
		grevealhero.each(function() {

			var cover = $(this).find('.cover'),
				revealContent = $(this).find('.reveal-content');

			var tl2 = new TimelineMax();

			setTimeout(function() {

				tl2
					.to(cover, 1, { marginLeft: '0', ease:Expo.easeInOut, onComplete() {
						tl2.set(revealContent, { x: 0 });
						tl2.to(cover, 1, { marginLeft: '102%', ease:Expo.easeInOut });
					} } )
			}, heroNum * 0 );

			var scene = new ScrollMagic.Scene({
				triggerElement: this,
				duration: "0%",
				reverse: false,
				offset: "-300%",
			})
			.setTween(tl2)
			.addTo(controller);

			heroNum++;
		});
  }

  // Mouse tracking for CTA button border (Global tracking with Proximity)
  $(document).on('mousemove', function(e) {
    var $btn = $('.hero-cta-pill');
    if ($btn.length) {
      var rect = $btn[0].getBoundingClientRect();
      var btnCenterX = rect.left + rect.width / 2;
      var btnCenterY = rect.top + rect.height / 2;
      
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      
      $btn[0].style.setProperty('--x', x + 'px');
      $btn[0].style.setProperty('--y', y + 'px');

      // Calculate distance from button center
      var dist = Math.sqrt(Math.pow(e.clientX - btnCenterX, 2) + Math.pow(e.clientY - btnCenterY, 2));
      
      // Activation radius: 360px around the button center
      if (dist < 360) {
        $btn.addClass('interaction-active');
      } else {
        $btn.removeClass('interaction-active');
      }
    }
  });

}


var blurTextReveal = function() {
	var controller = new ScrollMagic.Controller();

	$('.blur-reveal-text').each(function() {
		var $this = $(this);
		var text = $this.text().trim(); // Trim to avoid weird spacing
		$this.empty();
		
		// Split text into characters
		var chars = text.split('');
		$.each(chars, function(i, char) {
			// Use non-breaking space for spaces to preserve layout
			var content = char === ' ' ? '&nbsp;' : char;
			$this.append('<span style="display:inline-block; opacity:0; filter:blur(10px); transform:translateY(15px); will-change:transform, opacity, filter;">' + content + '</span>');
		});

		var $chars = $this.find('span');

		var tl = new TimelineMax();
		tl.staggerTo($chars, 0.8, {
			opacity: 1,
			filter: 'blur(0px)',
			y: 0,
			ease: Back.easeOut.config(1.2) // Subtle bounce
		}, 0.015); // Fast stagger for "no lag" feel

		new ScrollMagic.Scene({
			triggerElement: this,
			triggerHook: 0.85, // Trigger slightly before it hits the bottom
			reverse: false
		})
		.setTween(tl)
		.addTo(controller);
	});
};

var blurStaggerReveal = function() {
	var controller = new ScrollMagic.Controller();

	$('.blur-stagger-reveal').each(function() {
		var $this = $(this);
		// Select children: .skill-pill for skills, .experience-item for experience list, .process-card for cards, .process-tag for pill
		var $children = $this.find('.skill-pill, .experience-item, .process-card, .process-tag');

		// Initial State
		TweenMax.set($children, { 
			opacity: 0, 
			y: 30, 
			filter: 'blur(20px)',
			webkitFilter: 'blur(20px)'
		});

		var tl = new TimelineMax();
		tl.staggerTo($children, 0.8, {
			opacity: 1,
			y: 0,
			filter: 'blur(0px)',
			webkitFilter: 'blur(0px)',
			ease: Power3.easeOut
		}, 0.1); // Stagger delay

		new ScrollMagic.Scene({
			triggerElement: this,
			triggerHook: 0.85,
			reverse: false
		})
		.setTween(tl)
		.addTo(controller);
	});
};

var luxuryButtonReveal = function() {
	var controller = new ScrollMagic.Controller();

	$('.luxury-button-wrapper').each(function() {
		var $this = $(this);
		var $btns = $this.find('.resume-btn');

		// Initial State: Tilted, blurred, and pushed down
		TweenMax.set($btns, {
			y: 50,
			autoAlpha: 0,
			scale: 0.9,
			rotationX: 30,
			transformPerspective: 800,
			transformOrigin: "center top",
			filter: "blur(10px)",
			webkitFilter: "blur(10px)"
		});

		var tl = new TimelineMax();
		tl.staggerTo($btns, 1.2, {
			y: 0,
			autoAlpha: 1,
			scale: 1,
			rotationX: 0,
			filter: "blur(0px)",
			webkitFilter: "blur(0px)",
			ease: Elastic.easeOut.config(1, 0.6), // Rich elastic bounce
			force3D: true
		}, 0.2); // Delay between buttons

		new ScrollMagic.Scene({
			triggerElement: this,
			triggerHook: 0.85,
			reverse: false
		})
		.setTween(tl)
		.addTo(controller);
	});
};

var liquidRippleEffect = function() {
	// Disable on mobile/touch devices for performance
	var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 992;
	if (isMobile) return;

	var lastTime = 0;
	var throttle = 40; // Balanced for subtle glass trail

	$(document).on('mousemove', function(e) {
		var now = new Date().getTime();
		if (now - lastTime < throttle) return;
		lastTime = now;

		var x = e.clientX;
		var y = e.clientY;

		var $ripple = $('<div class="liquid-ripple"></div>');
		$ripple.css({
			left: x + 'px',
			top: y + 'px'
		});

		$('body').append($ripple);

		// Remove after animation completes (1s matches CSS animation)
		setTimeout(function() {
			$ripple.remove();
		}, 1000);
	});
};

var portfolioHoverEffect = function() {
	// Disable on mobile/touch devices for performance
	var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 992;
	if (isMobile) return;

	// Select all portfolio items
	$('.portfolio-item').each(function() {
		var $this = $(this);
		var $img = $this.find('img');
		var $overlay = $this.find('.overlay');
		var $textElements = $this.find('.portfolio-item-content h3, .portfolio-item-content p');

		// 1. Prepare Text: Split into characters
		$textElements.each(function() {
			var $el = $(this);
			var text = $el.text().trim();
			var chars = text.split('');
			$el.empty();
			$.each(chars, function(i, char) {
				var content = char === ' ' ? '&nbsp;' : char;
				$el.append('<span class="char" style="display:inline-block; opacity:0; filter:blur(8px); transform:translateY(10px); will-change:transform, opacity, filter;">' + content + '</span>');
			});
		});

		var $chars = $this.find('.char');

		// Set initial perspective on container
		TweenMax.set($this, { perspective: 1000, transformStyle: "preserve-3d" });
		TweenMax.set($img, { transformOrigin: "center center", transformStyle: "preserve-3d" });

		$this.on('mouseenter', function() {
			// Colorize on hover (Smooth Luxury Fade)
			TweenMax.to($img, 1.2, { // Slower duration for smoothness
				filter: 'grayscale(0%)',
				webkitFilter: 'grayscale(0%)',
				scale: 1.2, 
				ease: Power2.easeOut
			});

			// Text Blur IN Animation
			TweenMax.staggerTo($chars, 0.6, {
				opacity: 1,
				filter: 'blur(0px)',
				y: 0,
				ease: Power2.easeOut,
				delay: 0.1 // Slight delay to wait for overlay fade
			}, 0.015);
		});

		$this.on('mousemove', function(e) {
			var width = $this.outerWidth();
			var height = $this.outerHeight();
			var offset = $this.offset();
			
			// Calculate mouse position relative to center (-1 to 1)
			var xPos = (e.pageX - offset.left) / width - 0.5;
			var yPos = (e.pageY - offset.top) / height - 0.5;

			// Tilt AND Move Animation (3D Tracking) for Image Only
			TweenMax.to($img, 0.5, {
				rotationY: xPos * 30,  
				rotationX: -yPos * 30, 
				x: xPos * 50, 
				y: yPos * 50,
				ease: Power2.easeOut,
				transformPerspective: 1000,
				force3D: true
			});

			// Overlay stays static to prevent gradient breaking
			/* TweenMax.to($overlay, 0.5, {
				x: xPos * 60,
				y: yPos * 60,
				ease: Power2.easeOut,
				force3D: true
			}); */

		}).on('mouseleave', function() {
			// Smooth Grayscale Reset
			TweenMax.to($img, 1.0, {
				filter: 'grayscale(100%)',
				webkitFilter: 'grayscale(100%)',
				ease: Power2.easeInOut
			});

			// Physical Reset (Elastic)
			TweenMax.to($img, 1.0, {
				rotationY: 0,
				rotationX: 0,
				x: 0,
				y: 0,
				scale: 1,
				ease: Elastic.easeOut.config(1.0, 0.8), // Softer elastic
				clearProps: "transform" 
			});

			// Reset overlay (ensure it's at 0,0)
			TweenMax.to($overlay, 0.8, {
				x: 0,
				y: 0,
				ease: Power2.easeOut
			});

			// Text Blur OUT Animation
			TweenMax.staggerTo($chars, 0.4, {
				opacity: 0,
				filter: 'blur(8px)',
				y: 10,
				ease: Power2.easeIn
			}, 0.01);
		});


	});
};

var mobileImageReveal = function() {
	// Only run on mobile
	var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 992;
	if (!isMobile) return;

	// Select portfolio images (both original and Isotope-wrapped) and about image
	var $images = $('.portfolio-item img, .reveal-content img, .meet-image, .meet-image-mobile-wrap img');

	// Filter out already initialized images to prevent double-binding
	$images = $images.filter(function() {
		return !$(this).data('mobile-reveal-init');
	});

	if ($images.length === 0) return;

	// Mark as initialized
	$images.data('mobile-reveal-init', true);

	// Use GSAP to set initial state: Sharp Grayscale
	TweenMax.set($images, {
		filter: 'grayscale(100%) blur(0px)',
		webkitFilter: 'grayscale(100%) blur(0px)',
		scale: 1.05
	});

	// Intersection Observer for performance
	if ('IntersectionObserver' in window) {
		var observer = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					var img = entry.target;
					
					// Create a Timeline for the "Refocus" Effect
					var tl = new TimelineMax({ overwrite: 'all' });

					// Step 1: Blur IN while starting to color (The "Transition Blur")
					tl.to(img, 0.5, {
						filter: 'grayscale(50%) blur(4px)',
						webkitFilter: 'grayscale(50%) blur(4px)',
						scale: 1.02,
						ease: Power1.easeInOut
					})
					// Step 2: Blur OUT to sharp color
					.to(img, 1.0, {
						filter: 'grayscale(0%) blur(0px)',
						webkitFilter: 'grayscale(0%) blur(0px)',
						scale: 1,
						ease: Power2.easeOut
					});

					// Stop observing this image (it stays colored)
					observer.unobserve(img);
				}
			});
		}, {
			root: null,
			rootMargin: "0px", 
			threshold: 0.15 // Trigger slightly later to ensure user sees the start
		});

		$images.each(function() {
			observer.observe(this);
		});
	} else {
		// Fallback
		TweenMax.set($images, {
			filter: 'grayscale(0%) blur(0px)',
			webkitFilter: 'grayscale(0%) blur(0px)',
			scale: 1
		});
	}
};
