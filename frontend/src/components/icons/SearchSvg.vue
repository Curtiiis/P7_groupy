<template>
  <label for="search-input" class="search-button" id="search-btn">
    <svg
      viewBox="0 0 34 34"
      class="search-icon"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m29.71 28.29-6.5-6.5h-.07a12 12 0 1 0-1.39 1.39s0 .05 0 .07l6.5 6.5a1 1 0 0 0 1.42 0 1 1 0 0 0 .04-1.46ZM14 24a10 10 0 1 1 10-10 10 10 0 0 1-10 10Z"
      ></path>
    </svg>
  </label>
</template>

<script>
export default {
  name: "SearchSvg",
};
</script>

<style scoped lang="scss">
svg.search-icon {
  width: 26px;
  stroke: #344767;
  fill: #344767;
  stroke-width: 0.25px;

  &.orange {
    stroke: #fd7d63;
    fill: #fd7d63;
  }
}
</style>
