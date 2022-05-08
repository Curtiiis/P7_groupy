<template>
  <div class="super-container">
    <div class="valid-box" v-show="displayValidBox">
      <img src="../assets/checked.png" alt="checked logo" />
    </div>
    <div class="auth__container">
      <TitleLogo :authType="signup" />

      <form id="form" method="post" @submit.prevent="submitSignupForm" @keyup="isFormValid">
        <!-- INPUT - Pseudo -->
        <div
          id="form-group-pseudo"
          class="form-group"
          :class="{
            success: !$v.user.pseudo.$invalid,
            shake: displayErrorPseudo,
          }"
        >
          <input
            :type="pseudo"
            id="pseudo"
            name="pseudo"
            v-model.trim="$v.user.pseudo.$model"
            required
            @keyup="debounce('pseudo')"
          />
          <label for="pseudo">Pseudo</label>
          <span></span>
          <div class="error" v-if="errors.pseudo && !$v.user.pseudo.minLength">Le pseudo doit contenir minimum 3 caractères</div>
          <div class="error" v-if="errors.pseudo && !$v.user.pseudo.maxLength">Le pseudo doit contenir maximum 20 caractères</div>
          <div class="error">
            {{ errorPseudo }}
          </div>
        </div>

        <!-- INPUT - Email -->
        <div
          class="form-group"
          :class="{
            success: !$v.user.email.$invalid,
            shake: displayErrorEmail,
          }"
        >
          <input :type="email" id="email" name="email" v-model.trim="$v.user.email.$model" required @keyup="debounce('email')" />
          <label for="email">Email</label>
          <span></span>
          <div class="error" v-if="errors.email && $v.user.email.$error">L'email n'est pas valide.</div>
          <div class="error">
            {{ errorEmail }}
          </div>
        </div>

        <!-- INPUT - Password -->
        <div
          class="form-group"
          :class="{
            success: !$v.user.password1.$invalid,
            shake: displayErrorPassword,
          }"
        >
          <input
            :type="showPassword1 ? 'text' : 'password'"
            id="password1"
            name="password1"
            v-model.trim="$v.user.password1.$model"
            required
            @keyup="debounce('password1')"
          />
          <label for="password1">Mot de passe</label>
          <i class="far fa-eye" :class="{blue: showPassword1}" id="eye1" @click="showPassword1 = !showPassword1"></i>
          <span></span>
          <div class="error" v-if="errors.password1 && $v.user.password1.$error">
            Le mot de passe doit contenir 8 caractères : 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial.
          </div>
          <div class="error">
            {{ errorPassword }}
          </div>
        </div>

        <!-- INPUT - Confirm Password -->
        <div class="form-group" :class="{success: !$v.user.password2.$invalid}">
          <input
            :type="showPassword2 ? 'text' : 'password'"
            id="password2"
            name="password2"
            v-model.trim="$v.user.password2.$model"
            required
            @keyup="debounce('password2')"
          />
          <label for="password2">Confirmer le mot de passe</label>
          <i class="far fa-eye" :class="{blue: showPassword2}" id="eye2" @click="showPassword2 = !showPassword2"></i>
          <span></span>
          <div class="error" v-if="errors.password2 && $v.user.password2.$error">
            Les deux mots de passe doivent être identiques.
          </div>
        </div>

        <button type="submit" class="gradientBtn" name="inscription" id="submit-btn" :disabled="submitSignupForm">
          S'inscrire
        </button>
      </form>
      <p class="cgu">
        En créant un compte, vous acceptez les
        <button id="cgu-button" @click="showModal = !showModal" name="CGU">CGU</button>
      </p>

      <div class="signup_link">
        Vous avez déjà un compte ? <br />
        <router-link to="/login">Connectez-vous</router-link>
      </div>
      <Modale :showModal="showModal" @closed="showModal = false" />
    </div>
  </div>
</template>

<script>
//IMPORTS
import TitleLogo from '../components/TitleLogo.vue';
import Modale from './Modale.vue';

import _ from 'lodash';
import http from '../js/http';

import {required, minLength, maxLength, email, sameAs} from 'vuelidate/lib/validators';
import {hasNumber, hasLowercaseLetter, hasCapitalcaseLetter, hasSpecialCharacter} from '../validators/password';

//EXPORTS
export default {
  name: 'Signup',
  components: {
    TitleLogo,
    Modale,
  },
  data() {
    return {
      signup: 'Inscription',
      showModal: false,
      displayErrorPseudo: false,
      displayErrorEmail: false,
      displayErrorPassword: false,
      displayValidBox: false,
      errorPseudo: '',
      errorEmail: '',
      errorPassword: '',
      showPassword1: false,
      showPassword2: false,
      pseudo: '',
      email: '',
      user: {
        pseudo: '',
        email: '',
        password1: '',
        password2: '',
      },
      errors: {
        pseudo: false,
        email: false,
        password1: false,
        password2: false,
      },
    };
  },
  validations: {
    user: {
      pseudo: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(20),
      },
      email: {
        required,
        email,
        minLength: minLength(8),
      },
      password1: {
        required,
        minLength: minLength(8),
        hasNumber,
        hasLowercaseLetter,
        hasCapitalcaseLetter,
        hasSpecialCharacter,
      },
      password2: {
        required,
        minLength: minLength(8),
        hasNumber,
        hasLowercaseLetter,
        hasCapitalcaseLetter,
        hasSpecialCharacter,
        sameAsPassword: sameAs('password1'),
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

    submitSignupForm() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        http
          .post('auth/signup', {
            pseudo: this.$v.user.pseudo.$model,
            email: this.$v.user.email.$model,
            password: this.$v.user.password1.$model,
          })
          .then(() => {
            this.displayValidBox = true;
            setTimeout(() => {
              this.$router.push('/login');
            }, 1000);
          })
          .catch((error) => {
            if (error.response != null && error.response.status === 401) {
              this.errorEmail = 'Ce pseudo/email est déjà pris.';
            }
          });
      } else {
        return;
      }
    },
  },
  watch: {
    errorPseudo(newValue) {
      this.errorPseudo = newValue;
      this.displayErrorPseudo = true;
      setTimeout(() => {
        this.displayErrorPseudo = false;
        this.errorPseudo = '';
      }, 3000);
    },
    errorEmail(newValue) {
      this.errorEmail = newValue;
      this.displayErrorEmail = true;
      setTimeout(() => {
        this.displayErrorEmail = false;
        this.errorEmail = '';
      }, 3000);
    },
    errorPassword(newValue) {
      this.errorPassword = newValue;
      this.displayErrorPassword = true;
      setTimeout(() => {
        this.displayErrorPassword = false;
        this.errorPassword = '';
      }, 3000);
    },
  },
};
</script>

<style scoped lang="scss"></style>
