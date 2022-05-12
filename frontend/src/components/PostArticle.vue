<template>
  <div class="post">
    <div class="post__infos">
      <!-- Infos Left -->
      <div class="post__infos__left">
        <div class="img-container follow">
          <a :href="post.link" @click.prevent="$emit('get-user-profile', post)">
            <img :src="post.picture" class="follow-img" width="50px" height="auto" alt="photo de profil" />
          </a>

          <!-- Follow / Unfollow -->
          <FollowIcon
            v-show="post.notMyself"
            :followed="post.followed"
            :post="post"
            :followsCount="post.follows"
            @click.native="followUser(post)"
          />
        </div>
      </div>
      <!-- Infos Middle -->
      <div class="middle">
        <a :href="post.link" class="pseudo bold fz16" @click.prevent="$emit('get-user-profile', post)">
          {{ post.pseudo }}
        </a>
        <CreatedSince :createdSince="createdSince(post)" :updated="post.updated" />
      </div>
      <!-- Infos Right -->
      <Options :post="post" />
    </div>
    <div class="post__content">
      <PostImage :src="post.media" v-show="post.media != null" />
      <div class="post__title" v-show="post.title != 'undefined'">
        <p class="bold fz16">{{ post.title }}</p>
      </div>
      <div class="post__text blue-grey" v-show="post.text != 'undefined'">
        <p>
          {{ post.text }}
        </p>
      </div>
    </div>
    <div class="post__reactions">
      <LikeIcon :liked="post.liked" v-model="post.liked" :likesCount="post.likes" @click.native="likePost(post)" />

      <CommentIcon v-model="post.showComments" :commentsCount="post.commentsCount" />

      <SaveIcon :saved="post.saved" v-model="post.saved" :savesCount="post.saves" @click.native="savePost(post)" />
    </div>

    <!-- Comments -->
    <transition name="fadeUp" appear>
      <div class="post__comments" id="post-comments" v-show="post.showComments">
        <div class="post__comments-container">
          <div class="posted" v-for="comment in post.comments" :key="comment.commentId">
            <div class="comment-container">
              <div>
                <div class="post__comments-infos">
                  <a href="#" class="bold">{{ comment.pseudo }}</a>
                  <CreatedSince :createdSince="createdSince(comment)" :updated="comment.updated" />
                </div>
                <p v-if="!comment.updating">
                  {{ comment.text }}
                </p>
                <form id="update-comment-form" @submit.prevent="modifyComment(comment)" v-else>
                  <textarea
                    rows="1"
                    cols="50"
                    type="text"
                    id="update-comment-text"
                    ref="inputUpdComment"
                    v-model="updatedComment"
                    required
                    maxlength="250"
                  />
                  <button type="submit" class="upd-com-btn" name="publier">
                    <SaveComment />
                  </button>
                </form>
              </div>
              <div class="options-comment" v-show="!comment.updating">
                <EditIcon @click.native="openUpdateComment(comment)" v-if="comment.userId == userId || isAdmin" />
                <DeleteIcon @click.native="deleteComment(comment, post)" v-if="comment.userId == userId || isAdmin" />
              </div>
            </div>
          </div>
        </div>
        <form @submit.prevent="createComment(post)">
          <textarea
            rows="2"
            cols="50"
            type="text"
            class="white-border text-comment-input"
            placeholder="Votre commentaire..."
            v-model="post.commentText"
            required
            maxlength="250"
          />
          <button type="submit" class="orange br30 submit-comment-btn" name="poster">Poster</button>
        </form>
      </div>
    </transition>
  </div>
</template>

<script>
import http from '../js/http';
import {mapState, mapGetters} from 'vuex';
import * as utils from '../js/utils';
import EventBus from '../js/event-bus';

