<template>
  <div class="valid-box" v-show="validBox">
    <img src="../assets/checked.png" alt="checked logo" />
  </div>
</template>

<script>
export default {
  name: "ValidBox",
  props: ["validBox"],
  data() {
    return {
      showValidBox: false,
    };
  },
};
</script>

<style lang="scss">
.valid-box {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  background: #fff6;
  backdrop-filter: blur(2px);
  z-index: 20;
  border-radius: 10px;
  width: 100%;
  height: 100vh;
  animation: fadeIn 0.3s;

  img {
    width: 100px;
    height: 100px;
    animation: fadeIn 0.3s;
  }
}
</style>
