<template>
  <div class="form-group" :class="{ success: !v1 }">
    <input
      :type="showPassword ? 'text' : 'password'"
      id="inputFormName"
      :name="inputFormName"
      v-model.trim="v2"
      required
      @keyup="debounce('inputFormName')"
    />
    <label for="inputFormName">{{ labelText }}</label>
    <i
      class="far fa-eye"
      :class="{ blue: showPassword }"
      id="eye1"
      @click="showPassword = !showPassword"
    ></i>
    <span></span>
    <div class="error" v-if="errors.inputFormName && v3">
      {{ errorText }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Password",
  props: ["v1", "v2", "v3", "inputFormName", "labelText", "errorText"],
  //   data() {
  //     return {
  //       passwordShow: false,
  //       password1: "",
  //       showModal: false,
  //       showPassword1: false,
  //     };
  //   },
  //   user: {
  //     password1: "",
  //   },
  //   errors: {
  //     password1: false,
  //   },
  //   validations: {
  //     password1: {
  //       required,
  //       minLength: minLength(8),
  //       hasNumber,
  //       hasLowercaseLetter,
  //       hasCapitalcaseLetter,
  //       hasSpecialCharacter,
  //     },
  //   },
};
</script>

<style></style>
