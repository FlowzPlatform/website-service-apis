// Activate smooth scroll
$(document).on("click", ".smooth-scroll", function(event) {
    event.preventDefault();
    $("html, body").animate({
        scrollTop: $($.attr(this, "href")).offset().top
    }, 500);
});

// G-Form custom components
try {
  var class_g_form = '.g-form';
  var class_g_form_panel = '.g-form-panel';
  var class_g_form_group_button = '.g-form-group-button';
  var entitys = [];
  var data = [];
  var schemaarr = {}
  var configs = {};
  window.addEventListener("message", function(event) {
    if (event.data && event.data.entity) {
      entitys = event.data.entity
    }
    if (event.data && event.data.formData && event.data.schema) {
      data = event.data.formData
      schemaarr = event.data.schema
      configs = event.data.configs
      this.setValue()
    }
  });
  var setValue = () => {
    AWS.config.update({
      accessKeyId: configs.accesskey,
      secretAccessKey: configs.secretkey
    });
    AWS.config.region = 'us-west-2';
    var $form = document.querySelector(class_g_form);
    // console.log('schemaarr', schemaarr)
    setRecursiveValues(data, entitys, $form)
  }
  var setRecursiveValues = (data, entitys, $form) => {
    // console.log('...... setRecursiveValues :: ', data, entitys, $form)
    var clone_panel = $form.querySelector(class_g_form_panel).cloneNode(true)
    if (data != undefined) {
      for (var [index, item] of data.entries()) {
        var $panels = $form.querySelectorAll(':scope >' + class_g_form_panel)
        if (index > 0) {
          $panels[$panels.length - 1].insertAdjacentHTML('afterend', clone_panel.outerHTML)
        }
        for (var [inx, entity] of entitys.entries()) {
          $panels = $form.querySelectorAll(':scope >' + class_g_form_panel)
          if (entity.hasOwnProperty('customtype') && entity.customtype) {
            if ($panels[$panels.length - 1].querySelector('[attr-id="' + entity.name + '"]')) {
              setRecursiveValues(item[entity.name], entity.entity, $panels[$panels.length - 1].querySelector('[attr-id="' + entity.name + '"]').querySelector(class_g_form))
            }
          } else {
            // console.log('entity:: ', entity)
            if (entity.type == 'file') {
              if (item[entity.name] != undefined || item[entity.name] != null) {
                $panels[$panels.length - 1].querySelector('[name="' + entity.name + '"]').value = []
                var source = $($panels[$panels.length - 1].querySelector('div[data-display-file-for="' + entity.name + '"]')).html(); 
                var template = Handlebars.compile(source);
                // $panels[$panels.length - 1].querySelector('div[data-display-file-for="' + entity.name + '"]')
                console.log('item >>>>>>>>', item)
                $($panels[$panels.length - 1].querySelector('div[data-display-file-for="' + entity.name + '"]')).html(template(item));
              }
            } else {
              if (item[entity.name] != undefined || item[entity.name] != null) {
                $panels[$panels.length - 1].querySelector('[name="' + entity.name + '"]').value = item[entity.name]
              }
            }
          }
        }
      }
    }
  }
  var getValidate = (event, schema, form) => {
    let self = this
    let err = []
    let val, result, element, newSchema
    schema === undefined ? newSchema = self.customSchema : newSchema = schema
    let emailRegEx = '(\\w+)\\@(\\w+)\\.[a-zA-Z]'
    let numberRegEx = '^[0-9]+$'
    let phoneRegEx = '^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$'
    let dateRegEx = '(0?[1-9]|[12]\\d|30|31)[^\\w\\d\\r\\n:](0?[1-9]|1[0-2])[^\\w\\d\\r\\n:](\\d{4}|\\d{2})'
    Object.keys(event).forEach(function(key, index) {
      for (var i = 0; i < newSchema.length; i++) {
        if (key === newSchema[i].name || Array.isArray(newSchema[i])) {
          val = event[key]
          result = newSchema[i]
          element = {
            value: event[key],
            name: key,
            // type: newSchema[i].customtype ? 'customtype' : newSchema[i].type
            type: Array.isArray(newSchema[i]) ? 'customtype' : newSchema[i].type
          }
          if (element.type === 'customtype') {
            var inndervalidate = self.getValidate(event[key], newSchema[i], form.querySelector(class_g_form))
          } else {
            if (result.property.optional === false) {
              if (val === '' || val === null || val === undefined || (Array.isArray(val) && val.length === 0)) {
                err.push(element.name + ' - is required..!')
                $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text(element.name + ' - is required..!')
              } else {
                // console.log(element.name, ' >>> ', element.type)
                if (element.type === 'text') {
                  if (result.property.regEx !== null && result.property.regEx !== undefined) {
                    let pttrn = new RegExp(result.property.regEx)
                    let regEx = pttrn.test(val)
                    if (!regEx) {
                      err.push(element.name + ' - Enter proper format..!')
                      $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text(element.name + ' - Enter proper format..!')
                    } else {
                      if (result.property.max != 0 && val.length > result.property.max) {
                        err.push(element.name + ' - Enter proper format..!')
                        $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text(element.name + ' - max ' + result.property.max + ' character allowed..!')
                      } else {
                        let exist = false
                        if (result.property.allowedValue.length != 0) {
                          for (let i = 0; i < result.property.allowedValue.length; i++) {
                            if (result.property.allowedValue[i] == val) {
                              exist = true
                            }
                          }
                        } else {
                          exist = true
                        }
                        if (!exist) {
                          err.push(element.name + ' - Not allowed value, please enter allow one..!')
                          $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text(element.name + '- Not allowed value, please enter allow one..!')
                        } else {
                          $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text('')
                        }
                      }
                    }
                  }
                } else if (element.type === 'email') {
                  let re = new RegExp(emailRegEx)
                  let testEmail = re.test(val)
                  if (!testEmail) {
                    err.push(element.name + ' - Enter valid email address..!')
                    $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text(element.name + ' - Enter valid email address..!')
                  } else {
                    let exist = false
                    if (result.property.allowedValue.length != 0) {
                      for (let i = 0; i < result.property.allowedValue.length; i++) {
                        if (result.property.allowedValue[i] == val) {
                          exist = true
                        }
                      }
                    } else {
                      exist = true
                    }
                    if (!exist) {
                      err.push(element.name + ' - Not allowed value, please enter allow one..!')
                      $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text(element.name + '- Not allowed value, please enter allow one..!')
                    } else {
                      $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text('')
                    }
                  }
                } else if (element.type === 'number') {
                  let re = new RegExp(numberRegEx)
                  if (result.property.regEx != '' && result.property.regEx != null && result.property.regEx != undefined) {
                    re = new RegExp(result.property.regEx)
                  }
                  testEmail = re.test(val)
                  if (!testEmail) {
                    err.push(element.name + ' - Enter numbers only..!')
                    $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text(element.name + ' - Enter numbers only..!')
                  } else {
                    if (result.property.max != '' && result.property.max != undefined && result.property.min != '' && result.property.max != undefined) {
                      if (result.property.max != 0 && result.property.min != 0) {
                        if (val < result.property.min) {
                          err.push(element.name + ' - Value must be greater than !' + result.property.min)
                          $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text(element.name + ' - Value must be greater than or equal ' + result.property.min + ' ..!')
                        } else if (val > result.property.max) {
                          err.push(element.name + ' - Value must be less than !' + result.property.max)
                          $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text(element.name + ' - Value must be less than or equal ' + result.property.max + ' ..!')
                        } else {
                          let exist = false
                          if (result.property.allowedValue.length != 0) {
                            for (let i = 0; i < result.property.allowedValue.length; i++) {
                              if (result.property.allowedValue[i] == val) {
                                exist = true
                              }
                            }
                          } else {
                            exist = true
                          }
                          if (!exist) {
                            err.push(element.name + ' - Not allowed value, please enter allow one..!')
                            $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text(element.name + '- Not allowed value, please enter allow one..!')
                          } else {
                            $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text('')
                          }
                        }
                      } else {
                        let exist = false
                        if (result.property.allowedValue.length != 0) {
                          for (let i = 0; i < result.property.allowedValue.length; i++) {
                            if (result.property.allowedValue[i] == val) {
                              exist = true
                            }
                          }
                        } else {
                          exist = true
                        }
                        if (!exist) {
                          err.push(element.name + ' - Not allowed value, please enter allow one..!')
                          $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text(element.name + '- Not allowed value, please enter allow one..!')
                        } else {
                          $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text('')
                        }
                      }
                    } else {
                      let exist = false
                      if (result.property.allowedValue.length != 0) {
                        for (let i = 0; i < result.property.allowedValue.length; i++) {
                          if (result.property.allowedValue[i] == val) {
                            exist = true
                          }
                        }
                      } else {
                        exist = true
                      }
                      if (!exist) {
                        err.push(element.name + ' - Not allowed value, please enter allow one..!')
                        $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text(element.name + '- Not allowed value, please enter allow one..!')
                      } else {
                        $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text('')
                      }
                    }
                  }
                } else if (element.type === 'phone') {
                  let re = new RegExp(phoneRegEx)
                  if (result.property.regEx != '' && result.property.regEx != null && result.property.regEx != undefined) {
                    re = new RegExp(result.property.regEx)
                  }
                  testEmail = re.test(val)
                  if (!testEmail) {
                    err.push(element.name + ' - Enter valid phone number..!')
                    $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text(element.name + ' - Enter valid phone number..!')
                  } else {
                    let exist = false
                    if (result.property.allowedValue.length != 0) {
                      for (let i = 0; i < result.property.allowedValue.length; i++) {
                        if (result.property.allowedValue[i] == val) {
                          exist = true
                        }
                      }
                    } else {
                      exist = true
                    }
                    if (!exist) {
                      err.push(element.name + ' - Not allowed value, please enter allow one..!')
                      $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text(element.name + '- Not allowed value, please enter allow one..!')
                    } else {
                      $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text('')
                    }
                  }
                } else if (element.type === 'date') {
                  if (result.property.maxdate != '' && result.property.maxdate != undefined && result.property.mindate != '' && result.property.maxdate != undefined) {
                    if (result.property.maxdate != '' && result.property.mindate != '') {
                      if (val < result.property.mindate) {
                        err.push(element.name + ' - Date must be greater than !' + result.property.mindate)
                        $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text(element.name + ' - Date must be greater than or equal ' + result.property.mindate + ' ..!')
                      } else if (val > result.property.maxdate) {
                        err.push(element.name + ' - Date must be less than !' + result.property.maxdate)
                        $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text(element.name + ' - Date must be less than or equal ' + result.property.maxdate + ' ..!')
                      } else {
                        $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text('')
                      }
                    } else {
                      $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text('')
                    }
                  } else {
                    $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text('')
                  }
                } else if (element.type === 'dropdown') {
                  // console.log('>>>>', element.name, ' >>> ', element.type, result.property)
                  let exist = false
                  if (result.property.options.length != 0) {
                    for (let i = 0; i < result.property.options.length; i++) {
                      if (result.property.options[i] == val) {
                        exist = true
                      }
                    }
                  } else {
                    exist = true
                  }
                  if (!exist) {
                    err.push(element.name + ' - Please Select input!')
                    $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text(element.name + '- Please Select input!')
                  } else {
                    $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text('')
                  }
                } else {
                  $(form.querySelector('span[data-validate-for="' + element.name + '"]')).text('')
                }
              }
            }
          }
        }
      }
    })
    // console.log('ERROR:: ', err)
    if (err.length > 0) {
      return false
    } else {
      return true
    }
  }
  var getValues = async() => {
    var $form = document.querySelector(class_g_form)
    var _tempdata = await getRecursiveValues($form, entitys, schemaarr)
    console.log('............................ _tempdata:: ', _tempdata)
    if (_tempdata.msg) {
      console.log('Validated..')
      parent.postMessage(_tempdata.data, "*");
    }
  }
  var getRecursiveValues = async($form, entitys, schema) => {
    var datas = [];
    var validarr = [];
    for (let [i, form] of $form.querySelectorAll(':scope >' + class_g_form_panel).entries()) {
      var mdata = {}
      for (var [index, entity] of entitys.entries()) {
        if (entity.customtype) {
          if (form.querySelector('[attr-id="' + entity.name + '"]')) {
            var s = await getRecursiveValues(form.querySelector('[attr-id="' + entity.name + '"]').querySelector(class_g_form), entity.entity, schema[index])
            mdata[entity.name] = s.data
            validarr.push(s.msg)
          } else {
            mdata[entity.name] = ''
          }
        } else {
          // console.log('.............', entity.name, form.querySelector('[name="' + entity.name + '"]'))
          if (form.querySelector('[name="' + entity.name + '"]') !== null) {
            if (form.querySelector('[name="' + entity.name + '"]').type != null && form.querySelector('[name="' + entity.name + '"]').type == 'file') {
              let bucket = new AWS.S3({
                params: {
                  Bucket: 'airflowbucket1/obexpense/expenses'
                }
              });
              let fileChooser = form.querySelector('[name="' + entity.name + '"]');
              console.log('fileChooser', fileChooser, fileChooser.files)
             
              let filearr = []
              for(let f = 0; f < fileChooser.files.length; f++) {
                let file = fileChooser.files[f];
                if (file) {
                  let fileurl = await getFileUrl(file, f)
                  console.log('fileurl multi............', fileurl)
                  filearr.push(fileurl)
                } else {
                  filearr.push('')
                } 
              }
              if (data !== undefined &&  data[i] != undefined && data[i][entity.name] !== undefined && data[i][entity.name].length > 0) {
                for (let j of data[i][entity.name]) {
                  filearr.push(j)
                }
              }
              // console.log('data........', data[i][entity.name], filearr)
              mdata[entity.name] = filearr
            } else {
              mdata[entity.name] = await form.querySelector('[name="' + entity.name + '"]').value
            }
          } else {
            mdata[entity.name] = ''
          }
          // if (form.querySelector('[name="' + entity.name + '"]').type == 'file') {
          //   let bucket = new AWS.S3({
          //     params: {
          //       Bucket: 'airflowbucket1/obexpense/expenses'
          //     }
          //   });
          //   let fileChooser = form.querySelector('[name="' + entity.name + '"]');
          //   let file = fileChooser.files[0];
          //   if (file) {
          //     let fileurl = await getFileUrl(file)
          //     data[entity.name] = fileurl
          //   } else {
          //     data[entity.name] = ''
          //   }
          // } else {
          // }
        }
      }
      validated = this.getValidate(mdata, schema, form)
      // console.log('validated....', validated, validarr)
      validarr.push(validated)
      datas.push(mdata)
    }
    let valid = true
    for (let i = 0; i < validarr.length; i++) {
      if (!validarr[i]) {
        valid = false
      }
    }
    return {
      data: datas,
      msg: valid
    }
  }
  var getFileUrl = (file, f) => {
    // console.log('file', file)
    return new Promise((resolve, reject) => {
      let bucket = new AWS.S3({
        params: {
          Bucket: 'airflowbucket1/obexpense/expenses'
        }
      });
      var params = {
        Key: moment().valueOf().toString() + f + file.name,
        ContentType: file.type,
        Body: file
      };
      bucket.upload(params).on('httpUploadProgress', function(evt) {
      }).send(function(err, data) {
        if (err) {
          console.log('>>>>>>>>>>>>>>>>>>>. File Error:: ', err)
          resolve('')
        }
        resolve(data.Location)
      })
    })
  }
  var handleAdd = (event) => {
    var target = event.target || event.srcElement;
    var $buttonGroup = target.closest(class_g_form_group_button)
    var $parent = target.closest(class_g_form)
    var $cloneMain = $parent.querySelector(class_g_form_panel).cloneNode(true)
    getHtml($cloneMain)
    $buttonGroup.insertAdjacentHTML('beforebegin', $cloneMain.outerHTML);
  }
  var getHtml = ($cloneMain) => {
    if ($cloneMain.querySelector(class_g_form)) {
      var $cloneChild = $cloneMain.querySelector(class_g_form).querySelector(class_g_form_panel).cloneNode(true);
      while ($cloneMain.querySelector(class_g_form).querySelector(class_g_form_panel)) {
        $cloneMain.querySelector(class_g_form).querySelector(class_g_form_panel).remove()
      }
      $cloneMain.querySelector(class_g_form).querySelector(class_g_form_group_button).insertAdjacentHTML('beforebegin', $cloneChild.outerHTML)
      getHtml($cloneMain.querySelector(class_g_form).querySelector(class_g_form_panel))
    }
  }
  var handleDelete = (event) => {
    var target = event.target || event.srcElement;
    var $parent = target.closest(class_g_form_panel);
    if ($parent.closest(class_g_form).querySelectorAll(':scope > ' + class_g_form_panel).length > 1) {
      $parent.remove();
    }
  }
} catch (err) {
  console.log(err)
}
// G-Form JS ends

