<template>
  <div class="post__image br20">
    <img class="br20" :src="'images/' + src" alt="Image du post" />
    <!-- @dblclick="liked = true" -->
    <!-- @dblclick="animateLikeIcon" -->
  </div>
</template>

<script>
export default {
  name: "PostImage",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    src: {
      type: String,
      default: "0",
    },
  },
  data() {
    return {
      liked: false,
    };
  },
  //   methods: {
  //     likeByDoubleClick() {
  //       this.$emit("likeByDoubleClick");
  //     },
  //   },
  created() {
    this.liked = this.value;
  },
  watch: {
    liked(newValue) {
      this.$emit("input", newValue);
    },
  },
};
</script>

<style scoped lang="scss"></style>
