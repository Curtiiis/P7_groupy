<template>
  <div class="auth__container">
    <div class="valid-box" v-show="displayValidBox">
      <img src="../assets/checked.png" alt="checked logo" />
    </div>

    <TitleLogo :authType="'Réinitialiser mon mot de passe'" />

    <form
      id="form"
      method="post"
      @submit.prevent="submitLoginForm"
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

      <button type="submit" id="submit-btn" :disabled="submitLoginForm">
        Envoyer
      </button>
    </form>

    <div class="signup_link">
      <router-link to="/">Retourner à l'accueil</router-link>
    </div>
  </div>
</template>

<script>
//IMPORTS
import TitleLogo from "../components/TitleLogo.vue";

import _ from "lodash";
import axios from "axios";

import { required, email } from "vuelidate/lib/validators";

//EXPORTS
export default {
  name: "Forgot",
  components: {
    TitleLogo,
  },
  data() {
    return {
      displayValidBox: false,
      displayError: false,
      errorMessage: "",
      email: "",
      user: {
        email: "",
      },
      errors: {
        email: false,
      },
    };
  },
  validations: {
    user: {
      email: {
        required,
        email,
      },
    },
  },
  methods: {
    isFormValid() {
      const submitBtn = document.querySelector("#submit-btn");
      this.$v.$touch();
      !this.$v.$invalid
        ? (submitBtn.disabled = false)
        : (submitBtn.disabled = true);
    },
    debounce: _.debounce(function (inputName) {
      this.errors[inputName] = this.$v.user[inputName].$error;

      const _inputName = document.getElementById(inputName);

      if (_inputName != null && this.$v.user[inputName].$error) {
        _inputName.parentElement.classList.add("shake");

        setTimeout(() => {
          _inputName.parentElement.classList.remove("shake");
        }, 500);
      }
    }, 1000),
    submitLoginForm() {
      if (!this.$v.$invalid) {
        axios
          .post("auth/forgot", {
            email: this.$v.user.email.$model,
          })
          .then((response) => {
            console.log(response);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("pseudo", response.data.pseudo);
            this.displayValidBox = true;
            console.log("Redirection en cours...");
            setTimeout(() => {
              this.$router.push("/login");
            }, 1000);
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
