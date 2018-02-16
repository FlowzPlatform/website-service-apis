$(document).ready(function () {
    $('#slide-nav.navbar').append($('<div id="navbar-height-col"></div>'));
    var toggler = '.navbar-toggle';
    var pagewrapper = '#page-content';
    var navigationwrapper = '.navbar-header';
    var menuwidth = '50%'; 
    var slidewidth = '50%';
    var menuneg = '-50%';
    var slideneg = '-50%';
	
	$("#slide-nav").on("click", toggler, function (e) {
        var selected = $(this).hasClass('slide-active');
        $('#slidemenu').stop().animate({
            right: selected ? menuneg : '0px'
        });
        $('#navbar-height-col').stop().animate({
            right: selected ? slideneg : '0px'
        });
        $(pagewrapper).stop().animate({
            right: selected ? '0px' : slidewidth
        });
        $(navigationwrapper).stop().animate({
            right: selected ? '0px' : slidewidth
        });
        $(this).toggleClass('slide-active', !selected);
        $('#slidemenu').toggleClass('slide-active');
        $('.navbar, body, .navbar-header').toggleClass('slide-active');
    });
    var selected = '#slidemenu, body, .navbar, .navbar-header';
    $(window).on("resize", function () {
        if ($(window).width() > 767 && $('.navbar-toggle').is(':hidden')) {
			$(selected).removeClass('slide-active');
        }
    });
});

$(document).ready(function () {
    $('#mainmenu-nav.navbar2').append($('<div id="navbar-height-col2"></div>'));
    var toggler = '.navbar-toggle';
    var pagewrapper = '#page-content';
    var navigationwrapper = '.navbar-header2';
    var menuwidth2 = '265px';
    var slidewidth2 = '265px';
    var menuneg2 = '-265px';
    var slideneg2 = '-265px';
	
	$("#mainmenu-nav").on("click", toggler, function (e) {
        var selected = $(this).hasClass('slide-active');
        $('#mainmenu').stop().animate({
            left: selected ? menuneg2 : '0px'
        });
        $('#navbar-height-col2').stop().animate({
            left: selected ? slideneg2 : '0px'
        });
        $(pagewrapper).stop().animate({
            left: selected ? '0px' : slidewidth2
        });
        $(navigationwrapper).stop().animate({
            left: selected ? '0px' : slidewidth2
        });
        $(this).toggleClass('slide-active', !selected);
        $('.navbar2, body, .navbar-header2').toggleClass('slide-active');
    });
    var selected = '#mainmenu, body, .navbar2, .navbar-header2';
    $(window).on("resize", function () {
        if ($(window).width() > 767 && $('.navbar-toggle').is(':hidden')) {
            $(selected).removeClass('slide-active');
        }
    });
});