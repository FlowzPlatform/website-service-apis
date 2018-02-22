 $(document).ready(function () {
	$("body").addClass("ob-gm-theme gm-home fixed-header fp-viewing-home-0");
	 $("#header-price-range").ionRangeSlider({
		type: "double",
		min: 0,
		max: 200,
		from: 40,
		to: 180,
		prefix: "$",
		hide_min_max: true,
		hide_from_to: false,
		grid: false
	});
	$("#search-price-range").ionRangeSlider({
		type: "double",
		min: 0,
		max: 200,
		from: 40,
		to: 180,
		prefix: "$",
		hide_min_max: true,
		hide_from_to: false,
		grid: false
	});
	
	$(window).on("load resize" ,function (){            
		$(".fixed-dropdown").height($(window).height());
	});
     // BASIC
    $(".multi_category").multiselect();
    $(".js-not-member").click(function(){
        $(".not-member").slideToggle("slow");
    });
	$(".header-login-text a.dropdown-toggle").click(function(){
		$(this).parent().toggleClass('open');
		$("body").addClass("show-mask");
		$(".header-loging").addClass("open");
	});
	$(".mask-wrapp, .close-model").click(function(){
        $("body").removeClass("show-mask");
		$(".header-loging").removeClass("open");
		$(".header-login-text").removeClass('open');
		
    });
	if(screen.width < 1100){
		$(".js-close-search").click(function(){
			$("body").removeClass("advance-search-open");
			$(".advance-search").slideToggle();
			$(".search-section").removeClass("open");
		});
	}
    if(screen.width < 767){

        $('.ui-advance-search').appendTo('.main-logo-part');
        $(".js-product-grid").removeClass('list-view');  
        $(".ui-navigation .dropdown-toggle").attr('data-toggle', 'dropdown');
		$("a").removeAttr('data-hover', 'tooltip');
		$(".ui-product-action a").removeAttr('data-hover');
		$('.view-feat-button').appendTo('.section-2 .container');
		$('.view-flyer').appendTo('.section-4 .container');
	
    }

    $(".user-login a").click(function(){
        $("body").addClass('form-block-open');
    });
    $(".reponsive-login-col .close-model").click(function(){
        $("body").removeClass('form-block-open');
    });
    // BASIC
     $(".group-filter, .fixed-dropdown").mCustomScrollbar({
        axis:"y",
        theme:"dark",
		scrollInertia: 10,
        advanced:{autoExpandHorizontalScroll:true}
    });
    /*--DROPDOWN MENU--*/
    $('.header-advace-search [data-toggle=dropdown]').on('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).parent().toggleClass('open');
		
    });
    /*--DROPDOWN MENU--*/
    
    // HEADER SEARCH //
    $('.js-search-close-btn').on('click',function () {
        if(ww<=767){
             $(".header-advace-search").slideUp();
            
        }
    });
    $(".toggleMenu").click(function (e) {
        e.preventDefault();
        $(this).toggleClass("active");
        $(".nav").toggle();
    });
    $('.js-advace-search-but').on('click', function (event) {
        $(this).parent().parent().toggleClass('open');
		$(".advance-search").slideToggle();
		
    });
	if($(window).width() > 1100){
		$('.js-close-search').on('click', function (event) {
			$(this).parent().parent().removeClass('open');
			$(".advance-search").slideToggle();
		});
	}
    $('body').on('click', function (e) {
        if (!$('.advance-search-wrapper-wrap').is(e.target) && $('.js-advance-search-wrap').has(e.target).length === 0 && $('.open').has(e.target).length === 0 )
        { $('.js-advance-search-wrap').removeClass('open'); }
    });
    // DROPDOWN MENU HOVER START
    //$(".dropdown").hover(function () {
//        $(".dropdown-submenu:first-child .dropdown-menu").addClass('in');
//    });
    $(".dropdown-submenu").hover(function () {
        $(".dropdown-menu").removeClass('in');
    });
    // DROPDOWN MENU HOVER END
    
    $(".dropdown-colum .btn-group").click(function (event) {
        $(this).toggleClass('open');
    });

    // TOP MENU DROPDOWN START
     
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
     
    //$('#mainmenu-nav .navbar-toggle').click(function () {
//        var selected = $(this).hasClass('slide-active');
//        if (selected) {
//            $('.mask').css({
//                'z-index': '15'
//            });
//            $('.navbar-header').css({
//                'z-index': '4'
//            });
//            $('.mask').remove();
//        } else {
//            $('#mainmenu-nav').append('<div class="mask"></div>');
//            $("#mainmenu-nav").click(function () {
//                $("#mainmenu").show();
//                $('.mask').css({
//                    'z-index': '2'
//                });
//                $('.navbar-header').css({
//                    'z-index': '2'
//                });
//            });
//            $('.navbar-header2').css({
//                'z-index': '10'
//            });
//        }
//    });
   
    // TOP MENU DROPDOWN END
    // HEADER SEARCH //
    $("[data-hover='tooltip']").tooltip();  
    $("[data-toggle='tooltip']").tooltip();  
    // LOGIN POPUP START
	$(".js_forgot").click(function () {
	    $(".js-forgot-passwd").slideToggle("slow");
	});
	// LOGIN POPUP END
    
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
                $('.js-advace-search-btn').on('click',function () {
                    $('.search-box').slideUp('');
                    $('.header-advace-search').slideToggle('slow');
                    $('.search-button').removeClass('in');  
                });
                $(".header-login-text a").removeAttr('data-toggle');
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
   
    // CUSTOM SELECTION START
	$(".custom-select").each(function () {
        $(this).wrap("<span class='checkout-select-wrapper'></span>");
        $(this).after("<span class='checkout-holder'></span>");
    });
	$(document).on('change',
			'.custom-select', function() {
	//$(".custom-select").change(function () {
		var selectedOption = $(this).find(":selected").text();
        //console.log( $(this).next(".checkout-holder"));
        $(this).parents(".checkout-select-wrapper").find(".checkout-holder").text(selectedOption);
    });
	$('.custom-select').trigger('change');    
        $(document).on('click',
		'.custom-select option', function() {
        //$("").click(function(){
        $(this).parents(".checkout-select-wrapper").find(".checkout-holder").html('<span>'+ this.innerHTML+ '</span>');
	});
    
    // CUSTOM SELECTION END
    /* LOADER */
    $("#loader").fadeIn(function () {
        setTimeout(function () {
            $("#loader").fadeOut("slow");
        }, 1000);
    });
    /* END LOADER */
     /*--ADVANCE SEARCH--*/
        
        $(".close-search").click(function(){
            $(".top-search-block").removeClass('advance-search-wrapper');
        });    
        /*--BRAND NAVIGATION--*/
        $(".logo-navigation").click(function(){
            $(this).parent().toggleClass('js-open-nav');
        });
//    $('.shop-option a').hover(function(){
//        $(this).next().addClass('show');
//        },function(){
//            $(this).next().removeClass('show');
//    });
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
    $(".dropdown .dropdown-menu a span").click(function(){
        $(this).closest(".dropdown").find(".select_box").html('<span>'+ this.innerHTML+ '</span>');
        $(this).closest(".dropdown").removeClass("open");
    });
    $(".shipping-address-col .dropdown_size .dropdown-menu a").click(function(){
        $(this).closest(".dropdown").find(".dropdown-toggle").html('<span>'+ this.innerHTML+ '</span>');
        $(this).closest(".dropdown").removeClass("open");
    });
	// PRODUCT GRID AND LIST BUTTON END
}); 
// HEADER BLOCK



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

function myFunction() {
    window.print();
}


