<template>
  <div>
      <CompanyForm/>
      <ScheduleList />
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