// Progressbar component
try{
    var progress = $('progressbar').attr('progress');
    $(document).ready(function() {
        $('.progress-bar').attr('aria-valuenow', progress);
        $('.progress-bar').css('width', progress+ "%");
        $('.progress-bar').text(progress + "%")
    });
}
catch (err) {
    console.log('Progressbar not found!', err);
}

// Image gradient animation js
try {
    var color1 = $('imageanimation').attr('color1');
    var color2 = $('imageanimation').attr('color2');
    var color3 = $('imageanimation').attr('color3');
    var color4 = $('imageanimation').attr('color4');
    var color5 = $('imageanimation').attr('color5');
    var color6 = $('imageanimation').attr('color6');

    function hex_to_RGB(hex) {
        var m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
        return [parseInt(m[1], 16),parseInt(m[2], 16),parseInt(m[3], 16) ]
    }

    var color1 = hex_to_RGB(color1)
    var color2 = hex_to_RGB(color2)
    var color3 = hex_to_RGB(color3)
    var color4 = hex_to_RGB(color4)
    var color5 = hex_to_RGB(color5)
    var color6 = hex_to_RGB(color6)

    var colors = new Array(
    color1,
    color2,
    color3,
    color4,
    color5,
    color6);

    var step = 0;
    //color table indices for:
    // current color left
    // next color left
    // current color right
    // next color right
    var colorIndices = [0,1,2,3];

    //transition speed
    var gradientSpeed = 0.002;

    function updateGradient()
    {

        if ( $===undefined ) return;

        var c0_0 = colors[colorIndices[0]];
        var c0_1 = colors[colorIndices[1]];
        var c1_0 = colors[colorIndices[2]];
        var c1_1 = colors[colorIndices[3]];

        var istep = 1 - step;
        var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
        var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
        var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
        var color1 = "rgb("+r1+","+g1+","+b1+")";

        var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
        var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
        var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
        var color2 = "rgb("+r2+","+g2+","+b2+")";

        $('#gradient').css({
        background: "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"}).css({
            background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"});

        step += gradientSpeed;
        if ( step >= 1 )
        {
            step %= 1;
            colorIndices[0] = colorIndices[1];
            colorIndices[2] = colorIndices[3];

            //pick two new target color indices
            //do not pick the same as the current one
            colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
            colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;

        }
    }

    setInterval(updateGradient,10);
}
catch (err){
    console.log('Image gradient animation not found!', err);
}
// Image gradient animation ends

// Navbar Plugins JS
try{
    var menuData;

    $(document).ready(function(){
        var menuJsonName = './assets/' + $('.customMenu').attr('menuId') + '.json';

        $.getJSON({
            type: 'GET',
            url: menuJsonName,
            async: true,
            dataType: 'json',
            success: function(data) {
                menuData = {
                    "menu": data
                };

                var topLevelUl = true;
                $("#navigationDiv").html(makeUL(menuData.menu, topLevelUl, true));

                $('.navbar a.dropdown-toggle').on('click', function(e) {
                    var $el = $(this);
                    var $parent = $(this).offsetParent(".dropdown-menu");
                    $(this).parent("li").toggleClass('open');

                    if(!$parent.parent().hasClass('nav')) {
                        $el.next().css({"top": $el[0].offsetTop, "left": $parent.outerWidth() - 4});
                    }

                    $('.nav li.open').not($(this).parents("li")).removeClass("open");

                    return false;
                });
            }
        });
    });

    

    function makeUL(lst, topLevelUl, rootLvl) {
        var html = [];
        if (topLevelUl) {
            html.push('<ul class="nav navbar-nav" id="menu">');
            topLevelUl = false;
        } else {
            html.push('<ul class="dropdown-menu" role="menu">');
        }

        $(lst).each(function() {
            html.push(makeLI(this, topLevelUl, rootLvl))
        });
        html.push('</ul>');
        rootLvl = true;
        return html.join("\n");
    }

    function makeLI(elem, topLevelUl, rootLvl) {
        var html = [];
        if (elem.children && !rootLvl) {
            html.push('<li>');
        } else {
            html.push('<li>');
            rootLvl = false;
        }
        if (elem.title) {
            if (elem.children != undefined) {
                html.push("<a class='dropdown-toggle' data-toggle='dropdown' href='" + elem.customSelect + "''>" + elem.title + " </a>");
            } else {
                html.push("<a href='" + elem.customSelect + "'>" + elem.title + " </a>");
            }
        }

        if (elem.children) {
            html.push(makeUL(elem.children, topLevelUl, rootLvl));
        }
        html.push('</li>');
        return html.join("\n");
    }

    // $(document).ready(function() {
    //     $('.navbar a.dropdown-toggle').on('click', function(e) {
    //         var $el = $(this);
    //         var $parent = $(this).offsetParent(".dropdown-menu");
    //         $(this).parent("li").toggleClass('open');

    //         if(!$parent.parent().hasClass('nav')) {
    //             $el.next().css({"top": $el[0].offsetTop, "left": $parent.outerWidth() - 4});
    //         }

    //         $('.nav li.open').not($(this).parents("li")).removeClass("open");

    //         return false;
    //     });
    // });
}
catch (err) {
    console.log('Navigation menu not found!', err);
}
// Navbar Plugins JS ends

// Pagination Plugin
try{
    var nameAZ = $('Pagination').attr('nameaz');
    var nameZA = $('Pagination').attr('nameza');
    var priceLH = $('Pagination').attr('pricelh');
    var priceHL = $('Pagination').attr('pricehl');
    var itemAZ = $('Pagination').attr('itemaz');
    var itemZA = $('Pagination').attr('itemza');
    var options;

    if (nameAZ=='true')
    {
        options=options+'<option value="nameAZ">Name [A-Z]</option>'
    }

    if (nameZA=='true')
    {
        options=options+'<option value="nameZA">Name [Z-A]</option>'
    }

    if (priceLH=='true')
    {
        options=options+'<option value="priceLH">Price [Low-High]</option>'
    }

    if (priceHL=='true')
    {
        options=options+'<option value="priceLH">Price [High-Low]</option>'
    }

    if (itemAZ=='true')
    {
        options=options+'<option value="priceLH">#Item [A-Z]</option>'
    }

    if (itemZA=='true')
    {
        options=options+'<option value="itemZA"># Item [Z-A]</option>'
    }

    var PaginationHTML='<Pagination style="display:block; min-height: 20px; padding: 20px;"><head><link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script><style>.fa{margin-top:24px;float: left;font-size: x-large;} select{margin-top:18px; height: 30px;float:left; width:auto;/* display:table-cell; */}a{color: #0088cc; text-decoration: none;}a:hover{color: #005580; text-decoration: underline;}h2{padding-top: 20px;}h2:first-of-type{padding-top: 0;}ul{padding: 0;}.pagination{height: 30px;/* margin: 18px 0; */ float:right;}.pagination ul{/* display: table-cell; */ /* IE7 inline-block hack */ *zoom: 1; margin-left: 0; margin-bottom: 0; -webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px; -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); -moz-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);}.pagination li{display: inline;}.pagination a{float: left; padding: 0 14px; line-height: 34px; text-decoration: none; border: 1px solid #ddd; border-left-width: 0;}.pagination a:hover,.pagination .active a{background-color: #f5f5f5;}.pagination .active a{color: #999999; cursor: default;}.pagination .disabled span,.pagination .disabled a,.pagination .disabled a:hover{color: #999999; background-color: transparent; cursor: default;}.pagination li:first-child a{border-left-width: 1px; -webkit-border-radius: 3px 0 0 3px; -moz-border-radius: 3px 0 0 3px; border-radius: 3px 0 0 3px;}.pagination li:last-child a{-webkit-border-radius: 0 3px 3px 0; -moz-border-radius: 0 3px 3px 0; border-radius: 0 3px 3px 0;}.pagination-centered{text-align: center;}.pagination-right{text-align: right;}.button{background-color: #e7e7e7; /* Green */ border: none; color: black; padding: 10px 32px; text-align: center; text-decoration: none;/* display: table-cell; */ font-size: 16px; margin: 14px 2px; cursor: pointer; float:right;}.paginationtext{margin-top:20px; font-size:medium; color:black; float:left;}</style></head><div class="container"> <div class="row" style="background-color:rgba(208, 208, 208, 0.33); border:groove; margin:5px;"> <div class="col-sm-3"><i style="margin-top:24px;float: left;font-size: x-large;" aria-hidden=true class="fa fa-list fa-2x"><span style=display:inline-block;width:10px></span> </i><i style="margin-top:24px;float: left;" aria-hidden=true class="fa fa-table fa-2x"><span style=display:inline-block;width:15px></span></i> <select style="margin-top:20px;"> <option value="nameAZ"> '+options+'</option> </select> </div><div class="col-sm-4"> <p class="paginationtext"> Showing 130 Products</p><button class="button">Show All</button> </div><div class="col-sm-5"> <div class="pagination"> <ul> <li><a href="#">Prev</a></li><li class="active"> <a href="#">1</a> </li><li><a href="#">2</a></li><li><a href="#">3</a></li><li><a href="#">4</a></li><li><a href="#">Next</a></li></ul> </div></div></div></div></Pagination>'

    $('Pagination').html(PaginationHTML);
}
catch (err) {
    console.log('Pagination not found!', err);
}
// Pagination JS ends

// Popular products slider
try {
    var projectName = 'setNameHere';
    var rawData = {};
    var productData = {};
    var productHtml = "";
    var id = $("popularProducts").attr("id");
    var apiUrl = $('popularProducts').attr('apiurl');
    var apiUsername = $('popularProducts').attr('apiusername');
    var apiPassword = $('popularProducts').attr('apipassword');
    var numberOfItems = $('popularProducts').attr('numberofitems');

    $('#sliderListItems').html('<i class="fa fa-spinner fa-pulse fa-3x fa-fw">');

    $.ajax({
    type: 'GET',
    url: apiUrl,
    async: false,
    beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa( apiUsername + ":" + apiPassword));
        },
    dataType: 'json',
    success: function (data) {
        rawData = data.hits.hits;
        productData = rawData;
    }
    });

    if(numberOfItems == 'all' || numberOfItems == '' ){
        productHtml = '';
        for( var i in productData){
            productHtml += '<div class="col-sm-3"> <a href="http://localhost/websites/' + projectName + '/product-detail.layout?sku=' + productData[i]._source.sku + '"> <div class="col-item"> <div class="photo"> <img src="http://104.239.249.114/live-api/web/images/'+ productData[i]._source.default_image+'" class="img-responsive" alt="a"/> </div><div class="info"> <div class="row"> <div class="price col-md-6"> <h5>'+ productData[i]._source.product_name + '</h5> <h5 class="price-text-color">$ '+ productData[i]._source.price_1 +'</h5> </div><div class="rating hidden-sm col-md-6"> <i class="price-text-color fa fa-star"></i><i class="price-text-color fa fa-star"> </i><i class="price-text-color fa fa-star"></i><i class="price-text-color fa fa-star"> </i><i class="fa fa-star"></i> </div></div><div class="separator clear-left"> <p class="btn-add"> <i class="fa fa-shopping-cart"></i><a href="#" class="hidden-sm">Add to cart</a></p><p class="btn-details"> <i class="fa fa-list"></i><a href="http://localhost/websites/' + projectName + '/product-detail.layout?sku=" class="hidden-sm">More details</a></p></div><div class="clearfix"> </div></div></div></a> </div>';
        }
    } else {
        productHtml = '';
        for( var i = 0; i<numberOfItems; i++ ){
            productHtml += '<div class="col-sm-3"> <a href="http://localhost/websites/' + projectName + '/product-detail.layout?sku=' + productData[i]._source.sku + '"> <div class="col-item"> <div class="photo"> <img src="http://104.239.249.114/live-api/web/images/'+ productData[i]._source.default_image+'" class="img-responsive" alt="a"/> </div><div class="info"> <div class="row"> <div class="price col-md-6"> <h5>'+ productData[i]._source.product_name + '</h5> <h5 class="price-text-color">$ '+ productData[i]._source.price_1 +'</h5> </div><div class="rating hidden-sm col-md-6"> <i class="price-text-color fa fa-star"></i><i class="price-text-color fa fa-star"> </i><i class="price-text-color fa fa-star"></i><i class="price-text-color fa fa-star"> </i><i class="fa fa-star"></i> </div></div><div class="separator clear-left"> <p class="btn-add"> <i class="fa fa-shopping-cart"></i><a href="#" class="hidden-sm">Add to cart</a></p><p class="btn-details"> <i class="fa fa-list"></i><a href="http://localhost/websites/' + projectName + '/product-detail.layout?sku=" class="hidden-sm">More details</a></p></div><div class="clearfix"> </div></div></div></a> </div>';
        }
    }

    $('#sliderListItems').html(productHtml);
}
catch (err) {
    console.log('Popular products slider not found!', err);
}
// Popular products ends

