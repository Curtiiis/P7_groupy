<template>
  <button class="create-button" id="create-btn" name="nouveau post">
    <svg viewBox="0 0 32 32" class="create-icon" :class="{orange: createModale}" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2Zm0 26a12 12 0 1 1 12-12 12 12 0 0 1-12 12Z"></path>
      <path d="M17 10h-2v5h-5v2h5v5h2v-5h5v-2h-5v-5z"></path>
    </svg>
  </button>
</template>

<script>
import {mapState, mapGetters} from 'vuex';

export default {
  name: 'CreateIcon',
  computed: {
    ...mapState({createModale: 'createModale'}),
    ...mapGetters(['createGetter']),
  },
};
</script>

<style scoped>
svg.create-icon {
  width: 26px;
  stroke: #344767;
  fill: #344767;
  stroke-width: 0.25px;
}

svg.create-icon.orange {
  stroke: #fd7d63;
  fill: #fd7d63;
}
</style>
