<template>
  <transition name="fade">
    <div class="create" id="create" v-show="createModale">
      <div id="overlay" @click="closeCreateModale"></div>
      <div class="create__modale">
        <div class="create__modale__title">
          <h1 v-if="createModale && updateModale">Modifier un post</h1>
          <h1 v-else>Créer un post</h1>
        </div>
        <div class="create__modale__post-container">
          <div class="post" id="post-in-creation">
            <div class="post__infos createModale">
              <!-- Infos Left -->
              <div class="left">
                <img :src="userDataX.picture" id="user-picture" width="60px" height="60px" alt="profile picture" />
              </div>
              <!-- Infos Middle -->
              <div class="middle">
                <p class="pseudo bold fz16">{{ userDataX.pseudo }}</p>
              </div>
            </div>

            <form @submit.prevent="createOrUpdate" @keyup="controlForm" enctype="multipart/form-data">
              <div class="post__content">
                <div class="post__image br20">
                  <div class="create-file" v-if="!updateModale">
                    <label for="create-file">
                      <div class="img-container">
                        <img src="" alt="Image du nouveau post" id="postImage" v-show="selectedFile != ''" />
                        <div class="create-file__default" v-show="selectedFile == ''">
                          <div class="create-file-icon-container">
                            <CreateFileIcon />
                          </div>
                          <p class="fz16">Choisir une image</p>
                        </div>
                      </div>
                    </label>
                    <ImageResizer
                      id="create-file"
                      :class-name="['form-control-file']"
                      name="image"
                      accept="image/*"
                      capture="camera"
                      hidden
                      :max-width="512"
                      :max-height="512"
                      doNotResize="['gif', 'svg']"
                    />
                  </div>
                </div>
                <div class="post__title">
                  <label for="create-title" id="create-title">
                    <input type="text" class="fz14 bold" placeholder="Titre du post..." v-model="newPost.title" />
                  </label>
                </div>
                <div class="post__text blue-grey">
                  <label for="create-title" id="create-text">
                    <textarea
                      name="create-text"
                      id="create-text"
                      cols="15"
                      rows="5"
                      placeholder="Texte..."
                      v-model="newPost.text"
                    ></textarea>
                  </label>
                </div>
              </div>
              <div class="create-buttons">
                <button type="submit" class="publish-btn" :disabled="createOrUpdate" name="pulier">
                  <span v-if="createModale && updateModale">Enregistrer</span>
                  <span v-else>Publier</span>
                </button>

                <button type="button" class="cancel-btn" @click="closeCreateModale" name="annuler">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {mapState, mapGetters} from 'vuex';
import http from '../js/http';
import * as utils from '../js/utils';
import EventBus from '../js/event-bus';

export default {
  name: 'Create',
  data() {
    return {
      newPost: {
        title: '',
        text: '',
      },
      headers: {
        Authorization: 'Bearer ' + this.token,
      },
    };
  },
  methods: {
    closeCreateModale() {
      utils.showUpdateModale(false);
      this.resetCreateState();
    },
    createOrUpdate() {
      this.updateModale ? this.submitUpdtatedPost() : this.submitNewPost();
    },
    controlForm() {
      const submitBtn = document.querySelector('.publish-btn');
      this.selectedFile || this.newPost.title != '' || this.newPost.text != ''
        ? (submitBtn.disabled = false)
        : (submitBtn.disabled = true);
    },
    resetCreateState() {
      this.newPost = {
        title: '',
        text: '',
      };
      if (this.createModale && !this.updateModale) {
        document.querySelector('#postImage').src = '-';
        utils.commitSelectedFile('');
        utils.commitImgPreview('');
      }
    },
    setDataInUpdateModale(post) {
      utils.showUpdateModale(true);
      this.newPost.title = post.title;
      this.newPost.text = post.text;
      this.newPost.postId = post.postId;
    },
    submitNewPost() {
      utils.showLoader(true);

      let fd = new FormData();
      fd.append('userId', this.userId);
      fd.append('title', this.newPost.title);
      fd.append('text', this.newPost.text);
      fd.append('image', this.selectedFile);

      http
        .post('posts', fd, {
          headers: {
            Authorization: 'Bearer ' + this.token,
          },
        })
        .then(() => {
          this.resetCreateState();
          EventBus.$emit('getAllPosts');
        })
        .catch((error) => {
          console.log(error);
          this.resetCreateState();
          utils.showErrorBoxTimer(700);
        });
    },
    submitUpdtatedPost() {
      utils.showSaveBox(true);
      let form = {
        title: this.newPost.title,
        text: this.newPost.text,
      };

      http
        .put(`posts/${this.newPost.postId}`, form, {
          headers: {
            Authorization: 'Bearer ' + this.token,
          },
        })
        .then(() => {
          this.resetCreateState();
          EventBus.$emit('getAllPosts');
        })
        .catch((error) => console.log(error));
    },
  },
  computed: {
    ...mapState({
      userId: 'userId',
      token: 'token',
      userDataX: 'userDataX',
      updateModale: 'updateModale',
      createModale: 'createModale',
      imgPreview: 'imgPreview',
      selectedFile: 'selectedFile',
    }),
    ...mapGetters(['userIdGetter', 'tokenGetter', 'updateGetter', 'createGetter', 'imgPreviewGetter', 'fileGetter']),
  },
  mounted() {
    EventBus.$on('setDataInUpdateModale', this.setDataInUpdateModale);
  },
  detroyed() {
    EventBus.$off('setDataInUpdateModale', this.setDataInUpdateModale);
  },
};
</script>

