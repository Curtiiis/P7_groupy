<template>
  <div class="post__reaction" @click="liked = !liked">
    <button class="like-icon" name="aimer">
      <svg viewBox="0 0 25.85 21.56" :class="{orange: liked, beat: liked}" id="like-svg">
        <path
          d="M23.3,8.6c0,5.2-7.7,10.6-10.3,12.4a1.5,1.5,0,0,1-1.8,0C8.4,19.3.8,13.8.8,8.6A5.85,5.85,0,0,1,6.7,2.7a6,6,0,0,1,5.4,3.4A5.87,5.87,0,0,1,23.3,8.6Z"
          transform="translate(0.3 -1.2)"
        ></path>
      </svg>
    </button>
    <p id="likes-counter">{{ likesCount }}</p>
  </div>
</template>

<script>
export default {
  name: 'LikeIcon',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      liked: false,
    };
  },
  created() {
    this.liked = this.value;
  },
  watch: {
    liked(newValue) {
      this.$emit('input', newValue);
    },
  },
};
</script>

<style scoped lang="scss">
.like-icon {
  border: none;
  background: none;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  & svg {
    width: 26px;
    fill: none;
    stroke: #344767;
    stroke-width: 2px;
    stroke-linecap: round;
    stroke-linejoin: round;
    &.orange {
      stroke-width: 1px;
      stroke: #fd7d63;
      fill: #fd7d63;
    }
  }
}
</style>
