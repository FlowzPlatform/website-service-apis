import vue from 'vue'
 import ElementUI from 'element-ui'
 import element from 'element-ui/src/locale/lang/en'
 import 'element-ui/lib/theme-chalk/index.css'
 vue.use(ElementUI, { element })
 import index from './index.vue'
vue.component('index', index)
 new vue({ el: '#index',
 render: h => h(index)
 })
