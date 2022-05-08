<template>
  <div class="save-icon-container">
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0h48v48H0z" fill="none"></path>
      <path
        d="M34 6H10c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V14l-8-8zM24 38c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm6-20H10v-8h20v8z"
      ></path>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'SaveComment',
};
</script>

<style scoped lang="scss">
div.save-icon-container {
  cursor: pointer;
  height: 20px;
  & svg {
    width: 20px;
    height: 20px;
  }
  & svg path:last-child {
    fill: #fd7d63;
    width: 20px;
    height: 20px;
  }
  &:hover {
    & svg path:last-child {
      fill: #fd7d63;
    }
  }
}
</style>