<style scoped lang="scss">
.fade-enter,
.fade-leave-to {
  transform: translateX(-20px);
}

// CREATE MODALE
#overlay {
  position: absolute;
  width: 100%;
  height: 100vh;
  background-color: #111722c9;
  z-index: 0;
}

.create {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: 2;

  &__modale {
    background-color: #fff;
    max-width: 400px;
    width: 100%;
    border-radius: 10px;
    z-index: 1;

    &__title {
      border-bottom: 1px solid #ddd;
      border-radius: 10px 10px 0 0;
      background-color: #fd7d63;
      color: #fff;
    }
    &__title h1 {
      font-weight: normal;
      color: #fff;
      border-bottom: none;
      padding: 0;
      letter-spacing: normal;
    }
    & #post-in-creation {
      margin: 0;
      border-radius: 0 0 10px 10px;

      & .create-buttons {
        text-align: end;
        padding-right: 20px;
      }
    }
    & form > div > div {
      margin: 10px 0;
    }
  }

  & #user-picture {
    border-radius: 50%;
    object-fit: cover;
  }

  &.none {
    display: none;
  }

  & form {
    display: block;
    height: calc(100% - 40px);
  }

  &-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    width: 100%;
    height: 100%;
    background-color: #fafafd;
    border-radius: 0 0 10px 10px;

    & > div {
      display: flex;
      flex-direction: column;
      width: 100%;
      text-align: left;
    }
    & > div label {
      font-size: 14px;
    }
    & > div input {
      font-size: 12px;
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 5px;
      &:focus-visible {
        outline: none;
      }
    }
    & > div textarea {
      height: 200px;
      max-height: 180px;
      width: 100%;
      max-width: 580px;
      font-family: 'Poppins';
      font-size: 12px;
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 5px;
      resize: none;
      &:focus-visible {
        outline: none;
      }
    }
    & div.create-text {
      margin: 10px 0;
    }
  }

  &-file {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #344767;
    width: 100%;
    min-width: 90%;
    max-height: 240px;
    margin: 0 auto 10px;

    & label {
      width: 100%;
      height: 100%;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      & .img-container {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        & img {
          width: 100%;
          height: 100%;
          max-height: 240px;
          object-fit: contain;
          border-radius: 10px;
        }
      }
    }
    &__default {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #fafafd;
      border: 3px dashed #ddd;
      border-radius: 10px;
    }

    & p {
      margin-top: 10px;
    }
  }
  #create-title,
  #create-hashtags,
  #create-text {
    width: 100%;
    display: block;

    & input,
    & textarea {
      width: 100%;
      height: 100%;
      border: none;
      border-left: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      border-radius: 0 0 0 5px;
      font-family: inherit;
      padding: 0 5px 5px 5px;
      color: #344767;

      &:focus-visible {
        outline: none;
        border-left: 1px solid #fd7d63;
        border-bottom: 1px solid #fd7d63;
      }
      &::placeholder {
        color: #67748e;
      }
    }
  }

  #create-hashtags {
    & input {
      font-size: 12px;
      font-weight: normal;
    }
  }
  #create-text {
    height: 75px;
    & textarea {
      resize: none;
      font-size: 12px;
      color: #67748e;
      border-left: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      border-radius: 0 0 0 5px;
      font-family: inherit;
      padding: 0 5px 5px 5px;
      &::-webkit-scrollbar {
        width: 5px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: #fd7d63;
      }
    }
  }
}

button.orange {
  padding: 5px 15px;
  border: none;
  background: none;
  background-color: #fd7d63;
  color: #fff;
  cursor: pointer;
}
button.publish-btn {
  width: 100px;
  height: 30px;
  border: none;
  border-radius: 15px;
  background: none;
  background-color: #fd7d63;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  &:hover {
    background: #fd7d63;
    box-shadow: 0 0 10px #0006;
  }
  &:disabled {
    background: grey !important;
    cursor: not-allowed !important;
  }
}
.cancel-btn {
  margin-left: 10px;
  border: none;
  background: none;
  color: #344767;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
</style>
