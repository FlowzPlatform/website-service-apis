var ww = document.body.clientWidth;

// function initColorCarousel() {
//     $(".color-box").owlCarousel({
// 		loop:false,
// 		margin:0,
// 		responsiveClass:true,
// 		nav:true,
// 		responsive:{
// 			0:{items:9,},
// 			500:{items:9,},
// 			600:{items:9,},
// 			800:{items:15,},
// 			900:{items:15,},
// 			1200:{items:15,}
// 		}
//     });
// }

function initCustomSelect(contentDiv) {
	$(contentDiv+" .custom-select").each(function () {
		$(this).wrap("<span class='checkout-select-wrapper'></span>");
		$(this).after("<span class='checkout-holder'></span>");
    });
	$(contentDiv+" .custom-select").trigger('change');
}

//CHECKBOX SELECTION
function test(parms) {
    $check = $("#"+parms).is(':visible');
    if ($check) {
        $("#"+parms).slideUp(500).css({"min-height":"1px"});
    } else {
			$('.div-state .container-1').slideUp(500).css({"min-height":"1px"});
        $("#"+parms).slideDown(500).css({"min-height":"150px"});;
    }
}

//FOOTER MENU DROPDOWN START
function addAccordian() {
    window_width = $(window).width();
    if (window_width < 768)
	{
        $(".middle-footer .footer-heading").each(function (index, element) {
            //console.log(element);
            $(element).attr({
                "data-toggle": "collapse",
                "data-target": "#demo" + index
            });

			$(element).addClass("collapsed");
            $(element).parent().next().next().attr("id", "demo" + index);
            $(element).parent().next().next().addClass("collapse");
			$(element).click(function(){
				$(element).toggleClass('active');
                $(element).parent().parent().siblings().children().children().removeClass('active');
                $(element).parent().parent().siblings().children('.footer-link').removeClass('in');
            });
    	});
    } else {
        $(".middle-footer .footer-heading").each(function (index, element) {
            $(element).removeAttr("data-toggle");
            $(element).removeAttr("data-target");
            $(element).removeClass("collapsed");
            $(element).parent().next().next().removeAttr("id");
            $(element).parent().next().next().removeClass("collapse");
			$(element).click(function(){
                $(element).removeClass('active');
                $(element).parent().parent().siblings().children('.footer-link').removeClass('in');
            });
        });
    }
}
// FOOTER MENU DROPDOWN END

