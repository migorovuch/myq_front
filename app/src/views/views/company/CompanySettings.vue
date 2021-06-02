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
  import ScheduleList from "../schedule/ScheduleList";
  import {mapActions, mapGetters} from 'vuex';

  export default {
    name: "CompanySettings",
    components: {ScheduleList, CompanyForm},
  }
</script>

<style scoped>

</style>
