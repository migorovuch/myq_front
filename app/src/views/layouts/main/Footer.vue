<template>
  <div>
    <div class="container pt-3">
      <p class="float-right"><a href="#">Back to top</a></p>
      <p>&copy; 2021 MyQ. &middot; <a href="#">Privacy</a> &middot; <a href="#">Terms</a></p>
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
