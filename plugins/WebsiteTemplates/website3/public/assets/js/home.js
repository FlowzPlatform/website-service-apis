(function () { 
	$('.js-shop-option a').hover(function(){
        $(this).next().addClass('show');
    },function(){
        $(this).next().removeClass('show');
    });   
	$('.carousel').carousel();
	$('#fullpage').fullpage({
		anchors: ['home', 'featureproducts', 'categories', 'flyers', 'howitworks', 'blogs', 'infocontact', 'contact'],
		navigation: false,
		menu: '#menu',
		navigationPosition: 'right',
		//scrollOverflow: true,
	});
	
   /* ON LOAD ADD HIEGHT */
    $(window).on("load resize " ,function (){
         /* HEADER ANIMATION */
         if(screen.width > 1100){
            $('body').delay(1100).addClass('fixed-header');
         }
    });
    /* PRODUCT SLIDER */
	
	$(window).on("load resize" ,function (){
	if($(window).width() > 1000){
		$(".featured-product-overflow").mCustomScrollbar({
			axis:"x",
			theme:"light-3",
			//autoDraggerLength:false,
			mouseWheel:false,
			scrollInertia: 0,
			advanced:{autoExpandHorizontalScroll:true}
		});
		$(".mobile-form").removeAttr('class');
		//$(".category-overflow").mCustomScrollbar({
//			axis:"x",
//			theme:"light-3",
//			advanced:{autoExpandHorizontalScroll:true}
//		});
	}
	});
	
})(jQuery);   
