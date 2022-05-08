<template>
  <main class="main-settings">
    <div class="main-settings-aside">
      <ul id="aside-list">
        <li class="btn-aside active" id="item-followers" @click="changeSetting">Abonnés</li>
        <li class="btn-aside" id="item-favorites" @click="changeSetting">Sauvegardés</li>
        <li class="btn-aside" id="item-infos" @click="changeSetting">Infos</li>
        <li class="btn-aside" id="item-change" @click="changeSetting">Sécurité</li>
      </ul>
    </div>

    <div class="main-settings-content">
      <!-- Settings Follows -->
      <div class="settings-infos active" id="settings-infos" v-show="settingShowed == 'item-followers'">
        <h2>Abonnés ({{ followersCount }})</h2>
        <div class="follows-cards">
          <div class="fz16 h100" v-if="userFollowers == ''"><p>Les abonnements ne devraient pas tarder...</p></div>
          <div class="card" v-else v-for="follower in userFollowers" :key="follower.userId">
            <a :href="follower.link" @click.prevent="$emit('get-user-profile', follower)">
              <img :src="follower.picture" alt="image follower" />
              <div>{{ follower.pseudo }}</div>
            </a>
            <FollowIcon :followed="follower.followed" @click.native="followUser(follower)" :big="true" />
          </div>
        </div>
      </div>

      <!-- Settings Favorites -->
      <div class="settings-infos active" id="settings-favorites" v-show="settingShowed == 'item-favorites'">
        <h2>Sauvegardés</h2>
        <div class="favorites-cards">
          <div class="fz16 tac wh100" v-if="savesX == ''"><p>Pas de posts sauvegardés pour le moment</p></div>
          <div class="favorites-card" v-else v-for="save in savesX" :key="save.postId">
            <a :href="save.link" @click.prevent="$emit('get-one-post', save)">
              <img :src="save.media" alt="image du post sauvegardé" />
              <div>
                <p>{{ save.pseudo }}</p>
                <p>{{ save.title }}</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      <!-- Settings Infos -->
      <div class="settings-infos active" id="settings-infos" v-show="settingShowed == 'item-infos'">
        <div class="container">
          <h2>Vos informations</h2>
          <form ref="profile-picture-form" @submit.prevent="updatePicture">
            <div class="group-form" id="picture-container">
              <label for="picture" id="picture-label">
                <span></span>

                <img
                  class="profile-picture"
                  id="preview-picture"
                  :src="userDataX.picture"
                  ref="profilePicture"
                  alt="photo de profil"
                />
              </label>
              <ImageResizer
                id="picture"
                class="none"
                :class-name="['form-control-file']"
                name="image"
                accept="image/*"
                capture="camera"
                hidden
                :max-width="256"
                :max-height="256"
                doNotResize="['gif', 'svg']"
              />
            </div>
            <div class="group-form form-text">
              <p>Pseudo</p>
              <p class="data pseudo">{{ userDataX.pseudo }}</p>
            </div>
            <div class="group-form form-text">
              <p>Email</p>
              <p class="data email">{{ userDataX.email }}</p>
            </div>
            <button type="submit" id="save-form-btn" name="enregistrer">Enregistrer</button>
          </form>
        </div>
      </div>

      <!-- Settings Change Password -->
      <div class="settings-change" id="settings-change" v-show="settingShowed == 'item-change'">
        <h2>Changer le mot de passe</h2>
        <Security />
        <Desactivate @click.native="$emit('disable-user', userDataX)" :msg="'Désactiver mon compte'" :stat="false" />
      </div>
    </div>
  </main>
</template>

<script>
import http from '../js/http';
import {mapState, mapGetters} from 'vuex';
import * as utils from '../js/utils';
import Security from './forms/Security.vue';
import ImageResizer from './ImageResizer.vue';
import EventBus from '../js/event-bus';

