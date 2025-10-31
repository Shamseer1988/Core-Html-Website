

/*-------------------------------
[  Table of contents  ]
---------------------------------
  01. jQuery MeanMenu
  02. wow js active
  03. Project  Masonry
  04. Sticky Header
  05. ScrollUp
  06. Testimonial Slick Carousel
  07. Testimonial Slick Carousel
  08. CounterUp
  16. ScrollReveal Js Init
  17. Magnific Popup




/*--------------------------------
[ End table content ]
-----------------------------------*/


(function($) {
    'use strict';


/*-------------------------------------------
  01. jQuery MeanMenu
--------------------------------------------- */
    
$('.mobile-menu nav').meanmenu({
    meanMenuContainer: '.mobile-menu-area',
    meanScreenWidth: "991",
    meanRevealPosition: "right",
});
/*-------------------------------------------
  02. wow js active
--------------------------------------------- */
    new WOW().init();


/*-------------------------------------------
  03. Project  Masonry
--------------------------------------------- */ 

$('.htc__project__container').imagesLoaded( function() {
  
    // filter items on button click
    $('.project__menu').on( 'click', 'button', function() {
      var filterValue = $(this).attr('data-filter');
      $grid.isotope({ filter: filterValue });
    }); 
    // init Isotope
    var $grid = $('.htc__latest__project__wrap').isotope({
      itemSelector: '.single__project',
      percentPosition: true,
      transitionDuration: '0.7s',
      layoutMode: 'fitRows',
      masonry: {
        // use outer width of grid-sizer for columnWidth
        columnWidth: '.single__project',
      }
    });

});

$('.project__menu button').on('click', function(event) {
    $(this).siblings('.is-checked').removeClass('is-checked');
    $(this).addClass('is-checked');
    event.preventDefault();
});



/*-------------------------------------------
  04. Sticky Header
--------------------------------------------- */ 

  $(window).on('scroll',function() {    
    var scroll = $(window).scrollTop();
    if (scroll < 245) {
    $("#sticky-header-with-topbar").removeClass("scroll-header");
    }else{
    $("#sticky-header-with-topbar").addClass("scroll-header");
    }
  });


/*--------------------------
  05. ScrollUp
---------------------------- */

  $.scrollUp({
    scrollText: '<i class="zmdi zmdi-chevron-up"></i>',
    easingType: 'linear',
    scrollSpeed: 900,
    animation: 'fade'
  });

    // Smooth scrolling: only handle same-page anchors (href starting with '#') so external links, mailto:, tel: etc are not intercepted -->

        jQuery(document).ready(function($){
            $('a[href^="#"]').on('click', function(event){
                var targetHash = this.hash;
                // Only handle if there's a target on the page
                if (targetHash && $(targetHash).length) {
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: $(targetHash).offset().top
                    }, 800, function(){
                        // Update the URL hash without causing an extra jump when supported
                        if (history.pushState) {
                            history.pushState(null, null, targetHash);
                        } else {
                            window.location.hash = targetHash;
                        }
                    });
                }
            });
        });

    // Smooth scrolling End




/*---------------------------------------------
  06. Testimonial Slick Carousel
------------------------------------------------*/
  $('.testimonial__activation').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    draggable: true,
    // fade: true,
    dots: true,
  });


/*------------------------------------------
  07. Testimonial Slick Carousel
-------------------------------------------*/
  $('.testimonial__activation--2').slick({
    slidesToShow: 2,
    slidesToScroll: 2,
    arrows: false,
    draggable: true,
    // fade: true,
    dots: true,
  });



/*-----------------------------
  08. CounterUp
-----------------------------*/
  $('.count').counterUp({
    delay: 60,
    time: 3000
  });






/*-----------------------------------------------
  15. Home Slider
-------------------------------------------------*/

