<template>
  <div class="welcome">
    <div class="welcome__title">
      <p>BIENVENUE</p>
      <h1>
        {{ pseudo }} {{ token }} <br />
        {{ tokenGetter }}
      </h1>
    </div>
    <button @click="logout">Deconnexion</button>
    <button @click="update">Update</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
export default {
  name: "Home",
  data() {
    return {
      pseudo: localStorage.getItem("pseudo").toUpperCase(),
    };
  },
  methods: {
    ...mapMutations(["updateToken"]),
    update() {
      this.updateToken({
        name: "Bertrand",
        value: 456,
      });
    },
    logout() {
      console.log("Hello logout !");
      localStorage.clear("token");
      this.$router.push("/login");
    },
  },
  computed: {
    ...mapState(["token"]),
    ...mapGetters(["tokenGetter"]),
  },
};
</script>
