<template>
  <div class="security-container">
    <form id="form" method="post" @submit.prevent="submitSignupForm" @keyup="isFormValid">
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
      </div>

      <button type="submit" class="gradientBtn" name="enregistrer" id="submit-btn" ref="submit-btn" :disabled="submitSignupForm">
        Enregistrer
      </button>
    </form>
    <div class="error" v-if="errors.password1 && $v.user.password1.$error">
      Le mot de passe doit contenir au moins 8 caractères : 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial.
      <hr />
    </div>
    <div class="error" v-if="errors.password2 && $v.user.password2.$error">Les deux mots de passe doivent être identiques.</div>
    <div class="error">
      {{ errorPassword }}
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import http from '../../js/http';
import {mapState, mapGetters, mapMutations} from 'vuex';
import store from '../../store/index';

import {required, minLength, maxLength, sameAs} from 'vuelidate/lib/validators';

import {hasNumber, hasLowercaseLetter, hasCapitalcaseLetter, hasSpecialCharacter} from '../../validators/password';

export default {
  name: 'Security',
  data() {
    return {
      displayErrorPassword: false,
      displayValidBox: false,
      errorPassword: '',
      showPassword1: false,
      showPassword2: false,
      user: {
        password1: '',
        password2: '',
      },
      errors: {
        password1: false,
        password2: false,
      },
    };
  },
  validations: {
    user: {
      password1: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(20),
        hasNumber,
        hasLowercaseLetter,
        hasCapitalcaseLetter,
        hasSpecialCharacter,
      },
      password2: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(20),
        hasNumber,
        hasLowercaseLetter,
        hasCapitalcaseLetter,
        hasSpecialCharacter,
        sameAsPassword: sameAs('password1'),
      },
    },
  },
  methods: {
    ...mapMutations(['updateUserId']),
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
        store.commit('changeState', {
          showSaveBox: true,
        });
        let userId = this.$store.state.userId;
        http
          .put(
            `user/updatePaswword/${userId}`,
            {
              password: this.$v.user.password1.$model,
            },
            {
              headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
              },
            }
          )
          .then((res) => {
            res;
            setTimeout(() => {
              store.commit('changeState', {
                showSaveBox: false,
              });
            }, 700);
            setTimeout(() => {
              this.$router.go();
            }, 700);
          })
          .catch((error) => {
            if (error.response != null && error.response.status === 400) {
              this.errorPassword = error.response.data.message;
            }
          });
      } else {
        console.log('Non soumis !');
        return;
      }
    },
  },
  computed: {
    ...mapState(['userId', 'showSaveBox']),
    ...mapGetters(['userIdGetter', 'saveBoxGetter']),
  },
  watch: {
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

<style lang="scss" scoped>
.security-container {
  height: 80%;
}

@keyframes shake {
  0%,
  100% {
    margin-left: 0;
  }
  20%,
  80% {
    margin-left: -12px;
  }
  40%,
  60% {
    margin-left: 12px;
  }
}
.shake {
  animation: shake 0.3s ease-in-out;
}

.error {
  color: red;
}

#settings-change {
  height: 90%;
  #form {
    width: 90%;
    margin: 0 auto;
    height: 70%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    & .form-group {
      margin-top: 0;
      margin-bottom: 0;
      width: 100%;
      & input,
      & label {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 40px;
        text-align-last: left;
      }
    }
  }
}
</style>
