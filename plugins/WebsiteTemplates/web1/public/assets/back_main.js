import vue from 'vue'
 import ElementUI from 'element-ui'
 import element from 'element-ui/src/locale/lang/en'
 import 'element-ui/lib/theme-chalk/index.css'
 vue.use(ElementUI, { element })
 import @@vuecomponent@@ from './@@vuecomponent@@.vue'
vue.component('@@vuecomponent@@', @@vuecomponent@@)
 new vue({ el: '#@@vuecomponent@@',
 render: h => h(@@vuecomponent@@)
 })