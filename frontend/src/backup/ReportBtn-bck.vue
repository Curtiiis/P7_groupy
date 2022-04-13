<template>
  <div class="report-btn" @click="showReportMsg = !showReportMsg">
    <button type="button" class="report">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    </button>
    <transition name="fade" appear>
      <div class="report-msg" v-show="showReportMsg">
        <p>
          <a href="#" v-show="!isMyPost">Signaler</a>
          <a href="#" v-show="isMyPost">Modifier</a>
          <a href="#" v-show="isMyPost">Supprimer</a>
        </p>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "ReportBtn",
  data() {
    return {
      showReportMsg: false,
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    isMyPost: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    tellMeIsMyPost() {
      this.$emit("tellMeIsMyPost");
    },
  },
  created() {
    this.showReportMsg = this.value;
  },
  watch: {
    showReportMsg(newValue) {
      this.$emit("input", newValue);
    },
  },
};
</script>

<style scoped lang="scss">
button.report {
  border: none;
  background: none;
  cursor: pointer;
  &:hover svg {
    stroke: #fd7d63;
  }

  & svg {
    width: 26px;
    stroke: #344767;
    stroke-width: 1px;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}
</style>
