<template>
  <div>
    <b-table
        striped
        hover
        :items="tableItems"
        :fields="tableFields"
        @row-clicked="rowClicked">
      <template #cell(status)="data">
        <b-badge :variant="getStatusBadge(data.value)">{{getStatusLabel(data.value)}}</b-badge>
      </template>
    </b-table>
  </div>
</template>

<script>

import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
  name: "DashboardCompanyList",
  data() {
    return {
      tableFields: [
        {key: 'id', label: this.$t('views_company.Id')},
        {key: 'name', label: this.$t('views_company.Name')},
        {key: 'createdAt', label: this.$t('views_company.Created at')},
        {key: 'phone', label: this.$t('views_company.Phone')},
        {key: 'status', label: this.$t('views_company.Status')},
      ],
      tableItems: []
    };
  },
  created() {
    this.setBreadcrumbItems([
      {
        text: this.$t('layouts_dashboard.Dashboard'),
        to: {name: 'dashboard_home'}
      },
      {
        text: this.$t('views_company_dashboard.Companies list'),
        to: {name: 'dashboard_companies'}
      }
    ]);
    this.loadCompanies({
      filter:{},
      successCallback: (data) => {
        this.tableItems = data.data;
        for (let item of this.tableItems) {
          item.createdAt = new Date(item.createdAt).sformat('yyyy-mm-dd HH:MM');
          item.updatedAt = new Date(item.updatedAt).sformat('yyyy-mm-dd HH:MM');
        }
      }
    });
  },
  methods: {
    ...mapGetters('company', {
      getCompanies: 'getList',
    }),
    ...mapActions('company', {
      loadCompanies: 'load'
    }),
    ...mapMutations('dashboard', {
      setBreadcrumbItems: 'setBreadcrumbItems',
    }),
    getStatusBadge(status) {
      let labels = {
        0: 'secondary',
        1: 'success',
      };

      return labels[status];
    },
    getStatusLabel(status) {
      let labels = {
        0: this.$t('views_company_dashboard.Inactive'),
        1: this.$t('views_company_dashboard.Active'),
      };

      return labels[status];
    },
    rowClicked(item, index, event) {
      this.$router.push({name: 'dashboard_companies_edit', params: {'id': item.id}});
    }
  }
}
</script>

<style scoped>

</style>
