<template>
  <button name="s'abonner" class="follow-btn fz20 br50" :class="{green: followed, big: big}">
    <span class="unchecked" v-show="!followed"></span>
    <svg class="checkIcon" width="14px" v-show="followed" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m173.898 439.404-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
        fill="#fff"
      ></path>
    </svg>
  </button>
</template>

<script>
export default {
  name: 'LikeIcon',
  props: {
    big: {
      type: Boolean,
      default: false,
    },
    post: {
      type: Object,
    },
    followed: {
      type: Boolean,
    },
  },
};
</script>

<style lang="scss">
button.follow-btn {
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  width: 20px;
  height: 20px;
  background-color: #fd7d63;
  cursor: pointer;
  transition: all 0.5s ease-out;

  &.green {
    background-color: #1dc874;
  }

  & span.unchecked {
    position: relative;
    width: 60%;
    height: 2.5px;

    &:before,
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #fff;
      transition: all 0.5s ease-out;
    }
    &::after {
      transform: rotate(90deg);
    }
  }
}

button.follow-btn.big {
  position: relative;
  width: 30px;
  height: 30px;

  &:focus-visible {
    outline: none;
  }

  & span.unchecked {
    height: 4px;
  }

  & svg.checkIcon {
    width: 20px;
  }
}
</style>
