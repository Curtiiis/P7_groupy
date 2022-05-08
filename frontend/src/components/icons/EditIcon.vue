<template>
  <div class="edit-icon-container">
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17 22H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a1 1 0 0 1 0 2H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4a1 1 0 0 1 2 0v4a3 3 0 0 1-3 3Z"
      ></path>
      <path
        d="m14.6 5.87-4.95 5a.41.41 0 0 0-.13.23l-1 3.82a.48.48 0 0 0 .13.48.47.47 0 0 0 .35.1.32.32 0 0 0 .13 0l3.82-1a.41.41 0 0 0 .23-.13l4.95-4.97ZM21 4.45 19.55 3a1.52 1.52 0 0 0-2.13 0L16 4.45 19.55 8 21 6.58a1.52 1.52 0 0 0 0-2.13Z"
      ></path>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'EditIcon',
};
</script>

<style scoped lang="scss">
div.edit-icon-container {
  cursor: pointer;
  height: 20px;
  & svg,
  & svg path {
    fill: #344767;
    width: 20px;
    height: 20px;
  }
  &:hover {
    & svg,
    & svg path {
      fill: #fd7d63;
    }
  }
}
</style>
