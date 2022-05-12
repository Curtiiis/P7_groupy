<template>
  <div class="valid-box">
    <div class="loader loader--style6" title="5">
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        width="80px"
        height="120px"
        viewBox="0 0 24 30"
        style="enable-background: new 0 0 50 50"
        xml:space="preserve"
      >
        <rect x="0" y="13" width="4" height="15" fill="#fd7d63">
          <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0s" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0s" dur="0.6s" repeatCount="indefinite" />
        </rect>
        <rect x="10" y="13" width="4" height="15" fill="#fd7d63">
          <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
        </rect>
        <rect x="20" y="13" width="4" height="15" fill="#fd7d63">
          <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
        </rect>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ValidBox',
  props: ['validBox'],
  data() {
    return {
      showValidBox: false,
    };
  },
};
</script>

<style lang="scss">
.valid-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  background: #fffb;
  backdrop-filter: blur(2px);
  z-index: 20;
  border-radius: 10px;
  width: 100%;
  height: 100vh;
  animation: fadeIn 0.3s;

  p {
    color: #fd7d63;
  }
}
</style>