$(document).ready(function(){
	// FIXED HEADER
	/*if(ww > 1170){
		$(window).scroll(function(){
			if ($(window).scrollTop() >= 70) {
			   $('header').addClass('fixed-header');
				setTimeout(function(){
					$('.fixed-header').addClass('fixed-header-top');
				},700);
			}
			else {
			   $('header').removeClass('fixed-header');
			   $('header').removeClass('fixed-header-top');
			}
		});
	}*/
	// FIXED HEADER

	$(".dropdown").hover(function(){
	   $(".dropdown-submenu:nth-child(1) .dropdown-menu").addClass('in');
	});
	$(".dropdown-submenu").hover(function () {
	   $(".dropdown-menu").removeClass('in');
	});
   	// DROPDOWN MENU HOVER END

    $(".dropdown .dropdown-menu a span").click(function(){
        $(this).closest(".dropdown").find(".select_box").html('<span>'+ this.innerHTML+ '</span>');
        $(this).closest(".dropdown").removeClass("open");
    });


	// if(ww < 1024){
	// 	$( '.js-alert-test' ).click( function () {
	// 		alert( 'Button Clicked: Event was maintained' );
	// 	});
	// 	fakewaffle.responsiveTabs( [ 'xs', 'sm', 'md' ] );
	// }
    $('#myTab a').click( function ( e ) {
        e.preventDefault();
        $( this ).tab( 'show' );
    });
    $(".js-open-new-address-form").on('click', function (){
        $(".add-new-address-form").toggleClass('show');
        $(".edit-new-address-form").toggleClass('hide');
    });
    $(".js-add-class").on('click', function (){
        $(this).parent().toggleClass('open');
    });
	// CUSTOM SELECTION START
	$(".custom-select").each(function () {
       $(this).wrap("<span class='checkout-select-wrapper'></span>");
       $(this).after("<span class='checkout-holder'></span>");
  });

	$(document).on('change','.custom-select', function() {
		var selectedOption = $(this).find(":selected").text();
       $(this).parents(".checkout-select-wrapper").find(".checkout-holder").text(selectedOption);
    });
	$('.custom-select').trigger('change');
  $(document).on('click','.custom-select option', function() {
       $(this).parents(".checkout-select-wrapper").find(".checkout-holder").html('<span>'+ this.innerHTML+ '</span>');
	});
    // CUSTOM SELECTION END

    // TOP SEARCH BUTTON START
	$('.js-top-search-btn').on('click', function(){
		$(".js-top-search-bar").toggle();
	});
	$('.js-close-top-search').on('click', function(){
		$(".js-top-search-bar").hide();
	});
    // TOP SEARCH BUTTON END

    // PRODUCT CATEGORY VIEW VIDEO
	$(".js-open-video").click(function(evt) {
	    evt.preventDefault();
	    $(".full-video-block").empty().append(
	        $("<iframe>", { src: this.href})
	    );
	});
    $(function () {
	    $("#checkbox-topbar").click(function () {
	        $("ul li div.name .css-checkbox").attr('checked', this.checked);
	    });
	});
	// $('.multi_category').multiselect();

	$('.advance-search-btn').on('hide.bs.dropdown', function () {
	    return false;
	});
	$(".ob-mask.fade.js-mask,header").click(function(){
	    $(".btn-group.mar_bot").removeClass("open");
	});
	$(".show-mask .ob-mask").click(function(){
	    $("body").addClass("show-mask");
	});

	$('.js-search-close-but').on('click',function () {
       $(".dropdown.top-advance-search.advance-search-btn").removeClass('open');
	   $("body").removeClass('show-mask');
	   $(".js-advance-menu").removeClass('open');
    });
	$('.js-advance-search-wrap .form-control').on('click',function () {
		$(".js-advance-search-wrap.dropdown").removeClass('open');
	});
	$('.js-billing-collapse').on('click',function(){
        $('.panel-default').removeClass('open');
        $(this).parent().parent().parent().addClass('open');
    });
	$(".panel-collapse.collapse.in").closest(".panel.panel-default").toggleClass('open');
	$('.radio-check').change(function(){
	    if($('.js-contact-book-checkbox , .js-po-number').is(":checked")) {
	        $('.js-open-new-address-form').css("display", "none");
	    } else {
	    	$('.js-open-new-address-form').css("display", "block");
	    }
	});
	$(".radio-check").click(function(){
	    $(".add-new-address-form").removeClass("show");
	    $(".edit-new-address-form").removeClass("hide");
	});
   // OPTION2 TOP SEARCHBAR TOGGLE END
   $('.color-selection .dropdown [data-toggle=dropdown]').on('click', function(event) {
       event.preventDefault();
       event.stopPropagation();
       $(this).parent().toggleClass("open");
   });
   $('.top-search-block .dropdown a[data-toggle=dropdown]').on('click', function(event) {
       event.preventDefault();
       event.stopPropagation();
       $(this).parent().toggleClass("open");
   });
   $( '.color-selected-col span' ).click(function() {
	  $('.color-selection .dropdown_size.color-section-box').toggleClass( "open" );
   });

   // TOP UI NAV OPTION 2 START
   $('.js-show-fpassword').on('click',function () {
       $('.forgot-title').slideUp();
       $('.top-ui-navigation .forgot-passwd').slideDown();
   });
  //  $(".top-ui-slider").owlCarousel({
	// 	loop:true,
	// 	margin:20,
	// 	responsiveClass:true,
	// 	nav:true,
	// 	responsive:{
	// 		0:{items:3,},
	// 		500:{items:3,},
	// 		600:{items:3,},
	// 		768:{items:3,},
	// 		1000:{items:3,},
	// 		1200:{items:3,}
	// 	}
  //   });
   // TOP UI NAV OPTION 2 END

   // MASK WRAPPER START
   $('.js-advace-search-but').on('click',function () {
       $("body").toggleClass('show-mask');
   });
    $('.js-search-close-but').on('click',function () {
       if(ww<=767){
            $(".header-advace-search").slideUp();
       }
   });
   $('.slidemenu').on('click',function () {
       $("body").removeClass('show-mask');
   });
   $(".toggleMenu").click(function (e) {
       e.preventDefault();
       $(this).toggleClass("active");
       $(".nav").toggle();
   });
   $('.option-head a').click(function () {
       $(this).parent().next().slideToggle(400);
       $(this).parent().parent().toggleClass('in');
   });
   // MASK WRAPPER END

    // SEARCH PAGE //
	/*(function ($) {
		if (ww < 767) {
			$('.ui-advance-search').appendTo('.ui-menu-nav .container');
			$('.shop-menu').appendTo('.ob-top-menu .container');
	    	$('a.member-col').appendTo('.ui-menu-nav .container');
			$(".ob-product-grid-left").prepend('<div class="search-filter-collapse"><i class="fa fa-filter"></i> Search Filters <i class="fa fa-chevron-right"></i></div>');
			$('.search-filter-collapse').click(function () {
				$('.filter-search').slideToggle('fast');
			});
		}
	})(jQuery);*/
	// SEARCH PAGE //

   // ADVANCE SEARCH DROPDOWN MENU START
   $('.js-advance-dropdown').on('click', function (event) {
       $(this).parent().toggleClass('open');
   });
   $('body').on('click', function (e) {
       if (!$('.js-advance-search-wrap').is(e.target) && $('.js-advance-search-wrap').has(e.target).length === 0 && $('.open').has(e.target).length === 0 )
       { $('.js-advance-search-wrap').removeClass('open'); }
   });
   // ADVANCE SEARCH DROPDOWN MENU END

   // FEEDBACK FORM RIGHT SIDE FORM START
   $("#js-feed-btn").click( function(event){
       event.preventDefault();
       if ($(this).hasClass("isdrag") ) {
           $(".js-feedback-block").animate({right:"0px"}, 400);
           $(this).removeClass("isdrag").addClass("drag-toggle");
       } else {
           $(".js-feedback-block").animate({right:"-330px"}, 400);
           $(this).addClass("isdrag").removeClass("drag-toggle");
       }
       return false;
   });
   // FEEDBACK FORM RIGHT SIDE FORM END

   $('.dropdown-menu-inner > li').click(function () {
       $(this).addClass('open');
   });
   $(".social-icon-box .l").after("<div class='footer-clear'></div>");
   $('.up-down-arrow-box').click(function () {
       if ($(this).hasClass('down_arrow_box')) {
           $(this).parents('.product-meta').animate({
               bottom: '-60px'
           }, 500);
           $(this).removeClass('down_arrow_box');
           $('.product-block .price-cart').removeClass('price-bor');
       } else {
           $(this).parents('.product-meta').animate({
               bottom: '0px'
           }, 500);
           $(this).addClass('down_arrow_box');
           $('.product-block .price-cart').addClass('price-bor');
       }
   });

   // COUPON HOVER START
   $("a.coupon").hover(function () {
       $('div.offer-col').show();
   }, function () {
       $('div.offer-col').hide();
   });
   $(".other-color").hover(function () {
       $(this).next().show();
   }, function () {
       $(this).next().hide();
   });
   $(".other-color").hover(function () {
       $(this).addClass('in');
   }, function () {
       $(this).removeClass('in');
   });
   // COUPON HOVER END

   // TOP MENU DROPDOWN START
   $(".ui-navigation .dropdown").click(function() {
       $(this).toggleClass('open');
   });
   $(".dropdown-colum").click(function (event) {
       // stop bootstrap.js to hide the parents
       event.stopPropagation();
       // hide the open children
       $(this).find(".btn-group").toggleClass('open');
       // this is also open (or was)
       $(this).toggleClass('open');
   });
    if(ww < 767){
		$(".ui-advance-search .dropdown").click(function (event) {
           // stop bootstrap.js to hide the parents
           event.stopPropagation();
           // hide the open children
           $(this).find(".dropdown-menu").removeClass('open');
           // add 'open' class to all parents with class 'dropdown-submenu'
           $(this).parents(".dropdown-menu").addClass('open');
           // this is also open (or was)
           $(this).addClass('open');
       });
        $(".dropdown-submenu").click(function (event) {
           // stop bootstrap.js to hide the parents
           event.stopPropagation();
           // hide the open children
           $(this).find(".dropdown-submenu").removeClass('open');
           // add 'open' class to all parents with class 'dropdown-submenu'
           $(this).parents(".dropdown-submenu").addClass('open');
           // this is also open (or was)
           $(this).toggleClass('open');
       });
        $(".ui-navigation .dropdown").click(function () {
           // hide the open children
           $(this).find(".dropdown-menu").toggleClass('open');
           // this is also open (or was)
           $(this).toggleClass('open');
       });
   }
   $('#mainmenu-nav .navbar-toggle').click(function () {
       var selected = $(this).hasClass('slide-active');
       if (selected) {
           $('.mask').css({
               'z-index': '15'
           });
           $('.navbar-header').css({
               'z-index': '4'
           });
           $('.mask').remove();
       } else {
           $('#mainmenu-nav').append('<div class="mask"></div>');
           $("#mainmenu-nav").click(function () {
               $("#mainmenu").show();
               $('.mask').css({
                   'z-index': '2'
               });
               $('.navbar-header').css({
                   'z-index': '2'
               });
           });
           $('.navbar-header2').css({
               'z-index': '10'
           });
       }
   });
   $('#slide-nav .navbar-toggle').click(function () {
       var selected = $(this).hasClass('slide-active');
       if (selected) {
           $('.navbar-header2').css({
               'z-index': '10'
           });
           $('.mask').remove();
       } else {
           $('.navbar-header').css({
               'z-index': '4'
           });
           $('#slide-nav').append('<div class="mask"></div>');
           $("#slide-nav").click(function () {
               $("#slidemenu").show();
               $('.navbar-header2').css({
                   'z-index': '1'
               });
           });
       }
   });
   // TOP MENU DROPDOWN END


   // RESIZE JS START
	addAccordian();
	$(window).resize(function () {
	    addAccordian();
	});
   // RESIZE JS END


	// PRODUCT GRID AND LIST BUTTON START
	$(".js-product-list-btn").click(function () {
	    $(this).addClass("active");
	    $(".js-product-grid-btn").removeClass("active");
	    $('.js-product-grid').addClass('list-view');
	});
	$(".js-product-grid-btn").click(function () {
	    $(this).addClass("active");
	    $(".js-product-list-btn").removeClass("active");
	    $('.js-product-grid').removeClass('list-view');
	});
	// PRODUCT GRID AND LIST BUTTON END

	$(".js-pro-compare").click(function () {
	    $(".js-compare").slideDown("slow");
	});

	// TOOLTIP START
	$(function () {
       $('[data-toggle="tooltip"]').tooltip();
    });
   // TOOLTIP END

   // RESPONSIVE TAB START
	$('.js-tabs').tab();
	// RESPONSIVE TAB END

	// LOGIN POPUP START
	 $(document).on('click', '.js_forgot', function(){
	    $(".js-forgot-passwd").slideToggle("slow");
	});
	// LOGIN POPUP END

    // HEADER SEARCH ICON START
    // $('.search-button').click(function () {
    //     $('.search-box').slideToggle('slow');
    //     return false;
    // });
    // HEADER SEARCH ICON END

    // CUSTOM HEADER START
    var adjustMenu = function () {
        if (ww < 768) {
                $(".toggleMenu").css("display", "inline-block");
                if (!$(".toggleMenu").hasClass("active")) {
                    $(".ui-navigation").hide();
                } else {
                    $(".ui-navigation").show();
                }
                $(".ui-navigation li").unbind('mouseenter mouseleave');
                $(".ui-navigation li a.parent").unbind('click').bind('click', function (e) {
                    e.preventDefault();
                    $(this).parent("li").toggleClass("hover");
                });

                $('.shop-menu .header-loging li a').removeAttr('data-toggle');
                $('.search-button').click(function () {
                    $(this).toggleClass('in');
                });

                // RESONSIVE SEARCH START
                $('.js-advace-search-but').on('click',function () {
                    $('.search-button').removeClass('in');
                });
                // END RESONSIVE SEARCH END
            } else if (ww >= 768) {
                $(".toggleMenu").css("display", "none");
                $(".ui-navigation").show();
                $(".ui-navigation li").removeClass("hover");
                $(".ui-navigation li a").unbind('click');
                $(".ui-navigation li").unbind('mouseenter mouseleave').bind('mouseenter mouseleave', function () {
                    // must be attached to li so that mouseleave is not triggered when hover over submenu
                    $(this).toggleClass('hover');
                });

            }
    };
    // CUSTOM HEADER END

    // FONT OPTION DROPDOWN START
    adjustMenu();
    $('.color-selection').children().children().click(function () {
        $(this).parent().siblings().children('.color-selection-box').css('display', 'none');
    });
    // FONT OPTION DROPDOWN END

    // SLIDE TOOGLE END
    $(".js-advance-dropdown").click(function(){
        $(".advance-search-btn").removeClass("open");
        $("body").removeClass("show-mask");
    });

    $(".js-advace-search-but").click(function(){
        $(".header-search").removeClass("open");
    });

    // Category Menu
    $(".js-category").click(function() {
        $(this).next().slideToggle("400");
        $(this).parent().toggleClass("open");
        $(this).children().toggleClass('fa-chevron-down');
    });
    // END Category Menu

    // initColorCarousel();

    $(window).bind('resize orientationchange', function () {
        ww = document.body.clientWidth;
        adjustMenu();
        //console.log("resize");
        if(ww>1024) {$(".top-search-block").css({'display': ''});}
    });

    // DATEPICKER START 
	$('.date').each(function(){
        $(this).datetimepicker({
            format: 'MM/dd/yyyy',
            pickTime: false
            })
        .on('changeDate', function(e){
            $(this).datetimepicker('hide');
        });
    });
    // DATEPICKER END
});

