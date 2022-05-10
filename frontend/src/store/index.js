import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import { createStore } from "vuex-extensions";

Vue.use(Vuex)

var store = createStore(Vuex.Store, {
  state: {
    token: "",
    userId: "",
    userPseudo: "",
    userLink: "",
    userEmail: "",
    userPicture: "",
    userPosts: "",
    selectedFile: "",
    imgPreview: "",
    userFollowers: [],
    userDataX: [],
    postDataX: [],
    suggestionsX: [],
    savesX: [],
    allUsersX: [],
    isAdmin: false,
    createModale: false,
    updateModale: false,
    showAccount: false,
    showAdminPanel: false,
    showLoader: false,
    showValidBox: false,
    showSaveBox: false,
    showDeleteBox: false,
    showErrorBox: false,
  },
  getters: {
    tokenGetter: (state) => {
      return state.token;
    },
    isAdminGetter: (state) => {
      return state.isAdmin;
    },
    userIdGetter: (state) => {
      return state.userId;
    },
    followersGetter: (state) => {
      return state.userFollowers;
    },
    imgPreviewGetter: (state) => {
      return state.imgPreview;
    },
    postDataGetter: (state) => {
      return state.postDataX;
    },
    suggestionsGetter: (state) => {
      return state.suggestionsX;
    },
    savesGetter: (state) => {
      return state.savesX;
    },
    allUsersGetter: (state) => {
      return state.allUsersX;
    },
    userDataGetter: (state) => {
      return state.userDataX;
    },
    userPictureGetter: (state) => {
      return state.userPicture;
    },
    createGetter: (state) => {
      return state.createModale;
    },
    updateGetter: (state) => {
      return state.updateModale;
    },
    accountGetter: (state) => {
      return state.showAccount;
    },
    showAdminPanelGetter: (state) => {
      return state.showAdminPanel;
    },
    loaderGetter: (state) => {
      return state.showLoader;
    },
    validBoxGetter: (state) => {
      return state.showValidBox;
    },
    deleteBoxGetter: (state) => {
      return state.showDeleteBox;
    },
    forbiddenBoxGetter: (state) => {
      return state.showErrorBox;
    },
    saveBoxGetter: (state) => {
      return state.showSaveBox
    },
    noPostsGetter: (state) => {
      return state.noPosts;
    },
    fileGetter: (state) => {
      return state.selectedFile;
    },
  },
  mutations: {
    resetState(state) {
      state.token = "",
        state.userId = "",
        state.userPseudo = "",
        state.userLink = "",
        state.userEmail = "",
        state.userPicture = "",
        state.userPosts = "",
        state.selectedFile = "",
        state.imgPreview = "",
        state.userFollowers = [],
        state.userDataX = [],
        state.postDataX = [],
        state.suggestionsX = [],
        state.savesX = [],
        state.allUsersX = [],
        state.isAdmin = false,
        state.createModale = false,
        state.updateModale = false,
        state.showAccount = false,
        state.showAdminPanel = false,
        state.showLoader = false,
        state.showValidBox = false,
        state.showDeleteBox = false,
        state.showErrorBox = false,
        state.showSaveBox = false
    },
    resetModals(state) {
      state.createModale = false,
        state.updateModale = false,
        state.showAccount = false,
        state.showAdminPanel = false,
        state.showLoader = false,
        state.showValidBox = false,
        state.showDeleteBox = false,
        state.showErrorBox = false,
        state.showSaveBox = false
    }
  },
  actions: {
    fetchToken(context, token) {
      context.commit('token', token)
    },
  },
  mixins: {
    mutations: {
      changeState: function (state, changed) {
        Object.entries(changed).forEach(([name, value]) => {
          state[name] = value;
        });
      }
    }
  },
  plugins: [createPersistedState()],
});

export default store;

