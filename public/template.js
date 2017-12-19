import vue from 'vue'
 import ElementUI from 'element-ui'
 import element from 'element-ui/src/locale/lang/en'
 import 'element-ui/lib/theme-chalk/index.css'
 vue.use(ElementUI, { element })
 import template from '/var/www/html/websites/FzDataSite/Partials/Custom/template.vue'
vue.component('template', template)
 new vue({ el: '#template',
 render: h => h(template)
 })