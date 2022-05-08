<template>
  <button name="ignorer" type="button" class="ignore-form-btn" :class="{colorize: green, statistics: stat}">
    {{ msg }}
  </button>
</template>

<script>
export default {
  name: 'Ignore',
  props: ['green', 'stat'],
};
</script>

<style scoped lang="scss">
.ignore-form-btn {
  border: 1px solid #ff6842;
  background: none;
  color: #ff6842;
  font-weight: 600;
  cursor: pointer;
  background-color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  &.statistics {
    width: 90px;
  }
  &:hover {
    background-color: #ff6842;
    color: #fff;
  }
  &.colorize {
    border: 1px solid #179e95;
    color: #179e95;
    &:hover {
      background-color: #179e95;
      color: #fff;
    }
  }
}
</style>
