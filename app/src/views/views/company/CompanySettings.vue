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
  import {mapMutations} from 'vuex';

  export default {
    name: "CompanySettings",
    components: {ScheduleList, CompanyForm},
    created() {
      this.selectSchedule(null);
    },
    methods: {
      ...mapMutations('schedule', {
        selectSchedule: 'loadOne',
      }),
    }
  }
</script>

<style scoped>

</style>
