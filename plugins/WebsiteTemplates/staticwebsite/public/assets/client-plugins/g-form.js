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