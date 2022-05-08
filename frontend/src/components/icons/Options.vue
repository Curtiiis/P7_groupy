<template>
  <div class="options-btn" @click="showOptions = !showOptions">
    <OptionsBtn />
    <transition name="fade" appear>
      <div class="options-msg" v-if="showOptions">
        <ul>
          <li v-if="!isItMyPost || isAdmin" @click="reportPost">Signaler</li>
          <li v-if="isItMyPost || isAdmin" @click="setDataInUpdateModale">Modifier</li>
          <li v-if="isItMyPost || isAdmin" @click="deletePost">Supprimer</li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import * as utils from '../../js/utils';
import EventBus from '../../js/event-bus';
import http from '../../js/http';

export default {
  name: 'Options',
  props: ['post'],
  data() {
    return {
      showOptions: false,
    };
  },
  methods: {
    setAuthorization() {
      return {
        headers: {
          Authorization: 'Bearer ' + this.token,
        },
      };
    },
    reportPost() {
      if (!confirm('Voulez-vous vraiment signaler ce post ?')) {
        return;
      }
      http
        .post(`posts/reports/${this.post.postId}`, {owner: this.post.userId}, this.setAuthorization())
        .then(() => {
          utils.showValidBoxTimer(700);
        })
        .catch((err) => {
          console.log(err);
          utils.showErrorBoxTimer(700);
        });
    },
    setDataInUpdateModale() {
      EventBus.$emit('setDataInUpdateModale', this.post);
    },
    deletePost() {
      EventBus.$emit('deletePost', this.post);
    },
  },
  computed: {
    isItMyPost() {
      return this.post.userId == this.userId;
    },
    ...mapState({
      token: 'token',
      userId: 'userId',
      isAdmin: 'isAdmin',
    }),
  },
};
</script>

<style scoped lang="scss">
.options-btn {
  position: relative;
  & ul {
    width: 100px;
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #fd7d63;
    color: #fff;
    border-radius: 5px;
  }
  & li {
    padding: 3px 10px;
    width: 100%;
    list-style-type: none;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
