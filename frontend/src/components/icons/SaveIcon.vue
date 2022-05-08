<template>
  <div class="post__reaction" @click="saved = !saved">
    <button class="save-icon" name="save">
      <svg :class="{orange: saved, beat: saved}" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg">
        <path
          d="m8.69 31.3 6.56-3.79a1.54 1.54 0 0 1 1.5 0l6.56 3.79c.23.13.49.2.75.2s.52-.07.75-.2c.46-.27.75-.76.75-1.3V6c0-3.03-2.47-5.5-5.5-5.5h-8.12A5.51 5.51 0 0 0 6.44 6v24c0 .54.29 1.03.75 1.3.47.27 1.04.27 1.5 0z"
        ></path>
      </svg>
    </button>
    <p id="saves-counter">{{ savesCount }}</p>
  </div>
</template>

<script>
export default {
  name: 'SaveIcon',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    savesCount: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      saved: false,
    };
  },
  created() {
    this.saved = this.value;
  },
  methods: {
    colorSvg() {
      this.$emit('colorize');
    },
  },
  watch: {
    saved(newValue) {
      this.$emit('input', newValue);
    },
  },
};
</script>

<style scoped lang="scss">
button.save-icon {
  border: none;
  background: none;
  cursor: pointer;
  svg {
    width: 26px;
    fill: none;
    stroke: #344767;
    stroke-width: 2.5px;
    stroke-linecap: round;
    stroke-linejoin: round;
    & path {
      transform: translateY(1px);
    }
    &.orange {
      stroke: #fd7d63;
    }
  }
}
</style>
