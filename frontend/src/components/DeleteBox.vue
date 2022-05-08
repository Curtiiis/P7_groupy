<template>
  <div class="valid-box">
    <p class="save-msg">Supprimé</p>
    <img src="../assets/checked.png" alt="checked logo" />
  </div>
</template>

<script>
export default {
  name: 'DeleteBox',
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
    background-color: #31ba7c;
    border-radius: 10px;
  }
}
</style>
