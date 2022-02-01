<template>
  <b-container class="pt-3">
      <CompanyForm :companyModel="companyModel" @onFormSubmit="onCompanySubmit"/>
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
          id: '',
          name: '',
          email: '',
          phone: '',
          slug: '',
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
          } else {
            this.$root.$bvToast.toast(this.$t("views_company.You haven't configured your company yet, fill the properties and press the Save button"), {
              toaster: 'b-toaster-bottom-right',
              variant: 'info',
              appendToast: true,
              autoHideDelay: 40000
            });
          }
        }
      });
    },
    methods: {
      ...mapMutations('schedule', {
        selectSchedule: 'loadOne',
      }),
      ...mapGetters('schedule', {
        getScheduleList: 'getList'
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
      onCompanySubmit(formModel) {
        if (!this.getScheduleList().length) {
          this.$root.$bvToast.toast(this.$t('views_company.Now you can create a schedule, just press the "Add Schedule" button'), {
            toaster: 'b-toaster-bottom-right',
            variant: 'info',
            appendToast: true,
            autoHideDelay: 40000
          });
        }
      }
    }
  }
</script>

<style scoped>

</style>