export default {
  name: 'Account',
  components: {
    Security,
    ImageResizer,
  },
  props: ['save'],
  data() {
    return {
      settingShowed: 'item-followers',
      profilePicture: '',
      favorites: [],
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

    changeSetting(e) {
      const setting = e.target;
      this.settingShowed = setting['id'];
      setting.parentElement.childNodes.forEach((x) => x.classList.remove('active'));
      setting.classList.add('active');
      switch (setting['id']) {
        case 'item-followers':
          this.getFollowers();
          break;
        case 'item-favorites':
          this.getSaves();
          break;
        case 'item-infos':
          EventBus.$emit('getCurrentUser');
          break;
      }
    },

    getFollowers() {
      http
        .get(`user/followers/${this.userId}`, this.setAuthorization())
        .then((response) => {
          utils.commitUserFollowers(response.data);
        })
        .catch((error) => console.log(error));
    },

    getSaves() {
      http
        .get(`posts/saves/${this.userId}`, this.setAuthorization())
        .then((response) => {
          this.favorites = [];
          this.favorites = response.data;
        })
        .catch((error) => console.log(error));
    },

    followUser(follower) {
      EventBus.$emit('followUser', follower);
    },

    updatePicture() {
      let fd = new FormData();
      fd.append('picture', this.profilePicture);
      fd.append('image', this.selectedFile);

      utils.showSaveBox(true);

      http
        .put(`user/updatePicture/${this.userId}`, fd, this.setAuthorization())
        .then(() => {
          this.profilePicture = '';
          utils.commitSelectedFile('');
          this.$emit('get-all-posts');
        })
        .catch((error) => console.log(error));
    },
  },
  computed: {
    followersCount() {
      return this.userFollowers.length;
    },
    ...mapState({
      token: 'token',
      postDataX: 'postDataX',
      savesX: 'savesX',
      showLoader: 'showLoader',
      userDataX: 'userDataX',
      userFollowers: 'userFollowers',
      userId: 'userId',
      selectedFile: 'selectedFile',
      showSaveBox: 'showSaveBox',
    }),
    ...mapGetters([
      'postDataGetter',
      'userDataGetter',
      'savesGetter',
      'loaderGetter',
      'userIdGetter',
      'fileGetter',
      'saveBoxGetter',
    ]),
  },
  mounted() {
    this.getFollowers();
  },
  created() {},
};
</script>

<style lang="scss" scoped>
// VARIABLES
$height-navbar: 50px;
$padding-main: 20px;

//BASE
*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
}

a {
  display: inline-block;
  text-decoration: none;
  color: #344767;
}

// TYPOGRAPHY
.container {
  text-align: center;
  color: #344767;
}
.bold {
  font-weight: 600;
}
.fz12 {
  font-size: 12px;
}
.fz14 {
  font-size: 14px;
}
.fz16 {
  font-size: 16px;
}
.fz18 {
  font-size: 18px;
}
.fz20 {
  font-size: 20px;
}
.fz22 {
  font-size: 22px;
}
.fz24 {
  font-size: 24px;
}
.tac {
  text-align: center;
}
.w100 {
  width: 100%;
}
.h100 {
  height: 100px;
}
.wh100 {
  width: 100%;
  height: 100%;
}
.upp {
  text-transform: uppercase;
}
.grey {
  color: #666;
}
.blue-grey {
  color: #67748e;
}
.none {
  display: none;
}
@media screen and (min-width: 768px) {
  .mq7-fz16 {
    font-size: 16px;
  }
  .mq7-fz18 {
    font-size: 18px;
  }
}
@media screen and (min-width: 975px) {
  .mq9-fz16 {
    font-size: 16px;
  }
  .mq9-fz18 {
    font-size: 18px;
  }
}

// COMPONENTS
button.orange {
  padding: 5px 15px;
  border: none;
  background-color: #fd7d63;
  color: #fff;
  cursor: pointer;
}
input.white-border {
  width: 100%;
  outline: 1px solid #ccc;
  border: none;
  padding-left: 10px;
  color: #344767;
  letter-spacing: 0.5px;
}
.br20 {
  border-radius: 20px;
}
.br30 {
  border-radius: 30px;
}
.br50 {
  border-radius: 50%;
}

// MAIN
.container {
  display: flex;
}

.main {
  width: 100%;
  background-color: #f4f4fb;
}

