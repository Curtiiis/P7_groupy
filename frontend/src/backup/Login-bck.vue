<template>
  <div class="auth__container">
    <TitleLogo :authType="login" />

    <form
      id="form"
      method="post"
      @submit.prevent="submitSignupForm"
      @keyup="isFormValid"
    >
      <!-- INPUT - Email -->
      <div class="form-group" :class="{ success: !$v.user.email.$invalid }">
        <input
          :type="email"
          id="email"
          name="email"
          v-model.trim="$v.user.email.$model"
          required
          @keyup="debounce('email')"
        />
        <label for="email">Email</label>
        <span></span>
        <div class="error" v-if="errors.email && $v.user.email.$error">
          L'email n'est pas valide.
        </div>
      </div>

      <!-- INPUT - Password -->
      <div class="form-group" :class="{ success: !$v.user.password1.$invalid }">
        <input
          :type="showPassword1 ? 'text' : 'password'"
          id="password1"
          name="password1"
          v-model.trim="$v.user.password1.$model"
          required
          @keyup="debounce('password1')"
        />
        <label for="password1">Mot de passe</label>
        <i
          class="far fa-eye"
          :class="{ blue: showPassword1 }"
          id="eye1"
          @click="showPassword1 = !showPassword1"
        ></i>
        <span></span>
        <div class="error" v-if="errors.password1 && $v.user.password1.$error">
          Le mot de passe doit contenir 8 caractères : 1 majuscule, 1 minuscule,
          1 chiffre, 1 caractère spécial.
        </div>
      </div>

      <button type="submit" id="submit-btn" :disabled="submitSignupForm">
        Se connecter
      </button>
    </form>

    <div class="signup_link">
      Vous avez déjà un compte ? <br />
      <router-link to="/signup">Inscrivez-vous</router-link>
    </div>
  </div>
</template>

<script>
//IMPORTS
import TitleLogo from "../components/TitleLogo.vue";

import _ from "lodash";
import { required, minLength, email } from "vuelidate/lib/validators";
import {
  hasNumber,
  hasLowercaseLetter,
  hasCapitalcaseLetter,
  hasSpecialCharacter,
} from "../validators/password";

//EXPORTS
export default {
  name: "Signup",
  components: {
    TitleLogo,
  },
  data() {
    return {
      signup: "Inscription",
      login: "Connexion",
      showPassword1: false,
      submitstatus: false,
      email: "",
      user: {
        email: "",
        password1: "",
      },
      errors: {
        email: false,
        password1: false,
      },
    };
  },
  validations: {
    user: {
      email: {
        required,
        email,
      },
      password1: {
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
      const submitBtn = document.querySelector("#submit-btn");
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.submitstatus = true;
        submitBtn.disabled = false;
      } else {
        this.submitstatus = false;
        submitBtn.disabled = true;
      }
    },
    debounce: _.debounce(function (inputName) {
      this.errors[inputName] = this.$v.user[inputName].$error;

      const inputName_parent = document.getElementById(inputName).parentElement;

      if (this.$v.user[inputName].$error) {
        inputName_parent.classList.add("shake");

        setTimeout(() => {
          inputName_parent.classList.remove("shake");
        }, 500);
      }
    }, 1000),
    submitSignupForm() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        console.log("Connexion autorisée !");
        console.log(this.user);
        setTimeout(() => {
          this.$router.push("/home");
        }, 500);
      } else {
        return;
      }
    },
  },
};
</script>
