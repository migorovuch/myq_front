<template>
  <div>
    <div class="row mt-3 mb-5">
      <div class="col"></div>
      <div class="col"></div>
      <div class="col"></div>
    </div>
    <div :class="(isLoading()?'d-block':'d-none')+' loader fixed-bottom'">
      <div class="bar"></div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "Footer",
  methods: {
    ...mapGetters('loader', {
      isLoading: 'isLoading'
    }),
  }
}
</script>

<style scoped>

</style>
