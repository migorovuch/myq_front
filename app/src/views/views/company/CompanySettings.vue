<template>
  <div>
    <div class="row">
      <div class="col-4">
        <CompanyForm/>
      </div>
      <div class="col-8">
        <ScheduleList />
      </div>
    </div>
  </div>
</template>

<script>
  import CompanyForm from "./CompanyForm";
  import ScheduleList from "./ScheduleList";
  import {mapActions, mapGetters} from 'vuex';

  export default {
    name: "CompanySettings",
    components: {ScheduleList, CompanyForm},
    data: function () {
      return {
        company: null,
      };
    },
    methods: {
      ...mapActions('company', {
        loadMyCompany: 'loadOne'
      }),
      ...mapActions('schedule', {
        loadScheduleList: 'load'
      }),
      ...mapGetters('company', {
        getCompany: 'getModel'
      }),
    },
    created() {
      this.loadMyCompany({
        id: 1,
        successCallback: (data) => {
          this.loadScheduleList({idCompany: data.id});
        }
      });
    }
  }
</script>

<style scoped>

</style>