// dataField JS
// const MyGroup = Vue.component('datafieldgroup', {
//   template: `<div class="dfgroup">
//                     <div class="dfrepeate" v-for="item in items"><slot :text="item"></slot></div>
//             </div>`,
//   props: ['data_api', 'data_schema'],
//   computed: {},
//   data: function() {
//     return {
//       items: []
//     }
//   },
//   mounted() {
//     this.getData()
//   },
//   methods: {
//     getData() {
//       let self = this;
//       console.log("data_schema", this.data_schema)
//       console.log("data_api", this.data_api)
//       if (this.data_schema != undefined) {
//         if (this.data_schema.length > 0) {
//           console.log("hello")
//           this.data_schema;
//           let schemaVal = this.data_schema.split(":");
//           let connString = $.trim(schemaVal[0]);
//           let schemaName = $.trim(schemaVal[1]);
//           let apiUrl = 'http://172.16.230.80:3080/connectiondata/' + connString + '?schemaname=' + schemaName;
//           $.getJSON(apiUrl, function(data) {
//             console.log(data)
//             self.items = data;
//           });
//         } else {
//           $.getJSON(this.data_api, function(data) {
//             console.log(data)
//             self.items = data;
//           });
//         }
//       } else {
//         $.getJSON(this.data_api, function(data) {
//           console.log(data)
//           self.items = data;
//         });
//       }
//     }
//   }
// });

