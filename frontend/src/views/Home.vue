<template>
  <div class="home__container">
    <ValidBox :validBox="showValidBox" @click.native="closeValidBox" />
    <SaveBox v-show="showSaveBox" @click.native="closeSaveBox" />
    <DeleteBox v-if="showDeleteBox" @click.native="closeDeleteBox" />
    <ErrorBox v-show="showErrorBox" @click.native="closeErrorBox" />
    <Loader v-show="showLoader" />

    <div class="main">
      <!-- NAVBAR -->
      <Navbar @get-all-posts="getAllPosts" @get-user-profile="getUserProfile" />

      <!-- MAIN CONTENT -->
      <transition name="fade" appear>
        <div class="content" v-show="!showAccount && !showAdminPanel">
          <AsideLeft
            @hide-account="hideAccount"
            :user="userDataX"
            @get-user-profile="getUserProfile"
            @get-all-posts="getAllPosts"
          />

          <!-- POSTS CONTAINER -->
          <transition name="fade">
            <div class="posts">
              <div id="noContent" v-show="noContent">
                <p>Postez votre première publication !</p>
              </div>
              <div id="noPosts" v-show="noPosts">
                <CryIcon />
                <p>{{ noPostMsg }}</p>
              </div>
              <!-- Post -->
              <PostArticle
                v-for="post in postDataX"
                :post="post"
                :key="post.postId"
                :postId="post.postId"
                :comments="post.comments"
                @get-user-profile="getUserProfile"
                @get-all-posts="getAllPosts"
                @get-user-infos="getCurrentUser"
              />
              <button @click="getFiveMore">Voir plus</button>
            </div>
          </transition>

          <!-- ASIDE RIGHT -->
          <div class="aside-right">
            <h2>Suggestions</h2>
            <transition name="fadeDown" appear>
              <div class="aside-right__cards">
                <AsideRight
                  v-for="item in suggestionsX"
                  :key="item.userId"
                  :item="item"
                  @get-user-profile="getUserProfile"
                  @follow-user="followUser"
                />
              </div>
            </transition>
            <div class="more">
              <button class="more-btn" @click="getSuggestions" name="plus">Voir plus</button>
            </div>
          </div>

          <!-- CREATE MODALE -->
          <Create />
        </div>
      </transition>

      <!-- ACCOUNT -->
      <transition name="fadeLeft">
        <Account
          v-show="showAccount"
          @get-user-profile="getUserProfile"
          @get-all-posts="getAllPosts"
          @disable-my-account="disableMyAccount"
          @get-one-post="getOnePost"
        />
      </transition>

      <!-- ADMIN PANEL -->
      <transition name="fadeLeft">
        <AdminPanel v-if="showAdminPanel" :user="userDataX" @get-all-posts="getAllPosts" @get-user-profile="getUserProfile" />
      </transition>
    </div>
  </div>
</template>

<script>
// IMPORTS
import {mapState, mapGetters} from 'vuex';
import EventBus from '../js/event-bus';
import * as utils from '../js/utils';
import http from '../js/http';
import Account from '../components/Account.vue';
import AdminPanel from '../components/AdminPanel.vue';
import AsideLeft from '../components/AsideLeft.vue';
import AsideRight from '../components/AsideRight.vue';
import Create from '../components/Create.vue';
import Navbar from '../components/Navbar.vue';
import PostArticle from '../components/PostArticle.vue';