export default {
  name: 'PostArticle',
  props: ['post', 'postId', 'comments'],
  data() {
    return {
      updatedComment: '',
      postFollowed: false,
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
    followUser(post) {
      EventBus.$emit('followUser', post);
    },

    likePost(post) {
      http
        .post(`posts/like/${post.postId}`, {}, this.setAuthorization())
        .then((res) => {
          res.status == 200 ? (post.likes -= 1) : (post.likes += 1);
        })
        .catch((error) => console.log(error));
    },

    savePost(post) {
      http
        .post(`posts/saves/${post.postId}`, {}, this.setAuthorization())
        .then((res) => {
          res.status == 200 ? (post.saves -= 1) : (post.saves += 1);
        })
        .catch((error) => console.log(error));
    },

    createComment(post) {
      http
        .post(`comment/${post.postId}`, {text: post.commentText}, this.setAuthorization())
        .then((res) => {
          post.comments = res.data.commentsArray;
          post.commentText = '';
          post.commentsCount++;
        })
        .catch((error) => console.log(error));
    },

    openUpdateComment(comment) {
      for (let comment of this.comments) {
        comment.updating = false;
      }
      comment.updating = true;
      this.updatedComment = comment.text;
    },

    modifyComment(comment) {
      http
        .put(`comment/${comment.commentId}`, {text: this.updatedComment}, this.setAuthorization())
        .then((res) => {
          comment.updating = false;
          this.updatedComment = '';
          comment.text = res.data;
          comment.updated = true;
        })
        .catch((error) => console.log(error));
    },

    deleteComment(comment, post) {
      if (!confirm('Voulez-vous vraiment supprimer ce commentaire ?')) {
        return;
      }
      http
        .delete(`comment/${comment.commentId}`, this.setAuthorization())
        .then(() => {
          setTimeout(() => {
            let commentsArray = this.postDataX.find((x) => x.postId == post.postId).comments;
            const index = commentsArray.findIndex((x) => x.commentId == comment.commentId);
            commentsArray.splice(index, 1);
            post.commentsCount--;
          }, 500);
          utils.showDeleteBoxTimer(700);
        })
        .catch((error) => console.log(error));
    },

    createdSince(post) {
      let timestamp = (Date.now() - Date.parse(post.createdAt)) / 700;
      let days = Math.floor(timestamp / 86400);
      let hours = Math.floor(timestamp / 3600) % 24;
      let minutes = Math.floor(timestamp / 60) % 60;
      let seconds = Math.floor(timestamp);

      if (timestamp < 60) {
        return seconds + ' secondes';
      }
      if (timestamp >= 60 && timestamp < 120) {
        return '1 minute';
      }
      if (timestamp >= 120 && timestamp < 3600) {
        return minutes + ' minutes';
      }
      if (timestamp >= 3600 && timestamp < 7200) {
        return '1 heure';
      }
      if (timestamp >= 7200 && timestamp < 86400) {
        return hours + ' heures';
      }
      if (timestamp >= 86400 && timestamp < 172800) {
        return '1 jour';
      }
      if (timestamp >= 172800) {
        return days + ' jours';
      }
    },
  },
  computed: {
    isFollowed() {
      return this.post.followed;
    },
    ...mapState({
      createModale: 'createModale',
      isAdmin: 'isAdmin',
      postDataX: 'postDataX',
      showDeleteBox: 'showDeleteBox',
      showValidBox: 'showValidBox',
      showLoader: 'showLoader',
      token: 'token',
      userId: 'userId',
      updateModale: 'updateModale',
    }),
    ...mapGetters([
      'createGetter',
      'isAdminGetter',
      'postDataGetter',
      'deleteBoxGetter',
      'validBoxGetter',
      'tokenGetter',
      'userIdGetter',
      'updateGetter',
      'loaderGetter',
    ]),
  },
};
</script>

<style lang="scss">
button.orange {
  padding: 5px 15px;
  border: none;
  background-color: #fd7d63;
  color: #fff;
  cursor: pointer;
}
// POST
.post {
  border: 1px solid #ddd;
  border-radius: 0;
  background-color: #fff;
  margin-bottom: 20px;
  padding: 15px 20px;

  & > div {
    margin: 10px 0;
  }

  &__infos {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0 !important;

    &.createModale {
      justify-content: start;
    }

    &__left {
      & .img-container.follow {
        position: relative;
        width: 60px;
        height: 60px;
        margin: 0 auto;
      }
      & a {
        width: 100%;
        height: 100%;
        & img.follow-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
      }
    }
    & .middle {
      text-align: left;
      width: calc(100% - 100px);
      height: 100%;
      padding-left: 10px;
      & a {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
        &:hover {
          text-decoration: underline;
        }
      }
      & .date {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 8px;
      }
    }
    & .right {
      width: 50px;
      height: 100%;
    }
  }
  &__content {
    text-align: left;
    margin-bottom: 0 !important;

    & > div {
      margin: 5px 0;
    }
  }
  &__image {
    display: flex;
    justify-content: center;
    width: 100%;

    & img {
      box-shadow: 0 0 5px #0003;
      max-height: 450px;
      object-fit: contain;
      width: fit-content;
      max-width: 100%;
    }
  }
  &__title p {
    width: fit-content;
    background: linear-gradient(90deg, #fc694c 30%, #344767);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  &__reactions {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 50px;

    & > div {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      cursor: pointer;
    }
    & p {
      font-weight: 600;
    }
  }
  &__comments {
    margin-bottom: 0 !important;

    &-container {
      max-height: 180px;
      overflow-y: scroll;
      margin-bottom: 10px;
      &::-webkit-scrollbar {
        width: 5px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: #fd7d63;
      }

      & .comment-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        & div:first-child {
          width: 80%;
        }
      }
      & .options-comment {
        display: flex;
        align-items: end;
        justify-content: space-between;
        width: 50px;
        height: 100%;
        padding-bottom: 3px;
      }
    }

    &-infos {
      display: flex;
      & p {
        color: #999;
      }
    }
    & .posted {
      display: flex;
      text-align: left;
      padding: 5px 5px 5px 0;
      border-top: 1px solid #ccc;
      overflow-wrap: break-word;
      word-break: break-word;
      hyphens: auto;
    }
    & .posted a,
    & .date {
      margin-right: 10px;
    }
    & form {
      display: flex;
      align-items: center;
    }
    & .text-comment-input,
    & #update-comment-text {
      box-sizing: content-box;
      border-radius: 10px;
      border: 1px solid #344767;
      padding: 5px;
      font-family: 'Poppins', sans-serif;
      font-size: 12px;
      letter-spacing: normal;
      margin-right: 10px;
      resize: none;
      overflow-y: scroll;
      min-height: 20px;
      max-height: 70px;
      color: #344767;
      &::-webkit-scrollbar {
        width: 0px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: #fd7d63;
      }

      &:focus-visible {
        outline: none;
        border: 1px solid #fd7d63;
      }
    }
    & button.submit-comment-btn {
      height: fit-content;
    }
    #update-comment-form {
      textarea {
        background-color: #344767;
        color: #fff;
      }
      & button {
        border: none;
        background: none;
      }
    }
  }
}

@media screen and (min-width: 450px) {
  .post {
    border-radius: 20px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter,
.fade-leave-to {
  transform: translateX(-20px);
}
</style>
