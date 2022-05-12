<template>
  <!-- NAVBAR -->
  <div class="navbar">
    <div class="navbar-content">
      <NavbarLogo v-show="showNavbarLogo || tabletView" @click.native="$emit('get-all-posts')" />

      <!-- Input Search -->
      <div class="search-container">
        <transition name="fadeDown" appear>
          <form action="/" class="navbar__form" v-show="showSearchBar">
            <SearchSvg2 />
            <input
              type="text"
              placeholder="Rechercher..."
              id="search-input"
              ref="searchInput"
              class="fz16"
              v-model="searchInput"
              @input="filterResults"
            />
          </form>
        </transition>

        <!-- Modale Results -->
        <transition name="fade" appear>
          <div class="navbar__search__modale" id="search-modale" v-show="showSearchResults">
            <!-- No Result -->
            <div v-if="results.length == 0 && searchInput.length > 0 && showSearchBar" class="result">
              <img src="https://cdn4.iconfinder.com/data/icons/tabler-vol-5/24/mood-cry-256.png" alt="Pas de résultat" />
              Aucun résultat
            </div>

            <!-- Result -->
            <div v-if="searchInput.length > 0 && results.length > 0 && showSearchResults && showSearchBar">
              <a
                class="result"
                v-for="user in results"
                :key="user.userId"
                :href="user.link"
                @click.prevent="getUserProfile(user)"
              >
                <img :src="user.picture" />
                <div class="result-pseudo">{{ user.pseudo }}</div>
              </a>
            </div>
          </div>
        </transition>
      </div>
      <div class="navbar-items">
        <SearchSvg v-show="!tabletView" @click.native="toggleSearchbarLogo" />

        <CreateIcon @click.native="createIconClick" />

        <UserIcon v-if="tabletView" @click.native="displayAccount" />
        <UsersIcon v-if="isAdmin" @click.native="displayAdminPanel" />

        <LogoutIcon @click.native="logout" v-if="tabletView" />

        <div class="mobile-menu-container" @click="showMobileMenu = !showMobileMenu">
          <CrossMenu :crossIcon="showMobileMenu" />
          <MenuItems :visible="showMobileMenu" @log-out="logout" @showAccount="displayAccount" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex';
import * as utils from '../js/utils';
import http from '../js/http';
import EventBus from '../js/event-bus';
import NavbarLogo from './icons/NavbarLogo.vue';
import CreateIcon from './icons/CreateIcon.vue';
import CrossMenu from './buttons/CrossMenu.vue';
import MenuItems from './menu/MenuItems.vue';
import SearchSvg from './icons/SearchSvg.vue';
import SearchSvg2 from './icons/SearchSvg2.vue';