// EXPORTS
export default {
  name: 'Home',
  components: {
    Navbar,
    AsideLeft,
    AsideRight,
    PostArticle,
    Create,
    Account,
    AdminPanel,
  },
  data() {
    return {
      showSearchBar: false,
      showNavbarLogo: true,
      tabletView: false,
      showSearchBtn: true,
      noPosts: false,
      noPostMsg: '',
      noContent: false,
      numberPosts: 5,
    };
  },
  methods: {
    setAuthorization() {
      return {
        headers: {
          Authorization: 'Bearer ' + this.token,
        },
      };
    },
    closeSaveBox() {
      utils.showSaveBox(false);
    },
    closeDeleteBox() {
      utils.showDeleteBox(false);
    },
    closeErrorBox() {
      utils.showErrorBox(false);
    },
    logout() {
      localStorage.clear();
      this.$store.commit('resetState');
      this.$router.push('/login');
    },

    followUser(item) {
      http
        .post(`user/follow/${item.userId}`, {}, this.setAuthorization())
        .then(() => {
          this.postDataX.filter((x) => x.userId == item.userId).forEach((x) => (x.followed = !x.followed));
          this.suggestionsX.filter((x) => x.userId == item.userId).forEach((x) => (x.followed = !x.followed));
          this.userFollowers.filter((x) => x.userId == item.userId).forEach((x) => (x.followed = !x.followed));
        })
        .catch((error) => console.log(error));
    },

    getSuggestions() {
      http
        .get(`user/suggestions/${this.userId}`, this.setAuthorization())
        .then((response) => utils.commitSuggestions(response.data))
        .catch((error) => console.log(error));
    },

    closeAccount() {
      utils.showAccount(false);
    },
    hideAccount() {
      this.getAllPosts();
      utils.showAccount(false);
    },

    getCurrentUser() {
      http
        .get(`user/current/${this.userId}`, this.setAuthorization())
        .then((res) => {
          // console.log('Current user', res.data);
          utils.commitUserData(res.data.userInfos);
          utils.commitSaves(res.data.dataSaves);
        })
        .catch((error) => console.log(error));
    },

    getUserProfile(post) {
      utils.showAccount(false);
      utils.showLoader(true);
      utils.showAdminPanel(false);

      http
        .get(`user/${post.userId}`, this.setAuthorization())
        .then((res) => {
          if (res.status == 202) {
            utils.commitPostData([]);
            this.noPosts = true;
            this.noPostMsg = `${res.data.pseudo} n'a encore rien publié !`;
          } else {
            utils.commitPostData(res.data);
            this.noPosts = false;
          }
          utils.scrollToTop();
          utils.showLoader(false, 500);
        })
        .catch((error) => console.log(error));
    },

    getFiveMore() {
      this.numberPosts += 5;
      this.getAllPosts();
    },

    getAllPosts() {
      this.$store.commit('resetModals');
      http
        .get(`posts/${this.numberPosts}`, this.setAuthorization())
        .then((response) => {
          console.log('Posts', response.data);
          if (response.data.length == 0) {
            this.noPosts = true;
            utils.commitPostData([]);
          } else {
            this.noPosts = false;
            utils.commitPostData(response.data);
          }
          utils.showLoader(false, 500);
        })
        .catch((error) => console.log(error));
      this.getCurrentUser();
    },

    getOnePost(item) {
      utils.showLoader(true);
      utils.showCreateModale(false);
      utils.showAccount(false);
      http
        .get(`posts/${item.postId}`, this.setAuthorization())
        .then((response) => {
          utils.commitPostData(response.data);
          utils.showLoader(false, 300);
          utils.scrollToTop();
        })
        .catch((error) => {
          console.log(error);
        });
    },

    deletePost(item) {
      if (!confirm('Voulez-vous vraiment supprimer ce post ?')) {
        return;
      }
      http
        .delete(`posts/${item.postId}`, this.setAuthorization())
        .then(() => {
          this.getAllPosts();
          utils.showDeleteBoxTimer(1000);
        })
        .catch(() => {
          utils.showErrorBoxTimer(1000);
        });
    },

    disableMyAccount(user) {
      if (!confirm('Voulez-vous vraiment désactiver ce compte ?')) {
        return;
      }
      http
        .put(`user/${user.userId}`, {}, this.setAuthorization())
        .then(() => {
          console.log('Au revoir ' + user.pseudo);
          this.logout();
        })
        .catch((error) => console.log(error));
    },

    onResize() {
      if (window.innerWidth >= 768) {
        this.tabletView = this.showSearchBar = this.showNavbarLogo = true;
        this.showSearchBtn = false;
      } else {
        this.tabletView = this.showSearchBar = false;
        this.showSearchBtn = true;
      }
    },
  },
  computed: {
    ...mapState({
      createModale: 'createModale',
      updateModale: 'updateModale',
      token: 'token',
      showAccount: 'showAccount',
      showLoader: 'showLoader',
      showValidBox: 'showValidBox',
      userId: 'userId',
      selectedFile: 'selectedFile',
      userDataX: 'userDataX',
      userFollowers: 'userFollowers',
      userLink: 'userLink',
      imgPreview: 'imgPreview',
      showDeleteBox: 'showDeleteBox',
      showErrorBox: 'showErrorBox',
      showSaveBox: 'showSaveBox',
      postDataX: 'postDataX',
      suggestionsX: 'suggestionsX',
      savesX: 'savesX',
      allUsersX: 'allUsersX',
      showAdminPanel: 'showAdminPanel',
    }),
    ...mapGetters([
      'postDataGetter',
      'creategetter',
      'updateGetter',
      'accountGetter',
      'userIdGetter',
      'fileGetter',
      'userDataGetter',
      'linkGetter',
      'imgPreviewGetter',
      'deleteBoxGetter',
      'forbiddenBoxGetter',
      'saveBoxGetter',
      'suggestionsGetter',
      'savesGetter',
      'allUsersGetter',
      'showAdminPanelGetter',
      'validBoxGetter',
      'followersGetter',
    ]),
  },
  mounted() {
    this.getAllPosts();
    this.getCurrentUser();
    this.getSuggestions();
    this.onResize();
    EventBus.$on('getAllPosts', this.getAllPosts);
    EventBus.$on('reportPost', this.reportPost);
    EventBus.$on('deletePost', this.deletePost);
    EventBus.$on('followUser', this.followUser);
    EventBus.$on('getUserProfile', this.getUserProfile);
    EventBus.$on('getCurrentUser', this.getCurrentUser);
  },
  created() {
    window.addEventListener('resize', this.onResize);
  },
  destroyed() {
    window.removeEventListener('resize', this.onResize);
    EventBus.$off('getAllPosts', this.getAllPosts);
    EventBus.$off('reportPost', this.reportPost);
    EventBus.$off('deletePost', this.deletePost);
    EventBus.$off('followUser', this.followUser);
    EventBus.$off('getUserProfile', this.getUserProfile);
    EventBus.$off('getCurrentUser', this.getCurrentUser);
  },
};
</script>

<style scoped lang="scss">
.displayFlex {
  display: flex;
  width: 30px;
  height: 30px;
}

/* ValidBox */
.valid-box {
  width: 100%;
  height: 100%;
}

#noPosts {
  height: calc(100vh - 50px - 40px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & p {
    font-size: 20px;
  }
}

/* FadeDown */
.fadeDown-enter-active,
.fadeDown-leave-active {
  transition: all 0.2s ease-out;
}

.fadeDown-enter,
.fadeDown-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* FadeUp */
.fadeUp-enter-active,
.fadeUp-leave-active {
  transition: all 0.2s ease-out;
}

.fadeUp-enter,
.fadeUp-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Fade */
.fadeLeft-enter-active,
.fadeLeft-leave-active,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter,
.fade-leave-to {
  //   filter: brightness(0);
  transform: translateX(-20px);
}

/* Fade Left */
.fadeLeft-enter,
.fadeLeft-leave-to {
  //   filter: brightness(0);
  transform: translateX(20px);
}
</style>
