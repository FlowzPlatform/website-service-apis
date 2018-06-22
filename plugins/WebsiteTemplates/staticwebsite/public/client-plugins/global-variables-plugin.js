var globalVariables = [];
var brandName;

var userEmail = '';
var projectID = '';
var configDataUrl = '';

// var baseURL = 'https://api.flowzcluster.tk/serverapi';
// var socketHost = 'https://ws.flowzcluster.tk:4032';

var baseURL = '';
var socketHost = '';

$(document).ready(async function() {
    await getProjectInfo();
    ImplementSocket();
});

async function getProjectInfo() {
    await $.getJSON( "./assets/project-details.json", function( data ) {  
        var configData = data;
        userEmail = data[0].projectOwner;
        projectID = data[0].projectID;

        baseURL = 'https://api.' + data[0].domainkey + '/serverapi';
        socketHost = 'https://ws.' + data[0].domainkey + ':4032';

        configDataUrl = baseURL + "/project-configuration/" + projectID;
    });

    getConfigData();
}

async function getConfigData () {

    await $.getJSON( configDataUrl , function( data ) {  
        var configData = data.configData;
        globalVariables = configData[1].projectSettings[1].GlobalVariables;
    }); 

    updateGlobalVariables();
}

async function updateGlobalVariables () {
    $('body [id="brandName"]').html(brandName);
  
    // Replace all global variables
    for (var i = 0; i < globalVariables.length; i++){

        switch(globalVariables[i].variableType){
            case 'text':
                if(($('body [data-global-id="' + globalVariables[i].variableId + '"]').length > 0)){
                    $('body [data-global-id="' + globalVariables[i].variableId + '"]').text(globalVariables[i].variableValue);
                } 
                break;
            case 'image':
                var _varId = globalVariables[i].variableId;
                var _varValue = globalVariables[i].variableValue;
                if(($('body [data-global-id="' + _varId + '"]').length > 0)){

                    $('body [data-global-id="' + _varId + '"]').children('img').attr('src', _varValue);

                    // if(globalVariables[i].isImageUrl == true){
                    //     $('body [data-global-id="' + _varId + '"]').children('img').attr('src', _varValue);
                    // } else {
                    //     var getImageData = await $.ajax({
                    //       url:'./assets/' + _varValue,
                    //       method: 'GET',
                    //       type: 'HEAD',
                    //       async: true,
                    //       error: function(err)
                    //       {
                    //         return false;
                    //       },
                    //       success: function(res)
                    //       {
                    //         $('body [data-global-id="' + _varId + '"]').children('img').attr('src', res);
                    //         return true;
                    //       }
                    //     });
                    // }
                  
                } 
                break;
            case 'hyperlink':
                if(($('body [data-global-id="' + globalVariables[i].variableId + '"]').length > 0)){
                    $('body [data-global-id="' + globalVariables[i].variableId + '"]').children('a')[0].text = globalVariables[i].variableTitle;
                    $('body [data-global-id="' + globalVariables[i].variableId + '"]').children('a')[0].href = globalVariables[i].variableValue;
                }
                break; 
            case 'html':
                if(($('body [data-global-id="' + globalVariables[i].variableId + '"]').length > 0)){
                    $('body [data-global-id="' + globalVariables[i].variableId + '"]').html(globalVariables[i].variableValue);
                } 
                break;
            default:
                console.log('No Variables Found'); 
        }

    }
}

function ImplementSocket() {
  var socket = io(socketHost);
  var client = feathers()
      .configure(feathers.hooks())
      .configure(feathers.socketio(socket));
  var flowzDirectoryService = client.service('project-configuration');

  flowzDirectoryService.on('updated', async function(flowzDirectoryService) {
    console.log('Configurations Updated:', flowzDirectoryService);

    getConfigData();

    $('body [id="brandName"]').html(brandName);
        $('body [id="brandLogo"]').attr('src', './assets/brand-logo.png');
    
        // Replace all global variables
        for (var i = 0; i < globalVariables.length; i++){

            switch(globalVariables[i].variableType){
                case 'text':
                    if(($('body [data-global-id="' + globalVariables[i].variableId + '"]').length > 0)){
                        $('body [data-global-id="' + globalVariables[i].variableId + '"]').text(globalVariables[i].variableValue);
                    } 
                    break;
                case 'image':
                    var _varId = globalVariables[i].variableId;
                    var _varValue = globalVariables[i].variableValue;
                    if(($('body [data-global-id="' + _varId + '"]').length > 0)){

                        $('body [data-global-id="' + _varId + '"]').children('img').attr('src', _varValue);

                        // if(globalVariables[i].isImageUrl == true){
                        //     $('body [data-global-id="' + _varId + '"]').children('img').attr('src', _varValue);
                        // } else {
                        //     var getImageData = await $.ajax({
                        //     url:'./assets/' + _varValue,
                        //     method: 'GET',
                        //     type: 'HEAD',
                        //     async: true,
                        //     error: function(err)
                        //     {
                        //         return false;
                        //     },
                        //     success: function(res)
                        //     {
                        //         $('body [data-global-id="' + _varId + '"]').children('img').attr('src', res);
                        //         return true;
                        //     }
                        //     });
                        // }
                    
                    } 
                    break;
                case 'hyperlink':
                    if(($('body [data-global-id="' + globalVariables[i].variableId + '"]').length > 0)){
                        $('body [data-global-id="' + globalVariables[i].variableId + '"]').children('a')[0].text = globalVariables[i].variableTitle;
                        $('body [data-global-id="' + globalVariables[i].variableId + '"]').children('a')[0].href = globalVariables[i].variableValue;
                    }
                    break; 
                case 'html':
                    if(($('body [data-global-id="' + globalVariables[i].variableId + '"]').length > 0)){
                        $('body [data-global-id="' + globalVariables[i].variableId + '"]').html(globalVariables[i].variableValue);
                    } 
                    break;
                default:
                    console.log('No Variables Found'); 
            }

        }    
    
  });
}