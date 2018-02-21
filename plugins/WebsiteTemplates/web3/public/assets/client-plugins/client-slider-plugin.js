
var SliderHtml='';
for(var i=0;i<=3;i++)
{
    if($('Slider').attr('Image'+i))
    {
        SliderHtml +='<div class="item active"><div class="carousel-caption"><h1>Be Unique, Be the One</h1><span>Addi-Fabrizio</span><h2>Bluetooth Speaker</h2><p>Great sound can go where you do. So whatever you do with your smartphone or tablet, wherever you do it, do it out loud.</p><a href="javascript:void(0);">Buy</a></div><img src="'+$("Slider").attr("Image"+i)+'" alt="" class="slider-img" /></div>';
    }
}
$('#dynamicslider').html(SliderHtml);