// const MyObj = Vue.component('datafieldobject', {
//   template: `<div class="dfgroup">
//                     <div class="dfrepeate"><slot :text="items"></slot></div>
//             </div>`,
//   props: ['data_api', 'data_schema'],
//   computed: {},
//   data: function() {
//     return {
//       items: []
//     }
//   },
//   mounted() {
//     this.getData()
//   },
//   methods: {
//     getData() {
//       let self = this;
//       console.log("data_schema", this.data_schema)
//       console.log("data_api", this.data_api)
//       if (this.data_schema != undefined) {
//         if (this.data_schema.length > 0) {
//           console.log("hello")
//           this.data_schema;
//           let schemaVal = this.data_schema.split(":");
//           let connString = $.trim(schemaVal[0]);
//           let schemaName = $.trim(schemaVal[1]);
//           let apiUrl = 'http://172.16.230.80:3080/connectiondata/' + connString + '?schemaname=' + schemaName;
//           $.getJSON(apiUrl, function(data) {
//             console.log(data)
//             self.items = data;
//           });
//         } else {
//           $.getJSON(this.data_api, function(data) {
//             console.log(data)
//             self.items = data;
//           });
//         }
//       } else {
//         $.getJSON(this.data_api, function(data) {
//           console.log(data)
//           self.items = data;
//         });
//       }
//     }
//   }
// });

