$(document).ready(function() {
    $("#slide-nav.navbar").append($('<div id="navbar-height-col"></div>'));
    var a = ".navbar-toggle",
        e = "#page-content",
        i = ".navbar-header",
        n = "50%",
        t = "-50%",
        s = "-50%";
    
    $("#slide-nav").on("click", a, function() {
        var a = $(this).hasClass("slide-active");
        $("#slidemenu").stop().animate({
            right: a ? t : "0px"
        }), 
        $("#navbar-height-col").stop().animate({
            right: a ? s : "0px"
        }), 
        $(e).stop().animate({
            right: a ? "0px" : n
        }), 
        $(i).stop().animate({
            right: a ? "0px" : n
        }), 
        $(this).toggleClass("slide-active", !a), 
        $("#slidemenu").toggleClass("slide-active"), 
        $(".navbar, body, .navbar-header").toggleClass("slide-active"),
        $('#mainmenu-nav #mainmenu .navbar-nav').toggleClass('displayblock nav-fixed')
        
    });
    var d = "#slidemenu, body, .navbar, .navbar-header";
    $(window).on("resize", function() {
        $(window).width() > 767 && $(".navbar-toggle").is(":hidden") && $(d).removeClass("slide-active")
    })
}), $(document).ready(function() {
    $("#mainmenu-nav.navbar2").append($('<div id="navbar-height-col2"></div>'));
    var a = ".navbar-toggle",
        e = "#page-content",
        i = ".navbar-header2",
        n = "265px",
        t = "-265px",
        s = "-265px";
    
    $("#mainmenu-nav").on("click", a, function() {
        var a = $(this).hasClass("slide-active");
        $("#mainmenu").stop().animate({
            left: a ? t : "0px"
        }), 
        $("#navbar-height-col2").stop().animate({
            left: a ? s : "0px"
        }), 
        $(e).stop().animate({
            left: a ? "0px" : n
        }), 
        $(i).stop().animate({
            left: a ? "0px" : n
        }), 
        $(this).toggleClass("slide-active", !a), 
        $(".navbar2, body, .navbar-header2").toggleClass("slide-active"),
        $('#mainmenu-nav #mainmenu .navbar-nav').toggleClass('displayblock nav-fixed')
        
        
    });
    var d = "#mainmenu, body, .navbar2, .navbar-header2";
    $(window).on("resize", function() {
        $(window).width() > 767 && $(".navbar-toggle").is(":hidden") && $(d).removeClass("slide-active")
    })
});