<template>
  <b-container class="pt-3">
      <CompanyForm :companyModel="companyModel"/>
      <ScheduleList />
  </b-container>
</template>

<script>
  import CompanyForm from "./CompanyForm";
  import ScheduleList from "../schedule/ScheduleList";
  import {mapGetters, mapMutations, mapActions} from 'vuex';

  export default {
    name: "CompanySettings",
    components: {ScheduleList, CompanyForm},
    data() {
      return {
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
      this.loadMyCompany({
        successCallback: (data) => {
          if (Object.keys(data).length !== 0) {
            this.companyModel = data;
            this.loadScheduleList({filter:{company: data.id}});
          }
        }
      });
    },
    methods: {
      ...mapMutations('schedule', {
        selectSchedule: 'loadOne',
      }),
      ...mapMutations('company', {
        selectCompany: 'loadP',
      }),
      ...mapGetters('company', {
        getCompany: 'getModel'
      }),
      ...mapActions('company', {
        loadMyCompany: 'loadMyCompany',
      }),
      ...mapActions('schedule', {
        loadScheduleList: 'load'
      }),
    }
  }
</script>

<style scoped>

</style>