$( window ).resize(function() {
if($(window).width() < 980){
        $('.ob-product-grid').removeClass('list-view');
    } else {
        $('.ob-product-grid').addClass('ob-product-grid2');
    }
});




// SUPPORT PLACE HOLDER JS START
jQuery(function () {
    jQuery.support.placeholder = false;
    webkit_type = document.createElement('input');
    if ('placeholder' in webkit_type) jQuery.support.placeholder = true;
});

jQuery(function () {
    if (!jQuery.support.placeholder) {
        var active = document.activeElement;
        jQuery(':text, textarea, :password').focus(function () {
            if ((jQuery(this).attr('placeholder')) && (jQuery(this).attr('placeholder').length > 0) && (jQuery(this).attr('placeholder') != '') && jQuery(this).val() == jQuery(this).attr('placeholder')) {
                jQuery(this).val('').removeClass('hasPlaceholder');
            }
        }).blur(function () {
            if ((jQuery(this).attr('placeholder')) && (jQuery(this).attr('placeholder').length > 0) && (jQuery(this).attr('placeholder') != '') && (jQuery(this).val() == '' || jQuery(this).val() == jQuery(this).attr('placeholder'))) {
                jQuery(this).val(jQuery(this).attr('placeholder')).addClass('hasPlaceholder');
            }
        });
        jQuery(':text, textarea, :password').blur();
        jQuery(active).focus();
        jQuery('form').submit(function () {
            jQuery(this).find('.hasPlaceholder').each(function () {
                jQuery(this).val('');
            });
        });
    }
});
// SUPPORT PLACE HOLDER JS END


// ONSCROLL ANIMATION //

$(function() {
    var current = 0;
    $(".help-products .col-lg-3").each(function() {
        $(this).addClass("wow fadeInUp").attr("data-wow-delay", current + "5ms");
        current++;
    });
    new WOW().init();
});

//$(function() {
//    var current = 0;
//    $(".pro-overflow .owl-item .item").each(function() {
//        $(this).addClass("wow fadeInUp").attr("data-wow-delay", current + "5ms");
//        current++;
//    });
//    new WOW().init();
//});

$(function() {
    var current = 0;
    $(".ob-product-grid .product-wrap").each(function() {
        $(this).addClass("wow fadeInUp").attr("data-wow-delay", current + "5ms");
        current++;
    });
    new WOW().init();
});

// ONSCROLL ANIMATION //
