<template>
  <button type="button" class="admin-change-btn" name="changer le statut">
    <span v-if="isItAnAdmin">Admin</span>
    <span v-else>User</span>
  </button>
</template>

<script>
import {mapState} from 'vuex';
export default {
  name: 'Desactivate',
  props: ['user'],
  computed: {
    isItAnAdmin() {
      return this.user.isAdmin;
    },
    ...mapState({
      userId: 'userId',
      isAdmin: 'isAdmin',
    }),
  },
};
</script>

<style scoped lang="scss">
.admin-change-btn {
  border: 1px solid #344767;
  background: none;
  color: #344767;
  font-weight: 600;
  cursor: pointer;
  background-color: #fff;
  width: 65px;
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 5px;
  &:hover {
    background-color: #344767;
    color: #fff;
  }
}
</style>
