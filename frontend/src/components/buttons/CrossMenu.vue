<template>
  <button class="menu-mobile-btn" name="menu">
    <span
      :class="{
        crossIcon: crossIcon,
      }"
    >
    </span>
  </button>
</template>

<script>
export default {
  name: 'CrossMenu',
  props: {
    crossIcon: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
