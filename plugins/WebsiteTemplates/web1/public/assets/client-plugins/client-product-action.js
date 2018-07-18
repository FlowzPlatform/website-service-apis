$(document).ready(function(){
    let pid = getParameterByName('pid');

    // download variation images
    $("#download_image").on("click",async function(){
        let productResponse = await getProductDetailById(pid)
        if(productResponse != null && productResponse.images != undefined){
            // console.log("productResponse",productResponse);
            let zip = new JSZip();
            let count = 0;
            let zipFilename = productResponse.sku+".zip";
            let urls = productResponse.images[0].images;
// console.log("urls",urls,zipFilename);
            urls.forEach(function(urlObj){
              let filename = urlObj.web_image;
              // loading a file and add it in a zip file
              JSZipUtils.getBinaryContent(urlObj.secure_url, function (err, data) {
                 if(err) {
                    throw err; // or handle the error
                 }
                 zip.file(filename, data, {binary:true});
                 count++;
                 if (count == urls.length) {
                   zip.generateAsync({type:'blob'}).then(function(content) {
                    //  window.location = "data:application/zip;base64," + content;
                      saveAs(content, zipFilename);
                      // location.href="data:application/zip;base64," + content;
                   });
                }
              });
            });
        }
    })
});
