<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
//EXPORT
export default {
  name: 'App',
};
</script>

<style lang="scss">
@import './scss/main.scss';
#app {
  min-width: 320px;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
</style>
