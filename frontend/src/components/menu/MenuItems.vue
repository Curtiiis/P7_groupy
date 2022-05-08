<template>
  <transition name="fadeDown" appear>
    <div class="mobile-menu-items" id="mobile-menu-items" v-show="visible">
      <!-- User icon -->
      <button type="button" class="mobile-menu-account" @click="$emit('showAccount')" name="mon compte">
        <UserIcon :orangeIcon="true" />
        <p>Mon compte</p>
      </button>

      <!-- Logout icon -->
      <button type="button" class="mobile-menu-logout" @click="$emit('log-out')" name="déconnexion">
        <LogoutIcon :orangeIcon="true" />
        <p>Déconnexion</p>
      </button>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'MenuItems',
  props: {
    visible: {
      type: Boolean,
    },
  },
};
</script>

<style></style>
