<template>
  <div class="aside-left">
    <div class="aside-left__content">
      <div class="aside-left__top">
        <p class="aside-left__pseudo-v" id="pseudo-user">
          <span>{{ user.pseudo }}</span>
        </p>
        <a :href="user.link" class="profile-picture" @click.prevent="$emit('get-user-profile', user)">
          <img :src="user.picture" alt="Photo de profil" />
        </a>
      </div>
      <div class="aside-left__bottom">
        <div class="aside-left__followers">
          <p class="upp">Abonnés</p>
          <p class="fz22 blue-grey">{{ user.followersCount }}</p>
        </div>
        <div class="aside-left__groups">
          <p class="upp">Posts</p>
          <p class="fz22 blue-grey">{{ user.posts }}</p>
        </div>
        <div class="aside-left__groups">
          <p class="upp">Likes</p>
          <p class="fz22 blue-grey">{{ user.likes }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AsideLeft',
  props: ['user'],
};
</script>

<style lang="scss">
// ASIDE LEFT
.aside-left {
  display: none;
  position: sticky;
  top: 70px;
  height: fit-content;
  width: 23%;
  min-width: 130px;
  max-width: 150px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background-color: #fff;
  overflow: hidden;

  &__content {
    position: sticky;
    top: 0;
    width: 100%;
  }
  &__top {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: end;
    height: 200px;
    background-color: #fd7d63;
  }
  &__bottom {
    padding: 30px 5px 0;
    & > div {
      margin: 35px 0;
    }
    & p {
      font-size: 18px;
    }
  }
  &__pseudo {
    display: none;
  }
  &__pseudo-v {
    position: absolute;
    width: fit-content;
    height: calc(100% - 10px);
    padding-top: 65px;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #fff;
    font-size: 20px;
    text-align: left;
    text-orientation: mixed;
    writing-mode: vertical-rl;
    transform: rotate(180deg);

    &.horizontal {
      writing-mode: initial;
      transform: none;
      height: 80%;
    }
  }

  & a.profile-picture {
    position: absolute;
    bottom: calc(-100px / 2);
    width: 100px;
    height: 100px;
    & img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      border-radius: 50%;
      box-shadow: 0 0 5px #0003;
    }
    &:hover img {
      box-shadow: 0 0 5px #0008;
    }
  }

  & img.logo1,
  & img.logo2 {
    position: relative;
    top: 25%;
  }
  & img.logo2 {
    display: none;
    left: 50%;
    transform: translate(-50%, -25%);
  }
}

// MEDIA QUERIES
@media screen and (min-width: 500px) {
  .aside-left {
    display: block;
  }
}

@media screen and (min-width: 975px) {
  .aside-left__bottom p {
    font-size: 18px;
  }
}
</style>
