<template>
  <div>
    <div>
      <b-form-input
          class='search-input'
          type='search'
          v-model='filterCriteria'
          v-on:keyup.enter='selectItem'
          @input="selectItem"
          :placeholder="$t('components_search.Find service')">
      </b-form-input>
    </div>
    <div>
      <b-collapse id='company-search-drop-down' :visible="visible">
        <div v-for="(company, key) in getCompanies()" :key="key" class="p-2">
          <router-link :to="{name: 'company_vue', params:{id: company.id}}">{{ company.name }}</router-link>
        </div>
      </b-collapse>
    </div>
  </div>
</template>

<script>

import {mapActions, mapGetters} from "vuex";

export default {
  name: "CompanySearch",
  data() {
    return {
      filterCriteria: '',
      filteredRows: [],
      visible: false,
      timeoutId: null
    }
  },
  methods: {
    ...mapGetters('company', {
      getCompanies: 'getList',
    }),
    ...mapActions('company', {
      loadCompanies: 'loadPublic'
    }),
    toggleDropDown() {
      // this.$root.$emit('bv::toggle::collapse', 'company-search-drop-down')
      this.visible = true;

    },
    selectItem() {
      if (this.filterCriteria.length > 3) {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }
        this.timeoutId = setTimeout(
            () => {
              this.loadCompanies({
                filter: {name: '%'+this.filterCriteria+'%'},
                successCallback: (data) => {
                  this.toggleDropDown()
                }
              });
              // if (this.filteredRows.length === 1) {
              //   this.$refs.collapsibleTable.selectRow(0)
              // }
            },
            1000
        );
      } else if (!this.filterCriteria.length) {
        this.visible = false;
      }
    },
  },
}
</script>

<style scoped>

</style>
