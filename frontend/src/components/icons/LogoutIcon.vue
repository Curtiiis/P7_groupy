<template>
  <svg
    class="logout-icon"
    :class="{ orange: orangeIcon }"
    viewBox="0 0 19.05 19.05"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.158 4.89a6.98 6.964 0 0 1 2.347 5.209v0a6.98 6.964 0 0 1-6.98 6.964 6.98 6.964 0 0 1-6.98-6.964 6.98 6.964 0 0 1 2.448-5.297"
    ></path>
    <path d="M9.525 1.987v8.197"></path>
  </svg>
</template>

<script>
export default {
  name: "LogoutIcon",
  props: ["orangeIcon"],
};
</script>

<style scoped lang="scss">
svg.logout-icon {
  width: 26px;
  stroke: #344767;
  stroke-width: 1.25px;
  cursor: pointer;
  & path {
    fill: none;
  }
  &.orange {
    stroke: #fd7d63 !important;
  }
}
</style>
