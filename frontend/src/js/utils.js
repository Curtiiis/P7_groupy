import store from '../store/index'
import router from '../router/index'

export function scrollToTop() {
  window.scrollTo(0, 0);
}

export function showLoader(value, delay) {
  setTimeout(() => {
    store.commit('changeState', {
      showLoader: value,
    });
  }, delay);
}
export function showLoaderTimer(delay) {
  store.commit('changeState', {
    showLoader: true,
  });
  setTimeout(() => {
    store.commit('changeState', {
      showLoader: false,
    });
  }, delay);
}

export function showValidBox(value, delay) {
  setTimeout(() => {
    store.commit('changeState', {
      showValidBox: value,
    });
  }, delay);
}
export function showValidBoxTimer(delay) {
  store.commit('changeState', {
    showValidBox: true,
  });
  setTimeout(() => {
    store.commit('changeState', {
      showValidBox: false,
    });
  }, delay);
}

export function showDeleteBox(value, delay) {
  setTimeout(() => {
    store.commit('changeState', {
      showDeleteBox: value,
    });
  }, delay);
}
export function showDeleteBoxTimer(delay) {
  store.commit('changeState', {
    showDeleteBox: true,
  });
  setTimeout(() => {
    store.commit('changeState', {
      showDeleteBox: false,
    });
  }, delay);
}

export function showSaveBox(value, delay) {
  setTimeout(() => {
    store.commit('changeState', {
      showSaveBox: value,
    });
  }, delay);
}
export function showSaveBoxTimer(delay) {
  store.commit('changeState', {
    showSaveBox: true,
  });
  setTimeout(() => {
    store.commit('changeState', {
      showSaveBox: false,
    });
  }, delay);
}

export function showErrorBox(value, delay) {
  setTimeout(() => {
    store.commit('changeState', {
      showErrorBox: value,
    });
  }, delay);
}
export function showErrorBoxTimer(delay) {
  store.commit('changeState', {
    showErrorBox: true,
  });
  setTimeout(() => {
    store.commit('changeState', {
      showErrorBox: false,
    });
  }, delay);
}

export function showCreateModale(value) {
  store.commit('changeState', {
    createModale: value,
  });
}
export function showUpdateModale(value) {
  store.commit('changeState', {
    updateModale: value,
  });
  store.commit('changeState', {
    createModale: value,
  });
}
export function showAccount(value) {
  store.commit('changeState', {
    showAccount: value,
  });
}
export function showAdminPanel(value) {
  store.commit('changeState', {
    showAdminPanel: value,
  });
}

// INFOS USER
export function commitToken(value) {
  store.commit('changeState', {
    token: value,
  });
}
export function commitUserId(value) {
  store.commit('changeState', {
    userId: value,
  });
}
export function commitUserPseudo(value) {
  store.commit('changeState', {
    userPseudo: value,
  });
}
export function commitUserPicture(value) {
  store.commit('changeState', {
    userPicture: value,
  });
}
export function commitUserEmail(value) {
  store.commit('changeState', {
    userEmail: value,
  });
}
export function commitUserFollowers(value) {
  store.commit('changeState', {
    userFollowers: value,
  });
}
export function commitUserPosts(value) {
  store.commit('changeState', {
    userPosts: value,
  });
}
export function commitUserLink(value) {
  store.commit('changeState', {
    userLink: value,
  });
}
export function commitIsAdmin(value) {
  store.commit('changeState', {
    isAdmin: value,
  });
}
export function commitUserData(value) {
  store.commit('changeState', {
    userDataX: value,
  });
}
export function commitAllUsers(value) {
  store.commit('changeState', {
    allUsersX: value,
  });
}
export function commitPostData(value) {
  store.commit('changeState', {
    postDataX: value,
  });
}
export function commitSuggestions(value) {
  store.commit('changeState', {
    suggestionsX: value,
  });
}
export function commitSaves(value) {
  store.commit('changeState', {
    savesX: value,
  });
}
export function commitSelectedFile(value) {
  store.commit('changeState', {
    selectedFile: value,
  });
}
export function commitImgPreview(value) {
  store.commit('changeState', {
    imgPreview: value,
  });
}

// Fonctions globales
export function redirectDelay(value, delay) {
  setTimeout(() => {
    router.push(value);
  }, delay);
}
export function redirect(value) {
  router.push(value);
}
export function deleteItem(item) {
  setTimeout(() => {
    item
  }, 500);
  this.showDeleteBoxTimer(700);
}