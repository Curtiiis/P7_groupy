<template>
  <div class="form-group" :class="{success: !$v.user.password1.$invalid}">
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
  </div>
</template>

<script>
export default {
  name: 'Password1',
  props: ['$v', 'vModel', 'idEye', 'labelText'],
};
</script>

<style></style>
