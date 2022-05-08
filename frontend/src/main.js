import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuelidate from 'vuelidate'
import store from './store/index'
import http from './js/http'
import axios from 'axios'
import LogoutIcon from './components/icons/LogoutIcon.vue';
import UserIcon from './components/icons/UserIcon.vue';
import UsersIcon from './components/icons/UsersIcon.vue';
import FollowIcon from './components/icons/FollowIcon.vue';
import Options from './components/icons/Options.vue';
import LikeIcon from './components/icons/LikeIcon.vue';
import CommentIcon from './components/icons/CommentIcon.vue';
import SaveIcon from './components/icons/SaveIcon.vue';
import Desactivate from './components/icons/Desactivate.vue';
import AdminChangeBtn from './components/icons/AdminChangeBtn.vue';
import CryIcon from './components/icons/CryIcon.vue';
import OptionsBtn from './components/icons/OptionsBtn.vue';
import Loader from './components/Loader.vue';
import ValidBox from './components/ValidBox.vue';
import SaveBox from './components/SaveBox.vue';
import DeleteBox from './components/DeleteBox.vue';
import ErrorBox from './components/ErrorBox.vue';
import CreatedSince from './components/CreatedSince.vue';
import CreateFileIcon from "./components/icons/CreateFileIcon.vue";
import EditIcon from "./components/icons/EditIcon.vue";
import DeleteIcon from "./components/icons/DeleteIcon.vue";
import SaveComment from "./components/icons/SaveComment.vue";
import PostImage from './components/PostImage.vue';
import ImageResizer from './components/ImageResizer.vue';

Vue.component('LogoutIcon', LogoutIcon);
Vue.component('UsersIcon', UsersIcon);
Vue.component('UserIcon', UserIcon);
Vue.component('FollowIcon', FollowIcon);
Vue.component('Options', Options);
Vue.component('LikeIcon', LikeIcon);
Vue.component('CommentIcon', CommentIcon);
Vue.component('SaveIcon', SaveIcon);
Vue.component('AdminChangeBtn', AdminChangeBtn);
Vue.component('Desactivate', Desactivate);
Vue.component('CryIcon', CryIcon);
Vue.component('Loader', Loader);
Vue.component('ValidBox', ValidBox);
Vue.component('SaveBox', SaveBox);
Vue.component('DeleteBox', DeleteBox);
Vue.component('ErrorBox', ErrorBox);
Vue.component('CreatedSince', CreatedSince);
Vue.component('CreateFileIcon', CreateFileIcon);
Vue.component('EditIcon', EditIcon);
Vue.component('DeleteIcon', DeleteIcon);
Vue.component('SaveComment', SaveComment);
Vue.component('PostImage', PostImage);
Vue.component('OptionsBtn', OptionsBtn);
Vue.component('ImageResizer', ImageResizer);

Vue.config.productionTip = false

export const bus = new Vue();

Vue.use(Vuelidate)

new Vue({
  router,
  store,
  axios,
  http,
  render: h => h(App)
}).$mount('#app')
