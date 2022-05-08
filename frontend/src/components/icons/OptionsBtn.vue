<template>
  <button type="button" class="options" name="options">
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
  </button>
</template>

<script>
export default {
  name: 'OptionsBtn',
};
</script>

<style scoped lang="scss">
button.options {
  border: none;
  background: none;
  cursor: pointer;
  &:hover svg {
    stroke: #fd7d63;
  }

  & svg {
    width: 26px;
    stroke: #344767;
    stroke-width: 1px;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}
</style>
