<template>
  <div class="super-container">
    <div class="valid-box" v-show="displayValidBox">
      <img src="../assets/checked.png" alt="checked logo" />
    </div>
    <div class="auth__container">
      <TitleLogo :authType="login" />
      <div class="errorLogin" v-show="showErrorLogin">
        <p>Ce compte a été désactivé.</p>
      </div>
      <form id="form" method="post" @submit.prevent="submitLoginForm" @keyup="isFormValid">
        <!-- INPUT - Email -->
        <div class="form-group" :class="{success: !$v.user.email.$invalid}">
          <input :type="email" id="email" name="email" v-model.trim="$v.user.email.$model" required @keyup="debounce('email')" />
          <label for="email">Email</label>
          <span></span>
          <div class="error" v-if="errors.email && $v.user.email.$error">L'email n'est pas valide.</div>
        </div>

        <!-- INPUT - Password -->
        <div
          class="form-group"
          :class="{
            success: !$v.user.password.$invalid,
            shake: displayError,
          }"
        >
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            name="password"
            v-model.trim="$v.user.password.$model"
            required
            @keyup="debounce('password')"
          />
          <label for="password">Mot de passe</label>
          <i class="far fa-eye" :class="{blue: showPassword}" id="eye1" @click="showPassword = !showPassword"></i>
          <span></span>
          <div class="error" v-if="errors.password && $v.user.password.$error">
            Le mot de passe doit contenir 8 caractères : 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial.
          </div>
          <div class="error">
            {{ errorMessage }}
          </div>
        </div>

        <button type="submit" class="gradientBtn" id="submit-btn" :disabled="submitLoginForm" name="connexion">
          Se connecter
        </button>
      </form>

      <div class="signup_link">
        Vous n'avez pas encore de compte ? <br />
        <router-link to="/signup">Inscrivez-vous</router-link>
      </div>
    </div>
  </div>
</template>

<script>
//IMPORTS
import {mapState, mapGetters} from 'vuex';
// import store from '../store/index';
import TitleLogo from '../components/TitleLogo.vue';

import _ from 'lodash';
import http from '../js/http';
import * as utils from '../js/utils';

import {required, minLength, email} from 'vuelidate/lib/validators';
import {hasNumber, hasLowercaseLetter, hasCapitalcaseLetter, hasSpecialCharacter} from '../validators/password';

//EXPORTS
export default {
  name: 'Signup',
  components: {
    TitleLogo,
  },
  data() {
    return {
      login: 'Connexion',
      displayContainer: true,
      displayValidBox: false,
      showPassword: false,
      displayError: false,
      showErrorLogin: false,
      errorMessage: '',
      email: '',
      user: {
        email: '',
        password: '',
      },
      errors: {
        email: false,
        password: false,
      },
    };
  },
  validations: {
    user: {
      email: {
        required,
        email,
      },
      password: {
        required,
        minLength: minLength(8),
        hasNumber,
        hasLowercaseLetter,
        hasCapitalcaseLetter,
        hasSpecialCharacter,
      },
    },
  },
  methods: {
    isFormValid() {
      const submitBtn = document.querySelector('#submit-btn');
      this.$v.$touch();
      !this.$v.$invalid ? (submitBtn.disabled = false) : (submitBtn.disabled = true);
    },

    debounce: _.debounce(function (inputName) {
      this.errors[inputName] = this.$v.user[inputName].$error;

      const _inputName = document.getElementById(inputName);

      if (_inputName != null && this.$v.user[inputName].$error) {
        _inputName.parentElement.classList.add('shake');

        setTimeout(() => {
          _inputName.parentElement.classList.remove('shake');
        }, 500);
      }
    }, 700),

    submitLoginForm() {
      if (!this.$v.$invalid) {
        http
          .post('auth/login', {
            email: this.$v.user.email.$model,
            password: this.$v.user.password.$model,
          })
          .then((response) => {
            const res = response.data;
            if (res.isActive == 1) {
              localStorage.setItem('token', res.token);

              let user = {
                followers: res.followers,
                isAdmin: res.isAdmin,
                link: res.link,
                picture: res.picture,
                posts: res.posts,
                pseudo: res.pseudo,
                userEmail: res.userEmail,
                userId: res.userId,
              };
              utils.commitToken(res.token);
              utils.commitUserData(user);

              utils.commitUserFollowers(res.followers);
              utils.commitIsAdmin(res.isAdmin);
              // utils.commitUserLink(res.link);
              // utils.commitUserPicture(res.picture);
              // utils.commitUserPosts(res.posts);
              // utils.commitUserPseudo(res.pseudo);
              // utils.commitUserEmail(res.userEmail);
              utils.commitUserId(res.userId);

              // this.displayValidBox = true;
              // setTimeout(() => {
              //   this.$router.push('/');
              // }, 500);
            }
            if (response.data.isActive == 0) {
              this.showErrorLogin = true;
              const errorLoginMsg = document.querySelector('.errorLogin p');
              errorLoginMsg.classList.add('shake');

              setTimeout(() => {
                errorLoginMsg.classList.remove('shake');
              }, 500);
              return;
            }
          })
          .catch((error) => {
            if (error.response != undefined && error.response.status === 401) {
              this.errorMessage = error.response.data.message;
            }
            // console.log(error.response);
          });
      } else {
        return;
      }
    },
  },
  computed: {
    ...mapState({
      token: 'token',
      userFollowers: 'userFollowers',
      isAdmin: 'isAdmin',
      userLink: 'userLink',
      userPosts: 'userPosts',
      userId: 'userId',
      showAccount: 'showAccount',
      showLoader: 'showLoader',
      noPosts: 'noPosts',
      userDataX: 'userDataX',
    }),
    ...mapGetters([
      'tokenGetter',
      'userIdGetter',
      'followersGetter',
      'postsGetter',
      'linkGetter',
      'accountGetter',
      'loaderGetter',
      'noPostsGetter',
      'isAdminGetter',
      'userDataGetter',
    ]),
  },
  watch: {
    errorMessage(newValue) {
      this.errorMessage = newValue;
      this.displayError = true;
      setTimeout(() => {
        this.displayError = false;
      }, 500);
    },
  },
};
</script>

<style scoped lang="scss">
.errorLogin {
  width: 100%;
  text-align: center;

  & p {
    color: red;
    font-size: 16px;
  }
}
</style>