#settings-change {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  #form {
    width: 90%;
    /* max-width: 300px; */
    margin: 0 auto;
    height: 70%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
}
.main-settings {
  padding: 20px 0;
  //   display: flex;
  //   justify-content: space-between;
  width: 100%;
  max-width: 500px;
  height: calc(100vh - 51px);
  overflow: hidden;
  margin: 0 auto;
  & > div,
  &-aside ul li {
    border: 1px solid #ddd;
    // border-radius: 10px;
    background-color: #fff;
    padding: 10px;
    list-style-type: none;
    // margin: 0;
    // margin: 0 auto 10px;
    // margin-bottom: 10px;
  }

  &-aside {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 15%;

    & ul {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      width: 100%;
    }
    & ul li {
      padding: 5px 0px;
      border-radius: 20px;
      width: 48%;
      padding: 5px;
      margin: 5px 0;
      height: fit-content;
      &:hover {
        background-color: #ffcccc2f;
        cursor: pointer;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
    li.active {
      border: 1px solid #fd7d63;
      background-color: #ffcccc2f;
    }
    li.active a {
      color: #fd7d63;
    }
  }
  &-content {
    margin-top: 20px;
    height: 80%;
    // max-height: 75%;
    // overflow-y: scroll;
    overflow: hidden;
    padding: 20px !important;
    // &::-webkit-scrollbar {
    //   width: 5px;
    // }
    // &::-webkit-scrollbar-thumb {
    //   border-radius: 10px;
    //   background-color: #fd7d63;
    // }
    & > div.active {
      display: block;
    }
    & h2 {
      margin-bottom: 10px;
    }

    & form {
      & label {
        display: inline-block;
        width: 20%;
        // margin-bottom: 10px;
        // text-align: right;
      }
      & > div {
        display: flex;
        justify-content: end;
        // width: 80%;
      }
      & > div.form-text {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        p:first-child {
          text-align: left;
          font-size: 14px;
        }
        .data {
          min-width: 75%;
          height: 25px;
          padding-left: 5px;
          border: 1px solid #344767;
          border-radius: 7px;
          color: #fff;
          background-color: #67748e;
          &:focus-visible {
            outline: none;
            border: 1px solid #fd7d63;
          }
          &:hover {
            cursor: not-allowed;
          }
        }
      }
    }

    & label#picture-label {
      width: fit-content;
      height: 200px;
      width: 200px;
      position: relative;
      border: 1px dashed;
      padding: 5px;
      //   margin: 0 auto 20px;
      border-radius: 50%;
      cursor: pointer;
    }
    & img.profile-picture {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  }
}

#picture-container {
  height: 70%;
  align-items: center;
  justify-content: center;
}

//   display: flex;
//   flex-direction: column;
//   justify-content: flex-start;
//   height: 100%;
//   & form:last-child {
//     height: 100%;
//     display: flex;
//     align-items: end;
//     justify-content: center;

//     & label {
//       display: inline;
//     }
//   }

#save-form-btn {
  padding: 7px 0;
  width: 70%;
  cursor: pointer;
  background-color: #66b366;
  outline: none;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  color: #fff;
  margin-top: 10px;

  &:hover {
    text-decoration: underline;
    background-color: hsl(120, 34%, 50%);
  }
}

.follows-cards {
  div:last-child {
    border-bottom: none;
  }
  overflow-y: scroll;
  //   height: 100%;
  height: calc(100% - 40px);
  &::-webkit-scrollbar {
    width: 0px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #fd7d63;
  }
}

.card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;

  & a {
    display: flex;
    align-items: center;
    width: 85%;
    &:hover {
      text-decoration: underline;
    }

    & img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 50%;
    }

    & div {
      margin-left: 10px;
      font-size: 14px;
      width: 60%;
      text-align: left;
    }
  }
}
#settings-favorites {
  height: 100%;
}
.favorites-cards {
  width: 100%;
  display: flex;
  align-items: center;
  //   justify-content: space-between;
  //   flex-direction: column;
  flex-wrap: wrap;
  height: calc(100% - 40px);
  overflow-y: scroll;
  //   overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0px;
  }
}

.favorites-card {
  width: 50%;
  padding: 10px;

  & a {
    position: relative;
    width: 100%;
    height: 150px;
    border-radius: 10px;
    box-shadow: 0 0 10px #0003;
    &:hover {
      box-shadow: 0 0 10px #0006;
    }
  }

  & img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    object-fit: cover;
    cursor: pointer;
  }

  & div {
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: left;
    padding: 2px 5px;
    background-color: #fffb;
    border-radius: 0 0 10px 10px;

    & p {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    & p:first-child {
      font-weight: 600;
    }
  }
}

.password-form {
  & div {
    display: flex !important;
    flex-direction: column;
    width: 100%;
  }
  & label {
    display: block !important;
    width: 100% !important;
  }
  & input {
    width: 70%;
    border-radius: 5px;
    border: 1px solid #344767;
    height: 30px;
    padding-left: 10px;
    &:focus-visible {
      border: 1px solid #fd7d63;
      outline: none;
    }
  }
}

#settings-infos {
  height: 100%;

  & .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: start;
  }
}

@media screen and (min-width: 400px) {
  .main-settings {
    padding: 20px;
    &-aside,
    &-content {
      border-radius: 10px;
    }
  }
}
</style>
