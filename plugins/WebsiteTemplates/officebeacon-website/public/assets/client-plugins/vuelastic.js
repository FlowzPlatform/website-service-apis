const paginate = Vue.component('paginate', VuejsPaginate);

  // const dfGroup = Vue.component('datasfieldgroup', {
  //   template: `<div class="grid">
  //               <template v-for="item in items1"><slot :text="item"></slot>
  //               </template>
  //             </div>`,
  //   props: ['items1', 'data_schema', 'data_api', 'draggable'],
  //   computed: {},
  //   data: function() {
  //     return {
  //       items: this.items1
  //     }
  //   },
  //   components: {
  //   },
  //   watch: {
  //     items: function() {}
  //   },
  //   created() {

  //     let self = this;
  //     let api_url;
  //     let api_listen;
  //     if (this.data_schema == undefined) {
  //       var a = this.data_api.lastIndexOf("/");
  //       api_url = this.data_api.substring(0, a)
  //       api_listen = this.data_api.substring(a + 2, this.data_api.length)

  //     } else {
  //       let schemaVal = this.data_schema.split(":");
  //       let connString = $.trim(schemaVal[0]);
  //       let schemaName = $.trim(schemaVal[1]);
  //       api_url = "http://api.flowz.com/dbetl"
  //       api_listen = 'schema/' + connString + '?schemaname=' + schemaName;
  //     }
  //   },
  //   mounted() {
  //     this.getData();
  //     this.$emit('get-data', this.data_api);
  //   },
  //   methods: {
  //     getData() {
  //       let self = this;
  //       if (this.data_schema != undefined) {
  //         if (this.data_schema.length > 0) {
  //           this.data_schema;
  //           let schemaVal = this.data_schema.split(":");
  //           let connString = $.trim(schemaVal[0]);
  //           let schemaName = $.trim(schemaVal[1]);
  //           let apiUrl = 'http://api.flowz.com/dbetl/schema/' + connString + '?schemaname=' + schemaName;
  //           $.getJSON(apiUrl, function(data) {
  //             this.products.push(data)
  //             self.items = data;
  //           });
  //         } else {
  //           $.getJSON(this.data_api, function(data) {
  //             this.products.push(data)
  //             self.items = data;
  //           });
  //         }
  //       } else {
  //         var settings = {
  //           "async": true,
  //           "crossDomain": true,
  //           "url": this.data_api,
  //           "method": "POST",
  //           "headers": {
  //             "Authorization": "Basic NWFmMDE3MDgzMjM4ZDUwMDEzMDhkOTQyOjNlM2JlMDEwLTUxZDctMTFlOC1hYWZjLWRkNWJiMWMzYjdmMg=="
  //           }
  //         }

  //         $.ajax(settings).done(function(response) {
  //           console.log("response", response)
  //           self.products = response
  //           self.items = response
  //         });
  //       }
  //     },
  //     search(searchEmail) {
  //       for (let i = 0; i < this.items.length; i++) {
  //         if (this.items[i].email == searchEmail) {
  //           return i;
  //         }
  //       }
  //     }
  //   }
  // });

  const dfObj = Vue.component('datasfieldobject', {
    template: `<div class="dfgroup">
                <div class="dfrepeate"><slot :text="items"></slot></div>
              </div>`,
    props: ['data_api', 'data_schema', 'auth'],
    computed: {},
    data: function() {
      return {
        items: []
      }
    },
    mounted() {
      // this.getData()
      // this.$emit('get-data', this.data_api);
    },
    methods: {
      // getData() {
      //   let self = this;
      //   if (this.data_schema != undefined) {
      //     if (this.data_schema.length > 0) {
      //       this.data_schema;
      //       let schemaVal = this.data_schema.split(":");
      //       let connString = $.trim(schemaVal[0]);
      //       let schemaName = $.trim(schemaVal[1]);
      //       let apiUrl = 'http://api.flowz.com/dbetl/schema/' + connString + '?schemaname=' + schemaName;
      //       $.getJSON(apiUrl, function(data) {
      //         self.items = data;
      //       });
      //     } else {
      //       $.getJSON(this.data_api, function(data) {
      //         self.items = data;
      //       });
      //     }
      //   } else {
      //     var settings = {
      //       "async": true,
      //       "crossDomain": true,
      //       "url": this.data_api,
      //       "method": "POST",
      //       "headers": {
      //         "Authorization": "Basic ZGM1YWUwNDctMzIzZC00YzZkLTgwZWEtNGM5Yzg1MmZmMzU1OjI5MzE3YjQwLTY1NWUtMTFlOC1hYzAxLWQzMmRkMDBjOWY2Nw=="
      //       }
      //     }

      //     $.ajax(settings).done(function(response) {
      //       self.products = response
      //       self.items = response
      //     });
      //   }
      // }
    }
  });

  // const Table = Vue.component('datasfieldtable', {
  //   template: `<Table :columns="columns1" :data="data1"></Table>`,
  //   props: ['column_value', 'data_api'],
  //   computed: {},
  //   data: function() {
  //     return {
  //       columns1: [],
  //       data1: []
  //     }
  //   },
  //   mounted() {
  //     this.getData()
  //   },
  //   methods: {
  //     getData() {
  //       let self = this;
  //       let arr_column = []
  //       var str = this.column_value;
  //       var res = str.split(",");
  //       for (let index = 0; index < res.length; index++) {
  //         let data = {
  //           "title": res[index],
  //           "key": res[index]
  //         }
  //         arr_column.push(data)
  //       }
  //       self.columns1 = arr_column;
  //       $.getJSON(this.data_api, function(data) {
  //         console.log(data)
  //         self.data1 = data;
  //       });

  //     }
  //   }
  // });

  const dfList = Vue.component('datasfieldlist', {
    template: '<div><div v-for="item in items"><slot :text="item"></slot></div></div>',
    props: ['items']
  });

  const dfText = Vue.component('datasfieldtext', {
    template: '<span v-bind:style="styles">{{text}}</span>',
    props: ['text', 'styles']
  });

  const dfSlider = Vue.component('datasfieldslider', {
    template: `<div>
                <h4><strong>{{label}}</strong></h4>
                <input type="text" id="amount" readonly style="border:0; color:#f6931f; font-weight:bold;" @change="filterProducts">
                <div id="product-filter-slider-range" ></div>
              </div>`,
    props: ['label', 'filtervalue', 'filterkey', 'filterkeysecond'],
    data: {
      minPrice: '',
      maxPrice: ''
    },
    methods: {
      filterProducts() {
        setTimeout(() => {
          this.$emit('call-method2', this.minPrice, this.maxPrice, this.filterkey, this.filterkeysecond);
        }, 100);

      }
    },
    created() {
      setTimeout(async() => {
        let minPrice = _.min(this.filtervalue[0]);
        let maxPrice = _.max(this.filtervalue[0]);
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;

        let self = this;
        // Range slider
        await $(() => {
          $("#product-filter-slider-range").slider({
            range: true,
            min: 0,
            max: this.maxPrice,
            values: [this.minPrice, this.maxPrice],
            slide: function(event, ui) {
              self.minPrice = ui.values[0];
              self.maxPrice = ui.values[1];
              self.filterProducts();
              $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
            }
          });
          $("#amount").val("$" + $("#product-filter-slider-range").slider("values", 0) +
            " - $" + $("#product-filter-slider-range").slider("values", 1));
        });

        this.filterProducts();
      }, 5000);

    }

  });

  const dfCheckBox = Vue.component('datasfieldcheckbox', {
    template: `<div>
                <h4><strong>{{label}}</strong></h4>
                <hr />
                <ul class="categoriesFilter">
                  <li v-for="category in filtervalue"><label><input type="checkbox" :id="category" :value="category" v-model="currentSelection" @click="filterProducts()"><span class="categoryName">{{category}}</span></label></li>
                </ul> 
              </div>`,
    data() {
      return {
        products: null,
        selectedFilters: {},
        currentSelection: [],
        varFilter: null
      }
    },
    props: ['filtervalue', 'label', 'filterkey', 'updatechild'],
    methods: {
      filterProducts() {

        setTimeout(() => {

          this.$emit('call-method', this.currentSelection, this.filterkey);
        }, 0);

      }
    },
    created() {
      // console.log("filtervalue...checkbox", this.filtervalue)
      let self = this
      $('datasfieldcheckbox').each(function(index, value) {
        let varFilter = $(this).attr(":filtervalue").substring($(this).attr(":filtervalue").indexOf(".") + 1, $(this).attr(":filtervalue").length);
        self.varFilter = varFilter;
        self.selectedFilters[varFilter] = [];
        self.currentSelection = self.selectedFilters[varFilter];
      });
    },
    mounted() {},
    watch: {
      updatechild: function (array) {

        let cAtegory = array[0].category;
        p = array[0].selectedFilters[cAtegory];
        var array2 = $.map(p, function (value, index) {
          return [value];
        });

        this.currentSelection = array2;
      }
    }
  });

  const dfSelect = Vue.component('datasfieldselect', {
    template: `<div>
                <h4><strong>{{label}}</strong></h4>
                <hr />
                <select class="form-control" @change="filterProducts" v-model="selectedCateogory">
                  <option disabled selected value="defaut">Select</option>
                  <option :value="category" v-for="category in filtervalue">{{category}}</option>
                </select>
              </div>`,
    data() {
      return {
        products: null,
        selectedFilters: {},
        currentSelection: [],
        varFilter: null,
        selectedCateogory: null
      }
    },
    props: ['filtervalue', 'label', 'filterkey', 'updatechild'],
    methods: {
      filterProducts() {
        this.currentSelection = [];
        this.currentSelection.push(this.selectedCateogory);
        this.$emit('call-method', this.currentSelection, this.filterkey);
      }
    },
    created() {
      let self = this;
      $('datasfieldselect').each(function(index, value) {
        let varFilter = $(this).attr(":filtervalue").substring($(this).attr(":filtervalue").indexOf(".") + 1, $(this).attr(":filtervalue").length);
        self.varFilter = varFilter;
        self.selectedFilters[varFilter] = [];
        self.currentSelection = self.selectedFilters[varFilter];
      });

      this.selectedCateogory = 'defaut';
    },
    mounted() {},
    watch: {
      updatechild: function (array) {
        console.log(array)
        if(array[0].category == this.varFilter){
          this.selectedCateogory = 'defaut';
        }
      }
    }
  });

  const dfSearch = Vue.component('datasfieldsearch', {
    template: `<div class="row">
                <div class="col-md-12">
                  <div class="row searchBar">
                    <div class="col-md-10">
                      <input type="text" v-on:keyup.enter="callSearchProducts" id="searchInputText" placeholder="Search Products" class="form-control input-lg" v-model="searchInput">
                    </div>
                    <div class="col-md-2">
                      <a href="#" class="btn btn-primary btn-block btn-lg searchButton" @click="callSearchProducts">
                        <i class="fa fa-search"></i> {{label}}</a>
                    </div>
                  </div>
                </div>
              </div>`,
    data() {
      return {
        searchInput: null
      }
    },
    props: ['label', 'searchinput'],
    methods: {
      callSearchProducts() {
        this.$emit('call-method', this.searchInput);
      }
    },
    created() {
    },
    mounted() {
    },
    watch: {
      searchinput: function (text) {
        this.searchInput = text;
      }
    }
  });

  const dfRating = Vue.component('datasfieldrating', {
    template: `<div>
                <h4><strong>{{label}}</strong></h4> 
                <div class="starsInput">
                  <fieldset class="rating" @click="setRatingFilter">
                    <input type="radio" id="star5" name="rating" value="5" />
                    <label class = "full" for="star5" title="Awesome - 5 stars"></label>

                    <input type="radio" id="star4half" name="rating" value="4.5" />
                    <label class="half" for="star4half" title="Pretty good - 4.5 stars"></label>

                    <input type="radio" id="star4" name="rating" value="4" />
                    <label class = "full" for="star4" title="Pretty good - 4 stars"></label>

                    <input type="radio" id="star3half" name="rating" value="3.5" />
                    <label class="half" for="star3half" title="Meh - 3.5 stars"></label>

                    <input type="radio" id="star3" name="rating" value="3" />
                    <label class = "full" for="star3" title="Meh - 3 stars"></label>

                    <input type="radio" id="star2half" name="rating" value="2.5" />
                    <label class="half" for="star2half" title="Kinda bad - 2.5 stars"></label>

                    <input type="radio" id="star2" name="rating" value="2" />
                    <label class = "full" for="star2" title="Kinda bad - 2 stars"></label>

                    <input type="radio" id="star1half" name="rating" value="1.5" />
                    <label class="half" for="star1half" title="Meh - 1.5 stars"></label>

                    <input type="radio" id="star1" name="rating" value="1" />
                    <label class = "full" for="star1" title="Sucks big time - 1 star"></label>

                    <input type="radio" id="starhalf" name="rating" value="0.5" />
                    <label class="half" for="starhalf" title="Sucks big time - 0.5 stars"></label>

                </fieldset>
                </div>
              </div>`,
    data() {
      return {
      }
    },
    props: ['filtervalue', 'label', 'filterkey'],
    methods: {
      setRatingFilter() {
        setTimeout(()=>{
          console.log('Filter with ' + $('[name=rating]:checked').val() + ' rating(s)');
        },0)
      }
    },
    created() {
      
    },
    mounted() {}
  });

  new Vue({
    el: "#app",
    data() {
      return {
        products: null,
        searchfilter: {},
        filteredProducts: [],
        colors: [],
        categories: [],
        minPrice: null,
        maxPrice: null,
        filterAll: null,
        selectedFilters: {},
        chipsFilter : {},
        dataCat: {},
        dataSlider: {},
        dataColor: [],
        dataFilterKeys: [],
        dataSliderKey: [],
        minValue: null,
        maxValue: null,
        searchInput: '',
        isDataLoading: false,
        totalPages: null,
        totalProductsCount: null,
        numberOfProductsPerPage: 20,
        displayedProducts: null,
        fromItemNumber: 1,
        priceField: null,
        updatechild: null,
        projectVid: null,
        projectVPwd: null,
        dataAuthToken: null,
        elasticURL: 'https://349d6e5f56299a9f7b9ff68ccd099977.us-west-2.aws.found.io:9243/pdmdev/_search'
      }
    },
    components: {
      // dfGroup,
      dfList,
      dfText,
      dfObj,
      // Table,
      dfCheckBox,
      dfSlider,
      dfSelect,
      dfRating,
      dfSearch,
      paginate
    },
    methods: {

      changeNumberOfProducts(){
        Cookies.set('numberOfProductsPerPage', this.numberOfProductsPerPage);
        if(Object.keys(this.selectedFilters).length == 0){
          this.totalPages = Math.ceil(this.totalProductsCount / this.numberOfProductsPerPage);  
          this.filterProducts();
        } else {
          this.totalPages = Math.ceil(this.filteredProducts.length / this.numberOfProductsPerPage);  
          this.filterProducts();
        }        
      },

      clickCallback(pageNum) {
        this.fromItemNumber = (this.numberOfProductsPerPage * (pageNum - 1) + 1 );
        this.$refs.paginate.selected = pageNum - 1;
        this.filterProducts();
      },

      searchProduct(searchInput) {
        if (searchInput == '' || searchInput == null || searchInput == undefined) {
          this.searchInput = '';
          
          this.filterProducts();

          $(function() {
            $('.lazy').lazy();
          });
        } else {
          this.searchInput = searchInput;
          this.filteredProducts = {};
          var settings = {
            "async": true,
            "url": this.elasticURL,
            "method": "POST",
            "headers": {
              "Authorization": "Basic " + this.dataAuthToken
            },
            "data": "{\"query\": {\"multi_match\" : {\"query\": \"" + searchInput + "\", \"fields\": [\"search_keyword\", \"categories\", \"product_name\", \"sku\"] } }, \"from\": " + this.fromItemNumber + ", \"size\": " + this.numberOfProductsPerPage + "}"
          }
          let self_ = this;
          $.ajax(settings).done(function(data) {
            self_.products = data.hits.hits;
            self_.filteredProducts = self_.products;

            self_.totalProductsCount = data.hits.total;

            if(data.hits.hits.length < self_.numberOfProductsPerPage){
              self_.displayedProducts = data.hits.hits.length;
            } else {
              self_.displayedProducts = self_.numberOfProductsPerPage;
            }

            self_.totalPages = Math.ceil(self_.totalProductsCount / self_.numberOfProductsPerPage);

            $(function() {
              $('.lazy').lazy();
            });
          });
        }
      },

      filterAll2() {
        let objFilter = {};
        let self = this
        $('datasfieldcheckbox').each(function(index, value) {
          let varFilter = $(this).attr(":filtervalue").substring($(this).attr(":filtervalue").indexOf(".") + 1, $(this).attr(":filtervalue").length);

          objFilter[varFilter] = []
          self.dataCat[varFilter] = []
          objFilter[varFilter] = self.dataCat[varFilter]

          self.dataFilterKeys.push(varFilter);

        });

        $('datasfieldselect').each(function(index, value) {
          let varFilter = $(this).attr(":filtervalue").substring($(this).attr(":filtervalue").indexOf(".") + 1, $(this).attr(":filtervalue").length);

          objFilter[varFilter] = []
          self.dataCat[varFilter] = []
          objFilter[varFilter] = self.dataCat[varFilter]

          self.dataFilterKeys.push(varFilter);

        });

        $('datasfieldslider').each(function(index, value) {
          let varFilter = $(this).attr(":filtervalue").substring($(this).attr(":filtervalue").indexOf(".") + 1, $(this).attr(":filtervalue").length);
          self.priceField = varFilter;
          self.dataSlider[varFilter] = []
          objFilter[varFilter] = self.dataSlider[varFilter]
          self.dataSliderKey.push(varFilter);
        });

        return objFilter;
      },

      getUrl(self) {
        this.isDataLoading = true;
        // this.apiUrl = self;
        let self_ = this;
        let filterBox = {};

        var settings = {
          "async": true,
          "crossDomain": true,
          "url": this.elasticURL,
          "method": "POST",
          "headers": {
            "Authorization": "Basic " + self_.dataAuthToken
          },
          "data": "{\n\t\"from\": "+this.fromItemNumber+",\n\t\"size\": "+this.numberOfProductsPerPage+"\n}"
        }

        $.ajax(settings).done(function(data) {
          console.log(data);
          self_.products = data.hits.hits;
          self_.filteredProducts = self_.products;

          self_.totalProductsCount = data.hits.total;

          if(data.hits.hits.length < self_.numberOfProductsPerPage){
            self_.displayedProducts = data.hits.hits.length;
          } else {
            self_.displayedProducts = self_.numberOfProductsPerPage;
          }

          self_.totalPages = Math.ceil(self_.totalProductsCount / self_.numberOfProductsPerPage);

          // for arrays
          self_.dataFilterKeys.forEach(function(dfKey) {
            filterBox[dfKey] = [];
            self_.filteredProducts.forEach(function(fProd) {
              filterBox[dfKey] = filterBox[dfKey].concat(fProd._source[dfKey]);

              filterBox[dfKey] = _.uniq(filterBox[dfKey])
            });

            for (let index = 0; index < filterBox[dfKey].length; index++) {
              self_.dataCat[dfKey].push(filterBox[dfKey][index]);
            }
          });

          //for single value
          let slider_temp = {}
          self_.dataSliderKey.forEach(function(dfKey) {
            slider_temp[dfKey] = [];
            self_.filteredProducts.forEach(function(fProd) {
                slider_temp[dfKey] = slider_temp[dfKey].concat(fProd._source[dfKey]);
              })
            self_.dataSlider[dfKey].push(slider_temp[dfKey])
          });

          $(function() {
            $('.lazy').lazy();
          });

          // self_.isDataLoading = false;
        });
      },

      callfilteredproducts(data, key) {
        this.selectedFilters[key] = [];
        this.selectedFilters[key] = data;
        this.filterProducts();
      },

      callfilteredproducts2(minValue, maxValue, minVal, maxVal) {
        this.minValue = minValue;
        this.maxValue = maxValue;
        setTimeout(()=>{
          this.filterProducts();
        },1500);
      },

      filterProductsOld() {
        this.isDataLoading = true;
        setTimeout(async() => {

          console.log('This Selected Filters: ', this.selectedFilters);
          this.selectedFilters = this.selectedFilters


          let keys = Object.keys(this.selectedFilters);
          this.chipsFilter = keys;

          await keys.forEach((key)=>{
            if(this.selectedFilters[key].length == 0){
              delete this.selectedFilters[key];
              var keyIndex = keys.indexOf(key);
              if (keyIndex > -1) {
                keys.splice(keyIndex, 1);
              }
            }
          });

          let allEmpty = [];

          for (let i = 0; i < keys.length; i++) {
            if (this.selectedFilters[keys[i]].length > 0) {
              allEmpty.push(true);
            } else {
              allEmpty.push(false);
            }
          }

          if (($.inArray(true, allEmpty)) != -1) {

            let self = this;

            await keys.forEach(function(filterKey) {

              let filterdProducts = _.filter(self.products, function(o) {

                let flg = false;
                let searchFilterKey = self.selectedFilters[filterKey];
                searchFilterKey.forEach(function(sKey) {
                  let ind = o._source[filterKey].indexOf(sKey)
                  if (ind >= 0) {
                    flg = true;
                  }
                })

                if (flg) {
                  return o._source.price_1 >= self.minValue && o._source.price_1 <= self.maxValue;
                }
              });

              self.filteredProducts = filterdProducts;
              self.totalPages = Math.ceil(self.filteredProducts.length / self.numberOfProductsPerPage);
              self.isDataLoading = false;

            });

          } else {
            let self = this;
            this.filteredProducts = _.filter(this.products, function(o) {
              return o._source.price_1 >= self.minValue && o._source.price_1 <= self.maxValue;
            });
            self.isDataLoading = false;
          }

        }, 0);
      },

      filterProducts(){
        this.filteredProducts = null;
        this.isDataLoading = true;
        setTimeout(async() => {

          // console.log('This Selected Filters: ', this.selectedFilters);
          this.selectedFilters = this.selectedFilters


          let keys = Object.keys(this.selectedFilters);
          this.chipsFilter = keys;

          await keys.forEach((key)=>{
            if(this.selectedFilters[key].length == 0){
              delete this.selectedFilters[key];
              var keyIndex = keys.indexOf(key);
              if (keyIndex > -1) {
                keys.splice(keyIndex, 1);
              }
            }
          });

          let allEmpty = [];

          for (let i = 0; i < keys.length; i++) {
            if (this.selectedFilters[keys[i]].length > 0) {
              allEmpty.push(true);
            } else {
              allEmpty.push(false);
            }
          }

          if (($.inArray(true, allEmpty)) != -1) {

            let self = this;

            let filterQuery = { 
              query:{ 
                bool:{ 
                  must:[{
                    range:{
                      [this.priceField]:{
                        gte:this.minValue,
                        lte:this.maxValue
                      }
                    }
                  }
                  ] 
                } 
              },
              from: this.fromItemNumber,
              size: this.numberOfProductsPerPage 
            };

            await keys.forEach(function(filterKey) {

              let searchTerm = '{ "terms": { "' + filterKey + '.raw" : ' + JSON.stringify(self.selectedFilters[filterKey]) + ' } }';

              filterQuery.query.bool.must.push(JSON.parse(searchTerm));

              // self.filteredProducts = filterdProducts;
              // self.totalPages = Math.ceil(self.filteredProducts.length / self.numberOfProductsPerPage);
              // self.isDataLoading = false;

            });

            var settings = {
              "async": true,
              "url": this.elasticURL,
              "method": "POST",
              "headers": {
                "Authorization": "Basic " + this.dataAuthToken
              },
              "data": JSON.stringify(filterQuery)
            }

            $.ajax(settings).done(function(data) {
              self.totalProductsCount = data.hits.total;
              self.totalPages = Math.ceil(self.totalProductsCount / self.numberOfProductsPerPage);

              self.products = data.hits.hits;
              self.filteredProducts = self.products;
              self.isDataLoading = false;
              
              if(data.hits.hits.length < self.numberOfProductsPerPage){
                self.displayedProducts = data.hits.hits.length;
              } else {
                self.displayedProducts = self.numberOfProductsPerPage;
              }

              $(function() {
                $('.lazy').lazy();
              });
            });

            // console.log('Filter Query : ', JSON.stringify(filterQuery));

          } else {

            let self = this;

            var settings = {
              "async": true,
              "url": this.elasticURL,
              "method": "POST",
              "headers": {
                "Authorization": "Basic " + this.dataAuthToken
              },
              "data": '{ "query":{ "bool":{ "must":[ { "range":{ "'+[this.priceField]+'":{ "gte":'+this.minValue+', "lte":'+this.maxValue+' } } } ] } }, "from": '+this.fromItemNumber+', "size": '+this.numberOfProductsPerPage+' }'
            }

            await $.ajax(settings).done(function(data) {
              self.totalProductsCount = data.hits.total;
              self.totalPages = Math.ceil(self.totalProductsCount / self.numberOfProductsPerPage);
              self.products = data.hits.hits;
              self.filteredProducts = self.products;
              self.isDataLoading = false;

              if(data.hits.hits.length < self.numberOfProductsPerPage){
                self.displayedProducts = data.hits.hits.length;
              } else {
                self.displayedProducts = self.numberOfProductsPerPage;
              }

              // self.filteredProducts = _.filter(self.products, function(o) {
              //   return o._source.price_1 >= self.minValue && o._source.price_1 <= self.maxValue;
              // });

              $(function() {
                $('.lazy').lazy();
              });
            });

            
          }

        }, 0);
      },

      removeAllFilters(){
        this.selectedFilters = {};
        this.filterProducts();

        let arrayToSend = [{
          selectedFilters: this.selectedFilters,
          category: []
        }];

        this.updatechild = arrayToSend;
      },

      removeSearchFilter(){
        this.searchInput = null;
        this.filterProducts();
      },

      removeFilter(category, name){

        console.log("Remove cat: ", name);

        let updatedFilters = _.remove(this.selectedFilters[category], function(n) {
                              return n == name;
                            });

        let arrayToSend = [{
          selectedFilters: this.selectedFilters,
          category: category
        }];

        this.updatechild = arrayToSend;
        this.category = category

        this.filterProducts();
      }

    },

    async mounted() {

      let self = this;

      await $.getJSON('./assets/project-details.json', {
      })
      .then(function (response) {
          self.projectVid = response[0].Projectvid.vid;
          self.projectVPwd = response[0].Projectvid.password;

          self.dataAuthToken = btoa(self.projectVid + ':' + self.projectVPwd);
      })
      .catch(function (error) {
          console.log(error);
      });

      this.getUrl();

      this.fromItemNumber = 1;
      this.searchInput = null;
      if(Cookies.get('numberOfProductsPerPage')){
        this.numberOfProductsPerPage = Cookies.get('numberOfProductsPerPage');
      } else {
        this.numberOfProductsPerPage = 20;
      }
    },

    created() {
      this.filterAll = this.filterAll2();

      let self = this;

      $('#searchInputText').keypress(function(e) {
        var key = e.which;
        console.log(key)
        if (key == 13) // the enter key code
        {
          self.searchProduct();
          return false;
        }
      });

    }
  })