// const MyList = Vue.component('datafieldlist', {
//   template: '<div class="dflist"><div v-for="item in items"><slot :text="item"></slot></div></div>',
//   props: ['items']
// });

// const MyText = Vue.component('datafieldtext', {
//   template: '<div class="dftext"><h3>{{text}}</h3></div>',
//   props: ['text']
// });

// new Vue({
//   el: '#app',
//   components: {
//     MyGroup,
//     MyList,
//     MyText
//   }
// })
// dataField js ends

// Payment JS
try{
    var paymentgateways = [];

    var userEmail = '';
    var projectName = '';
    var configDataUrl = '';
    var ProjectbaseURL = '';
    // var baseURL = 'http://localhost:3032';
    // var socketURL = 'http://localhost:4032';
    var baseURL = 'http://api.flowzcluster.tk/serverapi';
    var socketHost = 'http://ws.flowzcluster.tk:4032';

    $(document).ready(function() {
        getProjectInfo();
        // ImpletementSocekt();
    });

    async function getProjectInfo() {
        await $.getJSON( "./assets/project-details.json", function( data ) {
            var configData = data;
            userEmail = data[0].projectOwner;
            projectName = data[0].projectName;

            configDataUrl = baseURL + "/project-configuration?userEmail=" + userEmail + "&websiteName=" + projectName;
        });
        getConfigData();
    }

    async function getConfigData () {

        await $.getJSON( configDataUrl , function( data ) {
            var configData = data.data[0].configData;
            // globalVariables = configData[1].projectSettings[1].GlobalVariables;
            paymentgateways=configData[1].projectSettings[1].PaymentGateways
            ProjectbaseURL=configData[0].repoSettings[0].BaseURL;
        });
        Paymentgateways();
    }


    async function Paymentgateways () {
        var paymentbuttons=''
        for(let i=0;i<paymentgateways.length;i++){
            if(paymentgateways[i].checked==true){
                paymentbuttons=paymentbuttons+'<button type="button" class="btn" data-id="'+ paymentgateways[i].name+'" title="'+ paymentgateways[i].description+'">'+paymentgateways[i].gateway+'</button>'
            }
        }
        $('paymentgateway').replaceWith(paymentbuttons);

    }
}
catch (err) {
    console.log('Error in Payment Module: ', err);
}
// Payment JS Ends


