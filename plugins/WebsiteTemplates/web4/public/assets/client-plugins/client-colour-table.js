$(document).ready(function(){
  $("#attribute_option").on("change", function(){
    showPageAjaxLoading()
      let productHtmlColorTable = '';
      let attribute_name = $(this).val();
      let replace_attribute_name = replaceWithUnderscore(attribute_name);
      let colortablehead = '<tr><th class="text-center" width="150">Attribute Value</th><th class="text-center" width="150">#Hexcode</th><th class="text-center" width="250">Action</th><th class="text-center" width="150">Color Swatch</th></tr>';
       axios({
           method: 'GET',
           url: project_settings.color_swatch_filter_api+attribute_name,
           headers: {'Authorization': userToken,'vid': website_settings.Projectvid.vid},
         })
       .then(response => {
        $.each(response.data.aggregations.group_by_attributes.buckets, async function( index, value ) {

           let colorval;
           colorval = replaceWithUnderscore(value.key);
           let response =  await fetchColornameInService(value.key,attribute_name)
           let hexKeyVal = ''
           let colorKeyId = 0;
           let swatchColorHtml = ''
           if(response != null && response.data.data.length > 0){
             hexKeyVal = response.data.data[0].hexcode
             colorKeyId = response.data.data[0].id
             swatchColorHtml = '<span style="border: 1px solid #ccc; height: 27px; width: 27px; background-color: '+hexKeyVal+'; display: inline-block ;" data-toggle="tooltip"></span>'
           }
          productHtmlColorTable +=  '<tr id="attri-val-'+colorval+'-'+replace_attribute_name+'" value="'+value.key+'" class="trtag"><td class="text-center attribute_val_'+colorval+'_color">'+value.key +'</td><td class="text-center"> <input class="text-center" type="text" placeholder="Enter Hexcode" id="color_hexcode_'+colorval+'_color" name="color_hexcode" value="'+hexKeyVal.trim()+'"></td><td class="text-center"> <a href="#" class="admin-custom-btn text-center js-add-hex-code"'+ 'data-hex-key-id="'+colorKeyId+'" data-attribute-name="'+attribute_name+'" dataColorName="'+value.key+'" dataColorId= "'+colorval+'"><i class="fa fa-check-circle-o"></i>Save</a></td><td class="text-center swatch-color">'+swatchColorHtml+'</td></tr>'
      });
        setTimeout(function () {
          $("#sort").html(colortablehead + productHtmlColorTable);
          hidePageAjaxLoading();
        },5000)
       }).catch(error => {
           hidePageAjaxLoading();
       });
     });
});

async function fetchColornameInService(colorName,attribute_name){
 var result = await axios({
     method: 'GET',
     url: project_settings.color_table_api_url,
     params:{ 'colorname': colorName,'attribute_name':attribute_name}
   })
 .then(response => {
   let res = '';
   if(response.data.data.length>0){
     res = response;
   }
   return response;
 }).catch(error => {

  });
  return result
}


$(document).on('click', '.js-add-hex-code', function() {
     let thisObj = $(this);
     let divColorId = thisObj.parent().parent('tr').attr("id")
     let id = thisObj.attr("data-hex-key-id");
     let swatchname = thisObj.attr("datacolorname");
      let attribute_value_id = replaceWithUnderscore(thisObj.attr("datacolorname"));
      let hexcode = $("#color_hexcode_"+attribute_value_id+'_color').val();
      let optionName = thisObj.attr("data-attribute-name")

      if(hexcode == ""){
        showErrorMessage("Please enter hexcode");
        return false;
      }
      let isValid = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hexcode);
      if(!isValid){
        showErrorMessage("Please enter valid hexcode");
        return false;
      }
      if(id == 0){
        let param1 = {
           colorname :swatchname,
           hexcode : hexcode,
           attribute_name : optionName,
           vid: website_settings.Projectvid.vid
         }
         axios({
                method: 'post',
                url: project_settings.color_table_api_url,
                data: param1,
         }).then(function (res) {
                $('#'+divColorId+ ' .swatch-color').html('<span style="border: 1px solid #ccc; height: 27px; width: 27px; background-color: '+hexcode+'; display: inline-block ;" data-toggle="tooltip"></span>');
                thisObj.attr("data-hex-key-id",res.data.id)
         })
      }else{
        let param2 = {
           hexcode : hexcode
         }
         axios({
                method: 'patch',
                url: project_settings.color_table_api_url+"/"+id,
                data: param2,
         }).then(function (res) {
                $('#'+divColorId+ ' .swatch-color').html('<span style="border: 1px solid #ccc; height: 27px; width: 27px; background-color: '+hexcode+'; display: inline-block ;" data-toggle="tooltip"></span>');
         })
      }
   });

function replaceWithUnderscore(value){
 let returnVal = value.toLowerCase();
 returnVal = returnVal.replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '_').replace(/^(-)+|(-)+$/g,'').toLowerCase();
 return returnVal;
}
