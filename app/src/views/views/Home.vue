<template>
  <div class="home">
    <img alt="Vue logo" src="../../assets/logo.png">
    <div class="row">
      <div class="col-3" v-for="(company, key) in getCompanies()" :key="key">
        <router-link :to="{name: 'company_vue', params:{id: company.id}}">{{company.name}}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from './HelloWorld.vue'
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  created() {
    this.loadCompanies({filter:{}});
  },
  methods: {
    ...mapGetters('company', {
      getCompanies: 'getList',
    }),
    ...mapActions('company', {
      loadCompanies: 'load'
    }),
  }
}
</script>
