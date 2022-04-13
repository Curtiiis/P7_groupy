<template>
  <div class="title">
    <router-link to="/">
      <img
        src="../assets/logo-degrade-2-small.png"
        alt="logo groupy"
        width="50px"
        height="50px"
      />
    </router-link>
    <h1>GROUPY <span>App</span></h1>
    <h2>{{ authType }}</h2>
  </div>
</template>

<script>
export default {
  name: "TitleLogo",
  props: ["authType"],
};
</script>