$(function () {
  const $owl = $('.slider__activation__wrap');

  // Safety: destroy if already initialized (hot reloads / SPA transitions)
  if ($owl.hasClass('owl-loaded')) {
    $owl.trigger('destroy.owl.carousel');
    $owl.removeClass('owl-loaded');
    $owl.find('.owl-stage-outer').children().unwrap(); // unwrap stage
  }

  // Initialize
  $owl.owlCarousel({
    items: 1,
    loop: true,
    autoplay: true,
    autoplayTimeout: 8000,          // a touch slower for readability
    autoplayHoverPause: true,
    smartSpeed: 1000,               // smoother transition
    dots: false,
    nav: false,                     // we use external arrows
    lazyLoad: true,
    mouseDrag: true,
    touchDrag: true,

    // Default animations (needs animate.css)
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',

    responsive: {
      0:    { items: 1 },
      600:  { items: 1 },
      1000: { items: 1 }
    }
  });

  // ---- External arrows control Owl ----
  $('.custom-slider-nav .custom-next').on('click', function (e) {
    e.preventDefault(); e.stopPropagation();
    $owl.trigger('next.owl.carousel');
  });
  $('.custom-slider-nav .custom-prev').on('click', function (e) {
    e.preventDefault(); e.stopPropagation();
    $owl.trigger('prev.owl.carousel');
  });

  // ---- Optional: per-slide animation overrides via data attributes ----
  // Usage in HTML: <div class="slide" data-animate-in="zoomIn" data-animate-out="fadeOutLeft">
  $owl.on('change.owl.carousel', function (e) {
    if (typeof e.property === 'undefined' || e.property.name !== 'position') return;
    const api = $owl.data('owl.carousel');
    if (!api) return;
    const targetIndex = e.property.value; // index of next slide
    const $targetSlide = $(this).find('.owl-item').eq(targetIndex).find('.slide').first();
    const animIn  = $targetSlide.data('animate-in');
    const animOut = $targetSlide.data('animate-out');
    if (animIn)  api.settings.animateIn  = animIn;
    if (animOut) api.settings.animateOut = animOut;
  });

  // ---- Cute staggered text reveal (now actually staggered) ----
  function reveal($scope) {
    const $els = $scope.find('.slider__inner > *');
    $els.each(function (i, el) {
      setTimeout(() => { $(el).addClass('reveal'); }, i * 120); // 120ms steps
    });
  }
  function hideAll($scope) {
    $scope.find('.slider__inner > *').removeClass('reveal');
  }

  // First slide: reveal immediately
  reveal($owl.find('.owl-item.active'));

  // During slide change: hide; after change: reveal active
  $owl.on('translate.owl.carousel', function () {
    hideAll($(this));
  });
  $owl.on('translated.owl.carousel', function () {
    reveal($(this).find('.owl-item.active'));
  });
});




/*-----------------------------------
  16. ScrollReveal Js Init
-------------------------------------- */


window.sr = ScrollReveal({ duration: 800 ,reset: false });

// Default fade-up
sr.reveal('.foo', {
  origin: 'bottom',
  distance: '30px',
  duration: 900,
  opacity: 0,
  easing: 'ease-in-out',
});

// Slide in from left
sr.reveal('.bar', {
  origin: 'left',
  distance: '60px',
  duration: 1200,
  easing: 'ease-out',
});

// Zoom in
sr.reveal('.zoomIn', {
  scale: 0.7,
  duration: 800,
  opacity: 0,
});

// Rotate entry
sr.reveal('.rotate', {
  rotate: { x: 0, y: 60, z: 0 },
  duration: 1000,
  easing: 'ease-in-out',
});





/*--------------------------------
  17. Magnific Popup
----------------------------------*/

$('.video-popup').magnificPopup({
  type: 'iframe',
  mainClass: 'mfp-fade',
  removalDelay: 160,
  preloader: false,
  zoom: {
      enabled: true,
  }
});

$('.image-popup').magnificPopup({
  type: 'image',
  mainClass: 'mfp-fade',
  removalDelay: 100,
  gallery:{
      enabled:true, 
  }
});






/*-----------------------------------------------
  16. Blog Slider
-------------------------------------------------*/

  if ($('.blog__activation').length) {
    $('.blog__activation').owlCarousel({
      loop: true,
      margin:0,
      nav:true,
      autoplay: false,
      navText: [ '<i class="zmdi zmdi-chevron-left"></i>', '<i class="zmdi zmdi-chevron-right"></i>' ],
      autoplayTimeout: 10000,
      items:1,
      dots: false,
      lazyLoad: true,
      responsive:{
        0:{
          items:1
        },
        600:{
          items:1
        }
      }
    });
  }








})(jQuery);




