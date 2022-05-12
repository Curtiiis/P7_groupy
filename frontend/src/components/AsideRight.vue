<template>
  <div class="card">
    <div class="img-container follow">
      <a :href="item.link" @click.prevent="$emit('get-user-profile', item)">
        <img :src="item.picture" class="follow-img" width="50px" height="auto" alt="image du follower" />
      </a>
      <FollowIcon :followed="item.followed" v-model="item.followed" @click.native="$emit('follow-user', item)" />
    </div>
    <a :href="item.link" @click.prevent="$emit('get-user-profile', item)">
      {{ item.pseudo }}
    </a>
  </div>
</template>

<script>
export default {
  name: 'AsideRight',
  props: ['item'],
};
</script>

//
<style lang="scss">
// ASIDE RIGHT
.aside-right {
  display: none;
  position: sticky;
  top: calc(50px + 20px);
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 20px;
  width: 23%;
  min-width: 160px;
  height: calc(100vh - 50px - 2 * 20px);
  max-height: 635px;
  padding: 20px 0;
  overflow: hidden;
  & h2 {
    font-weight: 600;
    color: #344767;
  }
  & .img-container {
    position: relative;
    width: 70px;
    height: 70px;
    margin: 0 auto;
    & a {
      width: 100%;
      height: 100%;
    }
  }
  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
  &__cards {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    max-height: calc(100% - 60px);
    overflow-y: scroll;
    scrollbar-color: #fd7d63 white;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      width: 0px;
      &-track {
        background: transparent;
        border-radius: 10px;
      }
    }
    & .card {
      margin: 10px;
      & a:hover {
        text-decoration: underline;
      }
    }
  }
  & .more {
    & button.more-btn {
      background: none;
      border: #ddd;
      color: #fd7d63;
      cursor: pointer;
      padding: 8px;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
// MEDIA QUERIES
@media screen and (min-width: 768px) {
  .aside-right {
    display: block;
  }
}
</style>
