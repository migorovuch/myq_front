<template>
  <b-container>
    <div v-for="(company, key) in favoriteCompanies" :key="key">
      <router-link :to="{name: 'company_vue', params:{id: company.id}}">{{ company.name }}</router-link>
    </div>
  </b-container>
</template>

<script>

import CompanyLocalStorageProvider from "../../../providers/localStorage/CompanyLocalStorageProvider";

let companyLocalStorageProvider = new CompanyLocalStorageProvider();

export default {
  name: "FavoriteCompanies",
  data() {
    return {
      favoriteCompanies: []
    };
  },
  created() {
    this.favoriteCompanies = companyLocalStorageProvider.getFavoriteCompanies();
  }
}
</script>

<style scoped>

</style>
