<template>
  <div class="post__image br20">
    <img class="br20" :src="src" alt="Image du post" />
  </div>
</template>

<script>
export default {
  name: "PostImage",
  props: {
    src: {
      type: String,
      default: "0",
    },
  },
};
</script>

<style scoped lang="scss"></style>
