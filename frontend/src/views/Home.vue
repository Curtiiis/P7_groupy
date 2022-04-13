<template>
  <div class="home__container" @click="closeSearchResults">
    <div class="aside-left">
      <div class="aside-left__content">
        <div class="aside-left__top">
          <!-- <img
            src="../assets/logo_white-small.png"
            alt="Logo groupomania sans texte"
            class="logo1"
          /> -->
          <img
            src="../assets/logo-d2-3-white.png"
            alt="Logo groupomania avec texte"
            class="logo2"
          />
          <p class="aside-left__pseudo-v" id="pseudo-user">
            <span>{{ user.pseudo }}</span>
          </p>
          <a href="profile" class="profile-picture">
            <img :src="'images/' + user.picture" alt="Photo de profil" />
          </a>
        </div>
        <div class="aside-left__bottom">
          <div class="aside-left__pseudo">
            <p class="upp">{{ user.pseudo }}</p>
          </div>
          <div class="aside-left__followers">
            <p class="upp">Abonnés</p>
            <p class="fz22 blue-grey">{{ user.followers }}</p>
          </div>
          <div class="aside-left__groups">
            <p class="upp">Posts</p>
            <p class="fz22 blue-grey">{{ user.posts.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="main">
      <!-- NAVBAR -->
      <div class="navbar">
        <div class="navbar-content">
          <transition name="fadeDown" appear>
            <a href="#top" class="navbar__logo" v-show="showNavbarLogo">
              <img
                class="logo-groupomania"
                :src="'images/' + navbar.img"
                alt="logo groupomania"
                height="30px"
              />
            </a>
          </transition>
          <!-- Rechercher -->
          <div class="search-container">
            <transition name="fadeDown" appear>
              <form
                action="/"
                class="navbar__form"
                v-show="showSearchBar || tabletView"
              >
                <SearchSvg2 />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  id="search-input"
                  class="fz16"
                  v-model="searchInput"
                  @input="filterResults"
                />
              </form>
            </transition>
            <transition name="fade" appear>
              <div
                class="navbar__search__modale"
                id="search-modale"
                v-show="showSearchResults"
              >
                <!-- Result -->
                <div
                  class="result"
                  v-for="result in filteredResults"
                  :key="result.id"
                >
                  <img :src="result.img" :alt="result.alt" />
                  <div class="result-pseudo">{{ result.pseudo }}</div>
                </div>
              </div>
            </transition>
          </div>
          <div class="navbar-items">
            <!-- Search icon -->
            <label
              for="search-input"
              class="search-button"
              id="search-btn"
              @click="toggleSearchbarLogo"
              v-if="showSearchBtn"
            >
              <SearchSvg />
            </label>

            <!-- Create icon -->
            <button
              class="create-button"
              id="create-btn"
              @click="displayCreatePost"
            >
              <CreateIcon :orange="showCreatePost" />
            </button>

            <!-- User icon -->
            <a href="#" v-if="tabletView">
              <UserIcon />
            </a>

            <!-- Logout icon -->
            <a href="#" v-if="tabletView">
              <LogoutIcon @click.native="logout" />
            </a>

            <div class="mobile-menu-container">
              <button
                class="menu-mobile-btn"
                @click="
                  barsToCross = !barsToCross;
                  showMobileMenu = !showMobileMenu;
                "
              >
                <input type="checkbox" id="menu-mobile" />
                <label
                  for="menu-mobile"
                  @click="
                    barsToCross = !barsToCross;
                    showMobileMenu = !showMobileMenu;
                  "
                  :class="{
                    menuMobileLabel: barsToCross,
                  }"
                >
                </label>
              </button>
              <transition name="fadeDown" appear>
                <div
                  class="mobile-menu-items"
                  id="mobile-menu-items"
                  v-show="showMobileMenu"
                >
                  <!-- User icon -->
                  <button type="button" class="mobile-menu-account">
                    <UserIcon :orangeIcon="true" />
                    <p>Mon compte</p>
                  </button>

                  <!-- Logout icon -->
                  <button
                    type="button"
                    class="mobile-menu-logout"
                    @click="logout"
                  >
                    <LogoutIcon :orangeIcon="true" />
                    <p>Déconnexion</p>
                  </button>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <div class="content">
        <div class="posts">
          <div
            class="post br20"
            v-for="post in posts"
            :key="post.id"
            :id="'post' + post.id"
          >
            <div class="post__infos">
              <!-- Infos Left -->
              <div class="left">
                <a href="#">
                  <img
                    :src="'images/' + post.picture"
                    width="50px"
                    height="auto"
                    alt="profile picture"
                  />
                </a>
              </div>
              <!-- Infos Middle -->
              <div class="middle">
                <a href="#" class="pseudo bold fz16">{{ post.pseudo }}</a>
                <p class="date grey">il y a {{ post.createdAt }}h</p>
              </div>
              <!-- Infos Right -->
              <ReportBtn
                :showReportMsg="post.showReportMsg"
                :isMyPost="post.isMyPost"
                @click.native="tellMeIsMyPost(post)"
                @updateThePost="update(post)"
              />
              <!-- v-model="post.showReportMsg" -->
            </div>
            <div class="post__content">
              <PostImage
                :src="post.img"
                v-show="isFileExist || post.img != ''"
                @click.native="test"
                ref="postImage"
              />
              <div class="post__title">
                <p class="bold fz16">{{ post.title }}</p>
              </div>
              <div class="post__text blue-grey">
                <p>
                  {{ post.text }}
                </p>
              </div>
              <div class="post__tags">
                <a href="#" v-for="hashtag in post.hashtags" :key="hashtag.id"
                  >#{{ hashtag.tag }}</a
                >
                <!-- <a href="#">#green</a>
                <a href="#">#homegarden</a> -->
              </div>
            </div>
            <div class="post__reactions">
              <!-- Like -->
              <LikeIcon
                :liked="post.liked"
                v-model="post.liked"
                @colorize="colorizeLikeIcon"
                :likesCount="post.likes.length"
                @click.native="like(post)"
              />

              <!-- Comment -->
              <CommentIcon
                v-model="post.showComments"
                :commentsCount="post.comments.length"
              />

              <!-- Share -->
              <!-- <div class="post__reaction">
                <ShareIcon />
                <p>{{ post.shares }}</p>
              </div> -->

              <!-- Save -->
              <SaveIcon
                :saved="post.saved"
                :savesCount="post.saves.length"
                v-model="post.saved"
                @click.native="save(post)"
              />
            </div>

            <!-- Comments -->
            <transition name="fadeUp" appear>
              <div
                class="post__comments"
                id="post-comments"
                v-show="post.showComments == true"
              >
                <div class="post__comments-container">
                  <div
                    class="posted"
                    v-for="comment in post.comments"
                    :key="comment.id"
                  >
                    <transition name="fadeUp" appear>
                      <div>
                        <div class="post__comments-infos">
                          <a href="#" class="bold">{{ comment.author }}</a>
                          <p>il y a {{ comment.createdAt }}min</p>
                        </div>
                        <p>
                          {{ comment.text }}
                        </p>
                      </div>
                    </transition>
                  </div>
                </div>
                <form @submit.prevent="postTheComment(post)">
                  <input
                    type="text"
                    class="white-border br30"
                    placeholder="Votre commentaire..."
                    v-model="comment"
                  />
                  <button type="submit" class="orange br30">Poster</button>
                </form>
              </div>
            </transition>
          </div>
        </div>

        <!-- ASIDE RIGHT -->
        <div class="aside-right">
          <h2 class="bold">Suggestions</h2>
          <div class="aside-right__cards">
            <!-- Card -->
            <a href="#" v-for="item in suggestions" :key="item.id">
              <div class="img-container">
                <img :src="item.src" :alt="item.alt" />
                <button class="fz20 br50">+</button>
              </div>
              <p>{{ item.pseudo }}</p>
            </a>
          </div>
        </div>

        <!-- CREATE MODALE -->
        <transition name="fade" appear>
          <div class="create" id="create" v-show="showCreatePost">
            <div id="overlay" @click="closeCreatePost"></div>
            <div class="create__modale">
              <div class="create__modale__title">
                <h1>Créer un post</h1>
              </div>
              <div class="create__modale__post-container">
                <div class="post" id="post-in-creation">
                  <div class="post__infos">
                    <!-- Infos Left -->
                    <div class="left">
                      <img
                        :src="'images/' + user.picture"
                        width="50px"
                        height="auto"
                        alt="profile picture"
                      />
                    </div>
                    <!-- Infos Middle -->
                    <div class="middle">
                      <p class="pseudo bold fz16">{{ user.pseudo }}</p>
                      <!-- <p class="date grey">il y a 1h</p> -->
                    </div>
                  </div>

                  <form @submit.prevent="submitNewPost">
                    <div class="post__content">
                      <div class="post__image br20">
                        <div class="create-file">
                          <label for="create-file">
                            <div class="img-container">
                              <img
                                :src="ImgOfNewPost"
                                alt=""
                                id="postImage"
                                v-show="isFileExist"
                              />
                              <div
                                class="create-file__default"
                                v-show="!isFileExist"
                              >
                                <div class="create-file-icon-container">
                                  <CreateFileIcon />
                                </div>
                                <p class="fz16">Choisir une image</p>
                              </div>
                            </div>
                          </label>
                          <input
                            type="file"
                            id="create-file"
                            accept="image/*"
                            @change="onFileSelected"
                            hidden
                          />
                        </div>
                      </div>
                      <div class="post__title">
                        <label for="create-title" id="create-title">
                          <input
                            type="text"
                            class="fz14 bold"
                            placeholder="Titre du post..."
                            v-model="titleOfNewPost"
                          />
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
                            v-model="textOfNewPost"
                          ></textarea>
                        </label>
                      </div>
                      <div class="post__tags">
                        <label for="create-title" id="create-hashtags">
                          <input
                            type="text"
                            placeholder="Hashtags..."
                            v-model="hashtagsOfNewPost"
                          />
                        </label>
                      </div>
                    </div>
                    <div class="create-buttons">
                      <button type="submit" class="publishBtn">Publier</button>
                      <button type="button" class="cancelBtn">Annuler</button>
                    </div>
                  </form>
                </div>
              </div>

              <!-- Form Display none -->
              <form style="display: none">
                <div class="create-file">
                  <label for="create-file">
                    <img src="" alt="" id="postImage" v-show="isFileExist" />
                    <div class="create-file__default" v-show="!isFileExist">
                      <CreateFileIcon />
                      <p class="fz16">Choisir une image</p>
                    </div>
                  </label>
                  <input
                    type="file"
                    id="create-file"
                    accept="image/*"
                    @change="onFileSelected"
                    hidden
                  />
                </div>
                <div class="create-content">
                  <div class="create-title">
                    <label for="create-title">Titre</label>
                    <input type="text" id="create-title" />
                  </div>

                  <div class="create-text">
                    <label for="create-text">Texte</label>
                    <textarea
                      name="create-text"
                      id="create-text"
                      cols="15"
                      rows="5"
                    ></textarea>
                  </div>
                  <div class="create-hashtag">
                    <label for="create-hashtag">Hashtags</label>
                    <input type="text" id="create-hashtag" />
                  </div>
                </div>
                <!-- <button type="submit" class="">Publier</button> -->
              </form>
            </div>
          </div>
        </transition>

        <!-- UPDATE MODALE -->
        <transition name="fade" appear>
          <div class="create update" id="create" v-show="showUpdatePost">
            <div id="overlay" @click="closeUpdatePost"></div>
            <div class="create__modale">
              <div class="create__modale__title">
                <h1>Modifier un post</h1>
              </div>
              <div class="create__modale__post-container">
                <div class="post" id="post-in-creation">
                  <div class="post__infos">
                    <!-- Infos Left -->
                    <div class="left">
                      <img
                        :src="'images/' + user.picture"
                        width="50px"
                        height="auto"
                        alt="profile picture"
                      />
                    </div>
                    <!-- Infos Middle -->
                    <div class="middle">
                      <p class="pseudo bold fz16">{{ user.pseudo }}</p>
                      <!-- <p class="date grey">il y a 1h</p> -->
                    </div>
                  </div>

                  <form @submit.prevent="submitUpdatedPost">
                    <div class="post__content">
                      <div class="post__image br20">
                        <div class="create-file">
                          <label for="create-file">
                            <div class="img-container">
                              <img
                                :src="'images/' + ImgOfUpdatedPost"
                                alt=""
                                id="postImage"
                                v-show="isFileExist"
                              />
                              <div
                                class="create-file__default"
                                v-show="!isFileExist"
                              >
                                <div class="create-file-icon-container">
                                  <CreateFileIcon />
                                </div>
                                <p class="fz16">Choisir une image</p>
                              </div>
                            </div>
                          </label>
                          <input
                            type="file"
                            id="create-file"
                            accept="image/*"
                            @change="onFileSelected"
                            hidden
                          />
                        </div>
                      </div>
                      <div class="post__title">
                        <label for="create-title" id="create-title">
                          <input
                            type="text"
                            class="fz14 bold"
                            placeholder="Titre du post..."
                            v-model="titleOfUpdatedPost"
                          />
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
                            v-model="textOfUpdatedPost"
                          ></textarea>
                        </label>
                      </div>
                      <div class="post__tags">
                        <label for="create-title" id="create-hashtags">
                          <input
                            type="text"
                            placeholder="Hashtags..."
                            v-model="hashtagsOfUpdatedPost"
                          />
                        </label>
                      </div>
                    </div>
                    <div class="create-buttons">
                      <button type="submit" class="publishBtn">
                        Enregistrer
                      </button>
                      <button type="button" class="cancelBtn">Annuler</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
// IMPORTS
import { mapState, mapGetters } from "vuex";
import SearchSvg from "../components/icons/SearchSvg.vue";
import SearchSvg2 from "../components/icons/SearchSvg2.vue";
import CreateIcon from "../components/icons/CreateIcon.vue";
import UserIcon from "../components/icons/UserIcon.vue";
import LogoutIcon from "../components/icons/LogoutIcon.vue";
import ReportBtn from "../components/icons/ReportBtn.vue";
import LikeIcon from "../components/icons/LikeIcon.vue";
import CommentIcon from "../components/icons/CommentIcon.vue";
// import ShareIcon from "../components/icons/ShareIcon.vue";
import SaveIcon from "../components/icons/SaveIcon.vue";
import CreateFileIcon from "../components/icons/CreateFileIcon.vue";
import PostImage from "../components/PostImage.vue";

// EXPORTS
export default {
  name: "Home",
  components: {
    SearchSvg,
    SearchSvg2,
    CreateIcon,
    UserIcon,
    LogoutIcon,
    ReportBtn,
    LikeIcon,
    CommentIcon,
    //  ShareIcon,
    SaveIcon,
    CreateFileIcon,
    PostImage,
  },
  data() {
    return {
      pseudo: localStorage.getItem("pseudo").toUpperCase(),
      barsToCross: false,
      showMobileMenu: false,
      showCreatePost: false,
      showUpdatePost: false,
      isFileExist: false,
      showSearchBar: false,
      showSearchResults: false,
      showNavbarLogo: true,
      tabletView: false,
      showSearchBtn: true,
      orangeLikeIcon: false,
      comment: "",
      titleOfNewPost: "",
      textOfNewPost: "",
      hashtagsOfNewPost: "",
      ImgOfNewPost: "",
      showNewPostImg: false,
      titleOfUpdatedPost: "",
      textOfUpdatedPost: "",
      hashtagsOfUpdatedPost: "",
      ImgOfUpdatedPost: "",
      searchInput: "",
      filteredResults: [],
      noResults: false,
      navbar: {
        img: "logo-d2-small-tr.png",
      },
      user: {
        id: "36",
        picture: "pp-user.jpeg",
        pseudo: localStorage.getItem("pseudo"),
        followers: 10,
        posts: ["1", "2", "3", "4", "5"],
      },
      posts: [
        {
          id: 1,
          createdAt: Math.floor(Math.random() * 10),
          picture: "pp1.jpeg",
          pseudo: "pseudo 1",
          img: "photo1.jpeg",
          title: "titre 1",
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt consequuntur labore autem voluptatem numquam omnis consequatur soluta nam? Soluta, esse ?",
          hashtags: [
            { id: 1, tag: "vancances" },
            { id: 2, tag: "soleil" },
            { id: 3, tag: "plage" },
          ],
          comments: [
            {
              id: 1,
              author: "Author1",
              text: "Je suis le commentaire 1.",
              createdAt: Math.floor(Math.random() * 10),
            },
            {
              id: 2,
              author: "Author2",
              text: "Je suis le commentaire 2.",
              createdAt: Math.floor(Math.random() * 10),
            },
          ],
          likes: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
          saves: ["1", "2", "3", "4", "5"],
          liked: false,
          showComments: false,
          showReportMsg: false,
          isMyPost: false,
        },
        {
          id: 2,
          createdAt: Math.floor(Math.random() * 10),
          picture: "pp2.jpeg",
          pseudo: "Curtis",
          img: "photo2.jpeg",
          title: "titre 2",
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt consequuntur labore autem voluptatem numquam omnis consequatur soluta nam? Soluta, esse ?",
          hashtags: [
            { id: 1, tag: "gâteaux" },
            { id: 2, tag: "macarons" },
            { id: 3, tag: "fleurs" },
          ],
          comments: [
            {
              id: 1,
              author: "Author21",
              text: "Je suis le commentaire 212.",
              createdAt: Math.floor(Math.random() * 10),
            },
            {
              id: 2,
              author: "Author22",
              text: "Je suis le commentaire 222.",
              createdAt: Math.floor(Math.random() * 10),
            },
          ],
          likes: ["1", "2", "3", "4", "5", "6", "7"],
          saves: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
          liked: false,
          showComments: false,
          showReportMsg: false,
          isMyPost: false,
        },
        {
          id: 3,
          createdAt: Math.floor(Math.random() * 10),
          picture: "pp3.jpeg",
          pseudo: "pseudo 3",
          img: "photo3.jpeg",
          title: "titre 3",
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt consequuntur labore autem voluptatem numquam omnis consequatur soluta nam? Soluta, esse ?",
          hashtags: [
            { id: 1, tag: "crochet" },
            { id: 2, tag: "laine" },
            { id: 3, tag: "diy" },
          ],
          comments: [
            {
              id: 31,
              author: "Author31",
              text: "Je suis le commentaire 31.",
              createdAt: Math.floor(Math.random() * 10),
            },
            {
              id: 32,
              author: "Author32",
              text: "Je suis le commentaire 32.",
              createdAt: Math.floor(Math.random() * 10),
            },
          ],
          likes: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
          saves: ["1", "2", "3", "4", "5"],
          liked: false,
          showComments: false,
          showReportMsg: false,
          isMyPost: false,
        },
      ],
      suggestions: [
        {
          id: 1,
          pseudo: "John doe",
          src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=580&amp;q=80",
          alt: "Profile picture of John Doe",
        },
        {
          id: 2,
          pseudo: "Jane Ferguson",
          src: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=580&amp;q=80",
          alt: "Profile picture of Jane Ferguson",
        },
        {
          id: 3,
          pseudo: "Qasim Radu",
          src: "https://images.unsplash.com/photo-1598641795816-a84ac9eac40c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=581&q=80",
          alt: "Profile picture of Qasim Radu",
        },
        {
          id: 4,
          pseudo: "Johanna Smith",
          src: "https://images.unsplash.com/photo-1518577915332-c2a19f149a75?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=562&q=80",
          alt: "Profile picture of Johanna Smith",
        },
        {
          id: 5,
          pseudo: "Céline Dion",
          src: "https://images.unsplash.com/photo-1563956261547-865a33406922?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=582&q=80",
          alt: "Profile picture of Céline Dion",
        },
      ],
      searchResults: [
        {
          id: 1,
          img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
          alt: "result1",
          pseudo: "John Doe",
        },
        {
          id: 2,
          img: "https://images.unsplash.com/photo-1518577915332-c2a19f149a75?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=562&q=80",
          alt: "result2",
          pseudo: "Johanna Smith",
        },
        {
          id: 3,
          img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
          alt: "result1",
          pseudo: "Bienvenue Doey",
        },
        {
          id: 4,
          img: "https://images.unsplash.com/photo-1518577915332-c2a19f149a75?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=562&q=80",
          alt: "result2",
          pseudo: "Terence Smithy",
        },
        {
          id: 5,
          img: "https://cdn4.iconfinder.com/data/icons/tabler-vol-5/24/mood-cry-256.png",
          alt: "No result",
          pseudo: "Pas de résultats",
        },
      ],
    };
  },
  methods: {
    onFileSelected(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          document.querySelector("#postImage").src = result;
        };
        reader.readAsDataURL(file);
        this.isFileExist = true;
        this.ImgOfNewPost = file.name;

        // Style container
        const imgContainer = document.querySelector(".create-file");
        imgContainer.style.border = "none";
        imgContainer.style.background = "none";
      }
    },
    submitNewPost() {
      let newPost = {
        id: Math.floor(Math.random() * 1000),
        createdAt: Math.floor(Math.random() * 10),
        picture: this.user.picture,
        pseudo: this.user.pseudo,
        img: this.ImgOfNewPost,
        title: this.titleOfNewPost,
        text: this.textOfNewPost,
        hashtags: [
          { id: Math.floor(Math.random() * 100), tag: "tag1" },
          { id: Math.floor(Math.random() * 100), tag: "tag2" },
          { id: Math.floor(Math.random() * 100), tag: "tag3" },
        ],
        comments: [],
        likes: [],
        saves: [],
        liked: false,
        showComments: false,
        showReportMsg: false,
        isMyPost: false,
      };
      this.posts.unshift(newPost);
      this.titleOfNewPost = "";
      this.textOfNewPost = "";
      this.hashtagsOfNewPost = "";
      document.querySelector("#create-file").value = "";
      this.isFileExist = false;
      document.querySelector("#postImage").src = "";
      this.showCreatePost = false;
      document.querySelector("#create-btn svg").classList.remove("orange");
    },
    submitUpdatedPost() {
      let updatedPost = {
        id: Math.floor(Math.random() * 1000),
        createdAt: Math.floor(Math.random() * 10),
        picture: this.user.picture,
        pseudo: this.user.pseudo,
        img: this.ImgOfUpdatedPost,
        title: this.titleOfUpdatedPost,
        text: this.textOfUpdatedPost,
        hashtags: [
          { id: Math.floor(Math.random() * 100), tag: "tag1" },
          { id: Math.floor(Math.random() * 100), tag: "tag2" },
          { id: Math.floor(Math.random() * 100), tag: "tag3" },
        ],
        comments: [],
        likes: [],
        saves: [],
        liked: false,
        showComments: false,
        showReportMsg: false,
        isMyPost: false,
      };
      this.posts.unshift(updatedPost);
      this.titleOfUpdatedPost = "";
      this.textOfUpdatedPost = "";
      this.hashtagsOfUpdatedPost = "";
      document.querySelector("#create-file").value = "";
      this.isFileExist = false;
      document.querySelector("#postImage").src = "";
      this.showCreatePost = false;
    },

    toggleSearchbarLogo() {
      const searchInput = document.querySelector("#search-input");
      const searchIcon = document.querySelector(".search-icon");

      if (this.showNavbarLogo) {
        this.showNavbarLogo = false;
        setTimeout(() => {
          this.showSearchBar = true;
        }, 250);
        setTimeout(() => {
          searchInput.focus();
        }, 500);
      } else {
        this.showSearchBar = false;
        setTimeout(() => {
          this.showNavbarLogo = true;
        }, 250);
      }
      searchIcon.classList.toggle("orange");

      // Display Search Results
      if (this.showSearchResults) {
        this.showSearchResults = false;
      } else {
        setTimeout(() => {
          this.showSearchResults = true;
        }, 200);
      }
    },
    displayCreatePost() {
      this.showCreatePost = true;
      document.querySelector("#create-btn svg").classList.add("orange");
    },
    closeCreatePost() {
      this.showCreatePost = false;
      document.querySelector("#create-btn svg").classList.remove("orange");
    },
    closeUpdatePost() {
      this.showUpdatePost = false;
    },

    onResize() {
      if (window.innerWidth >= 768) {
        this.tabletView = true;
        this.showSearchBar = true;
        this.showSearchBtn = false;
        this.showNavbarLogo = true;
      } else {
        this.tabletView = false;
        this.showSearchBar = false;
        this.showSearchBtn = true;
      }
    },
    like(post) {
      if (!post.likes.includes("36")) {
        post.likes.push("36");
      } else {
        post.likes.pop("36");
      }
    },
    save(post) {
      if (!post.saves.includes("36")) {
        post.saves.push("36");
      } else {
        post.saves.pop("36");
      }
    },
    update(post) {
      //  document.querySelector('#postImage').src == window.location.origin + '/images/'
      if (post.img == "") {
        this.isFileExist = false;
      } else {
        this.isFileExist = true;
        this.ImgOfUpdatedPost = post.img;
        //   this.ImgOfUpdatedPost = "images/" + post.img;
      }
      this.showUpdatePost = true;

      this.titleOfUpdatedPost = post.title;
      this.textOfUpdatedPost = post.text;
      const mapArray = post.hashtags.map((x) => x.tag);
      console.log(mapArray);
      this.hashtagsOfUpdatedPost = mapArray;
      // for (let i = 0; i < post.hashtags.length; i++) {
      //   let tags = post.hashtags[i].tag;
      //   this.hashtagsOfNewPost = tags;
      //   document.querySelector("#create-hashtag").value = "oui";
      // }
    },
    test(e) {
      console.log(e.srcElement.currentSrc);
    },
    likeByDoubleClick() {
      console.log(this.$el);
    },
    colorizeLikeIcon() {
      const likeSvg = document.querySelector("#like-svg");
      if (!this.posts[0].liked) {
        this.posts[0].liked = true;
        this.posts[0].likes += 1;
        likeSvg.classList.add("orange", "beat");
      } else {
        this.posts[0].liked = false;
        this.posts[0].likes -= 1;
        likeSvg.classList.remove("orange", "beat");
      }
    },
    animateLikeIcon() {
      //  Double click on image
      const likeSvg = document.querySelector(".like-icon svg");
      if (!likeSvg.classList.contains("orange")) {
        this.orangeLikeIcon = true;
      }
      likeSvg.classList.remove("beat");
      setTimeout(() => {
        likeSvg.classList.add("beat", "orange");
      }, 100);
    },
    postTheComment(post) {
      let today = new Date(Date.now());
      let postObject = {
        id: Math.floor(Math.random() * 1000),
        author: this.user.pseudo,
        text: this.comment,
        createdAt: today.getSeconds(),
      };
      if (this.comment.length > 0) {
        post.comments.unshift(postObject);
        this.comment = "";
      }
    },
    logout() {
      localStorage.clear("token");
      this.$router.push("/login");
    },
    orientPseudo() {
      const pseudoUser = document.querySelector("#pseudo-user span");
      const pseudoParent = pseudoUser.offsetParent;
      if (pseudoUser.offsetHeight < 180) {
        pseudoParent.classList.add("horizontal");
      }
    },
    filterResults() {
      if (this.searchInput.length > 0) {
        this.showSearchResults = true;
        this.filteredResults = this.searchResults.filter(
          (result) =>
            result.pseudo
              .toLowerCase()
              .includes(this.searchInput.toLowerCase()) &&
            !result.pseudo.includes("Pas de résultats")
        );
      }
      if (this.searchInput.length > 0 && this.filteredResults.length == 0) {
        console.log("Pas de résultats");
        this.filteredResults = this.searchResults.filter((result) =>
          result.pseudo.includes("Pas de résultats")
        );
        this.showSearchResults = true;
      }
      if (this.searchInput.length == 0) {
        this.filteredResults = [];
        this.showSearchResults = false;
      }
    },
    closeSearchResults(e) {
      const searchInput = document.querySelector("#search-input");
      if (this.searchInput.length > 0 && e.target != searchInput) {
        console.log("Fermer");
        this.filteredResults = [];
        this.showSearchResults = false;
      }
    },
    tellMeIsMyPost(post) {
      // const postPseudo =
      //   e.target.closest("div.report-btn").previousSibling.firstChild.innerText;
      post.showReportMsg = !post.showReportMsg;
      const postPseudo = post.pseudo.toLowerCase();
      const pseudoUser = localStorage.getItem("pseudo").toLowerCase();
      const isMyPost = postPseudo == pseudoUser;
      console.log("isMyPost", isMyPost);
      if (isMyPost) {
        post.isMyPost = true;
      } else {
        post.isMyPost = false;
      }
    },
  },
  computed: {
    ...mapState(["token"]),
    ...mapGetters(["tokenGetter"]),
  },
  beforeMount() {},
  mounted() {
    this.onResize();
    this.orientPseudo();
  },
  created() {
    window.addEventListener("resize", this.onResize);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
};
</script>

<style scoped>
/* FadeDown */
.fadeDown-enter-active,
.fadeDown-leave-active {
  transition: all 0.1s ease-out;
}

.fadeDown-enter,
.fadeDown-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* FadeUp */
.fadeUp-enter-active,
.fadeUp-leave-active {
  transition: all 0.2s ease-out;
}

.fadeUp-enter,
.fadeUp-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Fade */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