export default {
  name: 'Navbar',

  data() {
    return {
      showMobileMenu: false,
      searchInput: '',
      showNavbarLogo: true,
      showSearchIcon: true,
      showSearchBar: false,
      showSearchResults: false,
      tabletView: false,
      results: [],
    };
  },
  components: {
    CreateIcon,
    CrossMenu,
    MenuItems,
    NavbarLogo,
    SearchSvg,
    SearchSvg2,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    setAuthorization() {
      return {
        headers: {
          Authorization: 'Bearer ' + this.token,
        },
      };
    },
    displayAccount() {
      utils.showAdminPanel(false);
      this.showAccount ? utils.showAccount(false) : utils.showAccount(true);
    },

    displayAdminPanel() {
      utils.showAccount(false);
      EventBus.$emit('getAllUsers', this.getAllUsers);
      this.showAdminPanel ? utils.showAdminPanel(false) : utils.showAdminPanel(true);
    },

    getUserProfile(user) {
      this.showSearchResults = false;
      this.searchInput = '';
      if (window.innerWidth <= 768) {
        this.showSearchBar = false;
        setTimeout(() => {
          this.showNavbarLogo = true;
        }, 300);
      }
      this.$emit('get-user-profile', user);
    },

    createIconClick() {
      this.$store.commit('resetModals');
      utils.showCreateModale(true);
      utils.commitSelectedFile('');
    },

    filterResults() {
      if (this.searchInput.length == 0) {
        this.results = [];
        this.showSearchResults = false;
      } else {
        this.showSearchResults = true;
        this.showSearchBar = true;

        http
          .get(`user/search/${this.searchInput}`, this.setAuthorization())
          .then((response) => {
            this.results = response.data;
          })
          .catch((error) => console.log(error));
      }
    },

    logout() {
      if (!confirm('Voulez-vous vraiment vous déconnecter ?')) {
        return;
      } else {
        localStorage.clear();
        this.$store.commit('resetState');
        this.$router.push('/login');
      }
    },

    toggleSearchbarLogo() {
      if (this.showNavbarLogo) {
        this.showNavbarLogo = false;
        setTimeout(() => {
          this.showSearchBar = true;
        }, 250);
        setTimeout(() => {
          this.$refs.searchInput.focus();
        }, 300);
      } else {
        this.showSearchBar = false;
        setTimeout(() => {
          this.showNavbarLogo = true;
        }, 250);
      }

      // Display Search Results
      if (this.showSearchResults) {
        this.showSearchResults = false;
      } else {
        setTimeout(() => {
          this.showSearchResults = true;
        }, 250);
      }
    },

    onResize() {
      if (window.innerWidth >= 768) {
        this.tabletView = this.showSearchBar = true;
      } else {
        this.tabletView = this.showSearchBar = false;
        this.showNavbarLogo = true;
      }
    },
  },

  computed: {
    ...mapState({
      userId: 'userId',
      createModale: 'createModale',
      token: 'token',
      isAdmin: 'isAdmin',
      showAccount: 'showAccount',
      showAdminPanel: 'showAdminPanel',
      selectedFile: 'selectedFile',
    }),
    ...mapGetters([
      'userIdGetter',
      'createGetter',
      'tokenGetter',
      'isAdminGetter',
      'accountGetter',
      'showAdminPanelGetter',
      'fileGetter',
    ]),
  },
  watch: {
    mobileMenu(newValue) {
      this.$emit('input', newValue);
    },
  },
  created() {
    this.mobileMenu = this.value;
    window.addEventListener('resize', this.onResize);
  },
  mounted() {
    this.onResize();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
};
</script>

<style lang="scss">
// VARIABLES
$height-navbar: 50px;

// NAVBAR
.navbar {
  position: sticky;
  top: 0;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  padding: 0 25px;
  z-index: 1;

  &-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    margin: 0 auto;

    & a {
      margin-right: 5px;
    }
  }

  & .search-container {
    position: relative;
  }
  & form {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    width: 100%;
    & svg.form-search {
      opacity: 0.5;
    }
    & input {
      color: #344767;
    }
  }

  & input {
    width: 80%;
    height: 30px;
    padding-left: 10px;
    border: none;
    border-radius: 8px;

    &:focus-visible {
      outline: none;
    }
  }

  &__search__modale {
    top: 40px;
    left: 0;
    width: 100%;
    background-color: #fff;
    position: absolute;
    border-radius: 0 0 10px 10px;
    border: 1px solid #ddd;

    & div.no-result {
      padding: 10px;
      border-radius: 0 0 5px 5px;
      color: #fd7d63;
      background-color: #fff;
      font-weight: 600;
      border: 2px solid #ddd;
      border-top: 1px solid #ddd;
    }
  }

  &-items {
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    #create-btn,
    #search-btn,
    .mobile-menu-container,
    #admin-btn {
      padding: 0 5px;
      display: flex;
      cursor: pointer;
    }
  }

  & .mobile-menu {
    &-items {
      position: absolute;
      top: 40px;
      right: 0;
      background-color: #fff;
      padding: 5px;
      border-radius: 5px;
      border: 1px solid #ddd;
    }
    &-items > button {
      display: flex;
      align-items: center;
      color: #344767;
      padding: 5px;

      &:hover {
        background-color: #ffcccc2f;
        cursor: pointer;
      }
    }
    &-items > button:last-child {
      margin-bottom: 0;
      border-top: 1px solid #ddd;
    }
    &-items p {
      margin-left: 10px;
    }
    &-items svg {
      stroke: #fd7d63;
      fill: #fd7d63;
    }

    &-container {
      position: relative;

      & .menu-mobile-btn {
        width: 26px;
        height: 30px;

        & span {
          position: relative;
          width: 26px;
          height: 2.5px;
          display: block;
          background: none;
          border-radius: 20px;
          cursor: pointer;

          &::before,
          &::after {
            content: '';
            position: absolute;
            left: 0;
            width: 100%;
            height: 3px;
            background-color: #344767;
            border-radius: inherit;
            transition: all 0.3s ease-out;
          }
          &::before {
            top: -5px;
          }
          &::after {
            top: 5px;
          }
        }
        & span.crossIcon::before {
          transform: rotate(-45deg);
          top: 0;
        }
        & span.crossIcon::after {
          transform: rotate(45deg);
          top: 0;
        }
      }
    }
  }

  & button {
    border: none;
    background: none;
    cursor: pointer;
  }

  & .result {
    display: flex;
    align-items: center;
    padding: 5px;
    img {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 50%;
      margin-right: 10px;
    }
    &:hover {
      background-color: #fd7d6317;
      cursor: pointer;
    }
  }
}

// MEDIA QUERIES
@media screen and (min-width: 768px) {
  .navbar {
    justify-content: center;
    padding: 0;

    &-content {
      max-width: 800px;
      padding: 0 25px;
    }
    form {
      display: flex;
      width: 100%;
    }
    #create-btn {
      margin: 0;
    }
    .mobile-menu-container {
      display: none;
    }
    #user-icon,
    #logout-icon {
      display: block;
    }
    #search-btn {
      display: none;
    }
    .search-container {
      width: 50%;
    }
  }
}

/* Fade */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
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
</style>
