<template>
  <div class="valid-box forbidden">
    <p class="save-msg">Erreur</p>
    <img src="../assets/forbidden.png" alt="checked logo" />
  </div>
</template>

<script>
export default {
  name: 'ErrorBox',
};
</script>

<style scoped lang="scss">
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

  p.save-msg {
    color: #fff;
    font-size: 30px;
    margin-bottom: 10px;
    padding: 10px;
    background-color: #c0392a;
    border-radius: 10px;
  }
}
</style>
