<template>
  <main class="main-settings">
    <div class="main-settings-aside">
      <ul id="aside-list">
        <li class="btn-aside active" id="item-all-users" @click="changeSetting">Utilisateurs</li>
        <li class="btn-aside" id="item-reports" @click="changeSetting">{{ section2 }}</li>
        <li class="btn-aside" id="item-statistics" @click="changeSetting">{{ section3 }}</li>
      </ul>
    </div>

    <div class="main-settings-content">
      <!-- UTILISATEURS -->
      <div class="settings-infos active" id="settings-all-users" v-show="settingShowed == 'item-all-users'">
        <h2>{{ section1 }} ({{ usersCount }})</h2>
        <div class="follows-cards">
          <div class="card" v-for="user in allUsers" :key="user.userId">
            <a :href="user.link" @click.prevent="$emit('get-user-profile', user)">
              <img class="users-picture" :src="user.picture" alt="photo de profil" />
              <div>{{ user.pseudo }}</div>
            </a>
            <div class="actions-admin-btn">
              <AdminChangeBtn :user="user" @click.native="changeAdminStatus(user)" />
              <Desactivate @click.native="disableUser(user)" :msg="'Désactiver'" :stat="true" />
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Favorites -->
      <div class="settings-infos active" id="settings-favorites2" v-show="settingShowed == 'item-reports'">
        <h2>{{ section2 }} ({{ reportsCount }})</h2>
        <div class="reported-cards">
          <div class="reported-card" v-for="report in allReports" :key="report.postId">
            <a :href="report.link" @click.prevent="getOnePost(report)">
              <img :src="report.media" alt="image de signalement" />
              <div>
                <p>{{ report.pseudo }}</p>
                <p>{{ report.title }}</p>
              </div>
            </a>
            <div class="reported-actions">
              <Desactivate @click.native="deleteReport(report)" :msg="'Ignorer'" green="true" />
              <Desactivate @click.native="deletePost(report)" :msg="'Supprimer'" />
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Infos -->
      <div class="settings-infos statistics" id="settings-statistics" v-show="settingShowed == 'item-statistics'">
        <div class="container-statistics">
          <h2 class="statistics-title">{{ section3 }}</h2>
          <div class="statistics-group">
            <h2>Utilisateurs</h2>
            <div class="statistics-cards">
              <div class="statistics-card">
                <h3>Total</h3>
                <p>{{ number_of_users }}</p>
              </div>
              <div class="statistics-card">
                <h3>Actifs</h3>
                <p>{{ total_actives }}</p>
              </div>
              <div class="statistics-card">
                <h3>Inactifs</h3>
                <p>{{ total_disabled }}</p>
              </div>
            </div>
          </div>
          <div class="statistics-group">
            <h2>posts</h2>
            <div class="statistics-cards">
              <div class="statistics-card">
                <h3>Total</h3>
                <p>{{ number_of_posts }}</p>
              </div>
              <div class="statistics-card">
                <h3>Commentaires</h3>
                <p>{{ number_of_comments }}</p>
              </div>
              <div class="statistics-card">
                <h3>Likes</h3>
                <p>{{ number_of_likes }}</p>
              </div>
            </div>
          </div>
          <div class="statistics-group">
            <h2>Status</h2>
            <div class="statistics-cards">
              <div class="statistics-card">
                <h3>Utilsateurs</h3>
                <p>{{ total_status_users }}</p>
              </div>
              <div class="statistics-card">
                <h3>Administrateurs</h3>
                <p>{{ total_status_admins }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import http from '../js/http';
import {mapState, mapGetters} from 'vuex';
import * as utils from '../js/utils';

export default {
  name: 'Account',
  props: ['userX', 'user'],
  data() {
    return {
      settingShowed: 'item-all-users',
      profilePicture: '',
      favorites: [],
      allUsers: [],
      allReports: [],
      allStatistics: [],
      section1: 'Utilisateurs actifs ',
      section2: 'Signalements ',
      section3: 'Statistiques',
      number_of_users: 0,
      total_actives: 0,
      total_disabled: 0,
      number_of_posts: 0,
      number_of_comments: 0,
      number_of_likes: 0,
      total_status_users: 0,
      total_status_admins: 0,
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

    deleteReport(report) {
      if (!confirm('Voulez-vous vraiment supprimer ce signalement ?')) {
        return;
      }
      http
        .delete(`posts/reports/${report.postId}`, this.setAuthorization())
        .then(() => {
          setTimeout(() => {
            const index = this.allReports.findIndex((x) => x.postId == report.postId);
            this.allReports.splice(index, 1);
          }, 500);
          utils.showValidBoxTimer(700);
        })
        .catch((err) => console.log(err));
    },

    getAllUsers() {
      http
        .get('user', this.setAuthorization())
        .then((response) => (this.allUsers = response.data))
        .catch((error) => console.log(error));
    },

    getStatistics() {
      http
        .get(`posts/statistics/${this.userId}`, this.setAuthorization())
        .then((res) => {
          this.number_of_users = res.data.users;
          this.total_actives = res.data.users_actives;
          this.total_disabled = res.data.users_disabled;
          this.total_status_admins = res.data.status_admins;
          this.total_status_users = res.data.status_users;
          this.number_of_posts = res.data.posts;
          this.number_of_likes = res.data.likes;
          this.number_of_comments = res.data.comments;
        })
        .catch((error) => console.log(error));
    },

    getReports() {
      http
        .get(`posts/reports/${this.userId}`, this.setAuthorization())
        .then((response) => (this.allReports = response.data))
        .catch((error) => console.log(error));
    },

    changeAdminStatus(user) {
      if (!confirm('Voulez-vous vraiment changer le statut de ce compte ?')) {
        return;
      }
      http
        .put(`user/status/${user.userId}`, {}, this.setAuthorization())
        .then((res) => {
          let userTarget = this.allUsers.find((x) => x.userId == user.userId);
          if (res.status == 200) {
            userTarget.isAdmin = 0;
            console.log(user.pseudo + ' est désormais user !');
          }
          if (res.status == 201) {
            userTarget.isAdmin = 1;
            console.log(user.pseudo + ' est désormais admin !');
          }
        })
        .catch((error) => console.log(error));
    },

    disableUser(user) {
      if (!confirm('Voulez-vous vraiment désactiver ce compte ?')) {
        return;
      }
      http
        .put(`user/${user.userId}`, {}, this.setAuthorization())
        .then(() => {
          console.log('Compte de ' + user.pseudo + ' désactivé !');
          const index = this.allUsers.findIndex((x) => x.userId == user.userId);
          utils.showValidBoxTimer(1000);
          setTimeout(() => {
            this.allUsers.splice(index, 1);
          }, 500);
        })
        .catch((error) => console.log(error));
    },

    changeSetting(e) {
      const setting = e.target;
      this.settingShowed = setting['id'];
      setting.parentElement.childNodes.forEach((x) => x.classList.remove('active'));
      setting.classList.add('active');
      switch (setting['id']) {
        case 'item-all-users':
          this.getAllUsers();
          break;
        case 'item-reports':
          this.getReports();
          break;
        case 'item-statistics':
          this.getStatistics();
          break;
      }
    },
  },
  computed: {
    usersCount() {
      return this.allUsers.length;
    },
    reportsCount() {
      return this.allReports.length;
    },

    ...mapState({
      isAdmin: 'isAdmin',
      selectedFile: 'selectedFile',
      showLoader: 'showLoader',
      token: 'token',
      userDataX: 'userDataX',
      userId: 'userId',
    }),
    ...mapGetters(['isAdminGetter', 'fileGetter', 'loaderGetter', 'tokenGetter', 'userDataGetter', 'userIdGetter']),
  },
  mounted() {
    this.getAllUsers();
  },
};
</script>

<style lang="scss" scoped>
// VARIABLES
$height-navbar: 50px;
$padding-main: 20px;

// MAIN
.container {
  display: flex;
}

.main {
  width: 100%;
  background-color: #f4f4fb;
}

.main-settings {
  padding: 20px 0;
  width: 100%;
  max-width: 500px;
  height: calc(100vh - 51px);
  overflow: hidden;
  margin: 0 auto;
  border-radius: 0;
  & > div,
  &-aside ul li {
    border: 1px solid #ddd;
    background-color: #fff;
    padding: 10px;
    list-style-type: none;
  }

  &-aside {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    & ul {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      width: 100%;
    }
    & ul li {
      padding: 5px 0px;
      border-radius: 20px;
      width: 30%;
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
    overflow: hidden;
    padding: 20px !important;
    & > div.active {
      display: block;
    }
    & h2 {
      margin-bottom: 10px;
      width: 100%;
    }

    & form {
      & label {
        display: inline-block;
        width: 20%;
      }
      & > div {
        display: flex;
        justify-content: end;
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

    & label#picture-label2 {
      width: fit-content;
      height: 200px;
      width: 200px;
      position: relative;
      border: 1px dashed;
      padding: 5px;
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

#picture-container2 {
  height: 70%;
  align-items: center;
  justify-content: center;
}

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
.desactivate-form-btn {
  border: 1px solid #ff4242;
  background: none;
  margin-top: 40px;
  color: #ff4242;
  font-weight: 600;
  cursor: pointer;
  background-color: #fff;
  padding: 5px 10px !important;
  border-radius: 5px;
  &:hover {
    background-color: #ff4242;
    color: #fff;
  }
}

.follows-cards {
  div:last-child {
    border-bottom: none;
  }
  overflow-y: scroll;
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

  .actions-admin-btn {
    display: flex;
    & button {
      padding: 0 5px;
      margin: 0 5px;
    }
  }

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

.reported-actions {
  display: flex;
  flex-direction: column;
  button {
    margin: 10px 0;
  }
}

.reported-cards {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  height: calc(100% - 40px);
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0px;
  }
}

.reported-card {
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;

  & a {
    position: relative;
    width: 50%;
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

  & a div {
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

.settings-infos {
  height: 100%;

  & .container-statistics {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  & .statistics-title {
    color: #fd7d63;
    text-transform: uppercase;
  }
  & .statistics-group {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: space-around;
    padding: 10px;
    & h2 {
      color: #344767;
      border-bottom: 1px solid #344767;
      text-transform: capitalize;
    }
    & p {
      font-size: 25px;
    }
    & .statistics-cards {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 30px;
    }
  }
}

// MEDIA QUERIES
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
