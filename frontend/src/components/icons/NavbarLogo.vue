<template>
  <transition name="fadeDown" appear>
    <router-link to="/">
      <img class="logo-groupomania" :src="'images/logo-d2-small-tr.png'" alt="logo groupomania" height="30px" />
    </router-link>
  </transition>
</template>

<script>
export default {
  name: 'NavbarLogo',
};
</script>

<style lang="scss">
.navbar {
  &__logo {
    display: none;
    height: 100%;
    display: flex;
    align-items: center;
  }
}
</style>
