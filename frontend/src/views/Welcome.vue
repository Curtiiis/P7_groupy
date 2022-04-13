<template>
  <div class="welcome">
    <img
      src="../assets/logo_white-small.png"
      alt="logo groupy"
      width="100px"
      height="100px"
    />

    <div class="welcome__title">
      <p>BIENVENUE SUR</p>
      <h1><span>GROUPY</span> APP</h1>
    </div>

    <nav class="welcome__nav">
      <router-link to="/signup"> Inscription </router-link>
      <router-link to="/login"> Connexion </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: "Welcome",
};
</script>
