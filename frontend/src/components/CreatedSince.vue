<template>
  <div id="createdSince" class="date grey">il y a {{ createdSince }} <span v-show="updated">(modifié)</span></div>
</template>

<script>
export default {
  name: 'CreatedSince',
  props: ['createdSince', 'updated'],
};
</script>

<style></style>
