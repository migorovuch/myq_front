<template>
  <div>
    <CompanyForm :companyModel="companyModel"/>
    <DashboardScheduleList />
  </div>
</template>

<script>
import CompanyForm from "./CompanyForm";
import {mapGetters, mapMutations, mapActions} from 'vuex';
import DashboardScheduleList from "../schedule/DashboardScheduleList";

export default {
  name: "DashboardCompanyEdit",
  components: {DashboardScheduleList, CompanyForm},
  data() {
    return {
      companyId: this.$route.params.id,
      companyModel: {
        name: '',
        email: '',
        phone: '',
        logo: null,
        logoFormModel: null,
        address: '',
        addressLink: '',
        description: '',
        photos: [],
      }
    };
  },
  created() {
    // this.selectSchedule(null);
    this.loadCompany({
      id: this.companyId,
      successCallback: (data) => {
        if ('data' in data && Object.keys(data.data).length !== 0) {
          this.setBreadcrumbItems([
            {
              text: this.$t('layouts_dashboard.Dashboard'),
              to: {name: 'dashboard_home'}
            },
            {
              text: this.$t('views_company_dashboard.Companies list'),
              to: {name: 'dashboard_companies'}
            },
            {
              text: data.data[0].name,
              to: {name: 'dashboard_companies_edit', params: {id: data.data[0].id}}
            }
          ]);
          this.companyModel = data.data[0];
          this.loadScheduleList({filter:{company: data.data[0].id}});
        }
      }
    });
  },
  methods: {
    ...mapMutations('schedule', {
      selectSchedule: 'loadOne',
    }),
    ...mapMutations('company', {
      selectCompany: 'loadOne',
    }),
    ...mapGetters('company', {
      getCompany: 'getModel'
    }),
    ...mapActions('company', {
      loadCompany: 'loadOne',
    }),
    ...mapActions('schedule', {
      loadScheduleList: 'load'
    }),
    ...mapMutations('dashboard', {
      setBreadcrumbItems: 'setBreadcrumbItems',
    }),
  }
}
</script>

<style scoped>

</style>

