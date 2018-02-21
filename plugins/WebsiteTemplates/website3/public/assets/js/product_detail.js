$(document).ready(function () { 
	if ($(window).width() < 767) {
		$(".quick-view-gallery").mCustomScrollbar({
			axis:"y",
			theme:"light-3",
			advanced:{autoExpandHorizontalScroll:true}
		}); 
	}
	$(".ui-nav-tab .dropdown a").click(function () {    	
        $("body").addClass('open-mask');
    });  
	
    $(".shipping-mehod .dropdown-menu span").click(function(){
        $(this).closest(".dropdown").find(".dropdown-toggle").html('<span>'+ this.innerHTML+ '</span>');
        $(this).closest(".dropdown").removeClass("open");
    });
    $(".dropdown-menu a span").click(function () {    	
        $(".high-product-img").addClass('open');
    });
    $(".color-option-slider").owlCarousel({ 
        stopOnHover : true,
        mouseDrag:false,
        navigation:true,
        items :40,
        itemsDesktop: [1199, 40],
        itemsDesktopSmall: [979,30],
        itemsTablet: [700, 15],
        itemsMobile: [479, 10] ,
        crollPerPage : true
    });
    $(".color-slider").owlCarousel({ 
        stopOnHover : true,
        mouseDrag:false,
        navigation:true,
        items :20,
        itemsDesktop: [1199, 20],
        itemsDesktopSmall: [979,22],
        itemsTablet: [700, 15],
        itemsMobile: [479, 12]        
    });
    $(".quantity-table-col").owlCarousel({ 
        stopOnHover : true,
        navigation:true,
        mouseDrag:false,
        items :5,
        itemsDesktop: [1199, 4],
        itemsDesktopSmall: [979, 4],
        itemsTablet: [639, 3],
        itemsMobile: [479, 1]        
    });
    
    // RELATED PRODUCTS
    $('#Related-product').owlCarousel({
        navigation : true,
        mouseDrag:false,
        items :0,
        itemsCustom : [ [0,1]],
     });
    // END RELATED PRODUCTS
	$(".quantity-table-col").owlCarousel({ 
        stopOnHover : true,
        navigation:true,
        mouseDrag:false,
        items : 4,
        itemsDesktop: [1199, 4],
        itemsDesktopSmall: [979, 4],
        itemsTablet: [639, 3],
        itemsMobile: [479, 1]        
    });
	$("#Detail-related-product").owlCarousel({
        navigation: true,
        items: 4,
        autoPlay: 3200,
        margin: 10,
        autoplayHoverPause: true,
        lazyLoad: true,
        stopOnHover: true,
        itemsCustom: false,
        itemsDesktop: [1170, 4],
        itemsDesktop: [1024, 3],
        //itemsDesktopSmall : [992, 3],
        //itemsTablet : [767, 2],
        itemsTabletSmall: false,
        itemsMobile: [479, 1],
        singleItem: false,
        itemsScaleUp: false,
        afterInit: function (elem) {
            var that = this
            that.owlControls.prependTo(elem)
        }
    });
	

    $(".js-lightbox").click(function () {    	
        $('.product-lightbox').addClass('open');
    });
    $(".color-selection-block .dropdown-menu").click(function (event) {
        // stop bootstrap.js to hide the parents
        event.stopPropagation();
        // hide the open children
        $(this).find(".dropdown-menu").removeClass('open');
        // add 'open' class to all parents with class 'dropdown-submenu'
        $(this).parents(".dropdown").addClass('open');
        // this is also open (or was)
        $(this).toggleClass('open');
    });
    
    $(".mask").click(function(){
        $(this).parent().removeClass('active');
        $('.video-model').removeClass('open');
		$('body').removeClass('open-mask');
        $('.product-video-block').removeClass('open');
    });
    // Product Slider
    $(".product-thumb-anchar").on('click', function () {    	
        $('.product-gallery').trigger('zoom.destroy'); 
        var img_src = $(this).find("img").attr("src");
        $(".product-lrg-image").find("img").attr("src", img_src);
        $(".product-lrg-image").find("img").attr("data-zoom-image", img_src);
        $('.zoomWindow').css('background-image', 'url('+ img_src +')');
    });
    // Product Slider
    
    /* SHOP ICON HOVER */
    $(".js-add-class").click(function(){            
        $(this).parent().toggleClass('section-open'); 
    });
    $('.js-shop-option a').hover(function(){
        $(this).next().addClass('show');
    },function(){
        $(this).next().removeClass('show');
    });
    /* FILTER JS */ 
    $(".content-box").mCustomScrollbar({
        axis:"x",
        theme:"light-3",
        advanced:{autoExpandHorizontalScroll:true}
    });
    $(".my-logo-block").mCustomScrollbar({
        axis:"y",
        theme:"light-3",
        advanced:{autoExpandHorizontalScroll:true}
    });
    $('.option-head a').click(function () {
       $(this).parent().next().slideToggle(400);
       $(this).parent().parent().toggleClass('in');
   }); 

    $(".js-calculate").click(function() {
        $('.shipping-quote-block').slideUp();
        $('.shipping-quote-result-block').slideDown();
    });
    $(".js-check").click(function() {
        $('.shipping-quote-block').slideDown();
        $('.shipping-quote-result-block').slideUp();
    });
    $(".js-cancel").click(function() {
        $(this).parent().parent().parent().parent().removeClass('active');
        $('.shipping-quote-result-block').slideDown();
    });
    
    // Product Lightbox
    $('#shipping-slider01').bxSlider({
        pagerCustom: '#bx-pager',
        touchEnabled: false,
        infiniteLoop: false
    });
    $('#shipping-slider02').bxSlider({
        pagerCustom: '#bx-pager-1',
        touchEnabled: false,
        infiniteLoop: false
    });
    $('#shipping-slider03').bxSlider({
        pagerCustom: '#bx-pager-2',
        touchEnabled: false,
        infiniteLoop: false
    });
    $('#shipping-slider04').bxSlider({
        pagerCustom: '#bx-pager-4',
        touchEnabled: false,
        infiniteLoop: false
    });
    $('#shipping-slider05').bxSlider({
        pagerCustom: '#bx-pager-5',
        touchEnabled: false,
        infiniteLoop: false
    });
    $(".js-close-lightbox").on('click', function () {    	
        $('.product-lightbox').removeClass('open');
    });
    if ($(window).width() < 767) {
    $('.thumb-slider').bxSlider({
        slideWidth: 200,
        minSlides: 5,
        maxSlides: 5,
        pager:false,
        infiniteLoop: false,
        controls:false,
        slideMargin:5
    });        
    }else{
    $('.thumb-slider').bxSlider({
        mode: 'vertical',
        slideWidth:100,
        minSlides:3,
        infiniteLoop: false,
        pager:false,
        slideMargin:10
    }); 
	
    }
    $('.product-lrg-image').zoom();
    // Product Lightbox
});
