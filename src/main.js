// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// element
import './element-reset.scss'
// 全局css
import './main.css'

import App from './App'
import router from './router'
import store from './store'

Vue.use(ElementUI);

import moment from 'moment';
import 'moment/locale/zh-cn';

import api from './utils/api';
import common from './utils/common';

import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import PrettyCheckbox from 'pretty-checkbox-vue';
Vue.use(PrettyCheckbox);
Vue.use(VueQuillEditor, /* { default global options } */ )

window.Vue = Vue;
moment.locale('zh-cn');
window.moment = moment;

import Axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios, Axios);

import VueBus from 'vue-bus';
import VueDND from 'awe-dnd'

Vue.use(VueDND)
Vue.use(VueBus);

let localStore = require('store');
window.store = localStore;
Object.defineProperty(Vue.prototype, '$moment', { value: moment });
Object.defineProperty(Vue.prototype, '$api', { value: api });
Object.defineProperty(Vue.prototype, '$common', { value: common });

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})