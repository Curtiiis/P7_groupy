<template>
  <div class="post__reaction">
    <button for="like-icon" class="like-icon" @click="liked = !liked" name="like">
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
      type: String,
      default: '0',
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
  methods: {
    colorSvg() {
      this.$emit('colorize');
    },
  },
  watch: {
    liked(newValue) {
      this.$emit('input', newValue);
    },
  },
};
</script>