// CustomSliderComponent
try {

  let baseURL = '';
  let socketHost = '';
  let projectID = '';
  let userID = '';

  $(document).ready(async function() {
      await getProjectInfo();
      await ImplementSocket();
      let $form = document.querySelectorAll('customslidercomponent')
      await setBanners($form)
  });

  async function getProjectInfo() {
      await $.getJSON( "./assets/project-details.json", function( data ) {  
          projectID = data[0].projectID;
          // baseURL = 'http://localhost:3032'
          // socketHost= 'http://localhost:4032'
          baseURL = 'https://api.' + data[0].domainkey + '/serverapi';
          socketHost = 'https://ws.' + data[0].domainkey + ':4032';
          userID = data[0].UserID
          // configDataUrl = baseURL + "/project-configuration/" + projectID;
      });
  }

  function S4() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
  }

  function getUUID() {
    let guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
    return guid
  }


  async function setBanners($form, data) {
    // console.log('$form:: ', $form)
    for (let item of $form) {
      $(item).closest(".row").css({"display": "flex"});
      let bannertype_id = $(item).attr('slidercustom')
      let btype = $(item).attr('btype')
      let aplay = $(item).attr('aplay')
      let prebtn = $(item).attr('prev')
      let nexbtn = $(item).attr('next')
      let nav = $(item).attr('navigation')
      let slidespeed = $(item).attr('slidespeed')
      let pagination = $(item).attr('pagination')
      let ditems = $(item).attr('ditems')

      let bid = getUUID()
      // console.log('\nbannertype_id', bannertype_id, '\nbtype', btype, '\nautoplay', aplay, '\nprebtn', prebtn, '\nnexbtn', nexbtn, '\nnavigation', nav, '\npagination', pagination, '\nslidespeed', slidespeed, '\nditems', ditems)
      let mSider = ''
      if (bannertype_id != undefined && bannertype_id != '') {
        let checkBtype;
        if (data != undefined) {
          checkBtype = data
        } else {
          checkBtype = await getBannerType(bannertype_id)
        }
        // console.log('checkBtype::::', checkBtype)
        if (Object.keys(checkBtype).length != 0 && checkBtype.status && checkBtype.website_id == projectID) {
          let banners = await getBanners(bannertype_id)
          console.log('banners', banners)
          $(item).html('<div id="BannerSlider'+ bid +'" class="owl-carousel owl-theme"></div>')
          let content = '';
          if (banners.length > 0) {

            for (let [inx, slide] of banners.entries()) {
              let img = slide.banner_img
              let alt = slide.banner_name
              if(slide.banner_linkurl == '') {
                content += "<img style='display: block;width: 100%;height: auto;' src=\"" +img+ "\" alt=\"" +alt+ "\">"
              } else {
                if (slide.linkurl_target == 'same') {
                  content += "<a href="+ slide.banner_linkurl +"><img style='display: block;width: 100%;height: auto;' src=\"" +img+ "\" alt=\"" +alt+ "\"></a>"
                } else {
                  content += "<a href="+ slide.banner_linkurl +" target="+ slide.linkurl_target +"><img style='display: block;width: 100%;height: auto;' src=\"" +img+ "\" alt=\"" +alt+ "\"></a>"
                }
              }
            }

            $("#BannerSlider" + bid).html(content);

            let bannerconfig = {
              autoPlay: 5000
            }
            if (btype == 'brand') {
              bannerconfig.items = 5
              if (ditems != undefined && ditems != '') {
                bannerconfig.items = ditems
              }
            } else {
              bannerconfig.singleItem = true
            }
            if (aplay != undefined && aplay != '') {
              bannerconfig.autoPlay = aplay
            }
            if (pagination != undefined) {
              bannerconfig.pagination = true
            } else {
              bannerconfig.pagination = false
            }
            if (nav != undefined) {
              bannerconfig.navigation = true
              bannerconfig.navigationText = ['prev', 'next']
              if (prebtn != undefined && prebtn != '') {
                bannerconfig.navigationText[0] = prebtn 
              }
              if (nexbtn != undefined && nexbtn != '') {
                bannerconfig.navigationText[1] = nexbtn 
              }
            } else {
              bannerconfig.navigation = false
            }
            if (slidespeed != undefined && slidespeed != '') {
              bannerconfig.slideSpeed = slidespeed
            }
            // console.log('bannerconfig', bannerconfig)
            $("#BannerSlider" + bid).owlCarousel(bannerconfig);
          }
          
        }
      }
      // $(item).html(mSider)
    }
    // await startBanners()
  }

  // function getBannerConfigs(type, attr) {

  // } 

  function startBanners () {
    $(".owl-carousel1").owlCarousel({
      autoPlay: true,
      slideSpeed: 100,
      stopOnHover : true,
      navigation:false,
      // navigationText: ['<', '>'],
      items : 8,
      itemsDesktop: [1199, 4],
      itemsDesktopSmall: [979, 4],
      itemsTablet: [767, 2],
      itemsMobile: [479, 2]
    });
    $(".owl-carousel2").owlCarousel({
      autoPlay: true,
      navigation : false, // Show next and prev buttons
      slideSpeed : 300,
      paginationSpeed : 400,
      // navigationText: ['Prev', 'Next'],
      items : 1, 
      itemsDesktop : false,
      itemsDesktopSmall : false,
      itemsTablet: false,
      itemsMobile : false
    });  
  }

  async function getBanners (id) {
    if (baseURL != '') {
      let bannerUrl = baseURL + '/banners?userId='+userID+'&banner_type=' + id + '&banner_status=true&$paginate=false';
     
      let resp = await $.getJSON( bannerUrl ).then(res => {
        // console.log('res', res)
        return res
      }).catch(err => {
        console.log(':: Error :: ', err)
        return []
      })
      return resp
    } else {
      return []
    }
  }

  async function getBannerType (id) {
    if (baseURL != '') {
      let bannerTypeUrl = baseURL + '/bannertype/' + id;
      // console.log('userID::', userID, 'projectID:::', projectID, bannerTypeUrl)
      let resp = await $.getJSON( bannerTypeUrl ).then(res => {
        return res
      }).catch(err => {
        console.log(':: Error :: ', err)
        return {}
      })
      return resp
    } else {
      return {}
    }
  }

  async function updateBanners($sform, data, type) {
    let banners = [];
    let checkBtype = '';
    if (type == 'bannertype') {
      checkBtype = data
      banners = await getBanners(data.id)
    } else {
      checkBtype = await getBannerType(data.banner_type)
      banners = await getBanners(data.banner_type)
    }
    let mSider = ''
    // console.log(checkBtype, banners, type)
    if (Object.keys(checkBtype).length != 0 && checkBtype.status) {
      if (banners.length > 0) {

        if (checkBtype.bt_category == 'brand_slider') {
          mSider += '<div class="owlcarouselcat"><div  class="owl-carousel1 owl-theme">'
          for (let [inx, slide] of banners.entries()) {
            if (slide.banner_linkurl == '') {
              mSider += '<div class="item" style="text-align: center;position:relative;max-width:100%;margin:0px;border:0px;"> <img src="'+ slide.banner_img +'" alt="'+ slide.banner_name +'"></div>'
            } else if(slide.linkurl_target == 'same') {
              mSider += '<div class="item" style="text-align: center;position:relative;max-width:100%;margin:0px;border:0px;"> <a href="' + slide.banner_linkurl + '"> <img src="'+ slide.banner_img +'" alt="'+ slide.banner_name +'"> </a> </div>'
            } else {
              mSider += '<div class="item" style="text-align: center;position:relative;max-width:100%;margin:0px;border:0px;"> <a href="' + slide.banner_linkurl + '" target="'+ slide.linkurl_target +'"> <img src="'+ slide.banner_img +'" alt="'+ slide.banner_name +'"> </a> </div>'
            }
          }
          mSider += '</div></div>'
        } else {
          if (banners.length == 1) {
            if (banners[0].banner_linkurl == '') {
              mSider += '<img src="' + banners[0].banner_img + '" class="img-responsive" style="width: -webkit-fill-available;height:auto;" alt="' + banners[0].banner_name + '">'
            } else {
              mSider += '<a href="' + banners[0].banner_linkurl + '" target="'+ banners[0].linkurl_target +'"><img src="' + banners[0].banner_img + '" class="img-responsive" alt="' + banners[0].banner_name + '" style="width: -webkit-fill-available;height:auto;"></a>'
            }
          } else {
            mSider += '<div class="owlcarouselcat"><div class="owl-carousel2 owl-theme" style="width:100%;height:auto;display:block;">'
            for (let [inx, slide] of banners.entries()) {
              if(slide.banner_linkurl == '') {
                mSider += '<div class="item" style="text-align: center;position:relative;max-width:100%;margin:0px;border:0px;"><img  class="img-responsive" src="'+ slide.banner_img +'" alt="'+ slide.banner_name +'" style="width: -webkit-fill-available;height:auto;"></div>'
              } else if (slide.linkurl_target == 'same') {
                mSider += '<div class="item" style="text-align: center;position:relative;max-width:100%;margin:0px;border:0px;"> <a href="' + slide.banner_linkurl + '"> <img  class="img-responsive" src="'+ slide.banner_img +'" alt="'+ slide.banner_name +'" style="width: -webkit-fill-available;height:auto;"> </a> </div>'
              } else {
                mSider += '<div class="item" style="text-align: center;position:relative;max-width:100%;margin:0px;border:0px;"> <a href="' + slide.banner_linkurl + '" target="'+ slide.linkurl_target +'"> <img  class="img-responsive" src="'+ slide.banner_img +'" alt="'+ slide.banner_name +'" style="width: -webkit-fill-available;height:auto;"> </a> </div>'
              }
            } 
            mSider += '</div></div>'
          }
        }
      
      }
    }
    for (let item of $sform) {
      $(item).html(mSider)
    }
    await startBanners()
  }

  function ImplementSocket() {
    if (socketHost != '') {
      let socket = io(socketHost);
      let client = feathers()
          .configure(feathers.hooks())
          .configure(feathers.socketio(socket));
      let BannersService = client.service('banners');
      let BannerTypeService = client.service('bannertype');

      BannersService.on('updated', async function(data) {
        if (data.userId == userID) {
          console.log('Updated......................Banners')
          let $sform = $('customslidercomponent[slidercustom= '+data.banner_type+']')
          console.log($sform)
          if ($sform.length > 0) {
            await setBanners($sform)
            // await updateBanners($sform, data, 'banners')
          }
        }
      })

      BannersService.on('created', async function(data) {
        if (data.userId == userID) {
          let $sform = $('customslidercomponent[slidercustom= '+data.banner_type+']')
          if ($sform.length > 0) {
            await setBanners($sform)
            // await updateBanners($sform, data)
          }
        }
      })

      BannersService.on('removed', async function(data) {
        if (data.userId == userID) {
          let $sform = $('customslidercomponent[slidercustom= '+data.banner_type+']')
          if ($sform.length > 0) {
            await setBanners($sform)
            // await updateBanners($sform, data)
          }
        }
      })

      BannerTypeService.on('updated', async function(data) {
        if (data.userId == userID && data.website_id == projectID) {
          console.log('Updated BannerType ::::::::::::::::::::: ')
          let $sform = $('customslidercomponent[slidercustom= '+data.id+']')
          if ($sform.length > 0) {
            await setBanners($sform, data)
            // await updateBanners($sform, data, 'bannertype')
          }
        }
      })

      BannerTypeService.on('removed', async function(data) {
        if (data.userId == userID && data.website_id == projectID) {
          console.log('Removed BannerType ::::::::::::::::::::: ')
          let $sform = $('customslidercomponent[slidercustom= '+data.id+']')
          if ($sform.length > 0) {
            for(let item of $sform) {
              $(item).html('')
            }
          }
        }
      })

    }

  }
} 
catch (err) {
  console.log('Error in CustomSliderComponent Module: ', err)
}
// CustomSliderComponent JS
